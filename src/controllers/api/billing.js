import logger from '../../utils/logger.js';
import DatabaseService from '../../services/supabase.js';
import { authenticateUser } from '../../middleware/auth/index.js';

// Billing API routes
export default function billingRoutes(app) {
  // Get user's current subscription
  app.get('/api/billing/subscription', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;

      const subscriptions = await DatabaseService.read(
        'user_subscriptions',
        null,
        {
          user_id: userId,
          status: 'active',
        }
      );

      if (subscriptions.length === 0) {
        return res.json({
          success: true,
          subscription: null,
          message: 'No active subscription found',
        });
      }

      const subscription = subscriptions[0];

      // Get plan details
      const plans = await DatabaseService.read(
        'subscription_plans',
        subscription.plan_id
      );
      const plan = plans.length > 0 ? plans[0] : null;

      res.json({
        success: true,
        subscription: {
          ...subscription,
          plan,
        },
      });
    } catch (error) {
      logger.error('Error fetching current subscription:', error);
      res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  });

  // Get subscription plans
  app.get('/api/billing/plans', async (req, res) => {
    try {
      const plans = await DatabaseService.read('subscription_plans', null, {
        is_active: true,
      });

      res.json({
        success: true,
        plans,
      });
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  });

  // Upgrade subscription
  app.post('/api/billing/upgrade', authenticateUser, async (req, res) => {
    try {
      console.log('Upgrade request:', req.body);
      const userId = req.user.id;
      const { planId, billingCycle } = req.body; // 'monthly' or 'yearly'

      // Get plan details
      const plans = await DatabaseService.read('subscription_plans', planId);
      console.log('Plans found:', plans.length);
      if (plans.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      const plan = plans[0];
      const price =
        billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

      console.log('Price:', price);
      if (!price) {
        return res
          .status(400)
          .json({ error: 'Invalid billing cycle for this plan' });
      }

      // Calculate period dates
      const now = new Date();
      const periodEnd = new Date(now);
      if (billingCycle === 'yearly') {
        periodEnd.setFullYear(now.getFullYear() + 1);
      } else {
        periodEnd.setMonth(now.getMonth() + 1);
      }

      // Create or update subscription
      const existingSubs = await DatabaseService.read(
        'user_subscriptions',
        null,
        {
          user_id: userId,
        }
      );

      console.log('Existing subs:', existingSubs.length);
      let subscription;
      if (existingSubs.length > 0) {
        // Update existing subscription
        subscription = await DatabaseService.update(
          'user_subscriptions',
          existingSubs[0].id,
          {
            plan_id: planId,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            status: 'active',
            cancel_at_period_end: false,
            updated_at: now.toISOString(),
          }
        );
        console.log('Updated subscription:', subscription);
      } else {
        // Create new subscription
        subscription = await DatabaseService.create('user_subscriptions', {
          user_id: userId,
          plan_id: planId,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          cancel_at_period_end: false,
        });
        console.log('Created subscription:', subscription);
      }

      // Create billing record
      const billingRecord = await DatabaseService.create('billing_history', {
        user_id: userId,
        subscription_id: subscription.id,
        amount: price,
        currency: 'USD',
        status: 'paid',
        billing_period_start: now.toISOString(),
        billing_period_end: periodEnd.toISOString(),
        payment_method: 'dummy',
        invoice_number: `INV-${Date.now()}`,
      });
      console.log('Created billing record:', billingRecord);

      // Add credits to user account
      if (plan.credits_included > 0) {
        console.log('Adding credits:', plan.credits_included);
        const creditManager = (await import('../../utils/creditManager.js'))
          .default;
        await creditManager.addCredits(
          userId,
          plan.credits_included,
          `Subscription credits for ${plan.name} plan`,
          'purchase'
        );
        console.log('Credits added');
      }

      res.json({
        success: true,
        message: 'Subscription upgraded successfully',
        subscription: {
          ...subscription,
          plan,
        },
      });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      res.status(500).json({ error: 'Failed to upgrade subscription' });
    }
  });

  // Get billing history
  app.get('/api/billing/history', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { limit = 10, offset = 0 } = req.query;

      const history = await DatabaseService.supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      res.json({
        success: true,
        history: history.data || [],
      });
    } catch (error) {
      logger.error('Error fetching billing history:', error);
      res.status(500).json({ error: 'Failed to fetch billing history' });
    }
  });

  // Cancel subscription
  app.post('/api/billing/cancel', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { cancelAtPeriodEnd = true } = req.body;

      const subscriptions = await DatabaseService.read(
        'user_subscriptions',
        null,
        {
          user_id: userId,
          status: 'active',
        }
      );

      if (subscriptions.length === 0) {
        return res.status(404).json({ error: 'No active subscription found' });
      }

      const subscription = subscriptions[0];

      if (cancelAtPeriodEnd) {
        // Cancel at period end
        await DatabaseService.update('user_subscriptions', subscription.id, {
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        });
      } else {
        // Cancel immediately
        await DatabaseService.update('user_subscriptions', subscription.id, {
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        message: cancelAtPeriodEnd
          ? 'Subscription will be cancelled at the end of the billing period'
          : 'Subscription cancelled immediately',
      });
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  });
}

// Get subscription plans
export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await DatabaseService.read('subscription_plans', null, {
      is_active: true,
    });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    logger.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

// Upgrade subscription
export const upgradeSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, billingCycle } = req.body; // 'monthly' or 'yearly'

    // Get plan details
    const plans = await DatabaseService.read('subscription_plans', planId);
    if (plans.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = plans[0];
    const price =
      billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;

    if (!price) {
      return res
        .status(400)
        .json({ error: 'Invalid billing cycle for this plan' });
    }

    // Calculate period dates
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'yearly') {
      periodEnd.setFullYear(now.getFullYear() + 1);
    } else {
      periodEnd.setMonth(now.getMonth() + 1);
    }

    // Create or update subscription
    const existingSubs = await DatabaseService.read(
      'user_subscriptions',
      null,
      {
        user_id: userId,
        status: 'active',
      }
    );

    let subscription;
    if (existingSubs.length > 0) {
      // Update existing subscription
      subscription = await DatabaseService.update(
        'user_subscriptions',
        existingSubs[0].id,
        {
          plan_id: planId,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          status: 'active',
          cancel_at_period_end: false,
          updated_at: now.toISOString(),
        }
      );
    } else {
      // Create new subscription
      subscription = await DatabaseService.create('user_subscriptions', {
        user_id: userId,
        plan_id: planId,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
      });
    }

    // Create billing record
    await DatabaseService.create('billing_history', {
      user_id: userId,
      subscription_id: subscription.id,
      amount: price,
      currency: 'USD',
      status: 'paid',
      billing_period_start: now.toISOString(),
      billing_period_end: periodEnd.toISOString(),
      payment_method: 'dummy',
      invoice_number: `INV-${Date.now()}`,
    });

    // Add credits to user account
    if (plan.credits_included > 0) {
      const creditManager = (await import('../../utils/creditManager.js'))
        .default;
      await creditManager.addCredits(
        userId,
        plan.credits_included,
        `Subscription credits for ${plan.name} plan`,
        'subscription'
      );
    }

    res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      subscription: {
        ...subscription,
        plan,
      },
    });
  } catch (error) {
    logger.error('Error upgrading subscription:', error);
    res.status(500).json({ error: 'Failed to upgrade subscription' });
  }
};

// Get billing history
export const getBillingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const history = await DatabaseService.supabase
      .from('billing_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    res.json({
      success: true,
      history: history.data || [],
    });
  } catch (error) {
    logger.error('Error fetching billing history:', error);
    res.status(500).json({ error: 'Failed to fetch billing history' });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cancelAtPeriodEnd = true } = req.body;

    const subscriptions = await DatabaseService.read(
      'user_subscriptions',
      null,
      {
        user_id: userId,
        status: 'active',
      }
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = subscriptions[0];

    if (cancelAtPeriodEnd) {
      // Cancel at period end
      await DatabaseService.update('user_subscriptions', subscription.id, {
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      });
    } else {
      // Cancel immediately
      await DatabaseService.update('user_subscriptions', subscription.id, {
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: cancelAtPeriodEnd
        ? 'Subscription will be cancelled at the end of the billing period'
        : 'Subscription cancelled immediately',
    });
  } catch (error) {
    logger.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

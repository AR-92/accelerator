import logger from '../../utils/logger.js';
import DatabaseService from '../../services/supabase.js';
import { authenticateUser } from '../../middleware/auth/index.js';

// Credit API routes
export default function creditRoutes(app) {
  // Get user's credit balance
  app.get('/api/credits/balance', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;

      const credits = await DatabaseService.read('user_credits', null, {
        user_id: userId,
      });
      const balance = credits.length > 0 ? credits[0].balance : 0;

      res.json({
        success: true,
        balance,
        data: credits[0] || null,
      });
    } catch (error) {
      logger.error('Error fetching credit balance:', error);
      res.status(500).json({ error: 'Failed to fetch credit balance' });
    }
  });

  // Get credit packages
  app.get('/api/credits/packages', async (req, res) => {
    try {
      const packages = await DatabaseService.read('credit_packages', null, {
        is_active: true,
      });

      res.json({
        success: true,
        packages,
      });
    } catch (error) {
      logger.error('Error fetching credit packages:', error);
      res.status(500).json({ error: 'Failed to fetch credit packages' });
    }
  });

  // Buy credits (dummy payment)
  app.post('/api/credits/buy', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { packageId, paymentMethod } = req.body;

      // Get package details
      const packages = await DatabaseService.read('credit_packages', packageId);
      if (packages.length === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }

      const packageData = packages[0];

      // Get current balance
      const credits = await DatabaseService.read('user_credits', null, {
        user_id: userId,
      });
      const currentBalance = credits.length > 0 ? credits[0].balance : 0;

      // Simulate payment success (dummy)
      const newBalance = currentBalance + packageData.credits;

      // Create transaction record
      const transaction = await DatabaseService.create('credit_transactions', {
        user_id: userId,
        transaction_type: 'purchase',
        credits: packageData.credits,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Purchased ${packageData.name}`,
        reference_id: packageId,
        metadata: {
          package_name: packageData.name,
          price_riyals: packageData.price_riyals,
          payment_method: paymentMethod,
        },
      });

      // Ensure user_credits record exists
      if (credits.length === 0) {
        await DatabaseService.create('user_credits', {
          user_id: userId,
          balance: packageData.credits,
          total_earned: packageData.credits,
          total_spent: 0,
        });
      }

      res.json({
        success: true,
        message: 'Credits purchased successfully',
        balance: newBalance,
        transaction,
      });
    } catch (error) {
      logger.error('Error buying credits:', error);
      res.status(500).json({ error: 'Failed to purchase credits' });
    }
  });

  // Get transaction history
  app.get('/api/credits/transactions', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;

      const transactions = await DatabaseService.supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      res.json({
        success: true,
        transactions: transactions.data || [],
      });
    } catch (error) {
      logger.error('Error fetching credit transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  // Consume credits
  app.post('/api/credits/consume', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { credits, description, feature } = req.body;

      // Get current balance
      const userCredits = await DatabaseService.read('user_credits', null, {
        user_id: userId,
      });
      if (userCredits.length === 0 || userCredits[0].balance < credits) {
        return res.status(400).json({ error: 'Insufficient credits' });
      }

      const currentBalance = userCredits[0].balance;
      const newBalance = currentBalance - credits;

      // Create transaction record
      const transaction = await DatabaseService.create('credit_transactions', {
        user_id: userId,
        transaction_type: 'consumption',
        credits: -credits, // Negative for consumption
        balance_before: currentBalance,
        balance_after: newBalance,
        description,
        metadata: { feature },
      });

      res.json({
        success: true,
        message: 'Credits consumed successfully',
        balance: newBalance,
        transaction,
      });
    } catch (error) {
      logger.error('Error consuming credits:', error);
      res.status(500).json({ error: 'Failed to consume credits' });
    }
  });
}

// Get credit packages
export const getCreditPackages = async (req, res) => {
  try {
    const packages = await DatabaseService.read('credit_packages', null, {
      is_active: true,
    });

    res.json({
      success: true,
      packages,
    });
  } catch (error) {
    logger.error('Error fetching credit packages:', error);
    res.status(500).json({ error: 'Failed to fetch credit packages' });
  }
};

// Buy credits (dummy payment)
export const buyCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { packageId, paymentMethod } = req.body;

    // Get package details
    const packages = await DatabaseService.read('credit_packages', packageId);
    if (packages.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const packageData = packages[0];

    // Get current balance
    const credits = await DatabaseService.read('user_credits', null, {
      user_id: userId,
    });
    const currentBalance = credits.length > 0 ? credits[0].balance : 0;

    // Simulate payment success (dummy)
    const newBalance = currentBalance + packageData.credits;

    // Create transaction record
    const transaction = await DatabaseService.create('credit_transactions', {
      user_id: userId,
      transaction_type: 'purchase',
      credits: packageData.credits,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: `Purchased ${packageData.name}`,
      reference_id: packageId,
      metadata: {
        package_name: packageData.name,
        price_riyals: packageData.price_riyals,
        payment_method: paymentMethod,
      },
    });

    // Ensure user_credits record exists
    if (credits.length === 0) {
      await DatabaseService.create('user_credits', {
        user_id: userId,
        balance: packageData.credits,
        total_earned: packageData.credits,
        total_spent: 0,
      });
    }

    res.json({
      success: true,
      message: 'Credits purchased successfully',
      balance: newBalance,
      transaction,
    });
  } catch (error) {
    logger.error('Error buying credits:', error);
    res.status(500).json({ error: 'Failed to purchase credits' });
  }
};

// Get transaction history
export const getCreditTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const transactions = await DatabaseService.supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    res.json({
      success: true,
      transactions: transactions.data || [],
    });
  } catch (error) {
    logger.error('Error fetching credit transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Consume credits
export const consumeCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { credits, description, feature } = req.body;

    // Get current balance
    const userCredits = await DatabaseService.read('user_credits', null, {
      user_id: userId,
    });
    if (userCredits.length === 0 || userCredits[0].balance < credits) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    const currentBalance = userCredits[0].balance;
    const newBalance = currentBalance - credits;

    // Create transaction record
    const transaction = await DatabaseService.create('credit_transactions', {
      user_id: userId,
      transaction_type: 'consumption',
      credits: -credits, // Negative for consumption
      balance_before: currentBalance,
      balance_after: newBalance,
      description,
      metadata: { feature },
    });

    res.json({
      success: true,
      message: 'Credits consumed successfully',
      balance: newBalance,
      transaction,
    });
  } catch (error) {
    logger.error('Error consuming credits:', error);
    res.status(500).json({ error: 'Failed to consume credits' });
  }
};

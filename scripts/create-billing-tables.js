import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function createBillingTables() {
  try {
    console.log('Setting up billing tables...');

    // Just insert sample data - assume tables are created via SQL
    const { error: insertError } = await supabase
      .from('subscription_plans')
      .upsert(
        [
          {
            name: 'Starter',
            description: 'Perfect for getting started',
            price_monthly: 9.99,
            price_yearly: 99.99,
            credits_included: 100,
            features: ['Up to 3 projects', 'Basic analytics', 'Email support'],
          },
          {
            name: 'Pro',
            description: 'For growing businesses',
            price_monthly: 29.99,
            price_yearly: 299.99,
            credits_included: 500,
            features: [
              'Unlimited projects',
              'Advanced analytics',
              'Priority support',
              'Team collaboration',
            ],
          },
          {
            name: 'Enterprise',
            description: 'For large organizations',
            credits_included: 2000,
            features: [
              'Everything in Pro',
              'Custom integrations',
              'Dedicated support',
              'SLA guarantee',
            ],
          },
        ],
        { onConflict: 'name' }
      );

    if (insertError) {
      console.error('Error inserting sample data:', insertError);
      console.log(
        'Note: You may need to create the billing tables manually in Supabase SQL Editor'
      );
      console.log(
        'Run the SQL from billing_schema.sql in your Supabase dashboard'
      );
    } else {
      console.log('✅ Sample subscription plans inserted');
    }
  } catch (error) {
    console.error('Error setting up billing tables:', error);
    console.log(
      'Note: You may need to create the billing tables manually in Supabase SQL Editor'
    );
  }
}

createBillingTables();

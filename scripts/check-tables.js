import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkTables() {
  try {
    console.log('Checking credit system tables...');

    // Check credit_packages table
    const { data: packages, error: packagesError } = await supabase
      .from('credit_packages')
      .select('*')
      .limit(1);

    if (packagesError) {
      console.error('credit_packages table error:', packagesError.message);
    } else {
      console.log('✅ credit_packages table exists, records:', packages.length);
    }

    // Check user_credits table
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .limit(1);

    if (creditsError) {
      console.error('user_credits table error:', creditsError.message);
    } else {
      console.log('✅ user_credits table exists, records:', credits.length);
    }

    // Check credit_transactions table
    const { data: transactions, error: transactionsError } = await supabase
      .from('credit_transactions')
      .select('*')
      .limit(1);

    if (transactionsError) {
      console.error(
        'credit_transactions table error:',
        transactionsError.message
      );
    } else {
      console.log(
        '✅ credit_transactions table exists, records:',
        transactions.length
      );
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();

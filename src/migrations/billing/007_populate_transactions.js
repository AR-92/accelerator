/**
 * Migration: Populate transactions table with sample data
 * Creates sample transactions for credit purchases and usage
 */

module.exports = {
  up: async (db) => {
    try {
      // Get user IDs, with fallback if users don't exist yet
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const corporateUser = await db.get('SELECT id FROM users WHERE email = ?', ['corporate@example.com']);
      const enterpriseUser = await db.get('SELECT id FROM users WHERE email = ?', ['enterprise@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);

      // Check if all required users exist
      if (!investorUser || !startupUser || !corporateUser || !enterpriseUser || !businessUser) {
        console.log('Required users do not exist yet, skipping transaction population');
        return true; // Return true to indicate successful completion (even though no changes were made)
      }

      // Create sample transactions
      const transactions = [
        // Credit purchase transactions
        {
          user_id: investorUser.id,
          tx_type: 'purchase_credits',
          amount_cents: 10000, // $100
          credits: 1000,
          currency: 'USD',
          provider: 'stripe',
          provider_tx_id: 'pi_3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t',
        },
        {
          user_id: startupUser.id,
          tx_type: 'purchase_credits',
          amount_cents: 5000, // $50
          credits: 500,
          currency: 'USD',
          provider: 'stripe',
          provider_tx_id: 'pi_3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4u',
        },
        {
          user_id: corporateUser.id,
          tx_type: 'purchase_credits',
          amount_cents: 25000, // $250
          credits: 2500,
          currency: 'USD',
          provider: 'stripe',
          provider_tx_id: 'pi_3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4v',
        },
        {
          user_id: enterpriseUser.id,
          tx_type: 'purchase_credits',
          amount_cents: 50000, // $500
          credits: 5000,
          currency: 'USD',
          provider: 'stripe',
          provider_tx_id: 'pi_3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4w',
        },
        {
          user_id: businessUser.id,
          tx_type: 'purchase_credits',
          amount_cents: 2000, // $20
          credits: 200,
          currency: 'USD',
          provider: 'stripe',
          provider_tx_id: 'pi_3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4x',
        },
        
        // Reward spending transactions
        {
          user_id: investorUser.id,
          tx_type: 'reward_spend',
          amount_cents: 0, // No money spent, just credit usage
          credits: -100, // 100 credits spent on rewarding
          currency: 'USD',
          provider: null,
          provider_tx_id: null,
        },
        {
          user_id: corporateUser.id,
          tx_type: 'reward_spend',
          amount_cents: 0,
          credits: -50, // 50 credits spent on rewarding
          currency: 'USD',
          provider: null,
          provider_tx_id: null,
        },
        {
          user_id: businessUser.id,
          tx_type: 'reward_spend',
          amount_cents: 0,
          credits: -25, // 25 credits spent on rewarding
          currency: 'USD',
          provider: null,
          provider_tx_id: null,
        }
      ];

      for (const tx of transactions) {
        await db.run(`
          INSERT INTO transactions (user_id, tx_type, amount_cents, credits, currency, provider, provider_tx_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [tx.user_id, tx.tx_type, tx.amount_cents, tx.credits, tx.currency, tx.provider, tx.provider_tx_id]);
      }

      console.log('Sample transactions created successfully');
      return true;
    } catch (error) {
      console.error('Error creating sample transactions:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Get user IDs, with fallback if users don't exist
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const corporateUser = await db.get('SELECT id FROM users WHERE email = ?', ['corporate@example.com']);
      const enterpriseUser = await db.get('SELECT id FROM users WHERE email = ?', ['enterprise@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);

      if (!investorUser || !startupUser || !corporateUser || !enterpriseUser || !businessUser) {
        console.log('Required users do not exist, no transactions to remove');
        return true;
      }

      // Remove all sample transactions
      await db.run(`
        DELETE FROM transactions
        WHERE user_id IN (?, ?, ?, ?, ?)
      `, [investorUser.id, startupUser.id, corporateUser.id, enterpriseUser.id, businessUser.id]);

      console.log('Sample transactions removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing sample transactions:', error);
      throw error;
    }
  },
};
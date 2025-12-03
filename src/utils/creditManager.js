import DatabaseService from '../services/supabase.js';
import logger from './logger.js';

class CreditManager {
  static async consumeCredits(userId, credits, description, feature) {
    try {
      // Get current balance
      const userCredits = await DatabaseService.read('user_credits', null, {
        user_id: userId,
      });
      if (userCredits.length === 0 || userCredits[0].balance < credits) {
        throw new Error('Insufficient credits');
      }

      const currentBalance = userCredits[0].balance;
      const newBalance = currentBalance - credits;

      // Create transaction record
      await DatabaseService.create('credit_transactions', {
        user_id: userId,
        transaction_type: 'consumption',
        credits: -credits,
        balance_before: currentBalance,
        balance_after: newBalance,
        description,
        metadata: { feature },
      });

      return { success: true, balance: newBalance };
    } catch (error) {
      logger.error('Error consuming credits:', error);
      throw error;
    }
  }

  static async getBalance(userId) {
    try {
      const credits = await DatabaseService.read('user_credits', null, {
        user_id: userId,
      });
      return credits.length > 0 ? credits[0].balance : 0;
    } catch (error) {
      logger.error('Error getting balance:', error);
      return 0;
    }
  }

  static async hasCredits(userId, requiredCredits) {
    const balance = await this.getBalance(userId);
    return balance >= requiredCredits;
  }

  static async addCredits(userId, credits, description, type = 'bonus') {
    try {
      // Get current balance
      const userCredits = await DatabaseService.read('user_credits', null, {
        user_id: userId,
      });
      const currentBalance =
        userCredits.length > 0 ? userCredits[0].balance : 0;
      const newBalance = currentBalance + credits;

      // Create transaction record
      await DatabaseService.create('credit_transactions', {
        user_id: userId,
        transaction_type: type,
        credits: credits,
        balance_before: currentBalance,
        balance_after: newBalance,
        description,
        metadata: { type },
      });

      // Ensure user_credits record exists
      if (userCredits.length === 0) {
        await DatabaseService.create('user_credits', {
          user_id: userId,
          balance: credits,
          total_earned: credits,
          total_spent: 0,
        });
      }

      return { success: true, balance: newBalance };
    } catch (error) {
      logger.error('Error adding credits:', error);
      throw error;
    }
  }
}

export default CreditManager;

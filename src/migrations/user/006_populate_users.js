/**
 * Migration: Populate users table with realistic sample data
 * Creates sample users with different roles and organizations for testing
 */

module.exports = {
  up: async (db) => {
    try {
      // Create sample users with different roles
      const users = [
        {
          email: 'admin@accelerator.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'System Admin',
          user_type: 'admin',
          wallet_credits: 0,
        },
        {
          email: 'corporate@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Corporate User',
          user_type: 'corporate',
          wallet_credits: 500,
        },
        {
          email: 'enterprise@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Enterprise User',
          user_type: 'enterprise',
          wallet_credits: 1000,
        },
        {
          email: 'startup@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Startup Founder',
          user_type: 'startup',
          wallet_credits: 200,
        },
        {
          email: 'investor@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Angel Investor',
          user_type: 'startup',
          wallet_credits: 1500,
        },
        {
          email: 'developer@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Tech Developer',
          user_type: 'startup',
          wallet_credits: 100,
        },
        {
          email: 'mentor@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Business Mentor',
          user_type: 'startup',
          wallet_credits: 300,
        },
        {
          email: 'designer@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'UI/UX Designer',
          user_type: 'startup',
          wallet_credits: 150,
        },
        {
          email: 'business@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Business Analyst',
          user_type: 'startup',
          wallet_credits: 250,
        },
        {
          email: 'student@example.com',
          password_hash: '$2b$12$3NfCBtDmLH6qTqgV4Y2r9e7k4q8v4s4t6u9v7w8x9y0z1a2b3c4d5', // 'password123' (hashed)
          name: 'Student Entrepreneur',
          user_type: 'startup',
          wallet_credits: 50,
        },
      ];

      // Insert users and capture their IDs
      for (const user of users) {
        await db.run(`
          INSERT INTO users (email, password_hash, name, user_type, wallet_credits, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [user.email, user.password_hash, user.name, user.user_type, user.wallet_credits]);
      }

      console.log('Sample users created successfully');
    } catch (error) {
      console.error('Error creating sample users:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Delete all sample users
      await db.run(`
        DELETE FROM users 
        WHERE email IN (
          'admin@accelerator.com', 'corporate@example.com', 
          'enterprise@example.com', 'startup@example.com',
          'investor@example.com', 'developer@example.com',
          'mentor@example.com', 'designer@example.com',
          'business@example.com', 'student@example.com'
        )
      `);
      console.log('Sample users removed successfully');
    } catch (error) {
      console.error('Error removing sample users:', error);
      throw error;
    }
  },
};
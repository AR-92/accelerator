/**
 * Migration: Populate packages
 * Inserts default packages for the billing system
 */

module.exports = {
  up: async (db) => {
    // Insert some default packages
    const insertDefaultPackages = `
      INSERT OR IGNORE INTO packages (name, description, price, credits, features, status, sort_order, is_popular) VALUES
      ('Starter Pack', 'Perfect for getting started with basic features', 9.99, 100, '["Basic AI assistance", "Community access", "Email support"]', 'active', 1, false),
      ('Professional Pack', 'Advanced features for growing businesses', 29.99, 500, '["Advanced AI assistance", "Priority support", "Analytics dashboard", "API access"]', 'active', 2, true),
      ('Enterprise Pack', 'Complete solution for large organizations', 99.99, 2000, '["Unlimited AI assistance", "Dedicated support", "Custom integrations", "White-label options", "Advanced analytics"]', 'active', 3, false);
    `;

    try {
      await db.run(insertDefaultPackages);
      console.log('Default packages inserted successfully');
    } catch (error) {
      console.error('Error inserting default packages:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run(
        'DELETE FROM packages WHERE name IN ("Starter Pack", "Professional Pack", "Enterprise Pack")'
      );
      console.log('Default packages removed successfully');
    } catch (error) {
      console.error('Error removing default packages:', error);
      throw error;
    }
  },
};

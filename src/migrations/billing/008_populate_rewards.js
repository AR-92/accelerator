/**
 * Migration: Populate rewards table with sample data
 * Creates sample rewards connecting givers to recipients (users and projects)
 */

module.exports = {
  up: async (db) => {
    try {
      // Get user IDs
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const corporateUser = await db.get('SELECT id FROM users WHERE email = ?', ['corporate@example.com']);
      const enterpriseUser = await db.get('SELECT id FROM users WHERE email = ?', ['enterprise@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const developerUser = await db.get('SELECT id FROM users WHERE email = ?', ['developer@example.com']);

      // Get project IDs
      const healthTrackerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Mobile Health Tracker App']);
      const aiCustomerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['AI-Powered Customer Service Platform']);
      const paymentGatewayProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Blockchain Payment Gateway']);
      const packagingProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Eco-Friendly Packaging Solution']);

      // Check if required users and projects exist
      if (!investorUser || !corporateUser || !enterpriseUser || !businessUser || !startupUser || !developerUser) {
        console.log('Required users do not exist yet, skipping rewards population');
        return true;
      }

      if (!healthTrackerProject || !aiCustomerProject || !paymentGatewayProject || !packagingProject) {
        console.log('Required projects do not exist yet, skipping rewards population');
        return true;
      }

      // Create sample rewards
      const rewards = [
        // Investor rewards to project creators
        {
          giver_user_id: investorUser.id,
          recipient_user_id: startupUser.id, // Reward for mobile health app
          project_id: healthTrackerProject.id,
          credits: 50,
          reason: 'Promising health tech concept',
        },
        {
          giver_user_id: investorUser.id,
          recipient_user_id: developerUser.id, // Reward for AI customer service
          project_id: aiCustomerProject.id,
          credits: 75,
          reason: 'Innovative AI implementation',
        },
        
        // Corporate rewards to projects
        {
          giver_user_id: corporateUser.id,
          recipient_user_id: null, // General project reward
          project_id: paymentGatewayProject.id,
          credits: 100,
          reason: 'Solid blockchain implementation',
        },
        
        // Enterprise rewards to users
        {
          giver_user_id: enterpriseUser.id,
          recipient_user_id: developerUser.id, // Reward for technical excellence
          project_id: null,
          credits: 60,
          reason: 'Outstanding technical contribution',
        },
        
        // Business user rewards
        {
          giver_user_id: businessUser.id,
          recipient_user_id: startupUser.id, // Reward for packaging innovation
          project_id: packagingProject.id,
          credits: 40,
          reason: 'Sustainable packaging solution',
        },
        
        // Cross-project collaboration rewards
        {
          giver_user_id: startupUser.id,
          recipient_user_id: developerUser.id, // Reward for collaboration
          project_id: healthTrackerProject.id,
          credits: 20,
          reason: 'Great development work',
        }
      ];

      for (const reward of rewards) {
        await db.run(`
          INSERT INTO rewards (giver_user_id, recipient_user_id, project_id, credits, reason, awarded_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [reward.giver_user_id, reward.recipient_user_id, reward.project_id, reward.credits, reward.reason]);
      }

      console.log('Sample rewards created successfully');
      return true;
    } catch (error) {
      console.error('Error creating sample rewards:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Get user IDs, only if they exist
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const corporateUser = await db.get('SELECT id FROM users WHERE email = ?', ['corporate@example.com']);
      const enterpriseUser = await db.get('SELECT id FROM users WHERE email = ?', ['enterprise@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const developerUser = await db.get('SELECT id FROM users WHERE email = ?', ['developer@example.com']);

      if (!investorUser || !corporateUser || !enterpriseUser || !businessUser || !startupUser || !developerUser) {
        console.log('Required users do not exist, no rewards to remove');
        return true;
      }

      // Remove all sample rewards
      await db.run(`
        DELETE FROM rewards
        WHERE giver_user_id IN (?, ?, ?, ?, ?, ?)
      `, [investorUser.id, corporateUser.id, enterpriseUser.id, businessUser.id, startupUser.id, developerUser.id]);

      console.log('Sample rewards removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing sample rewards:', error);
      throw error;
    }
  },
};
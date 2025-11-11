/**
 * Migration: Populate votes table with sample data
 * Creates sample votes connecting users to projects with realistic scores
 */

module.exports = {
  up: async (db) => {
    try {
      // Get user IDs
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);
      const developerUser = await db.get('SELECT id FROM users WHERE email = ?', ['developer@example.com']);
      const mentorUser = await db.get('SELECT id FROM users WHERE email = ?', ['mentor@example.com']);
      const designerUser = await db.get('SELECT id FROM users WHERE email = ?', ['designer@example.com']);
      const studentUser = await db.get('SELECT id FROM users WHERE email = ?', ['student@example.com']);

      // Get project IDs
      const healthTrackerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Mobile Health Tracker App']);
      const aiCustomerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['AI-Powered Customer Service Platform']);
      const fileStorageProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Cloud-Based File Storage System']);
      const packagingProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Eco-Friendly Packaging Solution']);
      const paymentGatewayProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Blockchain Payment Gateway']);

      // Create sample votes
      const votes = [
        // Investor votes on various projects
        {
          user_id: investorUser.id,
          project_id: healthTrackerProject.id,
          score: 4
        },
        {
          user_id: investorUser.id,
          project_id: aiCustomerProject.id,
          score: 5
        },
        {
          user_id: investorUser.id,
          project_id: paymentGatewayProject.id,
          score: 4
        },
        
        // Business analyst votes
        {
          user_id: businessUser.id,
          project_id: healthTrackerProject.id,
          score: 3
        },
        {
          user_id: businessUser.id,
          project_id: packagingProject.id,
          score: 5
        },
        {
          user_id: businessUser.id,
          project_id: paymentGatewayProject.id,
          score: 4
        },
        
        // Developer votes
        {
          user_id: developerUser.id,
          project_id: aiCustomerProject.id,
          score: 5
        },
        {
          user_id: developerUser.id,
          project_id: fileStorageProject.id,
          score: 4
        },
        {
          user_id: developerUser.id,
          project_id: healthTrackerProject.id,
          score: 3
        },
        
        // Mentor votes
        {
          user_id: mentorUser.id,
          project_id: healthTrackerProject.id,
          score: 4
        },
        {
          user_id: mentorUser.id,
          project_id: packagingProject.id,
          score: 4
        },
        
        // Designer votes
        {
          user_id: designerUser.id,
          project_id: healthTrackerProject.id,
          score: 5
        },
        {
          user_id: designerUser.id,
          project_id: packagingProject.id,
          score: 4
        },
        
        // Student votes
        {
          user_id: studentUser.id,
          project_id: aiCustomerProject.id,
          score: 3
        },
        {
          user_id: studentUser.id,
          project_id: fileStorageProject.id,
          score: 4
        }
      ];

      for (const vote of votes) {
        await db.run(`
          INSERT OR IGNORE INTO votes (user_id, project_id, score, created_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `, [vote.user_id, vote.project_id, vote.score]);
      }

      console.log('Sample votes created successfully');
    } catch (error) {
      console.error('Error creating sample votes:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Get user IDs
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);
      const developerUser = await db.get('SELECT id FROM users WHERE email = ?', ['developer@example.com']);
      const mentorUser = await db.get('SELECT id FROM users WHERE email = ?', ['mentor@example.com']);
      const designerUser = await db.get('SELECT id FROM users WHERE email = ?', ['designer@example.com']);
      const studentUser = await db.get('SELECT id FROM users WHERE email = ?', ['student@example.com']);

      // Remove all sample votes
      await db.run(`
        DELETE FROM votes
        WHERE user_id IN (?, ?, ?, ?, ?, ?)
      `, [investorUser.id, businessUser.id, developerUser.id, mentorUser.id, designerUser.id, studentUser.id]);

      console.log('Sample votes removed successfully');
    } catch (error) {
      console.error('Error removing sample votes:', error);
      throw error;
    }
  },
};
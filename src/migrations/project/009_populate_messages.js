/**
 * Migration: Populate messages table with sample data
 * Creates sample project collaboration messages
 */

module.exports = {
  up: async (db) => {
    try {
      // Get user IDs
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const developerUser = await db.get('SELECT id FROM users WHERE email = ?', ['developer@example.com']);
      const designerUser = await db.get('SELECT id FROM users WHERE email = ?', ['designer@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);
      const mentorUser = await db.get('SELECT id FROM users WHERE email = ?', ['mentor@example.com']);

      // Get project IDs
      const healthTrackerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Mobile Health Tracker App']);
      const aiCustomerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['AI-Powered Customer Service Platform']);

      // Check if required users and projects exist
      if (!startupUser || !investorUser || !developerUser || !designerUser || !businessUser || !mentorUser) {
        console.log('Required users do not exist yet, skipping messages population');
        return true;
      }

      if (!healthTrackerProject || !aiCustomerProject) {
        console.log('Required projects do not exist yet, skipping messages population');
        return true;
      }

      // Create sample messages
      const messages = [
        // Mobile Health Tracker App project messages
        {
          project_id: healthTrackerProject.id,
          user_id: startupUser.id,
          body: 'Team, we need to finalize the feature requirements by EOD. The core functionality should include health metrics tracking, user profiles, and data visualization.'
        },
        {
          project_id: healthTrackerProject.id,
          user_id: developerUser.id,
          body: 'I\'ve completed the initial API structure for user authentication. I\'ll need design mockups for the dashboard before proceeding with the UI implementation.'
        },
        {
          project_id: healthTrackerProject.id,
          user_id: designerUser.id,
          body: 'UI mockups for the main dashboard and health tracking screens are ready. I\'ll share the design files in the project folder by tomorrow morning.'
        },
        {
          project_id: healthTrackerProject.id,
          user_id: mentorUser.id,
          body: 'Investors are particularly interested in our security measures. Please ensure all health data is encrypted both in storage and transit. We need to be HIPAA compliant.'
        },
        
        // AI-Powered Customer Service Platform project messages
        {
          project_id: aiCustomerProject.id,
          user_id: investorUser.id,
          body: 'Market research shows strong potential for this product. Let\'s focus on demonstrating a working prototype within the next 2 weeks to attract Series A funding.'
        },
        {
          project_id: aiCustomerProject.id,
          user_id: developerUser.id,
          body: 'The NLP model training is going well. Current accuracy is at 85%. I expect we can reach 90%+ by the end of this sprint with additional training data.'
        },
        {
          project_id: aiCustomerProject.id,
          user_id: businessUser.id,
          body: 'Competitive analysis is complete. Our biggest competitors are Zendesk AI and Intercom. We have a clear differentiator with our custom automation rules.'
        }
      ];

      for (const message of messages) {
        await db.run(`
          INSERT INTO messages (project_id, user_id, body, created_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `, [message.project_id, message.user_id, message.body]);
      }

      console.log('Sample messages created successfully');
      return true;
    } catch (error) {
      console.error('Error creating sample messages:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Get project IDs, only if they exist
      const healthTrackerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Mobile Health Tracker App']);
      const aiCustomerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['AI-Powered Customer Service Platform']);

      if (!healthTrackerProject || !aiCustomerProject) {
        console.log('Required projects do not exist, no messages to remove');
        return true;
      }

      // Remove all sample messages
      await db.run(`
        DELETE FROM messages
        WHERE project_id IN (?, ?)
      `, [healthTrackerProject.id, aiCustomerProject.id]);

      console.log('Sample messages removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing sample messages:', error);
      throw error;
    }
  },
};
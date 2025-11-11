/**
 * Migration: Populate project_collaborators table with sample data
 * Creates sample collaboration relationships between users and projects
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
      const fileStorageProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Cloud-Based File Storage System']);
      const packagingProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Eco-Friendly Packaging Solution']);
      const paymentGatewayProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Blockchain Payment Gateway']);

      // Check if required users and projects exist
      if (!startupUser || !investorUser || !developerUser || !designerUser || !businessUser || !mentorUser) {
        console.log('Required users do not exist yet, skipping collaborators population');
        return true;
      }

      if (!healthTrackerProject || !aiCustomerProject || !fileStorageProject || !packagingProject || !paymentGatewayProject) {
        console.log('Required projects do not exist yet, skipping collaborators population');
        return true;
      }

      // Create sample collaborations
      const collaborations = [
        // Mobile Health Tracker App collaborators
        { project_id: healthTrackerProject.id, user_id: startupUser.id, role: 'admin' },
        { project_id: healthTrackerProject.id, user_id: developerUser.id, role: 'developer' },
        { project_id: healthTrackerProject.id, user_id: designerUser.id, role: 'designer' },
        { project_id: healthTrackerProject.id, user_id: mentorUser.id, role: 'advisor' },
        
        // AI-Powered Customer Service Platform collaborators
        { project_id: aiCustomerProject.id, user_id: investorUser.id, role: 'admin' },
        { project_id: aiCustomerProject.id, user_id: developerUser.id, role: 'developer' },
        { project_id: aiCustomerProject.id, user_id: businessUser.id, role: 'business_analyst' },
        
        // Cloud-Based File Storage System collaborators
        { project_id: fileStorageProject.id, user_id: developerUser.id, role: 'admin' },
        { project_id: fileStorageProject.id, user_id: designerUser.id, role: 'ui_designer' },
        
        // Eco-Friendly Packaging Solution collaborators
        { project_id: packagingProject.id, user_id: designerUser.id, role: 'admin' },
        { project_id: packagingProject.id, user_id: businessUser.id, role: 'business_developer' },
        
        // Blockchain Payment Gateway collaborators
        { project_id: paymentGatewayProject.id, user_id: businessUser.id, role: 'admin' },
        { project_id: paymentGatewayProject.id, user_id: developerUser.id, role: 'developer' },
        { project_id: paymentGatewayProject.id, user_id: mentorUser.id, role: 'advisor' }
      ];

      for (const collab of collaborations) {
        await db.run(`
          INSERT OR IGNORE INTO project_collaborators (project_id, user_id, role, joined_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `, [collab.project_id, collab.user_id, collab.role]);
      }

      console.log('Sample project collaborations created successfully');
      return true;
    } catch (error) {
      console.error('Error creating sample project collaborations:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Get user IDs, only if they exist
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const developerUser = await db.get('SELECT id FROM users WHERE email = ?', ['developer@example.com']);
      const designerUser = await db.get('SELECT id FROM users WHERE email = ?', ['designer@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);
      const mentorUser = await db.get('SELECT id FROM users WHERE email = ?', ['mentor@example.com']);

      // Get project IDs, only if they exist
      const healthTrackerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Mobile Health Tracker App']);
      const aiCustomerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['AI-Powered Customer Service Platform']);
      const fileStorageProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Cloud-Based File Storage System']);
      const packagingProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Eco-Friendly Packaging Solution']);
      const paymentGatewayProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Blockchain Payment Gateway']);

      if (!startupUser || !investorUser || !developerUser || !designerUser || !businessUser || !mentorUser) {
        console.log('Required users do not exist, no collaborators to remove');
        return true;
      }

      if (!healthTrackerProject || !aiCustomerProject || !fileStorageProject || !packagingProject || !paymentGatewayProject) {
        console.log('Required projects do not exist, no collaborators to remove');
        return true;
      }

      // Remove sample collaborations
      await db.run(`
        DELETE FROM project_collaborators
        WHERE (project_id = ? AND user_id IN (?, ?, ?, ?))
           OR (project_id = ? AND user_id IN (?, ?, ?))
           OR (project_id = ? AND user_id IN (?, ?))
           OR (project_id = ? AND user_id IN (?, ?))
           OR (project_id = ? AND user_id IN (?, ?, ?))
      `, [
        healthTrackerProject.id, startupUser.id, developerUser.id, designerUser.id, mentorUser.id,
        aiCustomerProject.id, investorUser.id, developerUser.id, businessUser.id,
        fileStorageProject.id, developerUser.id, designerUser.id,
        packagingProject.id, designerUser.id, businessUser.id,
        paymentGatewayProject.id, businessUser.id, developerUser.id, mentorUser.id
      ]);

      console.log('Sample project collaborations removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing sample project collaborations:', error);
      throw error;
    }
  },
};
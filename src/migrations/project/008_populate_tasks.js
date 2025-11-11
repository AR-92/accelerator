/**
 * Migration: Populate tasks table with sample data
 * Creates sample tasks for projects with different statuses and assignees
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

      // Check if required users and projects exist
      if (!startupUser || !investorUser || !developerUser || !designerUser || !businessUser || !mentorUser) {
        console.log('Required users do not exist yet, skipping tasks population');
        return true;
      }

      if (!healthTrackerProject || !aiCustomerProject || !fileStorageProject || !packagingProject) {
        console.log('Required projects do not exist yet, skipping tasks population');
        return true;
      }

      // Create sample tasks
      const tasks = [
        // Mobile Health Tracker App tasks
        {
          project_id: healthTrackerProject.id,
          title: 'Design user interface mockups',
          description: 'Create wireframes and high-fidelity mockups for the health tracking app interface',
          assignee_user_id: designerUser.id,
          status: 'completed'
        },
        {
          project_id: healthTrackerProject.id,
          title: 'Implement user authentication',
          description: 'Develop secure user registration and login functionality',
          assignee_user_id: developerUser.id,
          status: 'in_progress'
        },
        {
          project_id: healthTrackerProject.id,
          title: 'Set up backend API',
          description: 'Create REST API endpoints for health data management',
          assignee_user_id: developerUser.id,
          status: 'todo'
        },
        {
          project_id: healthTrackerProject.id,
          title: 'Create business plan',
          description: 'Draft comprehensive business plan for investor presentation',
          assignee_user_id: mentorUser.id,
          status: 'completed'
        },
        
        // AI-Powered Customer Service Platform tasks
        {
          project_id: aiCustomerProject.id,
          title: 'Research NLP models',
          description: 'Evaluate different natural language processing models for chat functionality',
          assignee_user_id: developerUser.id,
          status: 'in_progress'
        },
        {
          project_id: aiCustomerProject.id,
          title: 'Market analysis',
          description: 'Analyze competitors and market opportunities in customer service software',
          assignee_user_id: businessUser.id,
          status: 'completed'
        },
        
        // Cloud-Based File Storage System tasks
        {
          project_id: fileStorageProject.id,
          title: 'Design database schema',
          description: 'Create database schema for file metadata and user management',
          assignee_user_id: developerUser.id,
          status: 'completed'
        },
        {
          project_id: fileStorageProject.id,
          title: 'Implement encryption',
          description: 'Add client-side encryption for file storage and transfer',
          assignee_user_id: developerUser.id,
          status: 'in_progress'
        },
        
        // Eco-Friendly Packaging Solution tasks
        {
          project_id: packagingProject.id,
          title: 'Source sustainable materials',
          description: 'Find and evaluate biodegradable packaging materials',
          assignee_user_id: businessUser.id,
          status: 'in_progress'
        },
        {
          project_id: packagingProject.id,
          title: 'Design packaging prototypes',
          description: 'Create physical prototypes of sustainable packaging solutions',
          assignee_user_id: designerUser.id,
          status: 'todo'
        }
      ];

      for (const task of tasks) {
        await db.run(`
          INSERT INTO tasks (project_id, title, description, assignee_user_id, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [task.project_id, task.title, task.description, task.assignee_user_id, task.status]);
      }

      console.log('Sample tasks created successfully');
      return true;
    } catch (error) {
      console.error('Error creating sample tasks:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Get project IDs, only if they exist
      const healthTrackerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Mobile Health Tracker App']);
      const aiCustomerProject = await db.get('SELECT id FROM projects WHERE title = ?', ['AI-Powered Customer Service Platform']);
      const fileStorageProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Cloud-Based File Storage System']);
      const packagingProject = await db.get('SELECT id FROM projects WHERE title = ?', ['Eco-Friendly Packaging Solution']);

      if (!healthTrackerProject || !aiCustomerProject || !fileStorageProject || !packagingProject) {
        console.log('Required projects do not exist, no tasks to remove');
        return true;
      }

      // Remove all sample tasks
      await db.run(`
        DELETE FROM tasks
        WHERE project_id IN (?, ?, ?, ?)
      `, [healthTrackerProject.id, aiCustomerProject.id, fileStorageProject.id, packagingProject.id]);

      console.log('Sample tasks removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing sample tasks:', error);
      throw error;
    }
  },
};
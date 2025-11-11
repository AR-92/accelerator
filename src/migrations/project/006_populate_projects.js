/**
 * Migration: Populate projects table with sample data
 * Creates sample projects associated with users and organizations
 */

module.exports = {
  up: async (db) => {
    try {
      // Get user and organization IDs
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);
      const developerUser = await db.get('SELECT id FROM users WHERE email = ?', ['developer@example.com']);
      const designerUser = await db.get('SELECT id FROM users WHERE email = ?', ['designer@example.com']);
      const businessUser = await db.get('SELECT id FROM users WHERE email = ?', ['business@example.com']);
      
      const mobileSolutionsOrg = await db.get('SELECT id FROM organizations WHERE name = ?', ['Mobile Solutions LLC']);
      const fintechOrg = await db.get('SELECT id FROM organizations WHERE name = ?', ['FinTech Innovators']);

      // Check if required users and organizations exist
      if (!startupUser || !investorUser || !developerUser || !designerUser || !businessUser) {
        console.log('Required users do not exist yet, skipping projects population');
        return true;
      }

      if (!mobileSolutionsOrg && !fintechOrg) {
        console.log('Required organizations do not exist yet, skipping projects population');
        return true;
      }

      // Create sample projects
      const projects = [
        {
          owner_user_id: startupUser.id,
          organization_id: mobileSolutionsOrg ? mobileSolutionsOrg.id : null,
          title: 'Mobile Health Tracker App',
          description: 'A comprehensive health tracking application that connects users with healthcare providers and tracks fitness goals.',
          visibility: 'public',
        },
        {
          owner_user_id: investorUser.id,
          organization_id: null,
          title: 'AI-Powered Customer Service Platform',
          description: 'An advanced customer service platform using artificial intelligence to provide instant, accurate responses.',
          visibility: 'public',
        },
        {
          owner_user_id: developerUser.id,
          organization_id: null,
          title: 'Cloud-Based File Storage System',
          description: 'A secure, scalable file storage solution with advanced sharing capabilities and version control.',
          visibility: 'private',
        },
        {
          owner_user_id: designerUser.id,
          organization_id: null,
          title: 'Eco-Friendly Packaging Solution',
          description: 'Innovative packaging materials made from biodegradable resources for sustainable businesses.',
          visibility: 'public',
        },
        {
          owner_user_id: businessUser.id,
          organization_id: fintechOrg ? fintechOrg.id : null,
          title: 'Blockchain Payment Gateway',
          description: 'A secure payment gateway leveraging blockchain technology for fast, low-cost international transfers.',
          visibility: 'public',
        },
        {
          owner_user_id: startupUser.id,
          organization_id: mobileSolutionsOrg ? mobileSolutionsOrg.id : null,
          title: 'Local Food Delivery Network',
          description: 'Connecting local restaurants with customers through an efficient delivery platform.',
          visibility: 'public',
        },
        {
          owner_user_id: investorUser.id,
          organization_id: null,
          title: 'Virtual Reality Education Platform',
          description: 'Immersive educational experiences using VR technology for enhanced learning outcomes.',
          visibility: 'private',
        },
        {
          owner_user_id: developerUser.id,
          organization_id: null,
          title: 'Smart Home Automation System',
          description: 'Integrated home automation solution with voice control and energy efficiency features.',
          visibility: 'public',
        }
      ];

      for (const project of projects) {
        await db.run(`
          INSERT INTO projects (owner_user_id, organization_id, title, description, visibility, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [project.owner_user_id, project.organization_id, project.title, project.description, project.visibility]);
      }

      console.log('Sample projects created successfully');
      return true;
    } catch (error) {
      console.error('Error creating sample projects:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Delete all sample projects
      await db.run(`
        DELETE FROM projects 
        WHERE title IN (
          'Mobile Health Tracker App', 'AI-Powered Customer Service Platform',
          'Cloud-Based File Storage System', 'Eco-Friendly Packaging Solution',
          'Blockchain Payment Gateway', 'Local Food Delivery Network',
          'Virtual Reality Education Platform', 'Smart Home Automation System'
        )
      `);

      console.log('Sample projects removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing sample projects:', error);
      throw error;
    }
  },
};
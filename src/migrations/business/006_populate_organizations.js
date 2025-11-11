/**
 * Migration: Populate organizations table with sample data
 * Creates sample corporate, enterprise, and startup organizations
 */

module.exports = {
  up: async (db) => {
    try {
      // Get user IDs for foreign key references
      const adminUser = await db.get('SELECT id FROM users WHERE email = ?', ['admin@accelerator.com']);
      const corporateUser = await db.get('SELECT id FROM users WHERE email = ?', ['corporate@example.com']);
      const enterpriseUser = await db.get('SELECT id FROM users WHERE email = ?', ['enterprise@example.com']);
      const startupUser = await db.get('SELECT id FROM users WHERE email = ?', ['startup@example.com']);
      const investorUser = await db.get('SELECT id FROM users WHERE email = ?', ['investor@example.com']);

      // Check if required users exist
      if (!adminUser || !corporateUser || !enterpriseUser || !startupUser || !investorUser) {
        console.log('Required users do not exist yet, skipping organizations population');
        return true;
      }

      // Create sample organizations
      const organizations = [
        {
          name: 'Global Tech Corp',
          org_type: 'corporate',
          owner_user_id: corporateUser.id,
        },
        {
          name: 'Innovation Labs Inc',
          org_type: 'enterprise',
          owner_user_id: enterpriseUser.id,
        },
        {
          name: 'Global Tech Corp - Seattle Division',
          org_type: 'enterprise',
          owner_user_id: corporateUser.id,
        },
        {
          name: 'Innovation Labs - Boston Startup',
          org_type: 'startup',
          owner_user_id: enterpriseUser.id,
        },
        {
          name: 'Tech Ventures',
          org_type: 'startup',
          owner_user_id: investorUser.id,
        },
        {
          name: 'Mobile Solutions LLC',
          org_type: 'startup',
          owner_user_id: startupUser.id,
        },
        {
          name: 'Global Tech Corp - New York Branch',
          org_type: 'enterprise',
          owner_user_id: corporateUser.id,
        },
        {
          name: 'FinTech Innovators',
          org_type: 'startup',
          owner_user_id: investorUser.id,
        }
      ];

      for (const org of organizations) {
        await db.run(`
          INSERT INTO organizations (name, org_type, owner_user_id, created_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `, [org.name, org.org_type, org.owner_user_id]);
      }

      // Update corporate user with organization_id
      const corporateOrg = await db.get('SELECT id FROM organizations WHERE name = ?', ['Global Tech Corp']);
      if (corporateOrg) {
        await db.run('UPDATE users SET organization_id = ? WHERE email = ?', [corporateOrg.id, 'corporate@example.com']);
      }

      // Update enterprise users with organization_id
      const enterpriseOrg = await db.get('SELECT id FROM organizations WHERE name = ?', ['Innovation Labs Inc']);
      if (enterpriseOrg) {
        await db.run('UPDATE users SET organization_id = ? WHERE email = ?', [enterpriseOrg.id, 'enterprise@example.com']);
      }

      const seattleEnterpriseOrg = await db.get('SELECT id FROM organizations WHERE name = ?', ['Global Tech Corp - Seattle Division']);
      if (seattleEnterpriseOrg) {
        await db.run('UPDATE users SET organization_id = ? WHERE email = ?', [seattleEnterpriseOrg.id, 'admin@accelerator.com']);
      }

      const bostonStartupOrg = await db.get('SELECT id FROM organizations WHERE name = ?', ['Innovation Labs - Boston Startup']);
      if (bostonStartupOrg) {
        await db.run('UPDATE users SET organization_id = ? WHERE email = ?', [bostonStartupOrg.id, 'startup@example.com']);
      }

      console.log('Sample organizations created successfully');
      return true;
    } catch (error) {
      console.error('Error creating sample organizations:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Reset organization_id in users
      await db.run(`
        UPDATE users
        SET organization_id = NULL
        WHERE email IN (
          'corporate@example.com', 'enterprise@example.com',
          'admin@accelerator.com', 'startup@example.com'
        )
      `);

      // Delete all sample organizations
      await db.run(`
        DELETE FROM organizations
        WHERE name IN (
          'Global Tech Corp', 'Innovation Labs Inc',
          'Global Tech Corp - Seattle Division', 'Innovation Labs - Boston Startup',
          'Tech Ventures', 'Mobile Solutions LLC',
          'Global Tech Corp - New York Branch', 'FinTech Innovators'
        )
      `);

      console.log('Sample organizations removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing sample organizations:', error);
      throw error;
    }
  },
};
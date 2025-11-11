/**
 * Seed script for sample organizations and users
 * Creates sample corporate, enterprise, and startup organizations
 */

const { db, dbRun } = require('../config/database');
const bcrypt = require('bcrypt');

async function populateSampleData() {
  try {
    console.log('Populating sample organizations and users...');

    // Create sample organizations
    const organizations = [
      {
        name: 'TechCorp Inc.',
        org_type: 'corporate',
        owner_email: 'ceo@techcorp.com',
      },
      {
        name: 'InnovateLabs',
        org_type: 'enterprise',
        owner_email: 'director@innovatelabs.com',
      },
      {
        name: 'StartupXYZ',
        org_type: 'startup',
        owner_email: 'founder@startupxyz.com',
      },
      {
        name: 'Global Enterprises',
        org_type: 'corporate',
        owner_email: 'admin@globalent.com',
      },
      {
        name: 'NextGen Solutions',
        org_type: 'enterprise',
        owner_email: 'manager@nextgen.com',
      },
    ];

    const orgIds = {};

    for (const org of organizations) {
      const result = await dbRun(
        'INSERT INTO organizations (name, org_type) VALUES (?, ?)',
        [org.name, org.org_type]
      );
      orgIds[org.owner_email] = result.id;
    }

    // Create sample users
    const users = [
      {
        email: 'ceo@techcorp.com',
        password: 'password123',
        name: 'John CEO',
        user_type: 'corporate',
        organization_id: orgIds['ceo@techcorp.com'],
        wallet_credits: 1000,
      },
      {
        email: 'director@innovatelabs.com',
        password: 'password123',
        name: 'Sarah Director',
        user_type: 'enterprise',
        organization_id: orgIds['director@innovatelabs.com'],
        wallet_credits: 500,
      },
      {
        email: 'founder@startupxyz.com',
        password: 'password123',
        name: 'Mike Founder',
        user_type: 'startup',
        organization_id: orgIds['founder@startupxyz.com'],
        wallet_credits: 200,
      },
      {
        email: 'student1@university.edu',
        password: 'password123',
        name: 'Alice Student',
        user_type: 'student',
        organization_id: null,
        wallet_credits: 100,
      },
      {
        email: 'student2@university.edu',
        password: 'password123',
        name: 'Bob Student',
        user_type: 'student',
        organization_id: null,
        wallet_credits: 50,
      },
      {
        email: 'admin@globalent.com',
        password: 'password123',
        name: 'Admin User',
        user_type: 'corporate',
        organization_id: orgIds['admin@globalent.com'],
        wallet_credits: 2000,
      },
      {
        email: 'manager@nextgen.com',
        password: 'password123',
        name: 'Jane Manager',
        user_type: 'enterprise',
        organization_id: orgIds['manager@nextgen.com'],
        wallet_credits: 300,
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await dbRun(
        `INSERT INTO users (email, password_hash, first_name, last_name, user_type, organization_id, wallet_credits)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.email,
          hashedPassword,
          firstName,
          lastName,
          user.user_type,
          user.organization_id,
          user.wallet_credits,
        ]
      );
    }

    // Update organization owner_user_ids
    for (const org of organizations) {
      const user = await new Promise((resolve, reject) => {
        db.get(
          'SELECT id FROM users WHERE email = ?',
          [org.owner_email],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (user) {
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE organizations SET owner_user_id = ? WHERE name = ?',
            [user.id, org.name],
            function (err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }
    }

    console.log('✅ Sample organizations and users populated successfully!');
    console.log('Sample login credentials:');
    console.log('Corporate: ceo@techcorp.com / password123');
    console.log('Enterprise: director@innovatelabs.com / password123');
    console.log('Startup: founder@startupxyz.com / password123');
    console.log('Students: student1@university.edu / password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to populate sample data:', error);
    process.exit(1);
  }
}

populateSampleData();

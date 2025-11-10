/**
 * Script to populate users table with sample data
 */

const { db } = require('../config/database');
const bcrypt = require('bcrypt');

// Promisify db.run
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const users = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
    role: 'startup',
    credits: 150,
    bio: 'Entrepreneur passionate about technology and innovation.',
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'startup',
    credits: 200,
    bio: 'Serial entrepreneur with experience in fintech and healthcare.',
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    first_name: 'Mike',
    last_name: 'Johnson',
    role: 'startup',
    credits: 100,
    bio: 'Tech enthusiast building the next generation of AI applications.',
  },
  {
    email: 'sarah.wilson@example.com',
    password: 'password123',
    first_name: 'Sarah',
    last_name: 'Wilson',
    role: 'startup',
    credits: 300,
    bio: 'Product manager turned entrepreneur focusing on sustainable solutions.',
  },
  {
    email: 'david.brown@example.com',
    password: 'password123',
    first_name: 'David',
    last_name: 'Brown',
    role: 'startup',
    credits: 75,
    bio: 'Software developer with a passion for creating impactful products.',
  },
  {
    email: 'lisa.davis@example.com',
    password: 'password123',
    first_name: 'Lisa',
    last_name: 'Davis',
    role: 'startup',
    credits: 250,
    bio: 'Marketing expert helping startups grow their user base.',
  },
  {
    email: 'alex.garcia@example.com',
    password: 'password123',
    first_name: 'Alex',
    last_name: 'Garcia',
    role: 'startup',
    credits: 180,
    bio: 'Designer and developer creating beautiful user experiences.',
  },
  {
    email: 'emma.miller@example.com',
    password: 'password123',
    first_name: 'Emma',
    last_name: 'Miller',
    role: 'startup',
    credits: 120,
    bio: 'Data scientist leveraging AI for business intelligence.',
  },
  {
    email: 'ryan.anderson@example.com',
    password: 'password123',
    first_name: 'Ryan',
    last_name: 'Anderson',
    role: 'startup',
    credits: 90,
    bio: 'Operations specialist streamlining startup processes.',
  },
  {
    email: 'olivia.taylor@example.com',
    password: 'password123',
    first_name: 'Olivia',
    last_name: 'Taylor',
    role: 'startup',
    credits: 220,
    bio: 'Legal expert advising startups on compliance and growth.',
  },
  {
    email: 'chris.thomas@example.com',
    password: 'password123',
    first_name: 'Chris',
    last_name: 'Thomas',
    role: 'enterprise',
    credits: 500,
    bio: 'Enterprise executive driving digital transformation initiatives.',
  },
  {
    email: 'anna.white@example.com',
    password: 'password123',
    first_name: 'Anna',
    last_name: 'White',
    role: 'enterprise',
    credits: 600,
    bio: 'Corporate strategist specializing in innovation partnerships.',
  },
  {
    email: 'mark.harris@example.com',
    password: 'password123',
    first_name: 'Mark',
    last_name: 'Harris',
    role: 'enterprise',
    credits: 450,
    bio: 'Technology leader managing enterprise-scale software projects.',
  },
  {
    email: 'sophia.martin@example.com',
    password: 'password123',
    first_name: 'Sophia',
    last_name: 'Martin',
    role: 'enterprise',
    credits: 550,
    bio: 'Chief innovation officer fostering startup-corporate collaborations.',
  },
  {
    email: 'james.clark@example.com',
    password: 'password123',
    first_name: 'James',
    last_name: 'Clark',
    role: 'enterprise',
    credits: 400,
    bio: 'Business development executive connecting enterprises with emerging technologies.',
  },
];

async function populateUsers() {
  try {
    console.log('Starting user population...');

    for (const user of users) {
      // Hash the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      const sql = `
        INSERT INTO users (
          email, password_hash, first_name, last_name, role, credits, bio
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await dbRun(sql, [
        user.email,
        passwordHash,
        user.first_name,
        user.last_name,
        user.role,
        user.credits,
        user.bio,
      ]);

      console.log(
        `Inserted: ${user.first_name} ${user.last_name} (${user.email})`
      );
    }

    const result = await db.get('SELECT COUNT(*) as count FROM users');
    console.log(`Total users: ${result.count}`);
    console.log('User population completed successfully!');
  } catch (error) {
    console.error('Error populating users:', error);
  } finally {
    process.exit(0);
  }
}

populateUsers();

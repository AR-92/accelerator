/**
 * Script to populate collaborations table with sample data
 */

const { db } = require('../config/database');

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

async function populateCollaborations() {
  try {
    console.log('Starting collaborations data population...');

    // Get existing projects and users
    const projects = await new Promise((resolve, reject) => {
      db.all('SELECT id, title FROM projects LIMIT 10', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const users = await new Promise((resolve, reject) => {
      db.all(
        'SELECT id, first_name, last_name FROM users LIMIT 10',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    if (projects.length === 0 || users.length === 0) {
      console.log(
        'No projects or users found. Please populate those tables first.'
      );
      return;
    }

    // Clear existing data
    console.log('Clearing existing collaborations...');
    await dbRun('DELETE FROM collaborations');

    // Generate sample collaborations
    const collaborationsData = [];
    const messages = [
      'Great progress on the project! The latest features look promising.',
      'I have some feedback on the design. Let me share my thoughts.',
      'The team meeting went well. Here are the key takeaways.',
      "I've updated the documentation with the new requirements.",
      'The prototype is ready for testing. Let me know what you think.',
      'We need to discuss the timeline for the next milestone.',
      'I found a potential issue with the current implementation.',
      'The client feedback has been incorporated into the latest version.',
      "Let's schedule a review meeting for next week.",
      'The integration with the API is now complete.',
      "I've added some new features based on user research.",
      'The performance optimizations are showing good results.',
      'We should consider adding more test cases.',
      'The deployment process has been streamlined.',
      "I've prepared the presentation for the stakeholders.",
    ];

    for (let i = 0; i < 20; i++) {
      const project = projects[i % projects.length];
      const user = users[i % users.length];
      const message = messages[i % messages.length];

      collaborationsData.push({
        project_id: project.id,
        user_id: user.id,
        message: `${message} (Project: ${project.title})`,
        timestamp: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // Random date within last 30 days
      });
    }

    // Insert collaborations data
    console.log('Inserting collaborations data...');
    for (const collab of collaborationsData) {
      const sql = `
        INSERT INTO collaborations (
          project_id, user_id, message, timestamp
        ) VALUES (?, ?, ?, ?)
      `;

      try {
        await dbRun(sql, [
          collab.project_id,
          collab.user_id,
          collab.message,
          collab.timestamp,
        ]);
        console.log(`Inserted collaboration for project ${collab.project_id}`);
      } catch (error) {
        console.error(`Error inserting collaboration:`, error);
      }
    }

    // Get count
    const collabCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM collaborations', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    console.log(`Total collaborations records: ${collabCount.count}`);
    console.log('Collaborations data population completed successfully!');
  } catch (error) {
    console.error('Error populating collaborations data:', error);
  } finally {
    process.exit(0);
  }
}

populateCollaborations();

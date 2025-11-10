/**
 * Script to populate portfolio table with sample data
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

const portfolioData = [
  {
    user_id: 1,
    title: 'AI Health App',
    description: 'A mobile app using AI for health monitoring',
    category: 'Mobile',
    tags: JSON.stringify(['AI', 'Health', 'Mobile']),
    isPublic: true,
    image: '/images/placeholder.svg',
    votes: 15,
  },
  {
    user_id: 1,
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution',
    category: 'E-commerce',
    tags: JSON.stringify(['E-commerce', 'React', 'Node.js']),
    isPublic: true,
    image: '/images/placeholder.svg',
    votes: 22,
  },
  {
    user_id: 2,
    title: 'Data Analytics Dashboard',
    description: 'Dashboard for data visualization',
    category: 'Data',
    tags: JSON.stringify(['Analytics', 'Charts', 'Dashboard']),
    isPublic: true,
    image: '/images/placeholder.svg',
    votes: 8,
  },
];

async function populatePortfolio() {
  try {
    console.log('Starting portfolio data population...');

    // Clear existing data
    console.log('Clearing existing portfolio...');
    await dbRun('DELETE FROM portfolio');

    // Insert portfolio data
    console.log('Inserting portfolio data...');
    for (const item of portfolioData) {
      const sql = `
        INSERT INTO portfolio (
          user_id, title, description, category, tags, isPublic, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        await dbRun(sql, [
          item.user_id,
          item.title,
          item.description,
          item.category,
          item.tags,
          item.isPublic,
          item.image,
        ]);
        console.log(`Inserted portfolio: ${item.title}`);
      } catch (error) {
        console.error(`Error inserting portfolio ${item.title}:`, error);
      }
    }

    // Get count
    const portfolioCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM portfolio', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    console.log(`Total portfolio records: ${portfolioCount.count}`);
    console.log('Portfolio data population completed successfully!');
  } catch (error) {
    console.error('Error populating portfolio data:', error);
  } finally {
    process.exit(0);
  }
}

populatePortfolio();

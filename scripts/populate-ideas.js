/**
 * Script to populate ideas table with sample data
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

const ideasData = [
  {
    href: 'sample-idea-1',
    title: 'AI-Powered Health Monitoring App',
    type: 'product',
    typeIcon: '📱',
    rating: 8,
    description:
      'An innovative mobile app that uses AI to monitor user health metrics and provide personalized wellness recommendations.',
    tags: JSON.stringify(['health', 'ai', 'mobile', 'wellness']),
    isFavorite: true,
  },
  {
    href: 'sample-idea-2',
    title: 'Sustainable Urban Farming System',
    type: 'service',
    typeIcon: '🌱',
    rating: 7,
    description:
      'A comprehensive service for implementing vertical farming solutions in urban environments to promote sustainable food production.',
    tags: JSON.stringify(['sustainability', 'farming', 'urban', 'environment']),
    isFavorite: false,
  },
  {
    href: 'sample-idea-3',
    title: 'Blockchain-Based Supply Chain Tracker',
    type: 'product',
    typeIcon: '⛓️',
    rating: 9,
    description:
      'A blockchain platform that provides transparent and immutable tracking of products through the entire supply chain.',
    tags: JSON.stringify([
      'blockchain',
      'supply-chain',
      'transparency',
      'tracking',
    ]),
    isFavorite: true,
  },
  {
    href: 'sample-idea-4',
    title: 'Virtual Reality Learning Platform',
    type: 'service',
    typeIcon: '🕶️',
    rating: 6,
    description:
      'An educational platform using VR technology to create immersive learning experiences for students of all ages.',
    tags: JSON.stringify(['education', 'vr', 'learning', 'technology']),
    isFavorite: false,
  },
  {
    href: 'sample-idea-5',
    title: 'Smart Home Energy Optimizer',
    type: 'product',
    typeIcon: '🏠',
    rating: 8,
    description:
      'A device that automatically optimizes energy usage in homes by learning user patterns and adjusting appliances accordingly.',
    tags: JSON.stringify(['smart-home', 'energy', 'optimization', 'iot']),
    isFavorite: true,
  },
];

async function populateIdeas() {
  try {
    console.log('Starting ideas data population...');

    // Clear existing data
    console.log('Clearing existing ideas...');
    await dbRun('DELETE FROM ideas');

    // Insert ideas data
    console.log('Inserting ideas data...');
    for (const idea of ideasData) {
      const sql = `
        INSERT INTO ideas (
          href, title, type, typeIcon, rating, description, tags, isFavorite
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        await dbRun(sql, [
          idea.href,
          idea.title,
          idea.type,
          idea.typeIcon,
          idea.rating,
          idea.description,
          idea.tags,
          idea.isFavorite,
        ]);
        console.log(`Inserted idea: ${idea.title}`);
      } catch (error) {
        console.error(`Error inserting idea ${idea.title}:`, error);
      }
    }

    // Get count
    const ideasCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM ideas', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    console.log(`Total ideas records: ${ideasCount.count}`);
    console.log('Ideas data population completed successfully!');
  } catch (error) {
    console.error('Error populating ideas data:', error);
  } finally {
    process.exit(0);
  }
}

populateIdeas();

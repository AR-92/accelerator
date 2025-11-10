/**
 * Script to populate startups table with sample data
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

const startups = [
  {
    user_id: 2,
    name: 'AI Startup Co',
    description:
      'Developing cutting-edge AI solutions for business automation and decision making.',
    industry: 'Artificial Intelligence',
    status: 'active',
    website: 'https://ai-startup.com',
    founded_date: '2021-03-15',
  },
  {
    user_id: 3,
    name: 'GreenTech Innovations',
    description:
      'Sustainable technology startup focused on renewable energy solutions.',
    industry: 'Clean Energy',
    status: 'active',
    website: 'https://greentech-innovations.com',
    founded_date: '2020-07-22',
  },
  {
    user_id: 4,
    name: 'FinTech Revolution',
    description: 'Blockchain-based financial services for the modern economy.',
    industry: 'FinTech',
    status: 'active',
    website: 'https://fintech-revolution.com',
    founded_date: '2019-11-10',
  },
  {
    user_id: 5,
    name: 'HealthAI Labs',
    description:
      'AI-powered healthcare diagnostics and personalized medicine platform.',
    industry: 'HealthTech',
    status: 'active',
    website: 'https://healthai-labs.com',
    founded_date: '2022-01-05',
  },
  {
    user_id: 1,
    name: 'EduTech Connect',
    description:
      'Online learning platform connecting students with expert tutors worldwide.',
    industry: 'EdTech',
    status: 'active',
    website: 'https://edutech-connect.com',
    founded_date: '2020-09-18',
  },
  {
    user_id: 1,
    name: 'LogiChain Solutions',
    description:
      'Blockchain-based supply chain management and tracking platform.',
    industry: 'Supply Chain',
    status: 'active',
    website: 'https://logichain-solutions.com',
    founded_date: '2021-05-12',
  },
  {
    user_id: 1,
    name: 'CyberGuard Security',
    description: 'Next-generation cybersecurity solutions for enterprises.',
    industry: 'Cybersecurity',
    status: 'active',
    website: 'https://cyberguaard-security.com',
    founded_date: '2019-08-30',
  },
  {
    user_id: 1,
    name: 'AgriSmart Technologies',
    description:
      'IoT and AI solutions for precision agriculture and smart farming.',
    industry: 'AgTech',
    status: 'active',
    website: 'https://agrismart-tech.com',
    founded_date: '2020-12-03',
  },
  {
    user_id: 1,
    name: 'RetailAI Platform',
    description:
      'AI-powered retail analytics and customer experience optimization.',
    industry: 'Retail Tech',
    status: 'active',
    website: 'https://retailai-platform.com',
    founded_date: '2021-06-14',
  },
  {
    user_id: 1,
    name: 'SpaceTech Ventures',
    description: 'Small satellite technology and space data analytics startup.',
    industry: 'Space Technology',
    status: 'active',
    website: 'https://spacetech-ventures.com',
    founded_date: '2022-02-28',
  },
  {
    user_id: 1,
    name: 'BioTech Innovations',
    description:
      'Biotechnology startup developing sustainable materials and biofuels.',
    industry: 'Biotechnology',
    status: 'active',
    website: 'https://biotech-innovations.com',
    founded_date: '2020-04-17',
  },
  {
    user_id: 1,
    name: 'Quantum Computing Labs',
    description:
      'Quantum computing research and development for complex problem solving.',
    industry: 'Quantum Computing',
    status: 'active',
    website: 'https://quantum-computing-labs.com',
    founded_date: '2021-10-09',
  },
  {
    user_id: 1,
    name: 'VR Education World',
    description:
      'Virtual reality platform for immersive educational experiences.',
    industry: 'VR/AR',
    status: 'active',
    website: 'https://vr-education-world.com',
    founded_date: '2019-12-01',
  },
  {
    user_id: 1,
    name: 'SmartCity Solutions',
    description:
      'IoT solutions for smart city infrastructure and urban planning.',
    industry: 'IoT',
    status: 'active',
    website: 'https://smartcity-solutions.com',
    founded_date: '2020-11-25',
  },
  {
    user_id: 1,
    name: 'ClimateTech Analytics',
    description:
      'Climate data analytics and carbon tracking platform for businesses.',
    industry: 'Climate Tech',
    status: 'active',
    website: 'https://climatetech-analytics.com',
    founded_date: '2021-08-19',
  },
];

async function populateStartups() {
  try {
    console.log('Starting startup population...');

    for (const startup of startups) {
      const sql = `
        INSERT INTO startups (
          user_id, name, description, industry, founded_date, website, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await dbRun(sql, [
        startup.user_id,
        startup.name,
        startup.description,
        startup.industry,
        startup.founded_date,
        startup.website,
        startup.status,
      ]);

      console.log(`Inserted: ${startup.name}`);
    }

    const result = await db.get('SELECT COUNT(*) as count FROM startups');
    console.log(`Total startups: ${result.count}`);
    console.log('Startup population completed successfully!');
  } catch (error) {
    console.error('Error populating startups:', error);
  } finally {
    process.exit(0);
  }
}

populateStartups();

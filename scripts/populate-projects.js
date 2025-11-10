/**
 * Script to populate projects table with sample data
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

const projects = [
  {
    user_id: 2,
    title: 'AI-Powered Customer Support Platform',
    description:
      'Building an intelligent chatbot system that can handle customer inquiries 24/7 with natural language processing.',
    status: 'active',
  },
  {
    user_id: 3,
    title: 'Sustainable Energy Monitoring System',
    description:
      'IoT platform for monitoring and optimizing energy consumption in commercial buildings.',
    status: 'active',
  },
  {
    user_id: 4,
    title: 'Blockchain-Based Payment Solution',
    description:
      'Secure and fast payment processing platform using blockchain technology for financial institutions.',
    status: 'active',
  },
  {
    user_id: 5,
    title: 'Telemedicine Mobile Application',
    description:
      'Mobile app connecting patients with healthcare providers for remote consultations and monitoring.',
    status: 'active',
  },
  {
    user_id: 6,
    title: 'E-Learning Platform for Professionals',
    description:
      'Online learning platform offering courses and certifications for working professionals.',
    status: 'active',
  },
  {
    user_id: 7,
    title: 'Supply Chain Optimization Tool',
    description:
      'Software solution for optimizing supply chain operations using AI and predictive analytics.',
    status: 'active',
  },
  {
    user_id: 8,
    title: 'Cybersecurity Threat Detection',
    description:
      'Advanced threat detection system using machine learning to identify security breaches.',
    status: 'active',
  },
  {
    user_id: 9,
    title: 'Smart Agriculture Platform',
    description:
      'IoT and AI platform for precision farming and crop yield optimization.',
    status: 'active',
  },
  {
    user_id: 10,
    title: 'Retail Analytics Dashboard',
    description:
      'Business intelligence platform providing insights for retail operations and customer behavior.',
    status: 'active',
  },
  {
    user_id: 11,
    title: 'Enterprise Digital Transformation',
    description:
      'Comprehensive digital transformation initiative for large corporations.',
    status: 'active',
  },
  {
    user_id: 12,
    title: 'Cloud Migration Services',
    description:
      'End-to-end cloud migration and modernization services for enterprise applications.',
    status: 'active',
  },
  {
    user_id: 13,
    title: 'Data Analytics Platform',
    description:
      'Big data analytics platform for processing and visualizing large datasets.',
    status: 'active',
  },
  {
    user_id: 14,
    title: 'Innovation Lab Initiative',
    description:
      'Corporate innovation program fostering startup collaborations and internal entrepreneurship.',
    status: 'active',
  },
  {
    user_id: 15,
    title: 'Sustainability Reporting System',
    description:
      'Platform for tracking and reporting corporate sustainability metrics and ESG goals.',
    status: 'active',
  },
  {
    user_id: 2,
    title: 'Mobile Gaming Platform',
    description:
      'Cross-platform mobile gaming ecosystem with social features and monetization.',
    status: 'completed',
  },
  {
    user_id: 3,
    title: 'Environmental Monitoring Network',
    description:
      'Global network of environmental sensors for climate change research and monitoring.',
    status: 'active',
  },
  {
    user_id: 4,
    title: 'Cryptocurrency Trading Platform',
    description:
      'Advanced trading platform for cryptocurrencies with real-time analytics and risk management.',
    status: 'active',
  },
  {
    user_id: 5,
    title: 'Mental Health Support App',
    description:
      'Mobile application providing mental health resources and professional support.',
    status: 'active',
  },
  {
    user_id: 6,
    title: 'Corporate Training Platform',
    description:
      'Online platform for employee training and skill development programs.',
    status: 'active',
  },
  {
    user_id: 7,
    title: 'Logistics Optimization Software',
    description:
      'Route optimization and fleet management software for transportation companies.',
    status: 'active',
  },
];

async function populateProjects() {
  try {
    console.log('Starting project population...');

    for (const project of projects) {
      const sql = `
        INSERT INTO projects (
          user_id, title, description, status
        ) VALUES (?, ?, ?, ?)
      `;

      await dbRun(sql, [
        project.user_id,
        project.title,
        project.description,
        project.status,
      ]);

      console.log(`Inserted: ${project.title}`);
    }

    const result = await db.get('SELECT COUNT(*) as count FROM projects');
    console.log(`Total projects: ${result.count}`);
    console.log('Project population completed successfully!');
  } catch (error) {
    console.error('Error populating projects:', error);
  } finally {
    process.exit(0);
  }
}

populateProjects();

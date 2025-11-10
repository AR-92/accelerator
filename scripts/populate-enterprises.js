/**
 * Script to populate enterprises table with sample data
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

const enterprises = [
  {
    user_id: 11,
    name: 'MegaCorp Industries',
    description:
      'Global conglomerate with diverse business interests in technology, manufacturing, and services.',
    industry: 'Conglomerate',
    company_size: 'enterprise',
    status: 'active',
    revenue: 5000000000,
    location: 'New York, NY',
    website: 'https://megacorp.com',
    founded_date: '1950-01-01',
  },
  {
    user_id: 12,
    name: 'TechGiant Corporation',
    description:
      'Leading technology company providing cloud computing, AI, and consumer electronics.',
    industry: 'Technology',
    company_size: 'enterprise',
    status: 'active',
    revenue: 4000000000,
    location: 'Seattle, WA',
    website: 'https://techgiant.com',
    founded_date: '1975-04-04',
  },
  {
    user_id: 1,
    name: 'Global Finance Group',
    description:
      'International financial services company offering banking, investment, and insurance solutions.',
    industry: 'Financial Services',
    company_size: 'enterprise',
    status: 'active',
    revenue: 3500000000,
    location: 'London, UK',
    website: 'https://globalfinance.com',
    founded_date: '1865-07-15',
  },
  {
    user_id: 1,
    name: 'WorldWide Manufacturing',
    description:
      'Global manufacturing company producing automotive, industrial, and consumer goods.',
    industry: 'Manufacturing',
    company_size: 'enterprise',
    status: 'active',
    revenue: 2800000000,
    location: 'Tokyo, Japan',
    website: 'https://worldwidemfg.com',
    founded_date: '1937-11-28',
  },
  {
    user_id: 1,
    name: 'Universal Healthcare Systems',
    description:
      'Comprehensive healthcare provider with hospitals, clinics, and research facilities worldwide.',
    industry: 'Healthcare',
    company_size: 'enterprise',
    status: 'active',
    revenue: 2200000000,
    location: 'Zurich, Switzerland',
    website: 'https://universalhealth.com',
    founded_date: '1920-03-10',
  },
  {
    user_id: 1,
    name: 'Global Energy Solutions',
    description:
      'Integrated energy company involved in oil, gas, renewables, and energy trading.',
    industry: 'Energy',
    company_size: 'enterprise',
    status: 'active',
    revenue: 3200000000,
    location: 'Houston, TX',
    website: 'https://globalenergy.com',
    founded_date: '1911-05-29',
  },
  {
    user_id: 1,
    name: 'International Retail Group',
    description:
      'Global retail corporation operating hypermarkets, department stores, and online platforms.',
    industry: 'Retail',
    company_size: 'enterprise',
    status: 'active',
    revenue: 1800000000,
    location: 'Paris, France',
    website: 'https://internationalretail.com',
    founded_date: '1963-08-12',
  },
  {
    user_id: 1,
    name: 'Telecom Worldwide',
    description:
      'Global telecommunications company providing mobile, internet, and media services.',
    industry: 'Telecommunications',
    company_size: 'enterprise',
    status: 'active',
    revenue: 2500000000,
    location: 'Stockholm, Sweden',
    website: 'https://telecomworldwide.com',
    founded_date: '2000-12-01',
  },
  {
    user_id: 1,
    name: 'AeroSpace Dynamics',
    description:
      'Leading aerospace and defense company manufacturing aircraft, satellites, and defense systems.',
    industry: 'Aerospace',
    company_size: 'enterprise',
    status: 'active',
    revenue: 2900000000,
    location: 'Bethesda, MD',
    website: 'https://aerospacedynamics.com',
    founded_date: '1997-07-16',
  },
  {
    user_id: 1,
    name: 'PharmaGlobal Corporation',
    description:
      'Global pharmaceutical company developing and manufacturing medicines and vaccines.',
    industry: 'Pharmaceuticals',
    company_size: 'enterprise',
    status: 'active',
    revenue: 2100000000,
    location: 'Basel, Switzerland',
    website: 'https://pharmaglobal.com',
    founded_date: '1896-08-23',
  },
];

async function populateEnterprises() {
  try {
    console.log('Starting enterprise population...');

    for (const enterprise of enterprises) {
      const sql = `
        INSERT INTO enterprises (
          user_id, name, description, industry, founded_date, website, status,
          company_size, revenue, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await dbRun(sql, [
        enterprise.user_id,
        enterprise.name,
        enterprise.description,
        enterprise.industry,
        enterprise.founded_date,
        enterprise.website,
        enterprise.status,
        enterprise.company_size,
        enterprise.revenue,
        enterprise.location,
      ]);

      console.log(`Inserted: ${enterprise.name}`);
    }

    const result = await db.get('SELECT COUNT(*) as count FROM enterprises');
    console.log(`Total enterprises: ${result.count}`);
    console.log('Enterprise population completed successfully!');
  } catch (error) {
    console.error('Error populating enterprises:', error);
  } finally {
    process.exit(0);
  }
}

populateEnterprises();

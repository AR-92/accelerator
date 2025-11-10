/**
 * Migration: Populate corporates table with sample data
 * Creates sample corporate companies for testing
 */

module.exports = {
  up: async (db) => {
    const corporates = [
      {
        user_id: 1,
        name: 'TechCorp Solutions',
        description:
          'Leading provider of enterprise software solutions and digital transformation services.',
        industry: 'Technology',
        sector: 'Software & IT Services',
        company_size: 'large',
        status: 'active',
        headquarters: 'San Francisco, CA',
        employee_count: 2500,
        revenue: 850000000,
        location: 'San Francisco, CA',
        website: 'https://techcorp.com',
        founded_date: '2010-03-15',
      },
      {
        user_id: 1,
        name: 'Global Manufacturing Inc',
        description:
          'Worldwide manufacturer of industrial equipment and automation systems.',
        industry: 'Manufacturing',
        sector: 'Industrial Machinery',
        company_size: 'enterprise',
        status: 'active',
        headquarters: 'Detroit, MI',
        employee_count: 8500,
        revenue: 3200000000,
        location: 'Detroit, MI',
        website: 'https://globalmfg.com',
        founded_date: '1985-07-22',
      },
      {
        user_id: 1,
        name: 'FinTech Innovations',
        description:
          'Revolutionary financial technology company specializing in blockchain and digital payments.',
        industry: 'Financial Services',
        sector: 'FinTech',
        company_size: 'medium',
        status: 'active',
        headquarters: 'New York, NY',
        employee_count: 450,
        revenue: 120000000,
        location: 'New York, NY',
        website: 'https://fintechinnovations.com',
        founded_date: '2018-01-10',
      },
      {
        user_id: 1,
        name: 'GreenEnergy Corp',
        description:
          'Sustainable energy solutions provider focusing on renewable power generation.',
        industry: 'Energy',
        sector: 'Renewable Energy',
        company_size: 'large',
        status: 'active',
        headquarters: 'Austin, TX',
        employee_count: 1200,
        revenue: 450000000,
        location: 'Austin, TX',
        website: 'https://greenenergy.com',
        founded_date: '2012-09-05',
      },
      {
        user_id: 1,
        name: 'HealthTech Systems',
        description:
          'Healthcare technology company developing AI-powered medical diagnostic tools.',
        industry: 'Healthcare',
        sector: 'Medical Technology',
        company_size: 'medium',
        status: 'active',
        headquarters: 'Boston, MA',
        employee_count: 320,
        revenue: 95000000,
        location: 'Boston, MA',
        website: 'https://healthtechsys.com',
        founded_date: '2016-11-18',
      },
      {
        user_id: 1,
        name: 'LogisticsPro',
        description:
          'Global logistics and supply chain management solutions provider.',
        industry: 'Transportation',
        sector: 'Logistics & Supply Chain',
        company_size: 'large',
        status: 'active',
        headquarters: 'Chicago, IL',
        employee_count: 1800,
        revenue: 680000000,
        location: 'Chicago, IL',
        website: 'https://logisticspro.com',
        founded_date: '2008-04-12',
      },
      {
        user_id: 1,
        name: 'EduTech Global',
        description:
          'Educational technology platform connecting learners with institutions worldwide.',
        industry: 'Education',
        sector: 'EdTech',
        company_size: 'medium',
        status: 'active',
        headquarters: 'London, UK',
        employee_count: 280,
        revenue: 78000000,
        location: 'London, UK',
        website: 'https://edutechglobal.com',
        founded_date: '2017-06-30',
      },
      {
        user_id: 1,
        name: 'RetailMax Corporation',
        description:
          'Omnichannel retail technology and e-commerce solutions provider.',
        industry: 'Retail',
        sector: 'E-commerce',
        company_size: 'large',
        status: 'active',
        headquarters: 'Seattle, WA',
        employee_count: 950,
        revenue: 380000000,
        location: 'Seattle, WA',
        website: 'https://retailmax.com',
        founded_date: '2011-02-28',
      },
      {
        user_id: 1,
        name: 'AgriTech Solutions',
        description:
          'Agricultural technology company developing smart farming and precision agriculture solutions.',
        industry: 'Agriculture',
        sector: 'AgTech',
        company_size: 'medium',
        status: 'active',
        headquarters: 'Minneapolis, MN',
        employee_count: 180,
        revenue: 52000000,
        location: 'Minneapolis, MN',
        website: 'https://agritechsolutions.com',
        founded_date: '2019-08-14',
      },
      {
        user_id: 1,
        name: 'CyberSecure Inc',
        description:
          'Enterprise cybersecurity solutions and threat intelligence services.',
        industry: 'Security',
        sector: 'Cybersecurity',
        company_size: 'medium',
        status: 'active',
        headquarters: 'Washington, DC',
        employee_count: 380,
        revenue: 110000000,
        location: 'Washington, DC',
        website: 'https://cybersecure.com',
        founded_date: '2015-12-03',
      },
    ];

    try {
      for (const corporate of corporates) {
        const sql = `
          INSERT INTO corporates (
            user_id, name, description, industry, sector, company_size, status,
            headquarters, employee_count, revenue, location, website, founded_date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        console.log('Inserting:', corporate.name);
        const result = await db.run(sql, [
          corporate.user_id,
          corporate.name,
          corporate.description,
          corporate.industry,
          corporate.sector,
          corporate.company_size,
          corporate.status,
          corporate.headquarters,
          corporate.employee_count,
          corporate.revenue,
          corporate.location,
          corporate.website,
          corporate.founded_date,
        ]);
        console.log('Insert result:', result);
      }

      console.log('Sample corporates data inserted successfully');
    } catch (error) {
      console.error('Error inserting corporates data:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      // Remove all sample corporates (keeping any user-created ones)
      await db.run('DELETE FROM corporates WHERE user_id = 1');
      console.log('Sample corporates data removed successfully');
    } catch (error) {
      console.error('Error removing corporates data:', error);
      throw error;
    }
  },
};

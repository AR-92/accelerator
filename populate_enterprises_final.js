import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_KEY are required');
  process.exit(1);
}

// Helper function to generate random data
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = startDate + Math.random() * (endDate - startDate);
  return new Date(randomTime).toISOString().split('T')[0];
};

async function populateEnterprisesFinal() {
  try {
    console.log('Final attempt to populate Enterprises table...');

    const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Energy', 'Transportation', 'Real Estate', 'Consulting'];
    const companySizes = ['startup', 'small', 'medium', 'large', 'enterprise'];
    const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Miami, FL', 'Atlanta, GA'];

    const enterpriseData = [];
    for (let i = 0; i < 8; i++) {
      enterpriseData.push({
        user_id: randomInt(501, 502),
        name: `${randomChoice(['Global', 'Advanced', 'Premier', 'Elite', 'NextGen', 'Smart', 'Future', 'Innovative'])} ${randomChoice(['Tech', 'Solutions', 'Systems', 'Group', 'Enterprises', 'Corporation'])} ${randomChoice(['Inc', 'LLC', 'Ltd', 'Corp'])}`,
        description: `A ${randomChoice(['leading', 'innovative', 'established', 'growing', 'dynamic'])} ${randomChoice(['technology', 'healthcare', 'financial', 'manufacturing', 'retail'])} company specializing in ${randomChoice(['enterprise solutions', 'digital transformation', 'business intelligence', 'customer experience', 'operational efficiency'])}.`,
        industry: randomChoice(industries),
        founded_date: randomDate('1995-01-01', '2020-12-31'),
        website: `https://${randomChoice(['www', 'app', 'portal'])}.${randomChoice(['enterprise', 'company', 'corp', 'solutions'])}${i + 1}.com`,
        status: 'active',
        company_size: randomChoice(companySizes),
        revenue: randomInt(5000000, 10000000000),
        location: randomChoice(locations)
      });
    }

    console.log('Generated enterprise data:', enterpriseData.length, 'records');

    // Try using fetch with different approaches
    for (const enterprise of enterpriseData) {
      try {
        console.log(`Attempting to insert: ${enterprise.name}`);

        // Try with different content types and headers
        const response = await fetch(`${supabaseUrl}/rest/v1/Enterprises`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(enterprise)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Successfully inserted: ${enterprise.name}`);
        } else {
          const errorText = await response.text();
          console.error(`❌ Failed to insert ${enterprise.name}:`, response.status, errorText);
        }
      } catch (e) {
        console.error(`Exception inserting ${enterprise.name}:`, e.message);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Verify final count
    console.log('\nVerifying final count...');
    const countResponse = await fetch(`${supabaseUrl}/rest/v1/Enterprises?select=count`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });

    if (countResponse.ok) {
      const countData = await countResponse.json();
      console.log(`Enterprises table now has ${countData.length} records`);
    } else {
      console.log('Could not verify count');
    }

  } catch (error) {
    console.error('❌ Error during final enterprises population:', error);
  }
}

populateEnterprisesFinal();
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to generate random data
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = startDate + Math.random() * (endDate - startDate);
  return new Date(randomTime).toISOString().split('T')[0];
};

async function populateRandomData() {
  try {
    console.log('Starting random data population for zero-record tables...');

    // Enterprises - Add random enterprise data
    console.log('Populating Enterprises table with random data...');
    const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Energy', 'Transportation'];
    const companySizes = ['startup', 'small', 'medium', 'large', 'enterprise'];
    const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO'];

    const enterpriseData = [];
    for (let i = 0; i < 10; i++) {
      enterpriseData.push({
        user_id: randomInt(501, 502),
        name: `Enterprise ${i + 1} ${randomChoice(['Corp', 'Inc', 'LLC', 'Ltd', 'Solutions'])}`,
        description: `A ${randomChoice(['leading', 'innovative', 'dynamic', 'established'])} company in the ${randomChoice(industries)} sector.`,
        industry: randomChoice(industries),
        founded_date: randomDate('2000-01-01', '2020-12-31'),
        website: `https://enterprise${i + 1}.com`,
        status: randomChoice(['active', 'active', 'active', 'inactive']), // Mostly active
        company_size: randomChoice(companySizes),
        revenue: randomInt(1000000, 5000000000),
        location: randomChoice(locations)
      });
    }

    for (const enterprise of enterpriseData) {
      try {
        const { data, error } = await supabase
          .from('Enterprises')
          .insert([enterprise]);

        if (error) {
          console.error('Error inserting enterprise:', error);
        } else {
          console.log(`✅ Inserted enterprise: ${enterprise.name}`);
        }
      } catch (e) {
        console.error('Exception inserting enterprise:', e);
      }
    }

    // For tables with only id and created_at, we can try inserting empty records
    // These might be used for tracking purposes

    console.log('Attempting to populate tracking tables...');

    // Landing Page Management
    try {
      for (let i = 0; i < 5; i++) {
        const { error } = await supabase
          .from('Landing Page Management')
          .insert([{}]); // Empty object for auto-generated columns

        if (error) {
          console.log(`Could not insert into Landing Page Management: ${error.message}`);
        } else {
          console.log(`✅ Inserted record into Landing Page Management`);
        }
      }
    } catch (e) {
      console.log('Landing Page Management insertions failed (expected for tracking tables)');
    }

    // Corporate
    try {
      for (let i = 0; i < 5; i++) {
        const { error } = await supabase
          .from('Corporate')
          .insert([{}]);

        if (error) {
          console.log(`Could not insert into Corporate: ${error.message}`);
        } else {
          console.log(`✅ Inserted record into Corporate`);
        }
      }
    } catch (e) {
      console.log('Corporate insertions failed (expected for tracking tables)');
    }

    // Votes Management
    try {
      for (let i = 0; i < 10; i++) {
        const { error } = await supabase
          .from('Votes Management')
          .insert([{}]);

        if (error) {
          console.log(`Could not insert into Votes Management: ${error.message}`);
        } else {
          console.log(`✅ Inserted record into Votes Management`);
        }
      }
    } catch (e) {
      console.log('Votes Management insertions failed (expected for tracking tables)');
    }

    console.log('🎉 Random data population completed!');

    // Verify the results
    console.log('\nVerifying populated data...');
    const tables = ['Enterprises', 'Landing Page Management', 'Corporate', 'Votes Management'];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`${table}: Error - ${error.message}`);
        } else {
          console.log(`${table}: ${count} records`);
        }
      } catch (e) {
        console.log(`${table}: Exception - ${e.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error during random data population:', error);
  }
}

populateRandomData();
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

async function populateEnterprisesSimple() {
  try {
    console.log('Attempting to populate Enterprises table with minimal data...');

    // Try with just the basic required fields
    const simpleData = [
      { user_id: 501, name: 'Test Enterprise 1' },
      { user_id: 502, name: 'Test Enterprise 2' },
      { user_id: 501, name: 'Test Enterprise 3' },
      { user_id: 502, name: 'Test Enterprise 4' },
      { user_id: 501, name: 'Test Enterprise 5' }
    ];

    for (const enterprise of simpleData) {
      try {
        // Try using the REST API directly
        const response = await fetch(`${supabaseUrl}/rest/v1/Enterprises`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify(enterprise)
        });

        if (response.ok) {
          console.log(`✅ Inserted enterprise: ${enterprise.name}`);
        } else {
          const error = await response.text();
          console.error(`❌ Failed to insert ${enterprise.name}:`, error);
        }
      } catch (e) {
        console.error(`Exception inserting ${enterprise.name}:`, e);
      }
    }

    // Verify
    const response = await fetch(`${supabaseUrl}/rest/v1/Enterprises?select=count`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Enterprises table now has ${data.length} records`);
    }

  } catch (error) {
    console.error('❌ Error during enterprises population:', error);
  }
}

populateEnterprisesSimple();
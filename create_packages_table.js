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

async function createPackagesTable() {
  try {
    console.log('Creating packages table...');

    // Define the table columns
    const columnsDefinition = `
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price_cents INTEGER NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'active',
      features JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `.trim();

    const { data, error } = await supabase.rpc('create_custom_table', {
      table_name: 'packages',
      columns_definition: columnsDefinition
    });

    if (error) {
      console.error('Error creating table:', error);
      return;
    }

    console.log('Table created:', data);

    // Insert initial data
    console.log('Inserting initial package data...');

    const packages = [
      {
        name: 'Starter Plan',
        description: 'Perfect for small businesses getting started',
        price_cents: 9900, // $99.00
        currency: 'USD',
        status: 'active',
        features: ['Basic features', '5 users', '1GB storage']
      },
      {
        name: 'Professional Plan',
        description: 'Advanced features for growing businesses',
        price_cents: 29900, // $299.00
        currency: 'USD',
        status: 'active',
        features: ['All starter features', 'Unlimited users', '10GB storage', 'Priority support']
      },
      {
        name: 'Enterprise Plan',
        description: 'Complete solution for large organizations',
        price_cents: 99900, // $999.00
        currency: 'USD',
        status: 'active',
        features: ['All professional features', 'Unlimited storage', '24/7 support', 'Custom integrations']
      }
    ];

    for (const pkg of packages) {
      const { data: insertData, error: insertError } = await supabase.rpc('insert_custom_data', {
        table_name: 'packages',
        data_json: pkg
      });

      if (insertError) {
        console.error('Error inserting package:', pkg.name, insertError);
      } else {
        console.log('Inserted package:', pkg.name);
      }
    }

    console.log('Packages table creation and data insertion completed!');

  } catch (error) {
    console.error('Script error:', error);
  }
}

createPackagesTable();
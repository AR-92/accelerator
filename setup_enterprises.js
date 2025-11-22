import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
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

async function setupEnterprises() {
  try {
    console.log('Step 1: Creating exec_sql RPC function...');

    const createExecSql = `
-- RPC Function to execute arbitrary SQL (use with extreme caution - only for development)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Execute the SQL and return success
  EXECUTE sql;
  RETURN jsonb_build_object('status', 'success', 'message', 'SQL executed successfully');
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error executing SQL: %', SQLERRM;
END;
$$;
`;

    // Try to create the function using REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ sql: createExecSql })
    });

    if (!response.ok) {
      console.log('exec_sql function might already exist or creation failed, continuing...');
    } else {
      console.log('✅ exec_sql function created');
    }

    console.log('Step 2: Altering Enterprises table to add columns...');

    const alterSql = fs.readFileSync('alter_enterprises_table.sql', 'utf8');

    const alterResponse = await supabase.rpc('exec_sql', { sql: alterSql });

    if (alterResponse.error) {
      console.error('Error altering table:', alterResponse.error);
    } else {
      console.log('✅ Enterprises table altered successfully');
    }

    console.log('Step 3: Populating Enterprises table...');

    const insertSql = fs.readFileSync('populate_enterprises_manual.sql', 'utf8');

    const insertResponse = await supabase.rpc('exec_sql', { sql: insertSql });

    if (insertResponse.error) {
      console.error('Error inserting data:', insertResponse.error);
    } else {
      console.log('✅ Enterprises data inserted successfully');
    }

    console.log('Step 4: Verifying data...');

    const { data, error } = await supabase
      .from('Enterprises')
      .select('*');

    if (error) {
      console.error('Error verifying data:', error);
    } else {
      console.log(`✅ Enterprises table now has ${data.length} records`);
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

setupEnterprises();
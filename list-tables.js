import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_KEY not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTablesAndSchemas() {
  try {
    console.log('Fetching tables and schemas from Supabase...\n');

    // Get tables
    const { data: tables, error } = await supabase.rpc('get_table_list');
    const tableList = error ? ['todos'] : tables.map(t => t.name || t);

    for (const table of tableList) {
      console.log(`=== Table: ${table} ===`);

    // Try RPC for schema first
    const { data: schemaData, error: schemaError } = await supabase.rpc('get_table_schema', { tbl_name: table });

    if (!schemaError && schemaData) {
      console.log('Columns:');
      schemaData.forEach(col => {
        console.log(`${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ''}${col.column_default ? ' default=' + col.column_default : ''}`);
      });
      console.log('');
      continue;
    } else {
      console.log(`RPC call failed for ${table}: ${schemaError?.message || 'Unknown error'}`);
    }

      // Fallback: try sample data
      try {
        const { data: sample, error: sampleError } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (sampleError) {
          console.log(`Could not fetch data for ${table}: ${sampleError.message}\n`);
        } else if (sample && sample.length > 0) {
          console.log('Columns (inferred from sample data):');
          Object.keys(sample[0]).forEach(key => {
            const value = sample[0][key];
            let type = typeof value;
            if (value === null) type = 'unknown (null)';
            else if (type === 'object' && value instanceof Date) type = 'timestamp';
            console.log(`${key}: ${type}`);
          });
          console.log('');
        } else {
          console.log('No data in table - create RPC function for full schema:\n');
          console.log(`CREATE OR REPLACE FUNCTION get_table_schema(tbl_name text)
RETURNS TABLE(column_name text, data_type text, is_nullable text, column_default text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_name = tbl_name
    AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
END;
$$;\n`);
        }
      } catch (e) {
        console.log(`Error fetching schema for ${table}: ${e.message}\n`);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

getTablesAndSchemas();
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

async function runEnterprisesSQL() {
  try {
    console.log('Reading Enterprises SQL file...');
    const sqlContent = fs.readFileSync('populate_enterprises_manual.sql', 'utf8');

    console.log('Executing Enterprises SQL...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('Error executing SQL:', error);
      // Try alternative approach - execute statements one by one
      console.log('Trying individual statements...');

      const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
            if (stmtError) {
              console.error('Error with statement:', statement.trim(), stmtError);
            } else {
              console.log('✅ Executed statement successfully');
            }
          } catch (e) {
            console.error('Exception with statement:', statement.trim(), e);
          }
        }
      }
    } else {
      console.log('✅ Enterprises SQL executed successfully');
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

runEnterprisesSQL();
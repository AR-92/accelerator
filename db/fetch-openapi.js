#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Supabase configuration from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Validate required environment variables
if (!SUPABASE_URL) {
  console.error('❌ Error: SUPABASE_URL environment variable is required');
  console.error('Please set SUPABASE_URL in your .env file');
  process.exit(1);
}

if (!SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_KEY environment variable is required');
  console.error('Please set SUPABASE_KEY in your .env file');
  process.exit(1);
}

// OpenAPI spec endpoint
const OPENAPI_ENDPOINT = `${SUPABASE_URL}/rest/v1/`;

/**
 * Fetch OpenAPI specification from Supabase
 */
async function fetchOpenAPISpec() {
  try {
    console.log('🔄 Fetching OpenAPI specification from Supabase...');

    const response = await fetch(OPENAPI_ENDPOINT, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Write to openapi.json in the project root
    const outputPath = path.join(__dirname, '..', 'openapi.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log('✅ OpenAPI specification saved to openapi.json');
    console.log(`📄 File location: ${outputPath}`);
    console.log(`📊 API endpoints found: ${Object.keys(data.paths || {}).length}`);

  } catch (error) {
    console.error('❌ Error fetching OpenAPI specification:', error.message);
    process.exit(1);
  }
}

// Run the fetch function
fetchOpenAPISpec();
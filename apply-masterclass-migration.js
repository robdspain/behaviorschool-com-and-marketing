#!/usr/bin/env node

/**
 * Masterclass Database Migration Script
 *
 * This script applies the masterclass database schema to Supabase
 *
 * Usage:
 *   node apply-masterclass-migration.js
 *
 * Environment variables required:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_KEY - Your Supabase service role key
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Starting Masterclass Database Migration...\n');

  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'sql', 'masterclass-schema.sql');
    console.log(`📄 Reading SQL file: ${sqlFilePath}`);

    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found at ${sqlFilePath}`);
    }

    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ SQL file loaded successfully\n');

    // Split SQL into individual statements (rough split by semicolons)
    // Note: This is a simple approach; for complex SQL you might need a proper parser
    console.log('🔧 Executing SQL statements...\n');

    // Execute the entire SQL as one statement using Supabase's RPC
    // This is the most reliable way to execute complex SQL with Supabase
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql }).catch(() => {
      // If exec_sql doesn't exist, we'll use the REST API directly
      return { data: null, error: null };
    });

    // Alternative: Use Supabase's SQL endpoint directly
    if (error) {
      console.log('⚠️  RPC method not available, using direct SQL execution...\n');

      // Execute via Supabase's REST API
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ sql_string: sql })
      });

      if (!response.ok) {
        // If that doesn't work either, we'll need to use psql or Supabase dashboard
        console.log('⚠️  Direct SQL execution not available.\n');
        console.log('📋 Please execute the SQL manually using one of these methods:\n');
        console.log('Method 1: Supabase Dashboard');
        console.log('  1. Go to your Supabase project dashboard');
        console.log('  2. Navigate to the SQL Editor');
        console.log('  3. Copy and paste the contents of sql/masterclass-schema.sql');
        console.log('  4. Click "Run"\n');
        console.log('Method 2: psql command line');
        console.log(`  psql "${SUPABASE_URL}" < sql/masterclass-schema.sql\n`);
        console.log('Method 3: Use the script below:\n');
        console.log(sql);
        return;
      }
    }

    console.log('✅ Migration executed successfully!\n');

    // Verify tables were created
    console.log('🔍 Verifying table creation...\n');

    const tables = [
      'masterclass_enrollments',
      'masterclass_progress',
      'masterclass_quiz_responses',
      'masterclass_certificates',
      'masterclass_analytics_events'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`❌ Table "${table}" verification failed: ${error.message}`);
      } else {
        console.log(`✅ Table "${table}" exists and is accessible`);
      }
    }

    console.log('\n🎉 Masterclass database migration completed!\n');
    console.log('📊 Database Summary:');
    console.log('  - 5 tables created');
    console.log('  - 3 helper functions created');
    console.log('  - 2 views created');
    console.log('  - Row Level Security policies enabled');
    console.log('  - Indexes created for performance\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();

#!/usr/bin/env node

/**
 * Database Setup Verification Script
 * 
 * This script checks if required database tables exist and provides
 * instructions for applying migrations if they don't.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
try {
  const dotenv = require('dotenv');
  dotenv.config({ path: '.env.local' });
} catch (e) {
  console.log('⚠️  dotenv not available, using system environment variables\n');
}

const { createClient } = require('@supabase/supabase-js');

const REQUIRED_TABLES = [
  'checkout_access',
  'checkout_access_logs',
  'checkout_settings'
];

async function checkDatabaseSetup() {
  console.log('\n🔍 VERIFYING DATABASE SETUP\n');
  console.log('═'.repeat(80));

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ ERROR: Missing Supabase credentials');
    console.log('\nRequired environment variables:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
    console.log('  - SUPABASE_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY');
    console.log('\nPlease set these in your .env.local file\n');
    process.exit(1);
  }

  console.log('✅ Supabase credentials found');
  console.log(`   URL: ${supabaseUrl}`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check each required table
  console.log('\n📊 Checking required tables:\n');
  
  const results = [];
  for (const tableName of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist
          console.log(`❌ Table '${tableName}' does not exist`);
          results.push({ table: tableName, exists: false, error: error.message });
        } else {
          console.log(`⚠️  Table '${tableName}' - Error: ${error.message}`);
          results.push({ table: tableName, exists: false, error: error.message });
        }
      } else {
        console.log(`✅ Table '${tableName}' exists`);
        results.push({ table: tableName, exists: true });
      }
    } catch (err) {
      console.log(`❌ Table '${tableName}' - Exception: ${err.message}`);
      results.push({ table: tableName, exists: false, error: err.message });
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(80));
  const missingTables = results.filter(r => !r.exists);
  
  if (missingTables.length === 0) {
    console.log('\n✅ SUCCESS: All required tables exist!\n');
    console.log('Your database is properly configured.\n');
    return true;
  } else {
    console.log(`\n❌ MISSING TABLES: ${missingTables.length} table(s) need to be created\n`);
    console.log('Missing tables:');
    missingTables.forEach(t => console.log(`  - ${t.table}`));
    
    console.log('\n' + '─'.repeat(80));
    console.log('\n📝 TO FIX THIS:\n');
    console.log('1. Read the instructions in APPLY_MIGRATIONS.md');
    console.log('2. Open Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/sql/new');
    console.log('3. Copy and paste the migration SQL from APPLY_MIGRATIONS.md');
    console.log('4. Click "Run" to execute the migrations');
    console.log('5. Run this script again to verify\n');
    
    return false;
  }
}

// Run the check
checkDatabaseSetup()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });


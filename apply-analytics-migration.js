#!/usr/bin/env node

/**
 * Analytics Database Migration Script
 * 
 * This script applies the analytics_events and download_submissions tables
 * to your Supabase database.
 * 
 * Usage: node apply-analytics-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQL(filename, description) {
  console.log(`\n📝 ${description}...`);
  
  const sqlPath = path.join(__dirname, 'sql', filename);
  
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Error: SQL file not found: ${sqlPath}`);
    return false;
  }
  
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Try direct query as fallback
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        const { error: stmtError } = await supabase.from('_migrations').insert({
          statement: statement
        });
        
        if (stmtError && !stmtError.message.includes('does not exist')) {
          console.error(`❌ Error executing statement:`, stmtError.message);
          return false;
        }
      }
    }
    
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying tables...');
  
  const tables = ['analytics_events', 'download_submissions'];
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`❌ Table '${table}' not found or not accessible`);
      console.error(`   Error: ${error.message}`);
      return false;
    }
    
    console.log(`✅ Table '${table}' exists and is accessible`);
  }
  
  return true;
}

async function insertTestData() {
  console.log('\n📊 Inserting test data...');
  
  const testEvents = [
    {
      event_type: 'email_signup',
      event_name: 'Newsletter Signup (Test)',
      source_page: '/test',
      user_email: 'test@example.com',
      value: 5.00,
    },
    {
      event_type: 'download',
      event_name: 'ACT Matrix Guide Download (Test)',
      source_page: '/act-matrix',
      user_email: 'test@example.com',
      resource_name: 'ACT Matrix Guide',
      value: 10.00,
    },
    {
      event_type: 'course_inquiry',
      event_name: 'Course Information Request (Test)',
      source_page: '/supervisors',
      user_email: 'test2@example.com',
      value: 25.00,
    },
  ];
  
  const { error } = await supabase
    .from('analytics_events')
    .insert(testEvents);
  
  if (error) {
    console.error('❌ Error inserting test data:', error.message);
    return false;
  }
  
  console.log('✅ Test data inserted successfully');
  console.log('   - 3 test events added to analytics_events table');
  return true;
}

async function showSummary() {
  console.log('\n📈 Database Summary:');
  
  // Count events by type
  const { data: events, error: eventsError } = await supabase
    .from('analytics_events')
    .select('event_type');
  
  if (!eventsError && events) {
    const counts = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n   Analytics Events by Type:');
    Object.entries(counts).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
  }
  
  // Count downloads
  const { data: downloads, error: downloadsError } = await supabase
    .from('download_submissions')
    .select('*', { count: 'exact', head: true });
  
  if (!downloadsError) {
    console.log(`\n   Download Submissions: ${downloads?.length || 0}`);
  }
}

async function main() {
  console.log('🚀 Analytics Database Migration');
  console.log('================================\n');
  console.log(`Supabase URL: ${supabaseUrl}`);
  
  // Check connection
  console.log('\n🔌 Testing Supabase connection...');
  const { data, error } = await supabase.from('_migrations').select('*').limit(1);
  
  if (error && !error.message.includes('does not exist')) {
    console.error('❌ Error: Cannot connect to Supabase');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
  
  console.log('✅ Supabase connection successful');
  
  // Run migrations
  const migrations = [
    {
      file: 'analytics_events_table.sql',
      description: 'Creating analytics_events table'
    },
    {
      file: 'download_submissions_table.sql',
      description: 'Creating download_submissions table'
    }
  ];
  
  for (const migration of migrations) {
    const success = await runSQL(migration.file, migration.description);
    if (!success) {
      console.log('\n⚠️  Migration had errors, but continuing...');
    }
  }
  
  // Verify tables
  const tablesExist = await verifyTables();
  
  if (!tablesExist) {
    console.log('\n❌ Migration failed: Tables were not created successfully');
    console.log('\n💡 Please run the SQL manually in Supabase SQL Editor:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Copy contents of sql/analytics_events_table.sql');
    console.log('   3. Run the SQL');
    console.log('   4. Copy contents of sql/download_submissions_table.sql');
    console.log('   5. Run the SQL');
    process.exit(1);
  }
  
  // Insert test data
  console.log('\n❓ Would you like to insert test data? (y/n)');
  console.log('   This will add 3 sample events to help you verify the setup.');
  
  // For automated runs, skip test data
  if (process.env.INSERT_TEST_DATA === 'true') {
    await insertTestData();
  } else {
    console.log('   Skipping test data (set INSERT_TEST_DATA=true to enable)');
  }
  
  // Show summary
  await showSummary();
  
  console.log('\n✅ Migration completed successfully!');
  console.log('\n📖 Next Steps:');
  console.log('   1. Visit https://behaviorschool.com/admin/analytics');
  console.log('   2. Check the Conversion Tracking section');
  console.log('   3. Test tracking by downloading a resource');
  console.log('   4. Verify events appear in the dashboard');
  console.log('\n📚 For more info, see ANALYTICS_TRACKING_SETUP.md');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});


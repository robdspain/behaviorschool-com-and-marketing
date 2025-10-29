#!/usr/bin/env node

/**
 * Presentations (AI) Database Migration Script
 * - Creates table public.presentations_ai
 * - Enables RLS and adds permissive admin policies
 *
 * Usage: node apply-presentations-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRECT_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQL(file) {
  const sqlPath = path.join(__dirname, 'sql', file);
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ SQL file not found: ${sqlPath}`);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Try calling an rpc function if it exists in your DB
  const rpcNames = ['exec_sql', 'exec', 'run_sql'];
  for (const rpc of rpcNames) {
    try {
      const { error } = await supabase.rpc(rpc, { sql_query: sql, sql_string: sql });
      if (!error) {
        console.log(`✅ Applied via RPC '${rpc}'`);
        return true;
      }
    } catch (_) { /* continue */ }
  }

  console.log('⚠️ RPC helper not available. Please run this SQL manually:');
  console.log(`\n--- BEGIN SQL (${file}) ---\n`);
  console.log(sql);
  console.log('\n--- END SQL ---\n');
  console.log('Open Supabase → SQL Editor → paste and run the SQL above.');
  return false;
}

async function verify() {
  const { error } = await supabase.from('presentations_ai').select('id').limit(1);
  if (error) {
    console.error('❌ Verification failed: presentations_ai not accessible.');
    console.error('   Run sql/presentations_ai.sql in Supabase SQL editor.');
    return false;
  }
  console.log('✅ Table presentations_ai verified.');
  return true;
}

async function main() {
  console.log('🚀 Applying Presentations (AI) migration...');
  const ok = await runSQL('presentations_ai.sql');
  if (!ok) process.exit(1);
  await verify();
  console.log('\n💾 Next: generation will auto-create the storage bucket `presentations` on first save.');
}

main().catch((e) => { console.error('❌ Fatal:', e.message); process.exit(1); });


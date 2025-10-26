#!/usr/bin/env node

/**
 * Apply introduction video migration to add introduction_video_url field
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🚀 Starting introduction video migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase/migrations/20251025_add_introduction_video_to_masterclass.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Applying migration...');
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // Try direct query if RPC doesn't exist
      const { error: directError } = await supabase.from('masterclass_certificate_config').select('introduction_video_url').limit(1);

      if (directError && directError.code === '42703') {
        // Column doesn't exist, need to add it
        console.log('⚠️  RPC method not available, attempting direct ALTER TABLE...');

        // For this migration, we'll need to run it manually via SQL editor or psql
        console.log('\n📋 Please run the following SQL manually in Supabase SQL Editor:');
        console.log('---');
        console.log(migrationSQL);
        console.log('---\n');
        return;
      } else if (!directError) {
        console.log('✅ Column already exists!');
        return;
      } else {
        throw directError;
      }
    }

    console.log('✅ Migration applied successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();

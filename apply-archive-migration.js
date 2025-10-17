const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load env from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = envVars.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function applyMigration() {
  try {
    console.log('Creating archived_activities table...');

    // Create the table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS archived_activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          activity_type VARCHAR(50) NOT NULL,
          activity_id VARCHAR(255) NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          original_timestamp TIMESTAMPTZ NOT NULL,
          archived_at TIMESTAMPTZ DEFAULT NOW(),
          archived_by UUID REFERENCES auth.users(id),
          UNIQUE(activity_type, activity_id)
        );
      `
    });

    if (createTableError) {
      // Try direct SQL execution
      console.log('Trying alternative approach...');

      const { data, error } = await supabase
        .from('archived_activities')
        .select('id')
        .limit(1);

      if (error && error.code === '42P01') {
        // Table doesn't exist, we need to create it
        console.error('Table needs to be created manually in Supabase dashboard');
        console.log('\nRun this SQL in your Supabase SQL editor:');
        console.log(fs.readFileSync('./supabase/migrations/20251016_create_archived_activities_table.sql', 'utf8'));
        process.exit(1);
      } else if (error) {
        console.error('Error:', error);
        process.exit(1);
      } else {
        console.log('Table already exists!');
      }
    } else {
      console.log('Migration applied successfully!');
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nPlease run this SQL in your Supabase SQL editor:');
    console.log(fs.readFileSync('./supabase/migrations/20251016_create_archived_activities_table.sql', 'utf8'));
  }
}

applyMigration();

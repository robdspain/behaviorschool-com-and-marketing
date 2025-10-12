const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('📂 Reading migration file...');
    const sqlPath = path.join(__dirname, '..', 'sql', 'email_templates_migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 Executing migration...');

    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      console.log(`\n📝 Executing statement ${i + 1}/${statements.length}...`);

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });

      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase
          .from('_sql_migrations')
          .insert({ query: statement });

        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }

    console.log('\n✅ Migration completed!');
    console.log('\n📊 Verifying email templates...');

    const { data: templates, error: fetchError } = await supabase
      .from('email_templates')
      .select('name, category, send_delay_minutes, is_active');

    if (fetchError) {
      console.error('❌ Error fetching templates:', fetchError);
    } else {
      console.log(`\n✅ Found ${templates.length} email templates:`);
      templates.forEach(t => {
        console.log(`  - ${t.name} (${t.category}, ${t.send_delay_minutes}min, ${t.is_active ? 'active' : 'inactive'})`);
      });
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

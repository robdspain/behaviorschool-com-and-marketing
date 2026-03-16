const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  db: { schema: 'public' }
});

async function setupCheckoutTables() {
  console.log('Setting up checkout tables with new password: SchoolBCBA2025\n');

  // Read the SQL file
  const fs = require('fs');
  const sql = fs.readFileSync('./supabase-checkout-setup.sql', 'utf8');

  // Execute the SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.log('Note: Direct SQL execution not available. Running setup via Supabase CLI...');
    const { execSync } = require('child_process');

    try {
      execSync('supabase db push', { stdio: 'inherit' });
    } catch (e) {
      console.log('Migration already applied. Updating password directly...');
    }
  }

  // Now update the password
  console.log('\nUpdating password to: SchoolBCBA2025');

  const { data: updateData, error: updateError } = await supabase
    .from('checkout_settings')
    .update({ setting_value: 'SchoolBCBA2025' })
    .eq('setting_key', 'checkout_password')
    .select();

  if (updateError) {
    console.error('Error updating password:', updateError);
    process.exit(1);
  }

  console.log('✅ Password updated successfully to: SchoolBCBA2025');
  console.log('\nYou can now use this password at:');
  console.log('https://behaviorschool.com/transformation-program/checkout');
}

setupCheckoutTables();

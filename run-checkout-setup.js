const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function runSetup() {
  const checkoutPassword = process.env.CHECKOUT_PASSWORD;

  if (!checkoutPassword || checkoutPassword.length < 6) {
    console.error('Error: CHECKOUT_PASSWORD environment variable must be set and at least 6 characters');
    process.exit(1);
  }

  console.log('Creating checkout tables and setting password from CHECKOUT_PASSWORD environment variable\n');

  // Read and parse the SQL file line by line
  const sql = fs.readFileSync('./supabase-checkout-setup.sql', 'utf8');

  // Split into individual statements and execute
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      const result = await supabase.rpc('exec', { sql: statement });
      console.log('✓ Executed statement');
    } catch (error) {
      // Ignore errors for already existing objects
      if (!error.message?.includes('already exists')) {
        console.log('Note:', error.message);
      }
    }
  }

  // Now update the password directly
  console.log('\nUpdating checkout password');

  const { data, error } = await supabase
    .from('checkout_settings')
    .upsert({
      setting_key: 'checkout_password',
      setting_value: checkoutPassword,
      description: 'Master password for checkout access'
    }, {
      onConflict: 'setting_key'
    })
    .select();

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('✅ Setup complete! Password updated.');
  console.log('\nCheckout URL: https://behaviorschool.com/transformation-program/checkout');
}

runSetup();

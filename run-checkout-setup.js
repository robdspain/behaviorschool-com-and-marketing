const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://dugolglucuzolzvuqxmi.supabase.co';
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z29sZ2x1Y3V6b2x6dnVxeG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTAxNzM1OCwiZXhwIjoyMDcwNTkzMzU4fQ.qQJMOeKnCXbj6UNFRtUt-3jXTWiyHkvYYIwwbte2l0c';

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function runSetup() {
  console.log('Creating checkout tables and setting password to: SchoolBCBA2025\n');

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
  console.log('\nUpdating password to: SchoolBCBA2025');

  const { data, error } = await supabase
    .from('checkout_settings')
    .upsert({
      setting_key: 'checkout_password',
      setting_value: 'SchoolBCBA2025',
      description: 'Master password for checkout access'
    }, {
      onConflict: 'setting_key'
    })
    .select();

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('✅ Setup complete! Password is now: SchoolBCBA2025');
  console.log('\nCheckout URL: https://behaviorschool.com/transformation-program/checkout');
}

runSetup();

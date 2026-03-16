const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function updateCheckoutPassword() {
  console.log('Updating checkout password to: SchoolBCBA2025');

  const { data, error } = await supabase
    .from('checkout_settings')
    .update({ setting_value: 'SchoolBCBA2025' })
    .eq('setting_key', 'checkout_password')
    .select();

  if (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }

  console.log('✅ Password updated successfully!');
  console.log('Data:', data);
}

updateCheckoutPassword();

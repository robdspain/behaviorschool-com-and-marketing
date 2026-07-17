const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function updateCheckoutPassword() {
  const checkoutPassword = process.env.CHECKOUT_PASSWORD;

  if (!checkoutPassword || checkoutPassword.length < 6) {
    console.error('Error: CHECKOUT_PASSWORD environment variable must be set and at least 6 characters');
    process.exit(1);
  }

  console.log('Updating checkout password from CHECKOUT_PASSWORD environment variable');

  const { data, error } = await supabase
    .from('checkout_settings')
    .update({ setting_value: checkoutPassword })
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

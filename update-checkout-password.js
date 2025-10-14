const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dugolglucuzolzvuqxmi.supabase.co';
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z29sZ2x1Y3V6b2x6dnVxeG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTAxNzM1OCwiZXhwIjoyMDcwNTkzMzU4fQ.qQJMOeKnCXbj6UNFRtUt-3jXTWiyHkvYYIwwbte2l0c';

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

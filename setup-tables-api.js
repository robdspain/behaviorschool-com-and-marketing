const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  console.log('🚀 Setting up checkout tables in Supabase...\n');

  try {
    // Create checkout_settings table
    console.log('1. Creating checkout_settings table...');
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS checkout_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          setting_key TEXT UNIQUE NOT NULL,
          setting_value TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    if (settingsError) console.log('Note:', settingsError.message);
    else console.log('✓ checkout_settings table created\n');

    // Create checkout_access table
    console.log('2. Creating checkout_access table...');
    const { error: accessError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS checkout_access (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          first_name TEXT,
          last_name TEXT,
          approved_by TEXT,
          notes TEXT,
          is_active BOOLEAN DEFAULT true,
          expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    if (accessError) console.log('Note:', accessError.message);
    else console.log('✓ checkout_access table created\n');

    // Create checkout_access_logs table
    console.log('3. Creating checkout_access_logs table...');
    const { error: logsError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS checkout_access_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          access_type TEXT NOT NULL,
          identifier TEXT NOT NULL,
          success BOOLEAN NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          error_message TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    if (logsError) console.log('Note:', logsError.message);
    else console.log('✓ checkout_access_logs table created\n');

    // Insert default password
    console.log('4. Inserting default password...');
    const { error: insertError } = await supabase
      .from('checkout_settings')
      .insert({
        setting_key: 'checkout_password',
        setting_value: 'Transform2025',
        description: 'Master password for checkout access'
      });

    if (insertError && insertError.code !== '23505') { // 23505 is duplicate key error
      console.log('Password insert error:', insertError.message);
    } else {
      console.log('✓ Default password set to: Transform2025\n');
    }

    console.log('✅ Setup complete!\n');
    console.log('Next steps:');
    console.log('1. Visit https://behaviorschool.com/admin/checkout-access');
    console.log('2. Manage checkout passwords and approved users');
    console.log('3. View access logs\n');

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n⚠️  The Supabase JS client cannot execute raw SQL.');
    console.log('Please use one of these methods instead:\n');
    console.log('Method 1: Supabase Dashboard (RECOMMENDED)');
    console.log('  1. Go to https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/editor');
    console.log('  2. Copy contents of supabase-checkout-setup.sql');
    console.log('  3. Paste in SQL Editor and run\n');
    console.log('Method 2: Use the generated migration files in supabase/migrations/\n');
  }
}

setupTables();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SERVICE_ROLE must be set in the environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumns() {
  console.log('🔧 Adding missing columns to email_templates table...\n');

  // First, let's check what columns currently exist
  const { data: existingData, error: selectError } = await supabase
    .from('email_templates')
    .select('*')
    .limit(1);

  if (selectError) {
    console.error('❌ Error checking existing columns:', selectError);
  } else {
    console.log('📋 Current columns:', Object.keys(existingData[0] || {}));
  }

  console.log('\n⚠️  The Supabase JavaScript client cannot execute ALTER TABLE statements.');
  console.log('📝 You need to run the SQL manually in your Supabase dashboard.\n');
  console.log('🔗 Open your Supabase SQL editor for this project.\n');
  console.log('📋 Copy and paste this SQL:\n');
  console.log('=' .repeat(80));
  console.log(`
-- Add missing columns to email_templates table
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'signup';
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS send_delay_minutes INTEGER DEFAULT 0;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS description TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'email_templates'
ORDER BY ordinal_position;
`);
  console.log('=' .repeat(80));
  console.log('\n✅ After running the SQL above, run this command again:');
  console.log('   node scripts/migrate-email-templates.mjs\n');
}

addColumns().catch(console.error);

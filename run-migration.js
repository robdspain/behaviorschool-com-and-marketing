#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n📋 MIGRATION INSTRUCTIONS\n');
console.log('Please run this SQL manually in Supabase Dashboard:\n');
console.log('1. Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/sql/new');
console.log('2. Copy and paste the SQL below');
console.log('3. Click "Run"\n');
console.log('─'.repeat(80));

const sql = fs.readFileSync('supabase/migrations/20251019_create_certificates_issued_table.sql', 'utf8');
console.log(sql);

console.log('─'.repeat(80));
console.log('\n✅ After running the SQL, the certificates_issued table will be ready!\n');

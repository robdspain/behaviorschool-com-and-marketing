#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🗄️  DATABASE MIGRATION RUNNER\n');
console.log('This script will show you all SQL migrations that need to be applied.\n');
console.log('═'.repeat(80));

const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`\nFound ${files.length} migration files:\n`);
files.forEach((file, index) => {
  console.log(`${index + 1}. ${file}`);
});

console.log('\n' + '═'.repeat(80));
console.log('\n📝 INSTRUCTIONS:\n');
console.log('1. Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/sql/new');
console.log('2. Copy ALL the SQL below (it contains all migrations)');
console.log('3. Paste it into the SQL Editor');
console.log('4. Click "Run" to execute all migrations at once\n');
console.log('─'.repeat(80));
console.log('\n-- START OF COMBINED MIGRATION SQL --\n');
console.log('─'.repeat(80));

// Combine all migrations
files.forEach(file => {
  console.log(`\n-- Migration: ${file}`);
  console.log(`-- Date: ${file.split('_')[0]}\n`);
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  console.log(sql);
  console.log('\n' + '─'.repeat(80));
});

console.log('\n-- END OF COMBINED MIGRATION SQL --\n');
console.log('─'.repeat(80));
console.log('\n✅ After running the SQL, all database tables will be ready!');
console.log('💡 TIP: The migrations are idempotent (safe to run multiple times)\n');


#!/usr/bin/env node

/**
 * Universal Search Engine Indexing Script
 * 
 * This script submits URLs to all available indexing services.
 * It is a command-line interface for the universal-indexing library.
 */

const { submitToAllIndexes, submitBlogPostUniversal, submitLandingPageUniversal, submitPriorityUrlsUniversal, getIndexingCoverage } = require('../src/lib/universal-indexing.ts');
const { validateIndexNowKey } = require('../src/lib/indexnow.ts');

function showCoverage() {
    const coverage = getIndexingCoverage();
    console.log(`
🌍 Universal Search Engine & AI Indexing Coverage
`);
    coverage.platforms.forEach(platform => {
        console.log(`
${platform.status === 'active' ? '🟢' : (platform.status === 'available' ? '🟡' : '🔴')} ${platform.platform}`);
        console.log(`   └── Coverage: ${platform.coverage}`);
        console.log(`   └── Status: ${platform.description}`);
    });
    console.log(`
📈 Total Coverage: ${coverage.totalCoverage}
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
🌐 Universal Search Engine & AI Indexing Tool

Submits URLs to all available platforms:
• IndexNow (Bing, Yandex)  
• Google Indexing API (when configured)
• AI Bot optimization (ChatGPT, Perplexity, Claude)

Usage:
  node scripts/universal-indexing-submit.js [command] [options]

Commands:
  --priority                    Submit all priority URLs
  --urls <url1> <url2> ...     Submit specific URLs  
  --blog <slug>                Submit blog post universally
  --landing <path>             Submit landing page universally
  --validate                   Validate IndexNow key accessibility
  --coverage                   Show platform coverage report
  --help                       Show this help

Examples:
  node scripts/universal-indexing-submit.js --priority
  node scripts/universal-indexing-submit.js --urls / /bcba-exam-prep
  node scripts/universal-indexing-submit.js --blog "bcba-salary-guide"  
  node scripts/universal-indexing-submit.js --landing "/school-based-bcba"
  node scripts/universal-indexing-submit.js --coverage
    `);
    return;
  }

  const command = args[0];
  
  try {
    switch (command) {
      case '--priority':
        await submitPriorityUrlsUniversal();
        break;
        
      case '--urls':
        const urls = args.slice(1);
        if (urls.length === 0) {
          console.log('❌ No URLs provided. Usage: --urls <url1> <url2> ...');
          return;
        }
        await submitToAllIndexes(urls);
        break;
        
      case '--blog':
        const slug = args[1];
        if (!slug) {
          console.log('❌ No blog slug provided. Usage: --blog <slug>');
          return;
        }
        await submitBlogPostUniversal(slug);
        break;

      case '--landing':
        const path = args[1];
        if (!path) {
            console.log('❌ No landing page path provided. Usage: --landing <path>');
            return;
        }
        await submitLandingPageUniversal(path);
        break;
        
      case '--validate':
        const isValid = await validateIndexNowKey();
        if (isValid) {
            console.log('✅ IndexNow key is valid and accessible');
        } else {
            console.log('❌ IndexNow key validation failed');
        }
        break;

      case '--coverage':
        showCoverage();
        break;
        
      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Use --help for usage information');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

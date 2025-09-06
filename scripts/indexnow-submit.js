#!/usr/bin/env node

/**
 * IndexNow Manual Submission Script
 * 
 * This script allows you to manually submit URLs to IndexNow from the command line.
 * 
 * Usage:
 * node scripts/indexnow-submit.js [options]
 * 
 * Examples:
 * node scripts/indexnow-submit.js --priority          # Submit all priority URLs
 * node scripts/indexnow-submit.js --urls / /blog      # Submit specific URLs
 * node scripts/indexnow-submit.js --validate          # Validate IndexNow key
 * node scripts/indexnow-submit.js --blog new-post     # Submit new blog post
 */

const https = require('https');

const INDEXNOW_KEY = 'a07fc6c7-3148-489c-85e2-5d82ab778569';
const SITE_URL = 'https://behaviorschool.com';
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://bing.com/indexnow',
  'https://yandex.com/indexnow'
];

const PRIORITY_URLS = [
  '/',
  '/bcba-exam-prep',
  '/school-based-bcba', 
  '/iep-goals',
  '/behavior-study-tools',
  '/supervisors',
  '/behavior-plans',
  '/school-based-behavior-support',
  '/transformation-program',
  '/blog',
  '/about',
  '/resources',
  '/community'
];

async function makeRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const postData = JSON.stringify(data);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'BehaviorSchool-IndexNow-CLI/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          endpoint: endpoint,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject({ endpoint, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

async function submitUrls(urls) {
  const absoluteUrls = urls.map(url => 
    url.startsWith('/') ? `${SITE_URL}${url}` : url
  );

  const submission = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: absoluteUrls
  };

  console.log(`\\n🚀 Submitting ${urls.length} URL(s) to IndexNow...`);
  console.log('URLs:', urls.join(', '));

  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    try {
      console.log(`\\n📡 Submitting to ${endpoint}...`);
      const result = await makeRequest(endpoint, submission);
      results.push(result);
      
      if (result.success) {
        console.log(`✅ ${endpoint}: HTTP ${result.status} - Success`);
      } else {
        console.log(`❌ ${endpoint}: HTTP ${result.status} - Failed`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.error || error.message}`);
      results.push({ endpoint, success: false, error: error.error || error.message });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\\n📊 Results: ${successCount}/${ENDPOINTS.length} endpoints succeeded`);
  
  if (successCount > 0) {
    console.log('🎉 URLs successfully submitted to search engines!');
  } else {
    console.log('⚠️  All submissions failed. Check your internet connection and try again.');
  }

  return results;
}

async function validateKey() {
  return new Promise((resolve, reject) => {
    const keyUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
    
    console.log(`\\n🔍 Validating IndexNow key at: ${keyUrl}`);
    
    https.get(keyUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const isValid = res.statusCode === 200 && data.trim() === INDEXNOW_KEY;
        if (isValid) {
          console.log('✅ IndexNow key is valid and accessible');
        } else {
          console.log('❌ IndexNow key validation failed');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Content: "${data.trim()}"`);
          console.log(`   Expected: "${INDEXNOW_KEY}"`);
        }
        resolve(isValid);
      });
    }).on('error', (error) => {
      console.log('❌ Key validation failed:', error.message);
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📋 IndexNow Submission Tool for Behavior School

Usage:
  node scripts/indexnow-submit.js [command] [options]

Commands:
  --priority                    Submit all priority URLs
  --urls <url1> <url2> ...     Submit specific URLs
  --blog <slug>                Submit blog post and blog index
  --validate                   Validate IndexNow key accessibility
  --help                       Show this help

Examples:
  node scripts/indexnow-submit.js --priority
  node scripts/indexnow-submit.js --urls / /bcba-exam-prep /iep-goals
  node scripts/indexnow-submit.js --blog "bcba-salary-guide"
  node scripts/indexnow-submit.js --validate
    `);
    return;
  }

  const command = args[0];
  
  try {
    switch (command) {
      case '--priority':
        await submitUrls(PRIORITY_URLS);
        break;
        
      case '--urls':
        const urls = args.slice(1);
        if (urls.length === 0) {
          console.log('❌ No URLs provided. Usage: --urls <url1> <url2> ...');
          return;
        }
        await submitUrls(urls);
        break;
        
      case '--blog':
        const slug = args[1];
        if (!slug) {
          console.log('❌ No blog slug provided. Usage: --blog <slug>');
          return;
        }
        await submitUrls([`/blog/${slug}`, '/blog']);
        break;
        
      case '--validate':
        await validateKey();
        break;
        
      case '--help':
        console.log('Help information shown above');
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

module.exports = { submitUrls, validateKey };
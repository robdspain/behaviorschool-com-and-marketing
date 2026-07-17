#!/usr/bin/env node

/**
 * IndexNow CLI Tool
 * 
 * Submit URLs to search engines for immediate indexing
 * 
 * Usage:
 *   node scripts/indexnow-submit.js --priority
 *   node scripts/indexnow-submit.js --urls / /bcba-exam-prep /blog
 *   node scripts/indexnow-submit.js --blog "post-slug"
 *   node scripts/indexnow-submit.js --validate
 */

const https = require('https');

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL = 'https://behaviorschool.com';

if (!INDEXNOW_KEY) {
  console.error('INDEXNOW_KEY must be set in the environment.');
  process.exit(1);
}

// Priority URLs to submit
const PRIORITY_URLS = [
  '/',
  '/bcba-exam-prep',
  '/school-based-bcba',
  '/iep-behavior-goals',
  '/iep-goals',
  '/behavior-study-tools',
  '/supervisors',
  '/behavior-plans',
  '/school-based-behavior-support',
  '/transformation-program',
  '/community',
  '/blog',
  '/about',
  '/resources'
];

// Blog post URLs (recently optimized)
const BLOG_URLS = [
  '/blog/behavior-school-launches-ai-powered-bcba-exam-prep-platform',
  '/blog/free-bcba-practice-test-ai-powered-exam-prep',
  '/blog/three-level-classification-bcba-exam-prep',
  '/blog/the-act-matrix-a-framework-for-school-based-bcbas',
  '/blog/from-teaching-machines-to-smart-learning-the-science-behind-adaptive-education-2',
  '/blog/the-role-of-language-in-connection',
  '/blog/how-functional-language-progresses-a-guide-to-stage-specific-interventions',
  '/blog/coming-soon'
];

// IndexNow endpoints
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://bing.com/indexnow',
  'https://yandex.com/indexnow'
];

async function makeRequest(url, data, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'POST',
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'BehaviorSchool-IndexNow/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          endpoint: url,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject({
        endpoint: url,
        status: 0,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        endpoint: url,
        status: 0,
        success: false,
        error: 'Request timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

async function submitToIndexNow(urls) {
  const urlList = Array.isArray(urls) ? urls : [urls];
  const absoluteUrls = urlList.map(url => 
    url.startsWith('/') ? `${SITE_URL}${url}` : url
  );

  const submission = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: absoluteUrls
  };

  console.log(`\n📡 Submitting ${absoluteUrls.length} URL(s) to IndexNow...\n`);
  
  const results = [];
  
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const result = await makeRequest(endpoint, submission);
      results.push(result);
      
      const hostname = new URL(endpoint).hostname;
      if (result.success) {
        console.log(`   ✅ ${hostname.padEnd(25)} HTTP ${result.status}`);
      } else {
        console.log(`   ❌ ${hostname.padEnd(25)} HTTP ${result.status}`);
      }
    } catch (error) {
      const hostname = new URL(endpoint).hostname;
      console.log(`   ❌ ${hostname.padEnd(25)} ${error.error || error.message}`);
      results.push({
        endpoint,
        status: 0,
        success: false,
        error: error.error || error.message
      });
    }
  }

  const successfulResults = results.filter(r => r.success);
  
  console.log(`\n   📊 Success Rate: ${successfulResults.length}/${INDEXNOW_ENDPOINTS.length} endpoints`);
  
  return {
    success: successfulResults.length > 0,
    results: results,
    submittedUrls: successfulResults.length > 0 ? urlList : []
  };
}

async function validateIndexNowKey() {
  return new Promise((resolve, reject) => {
    const keyUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
    
    console.log(`\n🔍 Validating IndexNow key at: ${keyUrl}\n`);
    
    https.get(keyUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const isValid = res.statusCode === 200 && data.trim() === INDEXNOW_KEY;
        if (isValid) {
          console.log('   ✅ IndexNow key is valid and accessible');
        } else {
          console.log('   ❌ IndexNow key validation failed');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Content: "${data.trim()}"`);
          console.log(`   Expected: "${INDEXNOW_KEY}"`);
        }
        resolve(isValid);
      });
    }).on('error', (error) => {
      console.log('   ❌ Key validation failed:', error.message);
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  console.log('🚀 IndexNow Submission Tool\n');
  console.log('═'.repeat(60));
  
  // Parse arguments
  let urls = [];
  let mode = 'help';
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--priority') {
      mode = 'priority';
      urls = [...PRIORITY_URLS, ...BLOG_URLS];
    } else if (arg === '--blog') {
      mode = 'blog';
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        const slug = args[i + 1];
        urls = [`/blog/${slug}`, '/blog'];
        i++;
      } else {
        urls = BLOG_URLS;
      }
    } else if (arg === '--urls') {
      mode = 'custom';
      // Collect URLs until next flag or end
      for (let j = i + 1; j < args.length && !args[j].startsWith('--'); j++) {
        urls.push(args[j]);
        i = j;
      }
    } else if (arg === '--validate') {
      mode = 'validate';
    } else if (arg === '--help' || arg === '-h') {
      mode = 'help';
    }
  }
  
  // Execute based on mode
  if (mode === 'validate') {
    try {
      await validateIndexNowKey();
      console.log('\n✅ Validation complete!\n');
    } catch (error) {
      console.error('\n❌ Validation failed:', error.message, '\n');
      process.exit(1);
    }
  } else if (mode === 'help') {
    console.log(`
Usage:
  node scripts/indexnow-submit.js --priority
    Submit all priority URLs (pillar pages + blog posts)
    
  node scripts/indexnow-submit.js --blog
    Submit all blog post URLs
    
  node scripts/indexnow-submit.js --blog "post-slug"
    Submit specific blog post and blog index
    
  node scripts/indexnow-submit.js --urls / /about /blog
    Submit custom list of URLs
    
  node scripts/indexnow-submit.js --validate
    Validate IndexNow key accessibility

Examples:
  # Notify search engines about all important pages
  node scripts/indexnow-submit.js --priority
  
  # Notify about newly optimized blog posts
  node scripts/indexnow-submit.js --blog
  
  # Notify about specific blog post
  node scripts/indexnow-submit.js --blog "bcba-exam-prep-guide"
  
  # Notify about specific pages
  node scripts/indexnow-submit.js --urls / /bcba-exam-prep /iep-goals

Search Engines Notified:
  - Bing (api.indexnow.org)
  - Microsoft Search
  - Yandex
  - Other IndexNow partners

Note: Google does not support IndexNow. For Google, use Search Console.
`);
  } else if (urls.length > 0) {
    try {
      const result = await submitToIndexNow(urls);
      
      if (result.success) {
        console.log('\n✅ IndexNow submission successful!\n');
        console.log('URLs submitted:');
        result.submittedUrls.forEach(url => {
          console.log(`   - ${url}`);
        });
        console.log('\nSearch engines will be notified within minutes.');
        console.log('Check Bing Webmaster Tools for indexing status.\n');
      } else {
        console.log('\n❌ All submissions failed. Please check:\n');
        console.log('   1. Internet connection');
        console.log('   2. IndexNow key is accessible');
        console.log('   3. Try validating with: --validate\n');
        process.exit(1);
      }
    } catch (error) {
      console.error('\n❌ Submission error:', error.message, '\n');
      process.exit(1);
    }
  } else {
    console.log('\n❌ No URLs specified. Use --help for usage information.\n');
    process.exit(1);
  }
}

main();

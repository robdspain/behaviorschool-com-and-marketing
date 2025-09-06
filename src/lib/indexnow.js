/**
 * IndexNow API Integration for Behavior School
 * 
 * This utility handles direct notifications to search engines when content changes.
 * Supports Bing, Yandex, and other IndexNow-compatible search engines.
 */

const https = require('https');

const INDEXNOW_KEY = 'a07fc6c7-3148-489c-85e2-5d82ab778569';
const SITE_URL = 'https://behaviorschool.com';

// IndexNow endpoints for different search engines
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',  // Primary endpoint
  'https://bing.com/indexnow',          // Bing direct
  'https://yandex.com/indexnow',        // Yandex direct
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
          data: responseData,
          error: res.statusCode >= 400 ? `HTTP ${res.statusCode}: ${res.statusMessage}` : undefined
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

/**
 * Submit URLs to IndexNow for immediate search engine notification
 */
async function submitToIndexNow(urls, options = {}) {
  const { timeout = 10000 } = options;
  
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

  console.log(`📡 IndexNow submission for ${absoluteUrls.length} URL(s)...`);
  
  const results = [];
  
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const result = await makeRequest(endpoint, submission, timeout);
      results.push(result);
      
      const hostname = new URL(endpoint).hostname;
      if (result.success) {
        console.log(`   ✅ ${hostname}: HTTP ${result.status}`);
      } else {
        console.log(`   ❌ ${hostname}: ${result.error || `HTTP ${result.status}`}`);
      }
    } catch (error) {
      const hostname = new URL(endpoint).hostname;
      console.log(`   ❌ ${hostname}: ${error.error || error.message}`);
      results.push({
        endpoint,
        status: 0,
        success: false,
        error: error.error || error.message
      });
    }
  }

  const successfulResults = results.filter(r => r.success);
  const timestamp = new Date().toISOString();
  
  console.log(`   📊 IndexNow: ${successfulResults.length}/${INDEXNOW_ENDPOINTS.length} endpoints succeeded`);
  
  return {
    success: successfulResults.length > 0,
    results: results,
    submittedUrls: successfulResults.length > 0 ? urlList : [],
    timestamp: timestamp
  };
}

/**
 * Validate IndexNow key accessibility
 */
async function validateIndexNowKey() {
  return new Promise((resolve, reject) => {
    const keyUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
    
    console.log(`🔍 Validating IndexNow key at: ${keyUrl}`);
    
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

/**
 * Specialized blog post submission
 */
async function submitBlogPost(slug, options = {}) {
  const urls = [
    `/blog/${slug}`,
    '/blog'  // Blog index page
  ];
  
  console.log(`📝 Blog post IndexNow submission: ${slug}`);
  return submitToIndexNow(urls, options);
}

module.exports = {
  submitToIndexNow,
  validateIndexNowKey,
  submitBlogPost,
  INDEXNOW_KEY,
  SITE_URL,
  INDEXNOW_ENDPOINTS
};
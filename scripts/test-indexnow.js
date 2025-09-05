#!/usr/bin/env node

/**
 * Test script for IndexNow API
 * Usage: node scripts/test-indexnow.js
 */

const INDEXNOW_API_KEY = 'D6F638D35C42D071C62B47907C2CD0CC';
const BASE_URL = 'https://behaviorschool.com';

async function testIndexNow() {
  console.log('🚀 Testing IndexNow API...\n');

  // Test URLs
  const testUrls = [
    '/',
    '/iep-goals',
    '/transformation-program',
    '/behavior-study-tools'
  ];

  const payload = {
    host: 'behaviorschool.com',
    key: INDEXNOW_API_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_API_KEY}.txt`,
    urlList: testUrls.map(url => `${BASE_URL}${url}`)
  };

  console.log('📋 Payload:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('\n');

  // Test endpoints
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    console.log(`🔗 Testing endpoint: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Success: ${response.ok ? '✅' : '❌'}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
    
    console.log('');
  }

  // Test key file accessibility
  console.log('🔑 Testing key file accessibility...');
  try {
    const keyUrl = `${BASE_URL}/${INDEXNOW_API_KEY}.txt`;
    const response = await fetch(keyUrl);
    console.log(`   Key file URL: ${keyUrl}`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Accessible: ${response.ok ? '✅' : '❌'}`);
    
    if (response.ok) {
      const keyContent = await response.text();
      console.log(`   Content: ${keyContent.trim()}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n✨ Test completed!');
}

// Run the test
testIndexNow().catch(console.error);


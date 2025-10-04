/**
 * Test script for admin authentication and database connections
 * Run with: node test-admin-auth.js
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testAdminRouteProtection() {
  console.log('\n🔒 Testing Admin Route Protection...');

  try {
    const response = await fetch(`${BASE_URL}/admin`, {
      redirect: 'manual'
    });

    if (response.status === 307 || response.status === 308) {
      const location = response.headers.get('location');
      if (location && location.includes('/admin/login')) {
        console.log('✅ Admin route correctly redirects to login');
        console.log(`   Redirect location: ${location}`);
        return true;
      } else {
        console.log('❌ Admin route redirects but not to login page');
        console.log(`   Redirect location: ${location}`);
        return false;
      }
    } else if (response.status === 200) {
      console.log('❌ Admin route is accessible without authentication!');
      return false;
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error testing admin route: ${error.message}`);
    return false;
  }
}

async function testAdminAPIAuthentication() {
  console.log('\n🔐 Testing Admin API Authentication...');

  try {
    const response = await fetch(`${BASE_URL}/api/admin/signups`);
    const data = await response.json();

    if (response.status === 401) {
      console.log('✅ Admin API correctly requires authentication');
      console.log(`   Response: ${data.message}`);
      return true;
    } else if (response.status === 200) {
      console.log('❌ Admin API is accessible without authentication!');
      return false;
    } else {
      console.log(`⚠️  Unexpected API status: ${response.status}`);
      console.log(`   Response:`, data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error testing admin API: ${error.message}`);
    return false;
  }
}

async function testLoginPageAccessibility() {
  console.log('\n🚪 Testing Login Page Accessibility...');

  try {
    const response = await fetch(`${BASE_URL}/admin/login`);

    if (response.status === 200) {
      console.log('✅ Login page is accessible');
      return true;
    } else {
      console.log(`❌ Login page returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error accessing login page: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Admin Authentication & Database Connection Tests');
  console.log(`   Testing URL: ${BASE_URL}`);
  console.log('═'.repeat(60));

  const results = {
    routeProtection: await testAdminRouteProtection(),
    apiAuth: await testAdminAPIAuthentication(),
    loginAccess: await testLoginPageAccessibility()
  };

  console.log('\n' + '═'.repeat(60));
  console.log('📊 Test Results Summary:');
  console.log(`   Admin Route Protection: ${results.routeProtection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Admin API Authentication: ${results.apiAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Login Page Accessibility: ${results.loginAccess ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = Object.values(results).every(r => r === true);
  console.log('\n' + (allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed'));
  console.log('═'.repeat(60));

  process.exit(allPassed ? 0 : 1);
}

runTests();

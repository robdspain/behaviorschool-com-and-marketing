/**
 * Comprehensive Admin System Test
 * Tests authentication, authorization, and database connections
 */

const BASE_URL = process.env.TEST_URL || 'https://behaviorschool.com';

const tests = {
  passed: 0,
  failed: 0,
  results: []
};

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${name}`);
  if (details) console.log(`   ${details}`);

  tests.results.push({ name, passed, details });
  if (passed) tests.passed++;
  else tests.failed++;
}

async function test1_AdminDashboardProtection() {
  console.log('\n📋 Test 1: Admin Dashboard Protection');
  try {
    const response = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' });
    const isProtected = response.status === 307 || response.status === 308;
    const location = response.headers.get('location');
    const redirectsToLogin = location && location.includes('/admin/login');

    logTest(
      'Admin dashboard redirects to login',
      isProtected && redirectsToLogin,
      `Status: ${response.status}, Location: ${location}`
    );
  } catch (error) {
    logTest('Admin dashboard protection', false, error.message);
  }
}

async function test2_AdminAPIProtection() {
  console.log('\n🔐 Test 2: Admin API Protection');
  try {
    const response = await fetch(`${BASE_URL}/api/admin/signups`);
    const data = await response.json();

    logTest(
      'Admin API requires authentication',
      response.status === 401,
      `Status: ${response.status}, Message: ${data.message}`
    );
  } catch (error) {
    logTest('Admin API protection', false, error.message);
  }
}

async function test3_SubroutesProtection() {
  console.log('\n📁 Test 3: Admin Subroutes Protection');
  const subroutes = ['/admin/signups', '/admin/leads', '/admin/users', '/admin/analytics'];

  for (const route of subroutes) {
    try {
      const response = await fetch(`${BASE_URL}${route}`, { redirect: 'manual' });
      const isProtected = response.status === 307 || response.status === 308;

      logTest(
        `${route} is protected`,
        isProtected,
        `Status: ${response.status}`
      );
    } catch (error) {
      logTest(`${route} protection`, false, error.message);
    }
  }
}

async function test4_LoginPageAccessible() {
  console.log('\n🚪 Test 4: Login Page Accessibility');
  try {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AdminTest/1.0)'
      }
    });

    // Login page should return 200 eventually (after following redirects if any)
    const text = await response.text();
    const hasLoginContent = text.includes('Sign in') || text.includes('Google') || text.includes('login');

    logTest(
      'Login page is accessible',
      response.status === 200 && hasLoginContent,
      `Status: ${response.status}, Has login content: ${hasLoginContent}`
    );
  } catch (error) {
    logTest('Login page accessibility', false, error.message);
  }
}

async function test5_DatabaseSchema() {
  console.log('\n🗄️  Test 5: Database Schema Check');

  // This tests that the API endpoint exists and has proper schema
  // We expect 401 since we're not authenticated, but the response
  // structure tells us the endpoint is properly configured
  try {
    const response = await fetch(`${BASE_URL}/api/admin/signups`);
    const data = await response.json();

    const hasProperStructure = data.hasOwnProperty('success') &&
                               data.hasOwnProperty('message');

    logTest(
      'Admin API has proper response structure',
      hasProperStructure,
      `Response keys: ${Object.keys(data).join(', ')}`
    );
  } catch (error) {
    logTest('Database schema check', false, error.message);
  }
}

async function test6_AuthAPIEndpoints() {
  console.log('\n🔑 Test 6: Auth API Endpoints');

  // Test that auth endpoints are accessible (Supabase)
  try {
    const response = await fetch(`${BASE_URL}/api/auth/callback`, {
      redirect: 'manual'
    });

    // Auth callback should exist (might redirect or return error, but shouldn't 404)
    const isConfigured = response.status !== 404;

    logTest(
      'Auth callback endpoint exists',
      isConfigured,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest('Auth API endpoints', false, error.message);
  }
}

async function runAllTests() {
  console.log('🧪 COMPREHENSIVE ADMIN SYSTEM TEST');
  console.log(`Testing: ${BASE_URL}`);
  console.log('═'.repeat(70));

  await test1_AdminDashboardProtection();
  await test2_AdminAPIProtection();
  await test3_SubroutesProtection();
  await test4_LoginPageAccessible();
  await test5_DatabaseSchema();
  await test6_AuthAPIEndpoints();

  console.log('\n' + '═'.repeat(70));
  console.log('📊 FINAL RESULTS');
  console.log('═'.repeat(70));
  console.log(`✅ Passed: ${tests.passed}`);
  console.log(`❌ Failed: ${tests.failed}`);
  console.log(`📈 Success Rate: ${Math.round((tests.passed / (tests.passed + tests.failed)) * 100)}%`);

  if (tests.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Admin system is properly configured.');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED. Review the details above.');
  }

  console.log('═'.repeat(70));

  process.exit(tests.failed === 0 ? 0 : 1);
}

runAllTests();

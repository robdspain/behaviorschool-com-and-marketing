#!/usr/bin/env node

/**
 * Post-Build IndexNow Submission Hook
 * 
 * This script runs after successful builds and automatically submits
 * updated URLs to IndexNow. Perfect for CI/CD integration.
 * 
 * Usage:
 * node scripts/post-build-indexnow.js [options]
 * 
 * Environment Variables:
 * INDEXNOW_AUTO_SUBMIT=true     Enable automatic submissions
 * INDEXNOW_SUBMIT_MODE=priority Submit priority URLs (default) or 'all'
 * CI=true                       Detected CI environment
 * NETLIFY=true                  Netlify deployment
 * VERCEL=1                      Vercel deployment
 */

const { submitUrls, validateKey } = require('./indexnow-submit.js');

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

class PostBuildIndexNow {
  constructor() {
    this.isCI = process.env.CI === 'true';
    this.isNetlify = process.env.NETLIFY === 'true';
    this.isVercel = process.env.VERCEL === '1';
    this.autoSubmit = process.env.INDEXNOW_AUTO_SUBMIT === 'true';
    this.submitMode = process.env.INDEXNOW_SUBMIT_MODE || 'priority';
    
    this.log('🚀 Post-Build IndexNow Hook');
    this.log(`   CI Environment: ${this.getCIProvider()}`);
    this.log(`   Auto Submit: ${this.autoSubmit}`);
    this.log(`   Submit Mode: ${this.submitMode}`);
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  getCIProvider() {
    if (this.isNetlify) return 'Netlify';
    if (this.isVercel) return 'Vercel';
    if (this.isCI) return 'Generic CI';
    return 'Local';
  }

  async checkBuildSuccess() {
    // Check if build artifacts exist
    const fs = require('fs');
    const path = require('path');
    
    const buildPaths = [
      '.next/BUILD_ID',        // Next.js build
      'out/index.html',        // Static export
      'dist/index.html',       // Generic build
    ];
    
    for (const buildPath of buildPaths) {
      if (fs.existsSync(path.join(process.cwd(), buildPath))) {
        this.log(`✅ Build success detected: ${buildPath}`);
        return true;
      }
    }
    
    // If no specific build artifacts, assume success in CI
    if (this.isCI) {
      this.log('✅ CI environment - assuming build success');
      return true;
    }
    
    this.log('⚠️  No build artifacts detected');
    return false;
  }

  async getChangedPages() {
    // In a real deployment, you might want to:
    // 1. Compare against previous deployment
    // 2. Check git diff for changed files
    // 3. Analyze build output for updated pages
    
    // For now, we'll submit priority pages on every build
    // This can be enhanced based on your deployment needs
    
    if (this.submitMode === 'all') {
      // In future: return all pages from sitemap
      return PRIORITY_URLS;
    }
    
    return PRIORITY_URLS;
  }

  async submitToIndexNow() {
    try {
      // Validate key first
      this.log('🔍 Validating IndexNow key...');
      const keyValid = await this.validateKey();
      if (!keyValid) {
        throw new Error('IndexNow key validation failed');
      }
      
      // Get URLs to submit
      const urls = await this.getChangedPages();
      this.log(`📡 Submitting ${urls.length} URLs to IndexNow`);
      
      // Submit URLs
      await submitUrls(urls);
      this.log('✅ IndexNow submission completed successfully');
      
      // Log deployment info for tracking
      if (this.isNetlify) {
        this.log(`   Netlify Deploy ID: ${process.env.DEPLOY_ID || 'unknown'}`);
        this.log(`   Deploy URL: ${process.env.DEPLOY_URL || 'unknown'}`);
      }
      
      if (this.isVercel) {
        this.log(`   Vercel URL: ${process.env.VERCEL_URL || 'unknown'}`);
        this.log(`   Vercel Environment: ${process.env.VERCEL_ENV || 'unknown'}`);
      }
      
      return true;
    } catch (error) {
      this.log(`❌ IndexNow submission failed: ${error.message}`);
      return false;
    }
  }

  async validateKey() {
    return new Promise((resolve) => {
      const https = require('https');
      const keyUrl = 'https://behaviorschool.com/a07fc6c7-3148-489c-85e2-5d82ab778569.txt';
      
      https.get(keyUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const isValid = res.statusCode === 200 && data.trim() === 'a07fc6c7-3148-489c-85e2-5d82ab778569';
          resolve(isValid);
        });
      }).on('error', () => resolve(false));
    });
  }

  async run() {
    try {
      // Check if we should run
      if (!this.autoSubmit && !process.argv.includes('--force')) {
        this.log('ℹ️  Auto-submit disabled. Use --force to override or set INDEXNOW_AUTO_SUBMIT=true');
        return;
      }
      
      // Check build success
      const buildSuccess = await this.checkBuildSuccess();
      if (!buildSuccess) {
        this.log('❌ Build not detected - skipping IndexNow submission');
        return;
      }
      
      // Submit to IndexNow
      const success = await this.submitToIndexNow();
      if (!success) {
        process.exit(1);
      }
      
    } catch (error) {
      this.log(`❌ Post-build hook failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Netlify-specific function for deployment hooks
async function netlifyDeploySuccess() {
  console.log('🌐 Netlify deployment success - triggering IndexNow');
  
  const hook = new PostBuildIndexNow();
  await hook.run();
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
🚀 Post-Build IndexNow Submission Hook

Automatically submits URLs to IndexNow after successful builds.

Usage:
  node scripts/post-build-indexnow.js [options]

Options:
  --force           Force submission even if auto-submit is disabled
  --help           Show this help

Environment Variables:
  INDEXNOW_AUTO_SUBMIT=true     Enable automatic submissions
  INDEXNOW_SUBMIT_MODE=priority Submit priority URLs (default) or 'all'

CI/CD Integration:
  Add to package.json:
  "scripts": {
    "postbuild": "node scripts/post-build-indexnow.js"
  }

  Or add to Netlify build settings:
  Build command: npm run build && node scripts/post-build-indexnow.js --force
    `);
    return;
  }
  
  if (args.includes('--netlify-deploy-success')) {
    await netlifyDeploySuccess();
    return;
  }
  
  const hook = new PostBuildIndexNow();
  await hook.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PostBuildIndexNow, netlifyDeploySuccess };
#!/usr/bin/env node

/**
 * IndexNow File System Watcher
 * 
 * This script watches for file changes in your Next.js app and automatically
 * submits URLs to IndexNow when content changes are detected.
 * 
 * Usage:
 * node scripts/indexnow-watcher.js [options]
 * 
 * Options:
 * --watch-src     Watch src/ directory for component changes
 * --watch-content Watch content files (markdown, etc.)
 * --watch-public  Watch public/ directory for asset changes
 * --debounce     Milliseconds to wait before submission (default: 5000)
 * --verbose      Show detailed logging
 */

const fs = require('fs');
const path = require('path');
const { submitUrls } = require('./indexnow-submit.js');

// Configuration
const DEBOUNCE_MS = 5000; // Wait 5 seconds after last change before submitting
const WATCHED_DIRECTORIES = [
  'src/app',           // Next.js app directory - page changes
  'src/components',    // Component changes that might affect content
  'public',           // Static assets
  'content',          // Content files (if you have them)
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
];

// File types that should trigger submissions
const TRIGGER_EXTENSIONS = [
  '.tsx', '.ts', '.jsx', '.js',   // React components and logic
  '.md', '.mdx',                  // Markdown content
  '.json',                        // Data files
  '.xml',                         // Sitemaps
  '.txt',                         // Text files like robots.txt
];

class IndexNowWatcher {
  constructor(options = {}) {
    this.debounceMs = options.debounce || DEBOUNCE_MS;
    this.verbose = options.verbose || false;
    this.watchSrc = options.watchSrc !== false;
    this.watchContent = options.watchContent !== false;
    this.watchPublic = options.watchPublic !== false;
    
    this.pendingSubmission = null;
    this.changedFiles = new Set();
    this.watchers = [];
    
    this.log('🔍 IndexNow File Watcher initialized');
    this.log(`   Debounce: ${this.debounceMs}ms`);
  }

  log(message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }

  verbose_log(message) {
    if (this.verbose) {
      this.log(`   ${message}`);
    }
  }

  shouldTriggerSubmission(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return TRIGGER_EXTENSIONS.includes(ext);
  }

  getAffectedUrls(filePath) {
    const affected = new Set();
    
    // Always include homepage for any change
    affected.add('/');
    
    // Map file paths to likely affected URLs
    if (filePath.includes('src/app/page.') || filePath.includes('layout.')) {
      affected.add('/');
    }
    
    if (filePath.includes('bcba-exam-prep') || filePath.includes('exam')) {
      affected.add('/bcba-exam-prep');
      affected.add('/behavior-study-tools');
    }
    
    if (filePath.includes('iep') || filePath.includes('goal')) {
      affected.add('/iep-goals');
      affected.add('/iep-behavior-goals');
    }
    
    if (filePath.includes('behavior') || filePath.includes('bip')) {
      affected.add('/behavior-plans');
      affected.add('/school-based-behavior-support');
    }
    
    if (filePath.includes('supervisor')) {
      affected.add('/supervisors');
    }
    
    if (filePath.includes('blog') || filePath.includes('ghost')) {
      affected.add('/blog');
    }
    
    if (filePath.includes('transformation') || filePath.includes('program')) {
      affected.add('/transformation-program');
    }
    
    // If we can't determine specific pages, submit priority URLs
    if (affected.size === 1) { // Only homepage
      return PRIORITY_URLS;
    }
    
    return Array.from(affected);
  }

  scheduleSubmission() {
    // Clear existing timeout
    if (this.pendingSubmission) {
      clearTimeout(this.pendingSubmission);
    }

    // Schedule new submission
    this.pendingSubmission = setTimeout(async () => {
      await this.performSubmission();
      this.pendingSubmission = null;
    }, this.debounceMs);
    
    this.log(`⏰ Submission scheduled in ${this.debounceMs / 1000}s`);
  }

  async performSubmission() {
    if (this.changedFiles.size === 0) return;

    const affectedUrls = new Set();
    
    // Determine affected URLs from all changed files
    for (const filePath of this.changedFiles) {
      const urls = this.getAffectedUrls(filePath);
      urls.forEach(url => affectedUrls.add(url));
    }
    
    const urlList = Array.from(affectedUrls);
    this.log(`🚀 Submitting ${urlList.length} URLs due to ${this.changedFiles.size} file changes`);
    
    if (this.verbose) {
      this.log(`   Changed files: ${Array.from(this.changedFiles).join(', ')}`);
      this.log(`   URLs: ${urlList.join(', ')}`);
    }
    
    try {
      await submitUrls(urlList);
      this.log('✅ IndexNow submission completed');
    } catch (error) {
      this.log(`❌ IndexNow submission failed: ${error.message}`);
    }
    
    // Clear the changed files set
    this.changedFiles.clear();
  }

  onFileChange(eventType, filename, watchDir) {
    if (!filename) return;
    
    const filePath = path.join(watchDir, filename);
    
    // Skip if file doesn't exist (deleted files)
    if (!fs.existsSync(filePath)) {
      this.verbose_log(`Skipping deleted file: ${filePath}`);
      return;
    }
    
    // Skip if not a trigger file type
    if (!this.shouldTriggerSubmission(filePath)) {
      this.verbose_log(`Skipping non-trigger file: ${filePath}`);
      return;
    }
    
    // Skip node_modules and .next directories
    if (filePath.includes('node_modules') || filePath.includes('.next')) {
      return;
    }
    
    this.verbose_log(`File ${eventType}: ${filePath}`);
    this.changedFiles.add(filePath);
    this.scheduleSubmission();
  }

  startWatching() {
    const projectRoot = process.cwd();
    
    for (const dir of WATCHED_DIRECTORIES) {
      const fullPath = path.join(projectRoot, dir);
      
      if (!fs.existsSync(fullPath)) {
        this.verbose_log(`Skipping non-existent directory: ${fullPath}`);
        continue;
      }
      
      try {
        const watcher = fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
          this.onFileChange(eventType, filename, fullPath);
        });
        
        this.watchers.push(watcher);
        this.log(`👀 Watching: ${fullPath}`);
      } catch (error) {
        this.log(`❌ Failed to watch ${fullPath}: ${error.message}`);
      }
    }
    
    if (this.watchers.length === 0) {
      this.log('❌ No directories are being watched');
      process.exit(1);
    }
    
    this.log(`🎯 Watching ${this.watchers.length} directories for changes`);
    this.log('✨ IndexNow auto-submission is active!');
  }

  stop() {
    this.log('🛑 Stopping IndexNow watcher...');
    
    if (this.pendingSubmission) {
      clearTimeout(this.pendingSubmission);
    }
    
    this.watchers.forEach(watcher => watcher.close());
    this.watchers = [];
    
    this.log('✅ IndexNow watcher stopped');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
🔍 IndexNow File System Watcher

Automatically submits URLs to IndexNow when file changes are detected.

Usage:
  node scripts/indexnow-watcher.js [options]

Options:
  --debounce <ms>    Wait time after changes (default: 5000ms)
  --verbose          Show detailed logging
  --help            Show this help

Examples:
  node scripts/indexnow-watcher.js
  node scripts/indexnow-watcher.js --verbose --debounce 10000
  
The watcher will run continuously until stopped with Ctrl+C.
    `);
    return;
  }
  
  const options = {
    verbose: args.includes('--verbose'),
    debounce: args.includes('--debounce') ? 
      parseInt(args[args.indexOf('--debounce') + 1]) : DEBOUNCE_MS,
  };
  
  const watcher = new IndexNowWatcher(options);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n');
    watcher.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    watcher.stop();
    process.exit(0);
  });
  
  // Start watching
  watcher.startWatching();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { IndexNowWatcher };
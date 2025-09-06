#!/usr/bin/env node

/**
 * Universal Indexing Scheduled Batch Submissions
 * 
 * This script runs periodic batch submissions to all configured indexing services
 * to ensure all URLs stay fresh in search engine indexes.
 * 
 * Usage:
 * node scripts/universal-indexing-scheduler.js [options]
 * 
 * Schedule with cron:
 * # Daily at 3 AM
 * 0 3 * * * cd /path/to/project && node scripts/universal-indexing-scheduler.js --daily
 * 
 * # Weekly on Sunday at 2 AM  
 * 0 2 * * 0 cd /path/to/project && node scripts/universal-indexing-scheduler.js --weekly
 * 
 * Options:
 * --daily      Run daily maintenance submission
 * --weekly     Run weekly full submission
 * --monthly    Run monthly comprehensive submission
 * --force      Force submission regardless of last run time
 * --dry-run    Show what would be submitted without submitting
 */

const fs = require('fs');
const path = require('path');
const { submitUniversal } = require('./universal-indexing-submit.js');

const SCHEDULE_FILE = '.universal-indexing-schedule.json';

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
  '/community',
  '/sitemap.xml',
  '/feed.xml'
];

// Extended URL list for comprehensive submissions
const EXTENDED_URLS = [
  ...PRIORITY_URLS,
  '/privacy',
  '/terms',
  '/contact',
  '/subscribe',
  '/signup',
  '/products',
  '/act-matrix',
  '/bcba-study-fluency',
  '/bcba-mock-practice-test',
  '/iep-behavior-goals',
  '/study'
];

class UniversalIndexingScheduler {
  constructor() {
    this.scheduleFile = path.join(process.cwd(), SCHEDULE_FILE);
    this.schedule = this.loadSchedule();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  loadSchedule() {
    try {
      if (fs.existsSync(this.scheduleFile)) {
        const data = fs.readFileSync(this.scheduleFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      this.log(`Warning: Could not load schedule file: ${error.message}`);
    }
    
    return {
      lastDaily: null,
      lastWeekly: null,
      lastMonthly: null,
      totalSubmissions: 0,
      lastUrls: []
    };
  }

  saveSchedule() {
    try {
      fs.writeFileSync(this.scheduleFile, JSON.stringify(this.schedule, null, 2));
    } catch (error) {
      this.log(`Warning: Could not save schedule file: ${error.message}`);
    }
  }

  shouldRun(type, force = false) {
    if (force) return true;
    
    const now = new Date();
    const lastRun = this.schedule[`last${type.charAt(0).toUpperCase() + type.slice(1)}`];
    
    if (!lastRun) return true;
    
    const lastRunDate = new Date(lastRun);
    const hoursSinceLastRun = (now - lastRunDate) / (1000 * 60 * 60);
    
    switch (type) {
      case 'daily':
        return hoursSinceLastRun >= 20; // At least 20 hours between daily runs
      case 'weekly':
        return hoursSinceLastRun >= 160; // At least 160 hours (6.6 days)
      case 'monthly':
        return hoursSinceLastRun >= 720; // At least 720 hours (30 days)
      default:
        return false;
    }
  }

  getUrlsForType(type) {
    switch (type) {
      case 'daily':
        // Daily: Submit only priority URLs
        return PRIORITY_URLS;
      case 'weekly':
        // Weekly: Submit extended URL set
        return EXTENDED_URLS;
      case 'monthly':
        // Monthly: Submit all URLs (could be expanded with sitemap parsing)
        return EXTENDED_URLS;
      default:
        return PRIORITY_URLS;
    }
  }

  async runScheduledSubmission(type, options = {}) {
    const { force = false, dryRun = false } = options;
    
    // Check if we should run
    if (!this.shouldRun(type, force)) {
      const lastRun = this.schedule[`last${type.charAt(0).toUpperCase() + type.slice(1)}`];
      this.log(`⏭️  Skipping ${type} submission - last run: ${new Date(lastRun).toLocaleString()}`);
      return;
    }
    
    const urls = this.getUrlsForType(type);
    this.log(`🗓️  Running ${type} universal submission`);
    this.log(`📋 URLs to submit: ${urls.length}`);
    
    if (dryRun) {
      this.log('🧪 DRY RUN - URLs that would be submitted:');
      urls.forEach(url => this.log(`   ${url}`));
      return;
    }
    
    try {
      // Submit URLs
      await submitUniversal(urls);
      
      // Update schedule
      const now = new Date().toISOString();
      this.schedule[`last${type.charAt(0).toUpperCase() + type.slice(1)}`] = now;
      this.schedule.totalSubmissions += urls.length;
      this.schedule.lastUrls = urls;
      this.saveSchedule();
      
      this.log(`✅ ${type} submission completed successfully`);
      this.log(`📊 Total submissions to date: ${this.schedule.totalSubmissions}`);
      
    } catch (error) {
      this.log(`❌ ${type} submission failed: ${error.message}`);
      throw error;
    }
  }

  showStatus() {
    this.log('📅 Universal Indexing Scheduler Status:');
    
    const formatDate = (dateStr) => {
      return dateStr ? new Date(dateStr).toLocaleString() : 'Never';
    };
    
    this.log(`   Last Daily: ${formatDate(this.schedule.lastDaily)}`);
    this.log(`   Last Weekly: ${formatDate(this.schedule.lastWeekly)}`);
    this.log(`   Last Monthly: ${formatDate(this.schedule.lastMonthly)}`);
    this.log(`   Total Submissions: ${this.schedule.totalSubmissions}`);
    
    // Show next run times
    const now = new Date();
    
    if (this.schedule.lastDaily) {
      const nextDaily = new Date(this.schedule.lastDaily);
      nextDaily.setHours(nextDaily.getHours() + 20);
      this.log(`   Next Daily: ${nextDaily > now ? nextDaily.toLocaleString() : 'Now'}`);
    } else {
      this.log('   Next Daily: Now');
    }
    
    if (this.schedule.lastWeekly) {
      const nextWeekly = new Date(this.schedule.lastWeekly);
      nextWeekly.setHours(nextWeekly.getHours() + 160);
      this.log(`   Next Weekly: ${nextWeekly > now ? nextWeekly.toLocaleString() : 'Now'}`);
    } else {
      this.log('   Next Weekly: Now');
    }
  }

  // Smart submission that runs appropriate type based on timing
  async runSmart(options = {}) {
    this.log('🧠 Smart scheduler - determining best submission type');
    
    if (this.shouldRun('monthly', options.force)) {
      await this.runScheduledSubmission('monthly', options);
    } else if (this.shouldRun('weekly', options.force)) {
      await this.runScheduledSubmission('weekly', options);
    } else if (this.shouldRun('daily', options.force)) {
      await this.runScheduledSubmission('daily', options);
    } else {
      this.log('⏭️  No scheduled submission needed at this time');
      this.showStatus();
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
🗓️  Universal Indexing Scheduled Batch Submissions

Runs periodic batch submissions to keep URLs fresh in search engines.

Usage:
  node scripts/universal-indexing-scheduler.js [command] [options]

Commands:
  --daily      Run daily maintenance submission (priority URLs only)
  --weekly     Run weekly submission (extended URL set)
  --monthly    Run monthly comprehensive submission (all URLs)
  --smart      Automatically choose the best submission type
  --status     Show scheduler status and next run times
  --help       Show this help

Options:
  --force      Force submission regardless of last run time
  --dry-run    Show what would be submitted without submitting

Examples:
  node scripts/universal-indexing-scheduler.js --smart
  node scripts/universal-indexing-scheduler.js --weekly --force
  node scripts/universal-indexing-scheduler.js --daily --dry-run

Cron Examples:
  # Daily at 3 AM
  0 3 * * * cd /path/to/project && node scripts/universal-indexing-scheduler.js --daily

  # Smart scheduling every 6 hours
  0 */6 * * * cd /path/to/project && node scripts/universal-indexing-scheduler.js --smart
    `);
    return;
  }
  
  const scheduler = new UniversalIndexingScheduler();
  const options = {
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run')
  };
  
  try {
    if (args.includes('--status')) {
      scheduler.showStatus();
    } else if (args.includes('--daily')) {
      await scheduler.runScheduledSubmission('daily', options);
    } else if (args.includes('--weekly')) {
      await scheduler.runScheduledSubmission('weekly', options);
    } else if (args.includes('--monthly')) {
      await scheduler.runScheduledSubmission('monthly', options);
    } else if (args.includes('--smart') || args.length === 0) {
      await scheduler.runSmart(options);
    } else {
      console.log('Unknown command. Use --help for usage information.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Scheduler error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { UniversalIndexingScheduler };
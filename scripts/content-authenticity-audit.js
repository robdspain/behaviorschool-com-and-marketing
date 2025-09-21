#!/usr/bin/env node

/**
 * Content Authenticity Audit Script
 *
 * Scans all three sites for potentially fake stats, quotes, sources, and testimonials
 * Run this script monthly or before major content updates
 *
 * Usage: node scripts/content-authenticity-audit.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITES = {
  robspain: '/Users/robspain/Desktop/robspain.com',
  behaviorschool: '/Users/robspain/Desktop/marketing suite',
};

// Patterns to flag for manual review
const RISK_PATTERNS = {
  HIGH_RISK: [
    // Specific percentages without attribution
    /(\d+)%\s+(pass\s+rate|success\s+rate|improvement|effective)/gi,
    // User count claims
    /(\d+,?\d*)\+?\s+(users?|students?|clients?|members?)/gi,
    // Testimonials with names
    /"[^"]*"\s*-\s*[A-Z][a-z]+\s+[A-Z]/g,
    // Revenue/business metrics
    /\$[\d,]+|\d+\s*million|\d+\s*billion/gi,
    // Fake citations
    /according\s+to\s+[^,]+(study|research)/gi,
  ],
  MEDIUM_RISK: [
    // Vague research claims
    /research\s+(shows|indicates|proves|demonstrates)/gi,
    // Effectiveness claims
    /(proven|guaranteed|certified)\s+(results|success|effectiveness)/gi,
    // Time-based claims
    /in\s+just\s+\d+\s+(days?|weeks?|months?)/gi,
    // Awards without specifics
    /(award|winner|ranked|top\s+\d+)/gi,
  ],
  LOW_RISK: [
    // General improvement language
    /(improve|enhance|increase|boost)/gi,
    // Professional credentials (should be verified)
    /(BCBA|IBA|certified|licensed)/gi,
    // Experience claims
    /(\d+)\+?\s*years?\s+(experience|practice)/gi,
  ]
};

// Files to exclude from scanning
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /dist/,
  /build/,
  /\.json$/,
  /\.log$/,
  /\.md$/,
  /package-lock\.json/,
];

// Results storage
let auditResults = {
  timestamp: new Date().toISOString(),
  sites: {},
  summary: {
    totalFiles: 0,
    flaggedFiles: 0,
    highRiskItems: 0,
    mediumRiskItems: 0,
    lowRiskItems: 0,
  }
};

/**
 * Recursively scan directory for files
 */
function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
        scanDirectory(filePath, fileList);
      }
    } else {
      // Include relevant file types
      if (/\.(html|tsx?|jsx?|md)$/i.test(file) &&
          !EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Scan file content for risk patterns
 */
function scanFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {
      filePath,
      fileName: path.basename(filePath),
      issues: []
    };

    // Check each risk level
    Object.entries(RISK_PATTERNS).forEach(([riskLevel, patterns]) => {
      patterns.forEach((pattern, index) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Get line number
            const lines = content.substring(0, content.indexOf(match)).split('\n');
            const lineNumber = lines.length;

            results.issues.push({
              riskLevel,
              patternIndex: index,
              match: match.trim(),
              lineNumber,
              context: getContext(content, match, lineNumber)
            });

            // Update summary
            auditResults.summary[`${riskLevel.toLowerCase()}RiskItems`]++;
          });
        }
      });
    });

    return results.issues.length > 0 ? results : null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Get context around a match
 */
function getContext(content, match, lineNumber) {
  const lines = content.split('\n');
  const contextStart = Math.max(0, lineNumber - 3);
  const contextEnd = Math.min(lines.length, lineNumber + 2);
  return lines.slice(contextStart, contextEnd).join('\n');
}

/**
 * Generate human-readable report
 */
function generateReport() {
  const reportPath = path.join(__dirname, `../audit-reports/content-authenticity-${Date.now()}.md`);

  // Ensure report directory exists
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  let report = `# Content Authenticity Audit Report\n\n`;
  report += `**Generated:** ${auditResults.timestamp}\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `- **Total Files Scanned:** ${auditResults.summary.totalFiles}\n`;
  report += `- **Files with Flagged Content:** ${auditResults.summary.flaggedFiles}\n`;
  report += `- **High Risk Items:** ${auditResults.summary.highRiskItems}\n`;
  report += `- **Medium Risk Items:** ${auditResults.summary.mediumRiskItems}\n`;
  report += `- **Low Risk Items:** ${auditResults.summary.lowRiskItems}\n\n`;

  // Overall assessment
  if (auditResults.summary.highRiskItems === 0) {
    report += `## ✅ Overall Assessment: GOOD\n\n`;
    report += `No high-risk authenticity issues detected. Continue monitoring for best practices.\n\n`;
  } else {
    report += `## ⚠️ Overall Assessment: NEEDS ATTENTION\n\n`;
    report += `${auditResults.summary.highRiskItems} high-risk items require immediate review.\n\n`;
  }

  // Detailed findings by site
  Object.entries(auditResults.sites).forEach(([siteName, siteResults]) => {
    if (siteResults.length > 0) {
      report += `## ${siteName.toUpperCase()} Site Issues\n\n`;

      siteResults.forEach(file => {
        report += `### ${file.fileName}\n`;
        report += `**Path:** \`${file.filePath}\`\n\n`;

        file.issues.forEach(issue => {
          const emoji = issue.riskLevel === 'HIGH_RISK' ? '🚨' :
                       issue.riskLevel === 'MEDIUM_RISK' ? '⚠️' : '💡';

          report += `${emoji} **${issue.riskLevel}** (Line ${issue.lineNumber})\n`;
          report += `**Found:** \`${issue.match}\`\n\n`;
          report += `**Action Required:**\n`;

          if (issue.riskLevel === 'HIGH_RISK') {
            report += `- IMMEDIATE: Verify source or remove content\n`;
            report += `- Check if statistic/quote is real and properly attributed\n`;
          } else if (issue.riskLevel === 'MEDIUM_RISK') {
            report += `- REVIEW: Ensure claims can be substantiated\n`;
            report += `- Consider adding disclaimers or qualifications\n`;
          } else {
            report += `- MONITOR: Standard content requiring periodic verification\n`;
          }

          report += `\n---\n\n`;
        });
      });
    }
  });

  // Recommendations
  report += `## Recommendations\n\n`;
  report += `### Immediate Actions\n`;
  if (auditResults.summary.highRiskItems > 0) {
    report += `1. Review all HIGH RISK items immediately\n`;
    report += `2. Verify sources or remove unsubstantiated claims\n`;
    report += `3. Update content with proper attribution\n`;
  } else {
    report += `✅ No immediate actions required\n`;
  }

  report += `\n### Ongoing Practices\n`;
  report += `1. Run this audit monthly\n`;
  report += `2. Review before major content updates\n`;
  report += `3. Maintain source documentation for all statistics\n`;
  report += `4. Use qualified language ("may", "can", "typically") for claims\n`;
  report += `5. Avoid specific percentages without verified sources\n\n`;

  report += `### Next Audit\n`;
  report += `**Recommended Date:** ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n`;
  report += `**Command:** \`node scripts/content-authenticity-audit.js\`\n\n`;

  // Write report
  fs.writeFileSync(reportPath, report);
  console.log(`\n📋 Detailed report saved: ${reportPath}`);

  return reportPath;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log('🔍 Starting Content Authenticity Audit...\n');

  Object.entries(SITES).forEach(([siteName, sitePath]) => {
    console.log(`Scanning ${siteName} site: ${sitePath}`);

    const files = scanDirectory(sitePath);
    auditResults.summary.totalFiles += files.length;
    auditResults.sites[siteName] = [];

    files.forEach(filePath => {
      const result = scanFileContent(filePath);
      if (result) {
        auditResults.sites[siteName].push(result);
        auditResults.summary.flaggedFiles++;
      }
    });

    console.log(`  Found ${auditResults.sites[siteName].length} files with flagged content`);
  });

  // Generate report
  console.log('\n📊 Generating report...');
  const reportPath = generateReport();

  // Console summary
  console.log('\n' + '='.repeat(60));
  console.log('CONTENT AUTHENTICITY AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files Scanned: ${auditResults.summary.totalFiles}`);
  console.log(`High Risk Items: ${auditResults.summary.highRiskItems}`);
  console.log(`Medium Risk Items: ${auditResults.summary.mediumRiskItems}`);
  console.log(`Low Risk Items: ${auditResults.summary.lowRiskItems}`);

  if (auditResults.summary.highRiskItems === 0) {
    console.log('\n✅ STATUS: All clear! No high-risk authenticity issues found.');
  } else {
    console.log(`\n⚠️  STATUS: ${auditResults.summary.highRiskItems} high-risk items need immediate attention.`);
  }

  console.log(`\n📋 Full report: ${reportPath}`);
  console.log('\n💡 Run this audit monthly or before major updates.');
}

// Execute if run directly
if (require.main === module) {
  runAudit();
}

module.exports = { runAudit, RISK_PATTERNS, SITES };
#!/usr/bin/env node

/*
  CI Authenticity Check
  - Scans the repository for disallowed “fake stats” patterns
  - Fails the build with exit code 1 when violations are found

  Usage: node scripts/ci-authenticity-check.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// Disallowed patterns: unverified user counts and phrases like "Join [number]+"
// NOTE: Bare percentage checks are intentionally omitted — sourced percentages (e.g. BACB
// exam pass rates, domain breakdowns) appear legitimately throughout educational content.
// Editorial review during the publishing process covers percentage accuracy.
const DISALLOWED = [
  /(\b|\s)(\d{3,}[\+,]?)\s*\+?\s*(educators|teachers|bcbas|practitioners|users|schools)\b/gi,
  /join\s+\d{3,}[\+,]?/gi,
  /\b(over|more\s+than)\s+\d{3,}\b\s*(educators|teachers|bcbas|users|schools)/gi,
];

const EXCLUDE = [/node_modules/, /\.git\//, /\.next\//, /dist\//, /build\//, /audit-reports\//, /test-results\//, /week1-emergency-fixes\//];

// Only scan application source code — not blog content, docs, or config files.
// Blog posts (.md) contain cited research stats and are reviewed on publish.
// CSS files (.css) contain design values (percentages, colors) — not marketing copy.
const SCAN_ROOTS = [/\/src\//];

function shouldScan(file) {
  if (EXCLUDE.some((p) => p.test(file))) return false;
  if (!SCAN_ROOTS.some((p) => p.test(file))) return false;
  return /\.(tsx?|jsx?|ts)$/i.test(file);
}

function walk(dir, out = []) {
  // Skip excluded roots early
  if (EXCLUDE.some((p) => p.test(dir))) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    // Skip excluded paths
    if (EXCLUDE.some((p) => p.test(full))) continue;
    let stat;
    try {
      stat = fs.lstatSync(full);
    } catch {
      continue; // skip broken links
    }
    if (stat.isSymbolicLink()) {
      // Do not follow symlinks
      continue;
    }
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT).filter(shouldScan);
let violations = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of DISALLOWED) {
    const matches = content.match(pattern);
    if (matches) {
      // Compute line numbers for each match
      matches.forEach((m) => {
        const idx = content.indexOf(m);
        const line = content.substring(0, idx).split('\n').length;
        violations.push({ file, line, match: m.trim() });
      });
    }
  }
}

if (violations.length > 0) {
  console.error('\n🚫 Authenticity check failed: disallowed “fake stats” found.');
  violations.slice(0, 100).forEach((v) => {
    console.error(` - ${v.file}:${v.line} → ${v.match}`);
  });
  if (violations.length > 100) {
    console.error(` ... and ${violations.length - 100} more occurrences`);
  }
  console.error('\nGuideline: Remove specific counts/percentages unless sourced and attributed.');
  process.exit(1);
} else {
  console.log('✅ Authenticity check passed: no disallowed “fake stats” found.');
}

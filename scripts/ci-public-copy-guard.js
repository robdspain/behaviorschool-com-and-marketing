#!/usr/bin/env node

/**
 * Public-copy guard for public marketing surfaces.
 *
 * Public claims must be sourced and approved before they reach a public page.
 * This guard fails the build when public marketing contains
 * testimonial/social-proof scaffolding, fabricated-looking outcome data,
 * unsupported scarcity, or known stale Transformation copy.
 */

const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.lstatSync(full);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = [
  ...walk(path.join(process.cwd(), 'src/app')),
  ...walk(path.join(process.cwd(), 'src/components/marketing')),
].filter((file) => /\.(tsx?|jsx?)$/i.test(file) && !/\/src\/app\/(admin|api)(\/|$)/.test(file));

const rules = [
  ['testimonial or social-proof copy', /\b(testimonials?|social\s+proof|success\s+stories?|real\s+examples?\s+of\s+transformative\s+impact|what\s+bcbas\s+are\s+saying)\b/i],
  ['self-reported or unsupported outcome data', /\b(self[-\s]reported|outcome\s+stats?|by\s+the\s+numbers|would\s+recommend|saved\s+per\s+week|up\s+from|proven\s+results?|participants?\s+typically\s+report|many\s+(participants?|users?)\s+(also\s+)?report)\b/i],
  ['hardcoded scarcity claim', /\b(spots?\s+(left|remaining|available)|limited\s+spots?|limited\s+availability|only\s+\d+\s+(seats?|spots?)|\d+\s+(seats?|spots?)\s*(max|available|remaining))\b/i],
  ['unsupported outcome promise', /\b(leave\s+work\s+at|stop\s+writing\s+.*10\s*pm|finish\s+notes\s+the\s+same\s+day|fidelity\s+went\s+up|run\s+without\s+you|transformative\s+impact|transform(s|ed)?\s+your\s+practice)\b/i],
  ['customer quote scaffolding', /\b(?:quote|testimonial|customerQuote)\s*:\s*['"`]/i],
  ['unsupported percentage or named customer result', /\b\d{1,3}%\s+of\s+(our|the)\s+(students?|users?|participants?)|\b(result|outcome):\s*\d+%|\b(Megan|Holly)\s+(works?|provides?)\b/i],
  ['stale cohort date or price', /\b(April\s+9|May\s+14|April\s+2026|maximum\s+20|\$2,497|\$833)\b/i],
];

const violations = [];
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const [label, pattern] of rules) {
    if (label === 'stale cohort date or price' && !/transformation-program|ProgramApplication/.test(file)) continue;
    lines.forEach((line, index) => {
      if (pattern.test(line)) violations.push({ file, line: index + 1, label, text: line.trim() });
      pattern.lastIndex = 0;
    });
  }
}

if (violations.length) {
  console.error('\nPublic-copy guard failed. Remove or source every flagged claim before publishing:\n');
  for (const violation of violations) {
    console.error(` - ${violation.file}:${violation.line} [${violation.label}] ${violation.text}`);
  }
  process.exit(1);
}

console.log('Public-copy guard passed: no prohibited Transformation Program claims found.');

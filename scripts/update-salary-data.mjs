#!/usr/bin/env node
// Refresh salary benchmarks from a published CSV (e.g., Google Sheets export)
// Env: SALARY_DATA_URL=https://docs.google.com/spreadsheets/d/.../export?format=csv

import fs from 'node:fs/promises';

const url = process.env.SALARY_DATA_URL;
if (!url) {
  console.log('[salary-update] SALARY_DATA_URL not set. Skipping refresh.');
  process.exit(0);
}

console.log('[salary-update] Fetching CSV from', url);
const res = await fetch(url);
if (!res.ok) {
  console.error('[salary-update] Failed to fetch CSV:', res.status, res.statusText);
  process.exit(1);
}
const csv = await res.text();

// Minimal CSV parser (expects headers: label,min,max)
const lines = csv.split(/\r?\n/).filter(Boolean);
if (lines.length < 2) {
  console.error('[salary-update] CSV seems empty.');
  process.exit(1);
}
const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
const idxLabel = headers.indexOf('label');
const idxMin = headers.indexOf('min');
const idxMax = headers.indexOf('max');
if (idxLabel < 0 || idxMin < 0 || idxMax < 0) {
  console.error('[salary-update] CSV must include headers: label,min,max');
  process.exit(1);
}

const items = [];
for (let i = 1; i < lines.length; i++) {
  const raw = lines[i].split(',');
  if (!raw[idxLabel]) continue;
  const label = String(raw[idxLabel]).trim();
  const min = Number(String(raw[idxMin]).trim());
  const max = Number(String(raw[idxMax]).trim());
  if (!label || Number.isNaN(min) || Number.isNaN(max)) continue;
  items.push({ label, min, max });
}

if (items.length === 0) {
  console.error('[salary-update] No valid rows parsed.');
  process.exit(1);
}

const now = new Date();
const payload = {
  year: now.getFullYear(),
  updatedAt: now.toISOString().split('T')[0],
  items,
};

const outPath = 'public/data/salary-benchmarks.json';
await fs.mkdir('public/data', { recursive: true });
await fs.writeFile(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log('[salary-update] Wrote', outPath, 'with', items.length, 'items');


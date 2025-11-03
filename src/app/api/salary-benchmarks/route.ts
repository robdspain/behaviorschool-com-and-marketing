import { NextRequest } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

type Benchmarks = {
  year: number;
  updatedAt?: string;
  items: Array<{ label: string; min: number; max: number }>;
};

const fallback: Benchmarks = {
  year: new Date().getFullYear(),
  items: [
    { label: 'California', min: 90, max: 125 },
    { label: 'Texas', min: 70, max: 95 },
    { label: 'Florida', min: 65, max: 90 },
    { label: 'New York', min: 80, max: 115 },
    { label: 'Illinois', min: 72, max: 100 },
    { label: 'Arizona', min: 65, max: 90 },
    { label: 'Pennsylvania', min: 70, max: 95 },
    { label: 'Ohio', min: 68, max: 92 },
    { label: 'Washington', min: 85, max: 115 },
    { label: 'Massachusetts', min: 85, max: 120 },
  ],
};

function toCsv(data: Benchmarks): string {
  const lines = ['label,min,max'];
  for (const r of data.items) {
    // Simple CSV, labels have no commas in our set
    lines.push(`${r.label},${r.min},${r.max}`);
  }
  return lines.join('\n') + '\n';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = (searchParams.get('format') || 'json').toLowerCase();
  const download = searchParams.get('download') === '1';
  const year = new Date().getFullYear();

  // Try to read the current JSON payload from public
  let payload: Benchmarks = fallback;
  let usedFallback = true;
  try {
    const file = path.join(process.cwd(), 'public', 'data', 'salary-benchmarks.json');
    const raw = await fs.readFile(file, 'utf8');
    const json = JSON.parse(raw);
    if (json && Array.isArray(json.items)) {
      payload = json as Benchmarks;
      usedFallback = false;
    }
  } catch {
    // keep fallback
  }

  const headers: HeadersInit = new Headers();
  headers.set('X-Data-Year', String(payload.year || year));
  if (process.env.SALARY_DATA_URL) headers.set('X-Source-URL', process.env.SALARY_DATA_URL);
  if (usedFallback) headers.set('X-Fallback', 'true');

  if (format === 'csv') {
    const csv = toCsv(payload);
    headers.set('Content-Type', 'text/csv; charset=utf-8');
    if (download) headers.set('Content-Disposition', `attachment; filename="school-bcba-salaries-${payload.year || year}.csv"`);
    return new Response(csv, { status: 200, headers });
  }

  // Default: JSON
  const body = JSON.stringify(payload, null, 2);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  if (download) headers.set('Content-Disposition', `attachment; filename="school-bcba-salaries-${payload.year || year}.json"`);
  return new Response(body + '\n', { status: 200, headers });
}


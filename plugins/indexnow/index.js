import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CACHE_FILE = '.indexnow-cache/hashes.json';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, tries = 5) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'IndexNow-Netlify-Plugin/1.0' },
        redirect: 'manual',
      });
      if (res.status === 200) return await res.text();
    } catch {
      // retry
    }
    if (i < tries) await sleep(10000);
  }
  return null;
}

function contentHash(html) {
  const main =
    (html.match(/<main[\s\S]*?<\/main>/i) || html.match(/<body[\s\S]*?<\/body>/i) || [html])[0];
  const head = [
    /<title>[\s\S]*?<\/title>/i,
    /<meta name="description"[^>]*>/i,
    /<link rel="canonical"[^>]*>/i,
  ].map((r) => (html.match(r) || [''])[0]).join('');
  const text = (head + main)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return createHash('sha256').update(text).digest('hex');
}

export const onSuccess = async ({ inputs, utils }) => {
  try {
    if (process.env.CONTEXT !== 'production') {
      console.log('IndexNow: skipped (not a production deploy)');
      return;
    }
    const { host, key, sitemapUrl } = inputs;
    const keyLocation = `https://${host}/${key}.txt`;

    const keyBody = await fetchText(keyLocation);
    if (!keyBody || keyBody.trim() !== key) {
      console.log(`IndexNow: key file not live at ${keyLocation}; skipping`);
      return;
    }

    const xml = await fetchText(sitemapUrl);
    if (!xml) {
      console.log('IndexNow: sitemap unavailable; skipping');
      return;
    }
    const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
      .map((m) => m[1])
      .filter((u) => new URL(u).host === host);

    await utils.cache.restore(CACHE_FILE);
    let prev = {};
    try {
      prev = JSON.parse(await readFile(CACHE_FILE, 'utf8'));
    } catch {
      prev = {};
    }

    const next = {};
    const changed = [];
    for (const u of urls) {
      const html = await fetchText(u, 2);
      if (!html) continue;
      const h = contentHash(html);
      next[u] = h;
      if (prev[u] !== h) changed.push(u);
    }
    // URLs dropped from the sitemap since the last deploy are reported too,
    // so engines recrawl and see the 301/404.
    for (const u of Object.keys(prev)) if (!(u in next)) changed.push(u);

    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(next));
    await utils.cache.save(CACHE_FILE);

    if (changed.length === 0) {
      console.log('IndexNow: no changed URLs');
      return;
    }
    for (let i = 0; i < changed.length; i += 10000) {
      const batch = changed.slice(i, i + 10000);
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host, key, keyLocation, urlList: batch }),
      });
      console.log(`IndexNow: submitted ${batch.length} URL(s), HTTP ${res.status}`);
    }
  } catch (err) {
    console.log(`IndexNow: error ${err && err.message ? err.message : err}; build not affected`);
  }
};

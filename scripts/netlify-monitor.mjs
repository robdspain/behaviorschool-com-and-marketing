#!/usr/bin/env node

// Minimal Netlify deploy monitor script
// Usage:
// node scripts/netlify-monitor.mjs \
//   --site $NETLIFY_SITE_ID \
//   --token $NETLIFY_AUTH_TOKEN \
//   [--buildHook $NETLIFY_BUILD_HOOK_URL] \
//   [--timeout 1800] \
//   [--retry 1]
//   [--monitorLast]
//   [--autoFix true]

const NETLIFY_API = 'https://api.netlify.com/api/v1';

// Load env from .env and .env.local if present (ESM-safe, no deps)
async function loadEnvFromFiles() {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const parse = (text) => {
    const map = {};
    text.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!m) return;
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      map[key] = val;
    });
    return map;
  };
  const cwd = process.cwd();
  const envPath = path.join(cwd, '.env');
  const localPath = path.join(cwd, '.env.local');
  let base = {};
  let local = {};
  try { if (fs.existsSync(envPath)) base = parse(fs.readFileSync(envPath, 'utf8')); } catch {}
  try { if (fs.existsSync(localPath)) local = parse(fs.readFileSync(localPath, 'utf8')); } catch {}
  const merged = { ...base, ...local }; // .env.local takes precedence
  for (const [k, v] of Object.entries(merged)) {
    if (process.env[k] == null || process.env[k] === '') {
      process.env[k] = v;
    }
  }
  return { loaded: [fs.existsSync(envPath) ? '.env' : null, fs.existsSync(localPath) ? '.env.local' : null].filter(Boolean) };
}

await loadEnvFromFiles();

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
    args[key.slice(2)] = val;
  }
  return args;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function netlifyFetch(path, token, options = {}) {
  const res = await fetch(`${NETLIFY_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Netlify API ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

async function triggerBuildHook(buildHookUrl) {
  if (!buildHookUrl) return;
  let urlToCall = '';
  try {
    const u = new URL(buildHookUrl);
    if (u.protocol === 'http:' || u.protocol === 'https:') urlToCall = u.toString();
  } catch {
    // ignore – treated as no build hook provided
  }
  if (!urlToCall) return;
  const res = await fetch(urlToCall, { method: 'POST' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Build hook trigger failed: ${res.status} ${res.statusText} ${text}`);
  }
}

function withClearCacheParam(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has('clear_cache')) {
      u.searchParams.set('clear_cache', 'true');
    }
    return u.toString();
  } catch {
    // if it's not a valid URL, skip modifying it
    return '';
  }
}

async function getLatestDeployAfter(siteId, token, isoStart) {
  const list = await netlifyFetch(`/sites/${siteId}/deploys?per_page=5`, token);
  const start = new Date(isoStart).getTime();
  const sorted = list
    .filter((d) => new Date(d.created_at).getTime() >= start)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return sorted[0] || null;
}

async function getMostRecentDeploy(siteId, token) {
  const list = await netlifyFetch(`/sites/${siteId}/deploys?per_page=1`, token);
  return Array.isArray(list) && list.length > 0 ? list[0] : null;
}

async function getDeploy(deployId, token) {
  return netlifyFetch(`/deploys/${deployId}`, token);
}

async function waitForCompletion(siteId, token, deployId, opts) {
  const startTime = Date.now();
  const timeoutMs = Number(opts.timeoutMs || 30 * 60 * 1000);
  let waitMs = 5000;
  let lastState = '';
  for (;;) {
    const deploy = await getDeploy(deployId, token);
    if (deploy.state !== lastState) {
      console.log(`Deploy ${deployId} state: ${deploy.state}`);
      lastState = deploy.state;
    }
    if (deploy.state === 'ready') {
      return { status: 'success', deploy };
    }
    if (deploy.state === 'error' || deploy.state === 'failed' || deploy.state === 'cancelled') {
      return { status: 'failed', deploy };
    }
    if (Date.now() - startTime > timeoutMs) {
      return { status: 'timeout', deploy };
    }
    await sleep(waitMs);
    waitMs = Math.min(waitMs * 1.3, 30000);
  }
}

function summarizeFailure(deploy) {
  const lines = [];
  lines.push(`Deploy failed. id=${deploy.id}`);
  if (deploy.deploy_ssl_url) lines.push(`URL: ${deploy.deploy_ssl_url}`);
  if (deploy.commit_url) lines.push(`Commit: ${deploy.commit_url}`);
  if (deploy.admin_url) lines.push(`Admin: ${deploy.admin_url}`);
  if (deploy.logs) lines.push('Logs: available in Netlify UI');
  if (deploy.state) lines.push(`State: ${deploy.state}`);
  if (deploy.error_message) lines.push(`Error: ${deploy.error_message}`);
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);
  const siteId = args.site || process.env.NETLIFY_SITE_ID;
  const token = args.token || process.env.NETLIFY_AUTH_TOKEN;
  // Treat missing or placeholder values (e.g. 'true') as absent
  let buildHook = args.buildHook || process.env.NETLIFY_BUILD_HOOK_URL;
  if (!buildHook || buildHook === 'true' || buildHook === 'false') buildHook = '';
  const timeout = Number(args.timeout || process.env.NETLIFY_TIMEOUT_SECS || 1800);
  const retryCount = Number(args.retry || process.env.NETLIFY_RETRY_COUNT || 1);
  const monitorLast = args.monitorLast === 'true' || args.monitorLast === true;
  const autoFix = (args.autoFix ?? process.env.NETLIFY_AUTO_FIX ?? 'true') === 'true';

  if (!siteId || !token) {
    const missing = [];
    if (!siteId) missing.push('NETLIFY_SITE_ID');
    if (!token) missing.push('NETLIFY_AUTH_TOKEN');
    console.error(`Missing required env: ${missing.join(', ')}`);
    process.exit(2);
  }

  if (monitorLast) {
    const existing = await getMostRecentDeploy(siteId, token);
    if (!existing) {
      console.error('No deploys found for this site.');
      process.exit(4);
    }
    console.log(`Latest deploy id=${existing.id} state=${existing.state}`);
    if (['new', 'enqueued', 'building', 'processing'].includes(existing.state)) {
      const result = await waitForCompletion(siteId, token, existing.id, { timeoutMs: timeout * 1000 });
      if (result.status === 'success') {
        console.log(`Deploy succeeded: ${result.deploy.deploy_ssl_url || result.deploy.url || ''}`);
        return;
      }
      console.warn(summarizeFailure(result.deploy));
      process.exit(1);
    } else if (existing.state === 'ready') {
      console.log(`Deploy already succeeded: ${existing.deploy_ssl_url || existing.url || ''}`);
      return;
    } else {
      console.warn(summarizeFailure(existing));
      process.exit(1);
    }
  }

  const startedAt = new Date().toISOString();
  if (buildHook) {
    console.log('Triggering Netlify build via build hook...');
    await triggerBuildHook(buildHook);
  } else {
    console.log('No build hook provided. Assuming Netlify auto-builds from the connected Git repo.');
  }

  let deploy = null;
  const discoverDeadline = Date.now() + 10 * 60 * 1000;
  let backoff = 5000;
  while (!deploy && Date.now() < discoverDeadline) {
    deploy = await getLatestDeployAfter(siteId, token, startedAt);
    if (!deploy) {
      await sleep(backoff);
      backoff = Math.min(backoff * 1.3, 30000);
    }
  }
  if (!deploy) {
    console.error('No deploy discovered for this push within 10 minutes.');
    process.exit(3);
  }
  console.log(`Monitoring deploy id=${deploy.id} created_at=${deploy.created_at}`);

  let result = await waitForCompletion(siteId, token, deploy.id, { timeoutMs: timeout * 1000 });
  if (result.status === 'success') {
    console.log(`Deploy succeeded: ${result.deploy.deploy_ssl_url || result.deploy.url || ''}`);
    return;
  }

  console.warn(summarizeFailure(result.deploy));
  let attemptsLeft = retryCount;
  let usedClearCache = false;
  while (attemptsLeft > 0) {
    attemptsLeft -= 1;
    if (!buildHook) {
      console.error('Cannot retry: build hook not provided.');
      break;
    }
    let hookToUse = buildHook;
    if (autoFix && attemptsLeft === 0 && !usedClearCache) {
      hookToUse = withClearCacheParam(buildHook);
      usedClearCache = true;
      console.log('Retrying Netlify build with cache clear (auto-fix)...');
    } else {
      console.log('Retrying Netlify build by re-triggering build hook...');
    }
    await triggerBuildHook(hookToUse);
    // Discover new deploy after retry
    deploy = null;
    backoff = 5000;
    const retryDiscoverDeadline = Date.now() + 5 * 60 * 1000;
    const retryStartIso = new Date().toISOString();
    while (!deploy && Date.now() < retryDiscoverDeadline) {
      deploy = await getLatestDeployAfter(siteId, token, retryStartIso);
      if (!deploy) {
        await sleep(backoff);
        backoff = Math.min(backoff * 1.3, 30000);
      }
    }
    if (!deploy) {
      console.error('Retry did not create a new deploy.');
      break;
    }
    console.log(`Monitoring retry deploy id=${deploy.id}`);
    result = await waitForCompletion(siteId, token, deploy.id, { timeoutMs: timeout * 1000 });
    if (result.status === 'success') {
      console.log(`Retry succeeded: ${result.deploy.deploy_ssl_url || result.deploy.url || ''}`);
      return;
    }
    console.warn('Retry failed.');
    console.warn(summarizeFailure(result.deploy));
  }

  console.error('Netlify deploy failed. See details above.');
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});



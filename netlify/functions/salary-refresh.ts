import type { Handler } from '@netlify/functions';

// Scheduled via netlify.toml [[scheduled.functions]] or this function can be invoked manually
// Fallback trigger: calls GitHub Actions workflow_dispatch for the salary-data-refresh.yml
// Optional: also trigger a Netlify build hook if provided

const handler: Handler = async () => {
  const repo = process.env.GH_REPO || 'robdspain/behaviorschool-com-and-marketing';
  const workflow = process.env.GH_WORKFLOW || 'salary-data-refresh.yml';
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
  const buildHook = process.env.NETLIFY_BUILD_HOOK || '';

  const results: Record<string, unknown> = {};

  try {
    if (token) {
      const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ref: 'main' })
      });
      results.github = { status: res.status, ok: res.ok };
    } else {
      results.github = { skipped: true, reason: 'GH_TOKEN not set' };
    }
  } catch (e) {
    results.github = { error: String(e) };
  }

  try {
    if (buildHook) {
      const res = await fetch(buildHook, { method: 'POST' });
      results.netlify = { status: res.status, ok: res.ok };
    } else {
      results.netlify = { skipped: true, reason: 'NETLIFY_BUILD_HOOK not set' };
    }
  } catch (e) {
    results.netlify = { error: String(e) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, results })
  };
};

export { handler };


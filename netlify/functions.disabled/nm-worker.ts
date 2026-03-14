// Netlify Scheduled Function: triggers newsletter worker periodically
export const handler = async () => {
  const base = process.env.PUBLIC_BASE_URL || process.env.URL || ''
  const secret = process.env.NM_WORKER_SECRET || ''
  if (!base) {
    return { statusCode: 200, body: 'No base URL configured' }
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/nm/worker/process`, {
      method: 'POST',
      headers: { 'x-nm-worker-secret': secret },
    })
    const txt = await res.text()
    return { statusCode: 200, body: `Triggered: ${res.status} ${txt}` }
  } catch (e) {
    return { statusCode: 500, body: `Error: ${String(e)}` }
  }
}


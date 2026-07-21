export async function hasAdminClientSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/session', {
      cache: 'no-store',
      credentials: 'same-origin',
    });
    if (!response.ok) return false;
    const data = await response.json().catch(() => ({}));
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export async function clearAdminClientSession(): Promise<void> {
  await fetch('/api/admin/session', {
    method: 'DELETE',
    cache: 'no-store',
    credentials: 'same-origin',
  }).catch(() => undefined);
}

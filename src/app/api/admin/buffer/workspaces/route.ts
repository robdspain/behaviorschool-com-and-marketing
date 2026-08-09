import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { getBufferWorkspaceStatus } from '@/lib/buffer-workspaces'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await verifyAdminSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const workspaces = getBufferWorkspaceStatus()
  return NextResponse.json({
    ok: true,
    workspaces,
    legacyApiKeyWarning: workspaces.some((workspace) => workspace.legacyApiKeyDetected)
      ? 'An unscoped BUFFER_API_KEY exists and is intentionally ignored. Assign named keys before using Buffer.'
      : null,
  })
}

import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Manually revalidate the sitemap metadata route cache from Admin
export async function POST() {
  try {
    // Revalidate the metadata route for sitemap
    revalidatePath('/sitemap.xml')
    return NextResponse.json({ ok: true, revalidated: '/sitemap.xml' }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Failed to revalidate' }, { status: 500 })
  }
}


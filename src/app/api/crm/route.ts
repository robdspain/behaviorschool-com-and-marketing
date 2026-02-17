import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { upsertCrmContact } from '@/lib/crm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, first_name, last_name, role, organization, source } = body || {}

    const result = await upsertCrmContact({
      email,
      first_name,
      last_name,
      role,
      organization,
      source
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ ok: true, contactId: result.contactId })
  } catch (error) {
    console.error('CRM POST error:', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClient()
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const id = searchParams.get('id')
  const tag = searchParams.get('tag')
  const tags = searchParams.get('tags')

  try {
    if (tags === 'true') {
      const { data, error } = await supabase
        .from('crm_contact_tags')
        .select('tag')

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const counts: Record<string, number> = {}
      data?.forEach(item => {
        counts[item.tag] = (counts[item.tag] || 0) + 1
      })

      const tagList = Object.entries(counts)
        .map(([tagName, count]) => ({ tag: tagName, count }))
        .sort((a, b) => a.tag.localeCompare(b.tag))

      return NextResponse.json({ ok: true, tags: tagList })
    }

    if (id) {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select(`
          id,
          name,
          email,
          phone,
          organization,
          role,
          notes,
          created_at,
          updated_at,
          crm_contact_tags(tag),
          crm_interactions(id, note, interaction_date)
        `)
        .eq('id', id)
        .maybeSingle()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if (!data) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
      }

      return NextResponse.json({
        ok: true,
        contact: {
          ...data,
          tags: data.crm_contact_tags?.map((entry: { tag: string }) => entry.tag) || [],
          interactions: data.crm_interactions || []
        }
      })
    }

    let query = supabase
      .from('crm_contacts')
      .select(`
        id,
        name,
        email,
        phone,
        organization,
        role,
        notes,
        crm_contact_tags(tag)
      `)
      .order('name', { ascending: true })
      .limit(600)

    if (tag) {
      query = supabase
        .from('crm_contacts')
        .select(`
          id,
          name,
          email,
          phone,
          organization,
          role,
          notes,
          crm_contact_tags!inner(tag)
        `)
        .eq('crm_contact_tags.tag', tag)
        .order('name', { ascending: true })
        .limit(600)
    }

    if (q) {
      query = query.or(
        `name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,organization.ilike.%${q}%,role.ilike.%${q}%,notes.ilike.%${q}%`
      )
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const contacts = (data || []).map(contact => ({
      ...contact,
      tags: contact.crm_contact_tags?.map((entry: { tag: string }) => entry.tag) || []
    }))

    return NextResponse.json({ ok: true, contacts, count: contacts.length })
  } catch (error) {
    console.error('CRM GET error:', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

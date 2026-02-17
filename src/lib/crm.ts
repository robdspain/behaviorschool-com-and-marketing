import { createSupabaseAdminClient } from '@/lib/supabase-admin'

type CrmRole = 'BCBA' | 'RBT' | 'OTHER'

const normalizeRole = (role: string): CrmRole | null => {
  const normalized = String(role || '').trim().toUpperCase()
  if (normalized === 'BCBA' || normalized === 'RBT' || normalized === 'OTHER') {
    return normalized as CrmRole
  }
  return null
}

export interface CrmUpsertInput {
  email: string
  first_name?: string
  last_name?: string
  role: string
  organization?: string
  source?: string
}

export interface CrmUpsertResult {
  ok: boolean
  contactId?: string
  error?: string
}

export const upsertCrmContact = async (input: CrmUpsertInput): Promise<CrmUpsertResult> => {
  const supabase = createSupabaseAdminClient()
  const email = String(input.email || '').trim().toLowerCase()
  const role = normalizeRole(input.role)
  const organization = String(input.organization || 'Behavior School').trim()
  const source = String(input.source || 'behaviorschool_crm').trim()
  const firstName = String(input.first_name || '').trim()
  const lastName = String(input.last_name || '').trim()

  if (!email) {
    return { ok: false, error: 'Email is required' }
  }

  if (!role) {
    return { ok: false, error: 'Role must be BCBA, RBT, or OTHER' }
  }

  const name = `${firstName} ${lastName}`.trim() || email

  const { data: existing, error: existingError } = await supabase
    .from('crm_contacts')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existingError) {
    return { ok: false, error: existingError.message }
  }

  let contactId = existing?.id as string | undefined

  if (contactId) {
    const { error: updateError } = await supabase
      .from('crm_contacts')
      .update({ name, role, organization, updated_at: new Date().toISOString() })
      .eq('id', contactId)

    if (updateError) {
      return { ok: false, error: updateError.message }
    }
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from('crm_contacts')
      .insert([
        {
          name,
          email,
          organization,
          role,
          notes: `Source: ${source}`
        }
      ])
      .select('id')
      .single()

    if (insertError) {
      return { ok: false, error: insertError.message }
    }

    contactId = inserted?.id
  }

  if (!contactId) {
    return { ok: false, error: 'Failed to resolve contact id' }
  }

  const tagsToAdd = [
    'segment:behaviorschool',
    `source:${source}`,
    `role:${role.toLowerCase()}`
  ]

  const { error: tagError } = await supabase
    .from('crm_contact_tags')
    .upsert(
      tagsToAdd.map(tag => ({ contact_id: contactId, tag })),
      { onConflict: 'contact_id,tag' }
    )

  if (tagError) {
    return { ok: false, error: tagError.message }
  }

  return { ok: true, contactId }
}

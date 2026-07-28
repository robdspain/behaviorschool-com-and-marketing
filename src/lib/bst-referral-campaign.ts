export type ReferralContact = {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  organization?: string | null
  role?: string | null
  leadSource?: string | null
  tags?: string[] | null
  notes?: string | null
  isArchived?: boolean
}

export type ReferralSuppressionReason =
  | 'not_bae_sig'
  | 'archived'
  | 'invalid_email'
  | 'generic_inbox'
  | 'internal_account'
  | 'kcusd'
  | 'do_not_email'

const CAMPAIGN_ID = 'bst_supervisor_referral_beta'
const MOCK_EXAM_URL = 'https://study.behaviorschool.com/free-mock-exam/'
const EMAIL_UTM = new URLSearchParams({
  utm_source: 'behaviorschool_email',
  utm_medium: 'email',
  utm_campaign: CAMPAIGN_ID,
  utm_content: 'bae_sig_referral',
})
const SHARE_UTM = new URLSearchParams({
  utm_source: 'supervisor_referral',
  utm_medium: 'referral',
  utm_campaign: CAMPAIGN_ID,
  utm_content: 'supervisee_share',
})

export const bstSupervisorReferralCampaign = {
  id: CAMPAIGN_ID,
  name: 'BAE SIG supervisor referral pilot',
  status: 'draft_only' as const,
  audience: 'BAE SIG contacts who may know or supervise a BCBA exam candidate',
  subject: 'A free BCBA mock exam for someone you supervise',
  previewText: 'A free 185-question BCBA mock exam you can share with an exam candidate.',
  emailCtaUrl: `${MOCK_EXAM_URL}?${EMAIL_UTM.toString()}`,
  supervisorShareUrl: `${MOCK_EXAM_URL}?${SHARE_UTM.toString()}`,
  body: [
    'Hi {{first_name}},',
    '',
    'I built a free 185-question BCBA mock exam in Behavior Study Tools. It gives exam candidates a realistic timed practice session and a clear breakdown of what to study next.',
    '',
    'If you supervise someone who is preparing for the BCBA exam, would you pass this along?',
    '',
    'Free BCBA mock exam: {{supervisor_share_url}}',
    '',
    'They can begin without creating an account or entering a credit card.',
    '',
    'If you try it or share it, I would appreciate hearing what would make it more useful for supervisors and exam candidates. Just reply to this email.',
    '',
    'Rob',
  ].join('\n'),
}

const genericLocalParts = new Set([
  'admin',
  'admissions',
  'conference',
  'contact',
  'hello',
  'info',
  'office',
  'registrar',
  'support',
  'webmaster',
  'california.bae.sig',
])

function normalizedValues(contact: ReferralContact) {
  return [
    contact.email,
    contact.organization,
    contact.role,
    contact.leadSource,
    contact.notes,
    ...(contact.tags || []),
  ]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase())
}

function hasText(contact: ReferralContact, pattern: RegExp) {
  return normalizedValues(contact).some((value) => pattern.test(value))
}

export function isBaeSigContact(contact: ReferralContact) {
  return (contact.tags || []).some((tag) => /^bae[\s-]*sig$/i.test(tag.trim()))
}

export function hasSupervisorSignal(contact: ReferralContact) {
  return hasText(contact, /\b(supervisor|supervision|supervisee|fieldwork coordinator|clinical director)\b/i)
}

export function referralSuppressionReason(contact: ReferralContact): ReferralSuppressionReason | null {
  if (!isBaeSigContact(contact)) return 'not_bae_sig'
  if (contact.isArchived) return 'archived'

  const email = contact.email?.trim().toLowerCase() || ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'invalid_email'
  if (genericLocalParts.has(email.split('@')[0])) return 'generic_inbox'
  if (/@(behaviorschool\.com|updates\.behaviorschool\.com)$/i.test(email)) return 'internal_account'
  if (hasText(contact, /\b(behavior school staff|behaviorschool staff|internal account|test account)\b/i)) return 'internal_account'
  if (`${contact.firstName || ''} ${contact.lastName || ''}`.trim().toLowerCase() === 'rob spain') return 'internal_account'
  if (hasText(contact, /\b(kcusd|kings canyon unified|kings canyon usd)\b/i)) return 'kcusd'
  if (hasText(contact, /\b(do[\s-]*not[\s-]*email|unsubscribed|suppressed|no marketing)\b/i)) return 'do_not_email'
  return null
}

export function analyzeBaeSigReferralAudience(contacts: ReferralContact[]) {
  const byEmail = new Map<string, ReferralContact>()
  for (const contact of contacts) {
    const email = contact.email?.trim().toLowerCase()
    if (!email || byEmail.has(email)) continue
    byEmail.set(email, contact)
  }

  const uniqueContacts = [...byEmail.values()]
  const baeContacts = uniqueContacts.filter(isBaeSigContact)
  const suppressions = baeContacts.reduce<Record<ReferralSuppressionReason, number>>(
    (counts, contact) => {
      const reason = referralSuppressionReason(contact)
      if (reason) counts[reason] += 1
      return counts
    },
    {
      not_bae_sig: 0,
      archived: 0,
      invalid_email: 0,
      generic_inbox: 0,
      internal_account: 0,
      kcusd: 0,
      do_not_email: 0,
    },
  )
  const eligible = baeContacts.filter((contact) => !referralSuppressionReason(contact))
  const supervisorSignals = eligible.filter(hasSupervisorSignal)
  const rankedPilotPool = [...eligible]
    .filter(hasUsableName)
    .sort((left, right) => {
      const scoreDifference = pilotContactScore(right) - pilotContactScore(left)
      if (scoreDifference) return scoreDifference
      return campaignRank(left.email || '') - campaignRank(right.email || '')
    })
  const pilotByPerson = new Map<string, ReferralContact>()
  for (const contact of rankedPilotPool) {
    const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim().toLowerCase()
    const personKey = fullName || contact.email?.trim().toLowerCase() || contact.id || ''
    if (personKey && !pilotByPerson.has(personKey)) pilotByPerson.set(personKey, contact)
  }
  const pilot = [...pilotByPerson.values()].slice(0, 25)

  return {
    totalContacts: contacts.length,
    uniqueContacts: uniqueContacts.length,
    baeSigContacts: baeContacts.length,
    eligibleContacts: eligible.length,
    supervisorSignals: supervisorSignals.length,
    suppressions,
    pilot,
  }
}

function pilotContactScore(contact: ReferralContact) {
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim()
  return (
    (hasSupervisorSignal(contact) ? 100 : 0) +
    (contact.role?.trim() ? 20 : 0) +
    (contact.organization?.trim() ? 10 : 0) +
    (contact.firstName?.trim() && contact.lastName?.trim() ? 5 : 0) +
    (fullName && !/\d/.test(fullName) ? 2 : 0)
  )
}

function hasUsableName(contact: ReferralContact) {
  const firstName = contact.firstName?.trim() || ''
  const lastName = contact.lastName?.trim() || ''
  return firstName.length >= 2 && lastName.length >= 2 && !/\d/.test(`${firstName}${lastName}`)
}

function campaignRank(value: string) {
  let rank = 0
  for (const character of value.toLowerCase()) rank = (rank * 31 + character.charCodeAt(0)) % 1_000_003
  return rank
}

export function maskEmail(email?: string) {
  if (!email?.includes('@')) return ''
  const [local, domain] = email.split('@')
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${'*'.repeat(Math.max(2, local.length - visible.length))}@${domain}`
}

import assert from 'node:assert/strict'
import test from 'node:test'
import {
  analyzeBaeSigReferralAudience,
  bstSupervisorReferralCampaign,
  referralSuppressionReason,
  type ReferralContact,
} from './bst-referral-campaign'

const baeContact = (overrides: Partial<ReferralContact> = {}): ReferralContact => ({
  firstName: 'Taylor',
  lastName: 'Example',
  email: 'taylor@example.com',
  tags: ['BAE-SIG'],
  ...overrides,
})

test('excludes KCUSD, generic, and do-not-email contacts', () => {
  assert.equal(referralSuppressionReason(baeContact({ organization: 'KCUSD' })), 'kcusd')
  assert.equal(referralSuppressionReason(baeContact({ email: 'info@example.com' })), 'generic_inbox')
  assert.equal(referralSuppressionReason(baeContact({ email: 'staff@behaviorschool.com' })), 'internal_account')
  assert.equal(referralSuppressionReason(baeContact({ tags: ['BAE-SIG', 'do-not-email'] })), 'do_not_email')
})

test('deduplicates contacts and puts supervisor signals first in the pilot', () => {
  const audience = analyzeBaeSigReferralAudience([
    baeContact({ email: 'candidate@example.com' }),
    baeContact({ email: 'candidate@example.com' }),
    baeContact({ firstName: 'Jordan', lastName: 'Supervisor', email: 'supervisor@example.com', role: 'Fieldwork Supervisor' }),
    baeContact({ firstName: 'Taylor', lastName: 'Example', email: 'alternate@example.com' }),
    baeContact({ email: 'excluded@example.com', notes: 'No marketing' }),
  ])

  assert.equal(audience.uniqueContacts, 4)
  assert.equal(audience.eligibleContacts, 3)
  assert.equal(audience.supervisorSignals, 1)
  assert.equal(audience.pilot.length, 2)
  assert.equal(audience.pilot[0].email, 'supervisor@example.com')
})

test('uses separate tracked links for the email and the supervisor share', () => {
  assert.match(bstSupervisorReferralCampaign.emailCtaUrl, /utm_source=behaviorschool_email/)
  assert.match(bstSupervisorReferralCampaign.supervisorShareUrl, /utm_source=supervisor_referral/)
  assert.notEqual(bstSupervisorReferralCampaign.emailCtaUrl, bstSupervisorReferralCampaign.supervisorShareUrl)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { approvalStatusAfterSave, publishingStandardFailures, releaseMatches } from '../../convex/publishingStandardCore'

const validRecord = {
  title: 'FBA referrals: define the decision first',
  contentKey: 'newsletter:2026-08-15',
  contentHash: 'a'.repeat(64),
  tier: 'A' as const,
  audienceNeed: 'Help school BCBAs clarify the decision before accepting an FBA referral.',
  firstPartyInputReference: 'Rob reviewed the referral sequence and supplied the decision framing.',
  distinctiveThesis: 'A referral should identify the decision the assessment must inform.',
  specificityAnchors: [
    { type: 'workflow', detail: 'Name the decision before choosing the assessment method.', verifiedByRob: true },
    { type: 'school example', detail: 'Distinguish placement, support, and safety decisions.', verifiedByRob: true },
  ],
  evidenceInterpretationSeparated: true,
  informationGain: 'Adds a decision-first intake screen and examples.',
  detectorOptimizationUsed: false,
  claimsReviewed: true,
}

test('Tier A requires two verified specificity anchors', () => {
  const result = publishingStandardFailures({ ...validRecord, specificityAnchors: validRecord.specificityAnchors.slice(0, 1) })
  assert.ok(result.some((failure) => failure.includes('2 verified specificity anchors')))
})

test('detector-targeted writing tactics block approval', () => {
  const result = publishingStandardFailures({ ...validRecord, detectorOptimizationUsed: true })
  assert.ok(result.some((failure) => failure.includes('detector-targeted')))
})

test('social derivatives require an approved canonical source', () => {
  const result = publishingStandardFailures({ ...validRecord, tier: 'social-derivative', specificityAnchors: [] })
  assert.ok(result.some((failure) => failure.includes('canonical source')))
  assert.ok(result.some((failure) => failure.includes('approval reference')))
})

test('release approval matches only the exact approved fingerprint', () => {
  assert.equal(releaseMatches('approved', 'a'.repeat(64), 'a'.repeat(64)), true)
  assert.equal(releaseMatches('approved', 'b'.repeat(64), 'a'.repeat(64)), false)
  assert.equal(releaseMatches('stale', 'a'.repeat(64), 'a'.repeat(64)), false)
})

test('editing approved content makes its release stale', () => {
  assert.equal(approvalStatusAfterSave('approved', true, false), 'stale')
  assert.equal(approvalStatusAfterSave('approved', false, true), 'stale')
  assert.equal(approvalStatusAfterSave('approved', false, false), 'approved')
})

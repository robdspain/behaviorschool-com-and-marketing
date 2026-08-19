import assert from 'node:assert/strict'
import test from 'node:test'
import { subscribeToNewsletter } from '../../src/lib/convex-newsletter'
import { summarizeNewsletterAcquisition } from '../../src/lib/newsletter-acquisition'

test('Behavior School signup enters the canonical RobSpain delivery audience with source tags', async () => {
  const originalFetch = global.fetch
  const originalUrl = process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL
  let requestUrl = ''
  let requestBody: Record<string, any> = {}

  process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL = 'https://delivery.example'
  global.fetch = (async (input, init) => {
    requestUrl = String(input)
    requestBody = JSON.parse(String(init?.body || '{}'))
    return new Response(JSON.stringify({ value: { status: 'pending', isNew: true } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const result = await subscribeToNewsletter({
      email: ' Reader@Example.com ',
      source: 'behaviorschool-blog:/blog/fba',
      page: '/blog/fba',
      tags: ['blog-signup'],
    })

    assert.equal(requestUrl, 'https://delivery.example/api/action')
    assert.equal(requestBody.path, 'newsletterActions:requestSubscription')
    assert.equal(requestBody.args.email, 'reader@example.com')
    assert.equal(requestBody.args.source, 'behaviorschool-blog:/blog/fba')
    assert.deepEqual(requestBody.args.tags, ['newsletter', 'behaviorschool.com', 'page:/blog/fba', 'blog-signup'])
    assert.equal(result.isNew, true)
    assert.equal(result.status, 'pending')
  } finally {
    global.fetch = originalFetch
    if (originalUrl === undefined) delete process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL
    else process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL = originalUrl
  }
})

test('source summary returns aggregate confirmed conversions without contact details', () => {
  const launchAt = 1_000
  const summary = summarizeNewsletterAcquisition(
    33,
    [
      { source: 'behaviorschool-blog:/blog/fba', confirmedAt: 1_200, updatedAt: 1_200 },
      { source: 'verified-import', confirmedAt: 500, updatedAt: 500 },
    ],
    [{ source: 'behaviorschool-blog:/blog/fba', updatedAt: 1_300 }],
    launchAt,
    50,
  )

  assert.deepEqual(summary, {
    available: true,
    launchAt,
    targetConfirmed: 50,
    confirmedTotal: 33,
    confirmedSinceLaunch: 1,
    remainingToTarget: 17,
    pendingSinceLaunch: 1,
    sources: [
      { source: 'behaviorschool-blog:/blog/fba', requested: 2, confirmed: 1, pending: 1, confirmationRate: 0.5 },
    ],
  })
  assert.doesNotMatch(JSON.stringify(summary), /@/)
})

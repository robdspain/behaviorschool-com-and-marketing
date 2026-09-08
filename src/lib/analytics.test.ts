import assert from 'node:assert/strict'
import test from 'node:test'
import {
  trackConversion,
  trackDownload,
  trackEmailSignup,
  trackLead,
} from './analytics'

type GtagEvent = { name: string; params: Record<string, unknown> }
type DbEvent = { event_type: string; user_email?: string }

const installBrowserMocks = () => {
  const events: GtagEvent[] = []
  const dbPosts: DbEvent[] = []
  const dataLayer: Array<Record<string, unknown>> = []

  const gtag = (command: string, eventName: string, params: Record<string, unknown>) => {
    if (command === 'event') events.push({ name: eventName, params })
  }

  Object.defineProperty(globalThis, 'window', {
    value: { gtag, dataLayer },
    configurable: true,
    writable: true,
  })

  globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
    if (init?.body) dbPosts.push(JSON.parse(String(init.body)) as DbEvent)
    return { ok: true } as Response
  }) as typeof fetch

  return { events, dbPosts, dataLayer }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

test('email signup fires email_signup to GA4 and keeps email first-party only', async () => {
  const { events, dbPosts, dataLayer } = installBrowserMocks()

  trackEmailSignup('/newsletter', 'newsletter', 'test@example.com')
  await flush()

  assert.equal(events.length, 1)
  assert.equal(events[0].name, 'email_signup')
  assert.equal(events[0].params.user_email, undefined)
  assert.equal(events[0].params.email, undefined)
  assert.notEqual(events[0].name, 'generate_lead')
  assert.equal(dataLayer[0]?.user_email, undefined)
  assert.equal(dbPosts[0]?.user_email, 'test@example.com')
  assert.equal(dbPosts[0]?.event_type, 'email_signup')
})

test('download fires file_download to GA4 without an email', async () => {
  const { events, dbPosts } = installBrowserMocks()

  trackDownload('ACT Matrix', '/act-matrix', 'lead@example.com')
  await flush()

  assert.equal(events[0].name, 'file_download')
  assert.equal(events[0].params.user_email, undefined)
  assert.equal(dbPosts[0]?.user_email, 'lead@example.com')
})

test('trackLead maps lead types to GA4 conversion names instead of generate_lead', () => {
  const { events } = installBrowserMocks()

  trackLead({
    event_name: 'generate_lead',
    event_category: 'lead_generation',
    lead_type: 'course_inquiry',
    source_page: '/transformation',
    user_email: 'inquiry@example.com',
  })

  assert.equal(events[0].name, 'course_inquiry')
  assert.equal(events[0].params.user_email, undefined)
})

test('trackConversion strips email keys even if a caller passes them', () => {
  const { events, dataLayer } = installBrowserMocks()

  trackConversion({
    event_name: 'button_click',
    event_category: 'engagement',
    custom_parameters: {
      user_email: 'should-not-leak@example.com',
      button_name: 'cta',
    },
  })

  assert.equal(events[0].params.user_email, undefined)
  assert.equal(events[0].params.button_name, 'cta')
  assert.equal(dataLayer[0]?.user_email, undefined)
})

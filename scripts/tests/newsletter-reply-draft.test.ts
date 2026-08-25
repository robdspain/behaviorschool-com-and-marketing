import assert from 'node:assert/strict'
import test from 'node:test'
import { newsletterReplyDraftHref } from '../../src/lib/newsletter-reply-draft'

test('builds a safe editable reply draft without sending', () => {
  const href = newsletterReplyDraftHref({
    id: 'feedback-1',
    email: 'reader@example.com',
    answer: 'Our team begins with attendance totals before asking what the student may be avoiding.',
    rating: 5,
    createdAt: Date.UTC(2026, 7, 25, 16, 0),
  }, 'School is starting. What if a student will not go?')

  assert.match(href, /^mailto:reader%40example\.com\?/)
  assert.match(decodeURIComponent(href), /Re: School is starting/)
  assert.match(decodeURIComponent(href), /Thank you for taking the time/)
  assert.match(decodeURIComponent(href), /attendance totals/)
  assert.doesNotMatch(href, /from=/i)
})

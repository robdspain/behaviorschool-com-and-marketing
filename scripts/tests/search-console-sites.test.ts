import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveSearchConsoleSiteUrls } from '../../src/lib/behavior-study-tools/search-console-sites'

test('monitors the marketing gateway and canonical study property by default', () => {
  assert.deepEqual(resolveSearchConsoleSiteUrls({}), [
    'https://behaviorstudytools.com/',
    'https://study.behaviorschool.com/',
  ])
})

test('normalizes and deduplicates legacy and multi-property configuration', () => {
  assert.deepEqual(resolveSearchConsoleSiteUrls({
    BST_GSC_SITE_URL: 'https://behaviorstudytools.com',
    BST_GSC_SITE_URLS: ' https://study.behaviorschool.com, sc-domain:behaviorschool.com,not-a-url ',
  }), [
    'https://behaviorstudytools.com/',
    'https://study.behaviorschool.com/',
    'sc-domain:behaviorschool.com',
  ])
})

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const canonicalCloudUrl = 'https://quixotic-fox-157.convex.cloud'
const canonicalSiteUrl = 'https://quixotic-fox-157.convex.site'
const netlifyConfig = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8')

const requiredEntries = [
  `NEXT_PUBLIC_CONVEX_URL = "${canonicalCloudUrl}"`,
  `NEXT_PUBLIC_CONVEX_SITE_URL = "${canonicalSiteUrl}"`,
]

for (const entry of requiredEntries) {
  if (!netlifyConfig.includes(entry)) {
    throw new Error(`Marketing Convex ownership check failed: missing ${entry}`)
  }
}

const sources = [
  'netlify.toml',
  '.env.example',
  'src/lib/convex.ts',
  'src/lib/bst-referral-campaign.ts',
]
const forbiddenReferences = [
  'third-loris-453',
  'california.bae.sig',
]

for (const relativePath of sources) {
  const contents = fs.readFileSync(path.join(root, relativePath), 'utf8').toLowerCase()
  for (const forbidden of forbiddenReferences) {
    if (contents.includes(forbidden)) {
      throw new Error(`Marketing Convex ownership check failed: ${relativePath} references ${forbidden}`)
    }
  }
}

console.log('Behavior School marketing Convex ownership configuration verified.')

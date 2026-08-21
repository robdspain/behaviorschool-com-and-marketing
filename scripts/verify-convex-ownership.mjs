import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const canonicalCloudUrl = 'https://quixotic-fox-157.convex.cloud'
const canonicalSiteUrl = 'https://quixotic-fox-157.convex.site'
const approvedConvexOrigins = new Set([
  canonicalCloudUrl,
  canonicalSiteUrl,
  'https://modest-malamute-868.convex.cloud',
  'https://modest-malamute-868.convex.site',
  'https://precious-clownfish-797.convex.cloud',
])

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const netlifyConfig = read('netlify.toml')
const exampleEnvironment = read('.env.example')
const packageJson = JSON.parse(read('package.json'))

const requiredEntries = [
  `NEXT_PUBLIC_CONVEX_URL = "${canonicalCloudUrl}"`,
  `NEXT_PUBLIC_CONVEX_SITE_URL = "${canonicalSiteUrl}"`,
]

for (const entry of requiredEntries) {
  if (!netlifyConfig.includes(entry)) {
    throw new Error(`Marketing Convex ownership check failed: missing ${entry}`)
  }
}

for (const [name, expected] of [
  ['NEXT_PUBLIC_CONVEX_URL', canonicalCloudUrl],
  ['NEXT_PUBLIC_CONVEX_SITE_URL', canonicalSiteUrl],
]) {
  const configuredValue = process.env[name]
  if (configuredValue && configuredValue !== expected) {
    throw new Error(`Marketing Convex ownership check failed: ${name} resolves to an unapproved deployment`)
  }
}

for (const entry of [
  `NEXT_PUBLIC_CONVEX_URL=${canonicalCloudUrl}`,
  `NEXT_PUBLIC_CONVEX_SITE_URL=${canonicalSiteUrl}`,
]) {
  if (!exampleEnvironment.includes(entry)) {
    throw new Error(`Marketing Convex ownership check failed: .env.example is missing ${entry}`)
  }
}

if (!packageJson.scripts?.build?.includes('convex:ownership')) {
  throw new Error('Marketing Convex ownership check failed: the production build does not run the ownership guard')
}

const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
  cwd: root,
  encoding: 'utf8',
}).split('\0').filter(Boolean)

const forbiddenReferences = [
  ['behavior', 'school', 'pro'].join('-'),
  ['california', 'bae', 'sig'].join('.'),
  ['https://third-', 'loris-453.convex.cloud'].join(''),
  ['https://third-', 'loris-453.convex.site'].join(''),
]

for (const relativePath of trackedFiles) {
  let contents
  try {
    contents = read(relativePath)
  } catch {
    continue
  }

  if (contents.includes('\0')) continue

  const normalizedContents = contents.toLowerCase()
  for (const forbidden of forbiddenReferences) {
    if (normalizedContents.includes(forbidden)) {
      throw new Error(`Marketing Convex ownership check failed: ${relativePath} references ${forbidden}`)
    }
  }

  for (const match of contents.matchAll(/https:\/\/[a-z0-9-]+\.convex\.(?:cloud|site)/gi)) {
    const origin = match[0].toLowerCase()
    if (!approvedConvexOrigins.has(origin)) {
      throw new Error(`Marketing Convex ownership check failed: ${relativePath} references unapproved origin ${origin}`)
    }
  }
}

console.log(`Behavior School marketing Convex ownership verified across ${trackedFiles.length} tracked files.`)

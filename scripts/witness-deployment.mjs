import { createHash } from 'node:crypto'
import process from 'node:process'
import {
  CANONICAL_URL,
  MANIFEST_NAME,
  parseRemoteManifest,
  witnessCacheKey
} from './deployment-manifest.mjs'

const expectedRevision = process.env.GITHUB_SHA
const expectedManifestSha256 = process.env.EXPECTED_DEPLOYMENT_MANIFEST_SHA256
const runId = process.env.GITHUB_RUN_ID
const runAttempt = process.env.GITHUB_RUN_ATTEMPT
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function fetchBytes(url) {
  const response = await fetch(url, {
    headers: { 'cache-control': 'no-cache' },
    redirect: 'error',
    signal: AbortSignal.timeout(20_000)
  })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

async function witnessOnce(poll) {
  const cacheKey = witnessCacheKey(expectedRevision, runId, runAttempt, poll)
  const manifestUrl = new URL(`${MANIFEST_NAME}?${cacheKey}`, CANONICAL_URL)
  const manifestBytes = await fetchBytes(manifestUrl)
  const manifest = parseRemoteManifest(manifestBytes, expectedManifestSha256, expectedRevision)

  const inventory = new Map(manifest.artifact.files.map((file) => [file.path, file]))
  const witnessed = new Map()
  async function witnessPath(path) {
    const expected = inventory.get(path)
    if (!expected) throw new Error(`required live artifact is absent from deployment inventory: ${path}`)
    const url = new URL(`${path}?${cacheKey}&asset=${encodeURIComponent(path)}`, CANONICAL_URL)
    const bytes = await fetchBytes(url)
    const digest = createHash('sha256').update(bytes).digest('hex')
    if (bytes.length !== expected.bytes || digest !== expected.sha256) {
      throw new Error(`live artifact byte mismatch: ${path}`)
    }
    witnessed.set(path, bytes)
    return bytes
  }

  const indexBytes = await witnessPath('index.html')
  await Promise.all(['site.webmanifest', 'sitemap.xml'].map(witnessPath))

  const indexHtml = indexBytes.toString('utf8')
  const entryAssets = new Set()
  for (const match of indexHtml.matchAll(/(?:href|src)=["']\/docs-site\/(assets\/[^"'?#]+\.(?:css|js))["']/g)) {
    entryAssets.add(match[1])
  }
  if (![...entryAssets].some((path) => path.endsWith('.js'))) {
    throw new Error('live home page references no JavaScript application asset')
  }
  if (![...entryAssets].some((path) => path.endsWith('.css'))) {
    throw new Error('live home page references no CSS application asset')
  }
  await Promise.all([...entryAssets].map(witnessPath))

  return { manifest, witnessed: witnessed.size }
}

let lastError
for (let attempt = 1; attempt <= 12; attempt++) {
  try {
    const result = await witnessOnce(attempt)
    console.log(
      `deployment-witness: VERIFIED ${result.manifest.source.revision} ` +
      `${result.witnessed} critical files root=${result.manifest.artifact.root_sha256}`
    )
    process.exit(0)
  } catch (error) {
    lastError = error
    console.error(`deployment-witness: attempt ${attempt}/12 pending: ${error.message}`)
    if (attempt < 12) await sleep(15_000)
  }
}

console.error(`deployment-witness: FAILED: ${lastError?.message ?? 'unknown error'}`)
process.exit(1)

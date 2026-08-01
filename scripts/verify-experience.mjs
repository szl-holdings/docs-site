import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import process from 'node:process'

const root = process.cwd()
const theme = join(root, 'docs', '.vitepress', 'theme', 'kanchay')
const manifestPath = join(theme, 'manifest.json')
const requiredPublic = [
  'sitemap.xml',
  'site.webmanifest'
]
const forbiddenSubpathContracts = [
  'robots.txt',
  '.well-known/security.txt',
  'examples/mcp_claude_config.json'
]
const brandRepository = 'https://github.com/szl-holdings/szl-brand'
const brandRevision = '5b43015b66f254ee08330b39adcc1acb4d0c219d'
const liveBase = 'https://holdings.a-11-oy.com/docs-site/'
const retiredPublicLocations = [
  'docs.szlholdings.com',
  'szl-holdings.github.io/docs-site',
  'http://holdings.a-11-oy.com'
]
const expectedAssets = new Map([
  ['system.css', 'kit/tokens/szl-design-system.css'],
  ['tokens.json', 'kit/tokens/COLOR_TOKENS.json'],
  ['metadata.schema.json', 'kit/contracts/public-metadata.schema.json'],
  ['vitepress.css', 'kit/adapters/vitepress.css']
])

function fail(message) {
  console.error(`experience-contract: ${message}`)
  process.exitCode = 1
}

for (const file of [...expectedAssets.keys(), 'manifest.json']) {
  const path = join(theme, file)
  if (!existsSync(path)) {
    fail(`missing pinned KANCHAY asset: ${file}`)
  } else {
    const stat = lstatSync(path)
    if (!stat.isFile() || stat.isSymbolicLink()) fail(`unsafe pinned KANCHAY asset: ${file}`)
  }
}
if (existsSync(theme)) {
  const admitted = new Set([...expectedAssets.keys(), 'manifest.json'])
  for (const entry of readdirSync(theme)) {
    if (!admitted.has(entry)) fail(`unexpected KANCHAY bundle entry: ${entry}`)
  }
}

if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (manifest.contract !== 'szl.design-system/v1') fail(`unsupported contract: ${manifest.contract}`)
  if (manifest.version !== '1.1.0') fail(`unsupported KANCHAY version: ${manifest.version}`)
  if (manifest.source?.repository !== brandRepository) fail('brand source repository is not canonical')
  if (manifest.source?.revision !== brandRevision) fail('brand source revision is not the protected release pin')
  if (manifest.integrity?.algorithm !== 'sha256') fail('brand integrity algorithm must be sha256')
  if (!Array.isArray(manifest.assets)) fail('brand manifest assets must be an array')

  const seen = new Set()
  const rootMaterial = []
  for (const asset of Array.isArray(manifest.assets) ? manifest.assets : []) {
    if (basename(asset.path ?? '') !== asset.path || !expectedAssets.has(asset.path)) {
      fail(`unsafe or unknown manifest asset: ${asset.path}`)
      continue
    }
    if (seen.has(asset.path)) {
      fail(`duplicate manifest asset: ${asset.path}`)
      continue
    }
    seen.add(asset.path)
    if (asset.source_path !== expectedAssets.get(asset.path)) {
      fail(`source path mismatch: ${asset.path}`)
    }
    const path = join(theme, asset.path)
    if (!existsSync(path)) {
      fail(`manifest asset missing: ${asset.path}`)
      continue
    }
    const bytes = readFileSync(path)
    const digest = createHash('sha256').update(bytes).digest('hex')
    if (digest !== asset.sha256) fail(`manifest hash mismatch: ${asset.path}`)
    if (bytes.length !== asset.bytes) fail(`manifest size mismatch: ${asset.path}`)
    rootMaterial.push(`${asset.path}\0${digest}\0`)
  }
  if (seen.size !== expectedAssets.size || [...expectedAssets.keys()].some((name) => !seen.has(name))) {
    fail('brand manifest asset set mismatch')
  }
  const rootDigest = createHash('sha256').update(rootMaterial.join('')).digest('hex')
  if (rootDigest !== manifest.integrity?.root) {
    fail('brand manifest root mismatch')
  }
}

const config = readFileSync(join(root, 'docs', '.vitepress', 'config.mjs'), 'utf8')
const home = readFileSync(join(root, 'docs', 'index.md'), 'utf8')
const themeIndex = readFileSync(join(root, 'docs', '.vitepress', 'theme', 'index.js'), 'utf8')
const customCss = readFileSync(join(root, 'docs', '.vitepress', 'theme', 'custom.css'), 'utf8')
const publicTruthFiles = [
  'README.md',
  'MERGED.md',
  '.github/workflows/deploy-pages.yml',
  '.github/workflows/codename-guard.yml',
  'docs/public/sitemap.xml'
]

for (const file of publicTruthFiles) {
  const content = readFileSync(join(root, file), 'utf8').toLowerCase()
  if (retiredPublicLocations.some((location) => content.includes(location))) {
    fail(`stale or insecure public documentation URL in ${file}`)
  }
}

if (/fonts\.googleapis|fonts\.gstatic/.test(config)) fail('runtime font CDN is forbidden')
if (!config.includes("base: '/docs-site/'")) fail('VitePress base is not the canonical Pages path')
if (/href: '\.\/(?:img|site\.webmanifest)/.test(config)) fail('nested-page head assets are relative')
for (const marker of ['transformHead({ page, title, description })', 'property: \'og:title\'', 'name: \'twitter:card\'']) {
  if (!config.includes(marker)) fail(`metadata marker missing: ${marker}`)
}
for (const marker of ['Investor', 'Developer', 'Evaluator', 'data-state="real">REAL', 'data-state="roadmap">ROADMAP']) {
  if (!home.includes(marker)) fail(`homepage truth/audience marker missing: ${marker}`)
}
if (!themeIndex.includes("./kanchay/vitepress.css")) fail('KANCHAY adapter is not wired into VitePress')
for (const marker of [':root:not(.dark)', '--text: var(--color-gray-900)', '--link: var(--color-yuyay-700)']) {
  if (!customCss.includes(marker)) fail(`light appearance token binding missing: ${marker}`)
}
for (const marker of ['button.VPSwitchAppearance', "setAttribute('aria-label'", "setAttribute('role', 'main'"]) {
  if (!themeIndex.includes(marker)) fail(`accessible chrome marker missing: ${marker}`)
}

for (const file of requiredPublic) {
  if (!existsSync(join(root, 'docs', 'public', file))) fail(`public contract missing: ${file}`)
}
for (const file of forbiddenSubpathContracts) {
  if (existsSync(join(root, 'docs', 'public', file))) {
    fail(`subpath bundle must not claim an origin-wide or unavailable contract: ${file}`)
  }
}

if (process.argv.includes('--dist')) {
  const dist = join(root, 'docs', '.vitepress', 'dist')
  if (!existsSync(dist)) {
    fail('built output directory is missing')
  } else {
    for (const file of ['index.html', ...requiredPublic]) {
      if (!existsSync(join(dist, file))) fail(`built output missing: ${file}`)
    }
    for (const file of forbiddenSubpathContracts) {
      if (existsSync(join(dist, file))) fail(`built output contains a forbidden subpath contract: ${file}`)
    }
    if (!existsSync(join(dist, 'img', 'szl-docs-social.png'))) fail('built social preview is missing')
    const builtHomePath = join(dist, 'index.html')
    if (existsSync(builtHomePath)) {
      const builtHome = readFileSync(builtHomePath, 'utf8')
      if (!builtHome.includes('Governed AI that can show its work')) fail('built homepage is stale')
      if (/fonts\.googleapis|fonts\.gstatic/.test(builtHome)) fail('built homepage contains a runtime font CDN')
      const canonicalHref = builtHome.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>/)?.[1]
      let canonicalUrl
      try {
        canonicalUrl = new URL(canonicalHref)
      } catch {
        fail('built homepage canonical URL is missing or malformed')
      }
      if (canonicalUrl?.href !== liveBase) fail('built homepage canonical URL is stale')
      if (!builtHome.includes('aria-label="Toggle color theme"')) fail('built appearance controls lack accessible names')
      if (!builtHome.includes('role="main"') || !builtHome.includes('aria-label="Primary content"')) {
        fail('built homepage lacks a primary-content landmark')
      }
    }
  }
}

if (!process.exitCode) console.log('experience-contract: OK')

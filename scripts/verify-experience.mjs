import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import process from 'node:process'

const root = process.cwd()
const readme = readFileSync(join(root, 'README.md'), 'utf8')
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
const forbiddenSourceContracts = [
  'developers/EXAMPLES/mcp_claude_config.json'
]
const forbiddenMcpClientMarkers = [
  'mcp-remote',
  '"mcpServers"'
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

function collectDocumentationSources(directory, relative = '') {
  const sources = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryRelative = relative ? `${relative}/${entry.name}` : entry.name
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (entryRelative === '.vitepress/cache' || entryRelative === '.vitepress/dist') continue
      sources.push(...collectDocumentationSources(entryPath, entryRelative))
      continue
    }
    if (!entry.isFile()) continue
    if (/\.(?:css|html?|js|json|md|mjs|txt|ya?ml)$/i.test(entry.name)) {
      sources.push({ path: entryPath, relative: entryRelative })
    }
  }
  return sources
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
const mcpIntegration = readFileSync(join(root, 'docs', 'developers', 'mcp_integration.md'), 'utf8')
const apiReference = readFileSync(join(root, 'docs', 'developers', 'api_reference.md'), 'utf8')
const quickstart = readFileSync(join(root, 'docs', 'developers', 'quickstart.md'), 'utf8')
const developerHub = readFileSync(join(root, 'docs', 'developers', 'index.md'), 'utf8')
const compliancePage = readFileSync(join(root, 'docs', 'compliance.md'), 'utf8')
const statusPage = readFileSync(join(root, 'docs', 'status.md'), 'utf8')
const pagesWorkflow = readFileSync(join(root, '.github', 'workflows', 'deploy-pages.yml'), 'utf8')
const udsPage = readFileSync(join(root, 'docs', 'uds', 'index.md'), 'utf8')
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
if (/^\s*mpa:\s*true/m.test(config)) fail('VitePress static mpa mode must remain disabled for interactive docs')
for (const staleMarker of ["mpa: true", "MPA loses VitePress's instant in-page SPA navigation"]) {
  if (readme.includes(staleMarker)) fail(`README retains the retired non-interactive architecture: ${staleMarker}`)
}
for (const marker of [
  'npm run deployment:write',
  'npm run deployment:verify',
  'node scripts/witness-deployment.mjs',
  'pages: write',
  'id-token: write'
]) {
  if (!pagesWorkflow.includes(marker)) fail(`Pages source-binding step missing: ${marker}`)
}
for (const marker of ['deployment.json', 'exact protected', 'SHA-256 inventory/root digest']) {
  if (!statusPage.includes(marker)) fail(`public deployment-evidence explanation missing: ${marker}`)
}
for (const marker of ['Observed at **', 'Provider state', 'Evidence state', '**UNAVAILABLE**']) {
  if (!statusPage.includes(marker)) fail(`public runtime observation marker missing: ${marker}`)
}
for (const staleMarker of [
  'Two flagships ship today and expose live',
  'runtime ready, receipt chain verified, signer configured',
  'same-origin `/mcp/` endpoints returned successful public'
]) {
  if (statusPage.includes(staleMarker)) fail(`status page retains a stale live-runtime claim: ${staleMarker}`)
}
if (/href: '\.\/(?:img|site\.webmanifest)/.test(config)) fail('nested-page head assets are relative')
for (const marker of ['transformHead({ page, title, description })', 'property: \'og:title\'', 'name: \'twitter:card\'']) {
  if (!config.includes(marker)) fail(`metadata marker missing: ${marker}`)
}
for (const marker of ['Investor', 'Developer', 'Evaluator', 'data-state="real">REAL', 'data-state="roadmap">ROADMAP']) {
  if (!home.includes(marker)) fail(`homepage truth/audience marker missing: ${marker}`)
}
for (const marker of [
  '/api/a11oy/v1/mcp/tools',
  '/api/a11oy/v1/mcp/call',
  'https://szlholdings-a11oy.hf.space/mcp/',
  'https://szlholdings-killinchu.hf.space/mcp/',
  'a11oy and killinchu native MCP — protocol witnessed',
  'successful JSON-RPC',
  'Hatun-MCP — runtime ready, authentication required',
  'RUNTIME READY · AUTH REQUIRED · CLIENT SESSION NOT WITNESSED',
  'No drop-in Claude Desktop or Cursor configuration is published yet',
  'No generic bridge command is asserted here'
]) {
  if (!mcpIntegration.includes(marker)) fail(`MCP truth-boundary marker missing: ${marker}`)
}
for (const forbidden of forbiddenMcpClientMarkers) {
  if (mcpIntegration.includes(forbidden)) fail(`unavailable MCP client configuration is published: ${forbidden}`)
}
for (const [file, content] of [['docs/status.md', statusPage], ['docs/uds/index.md', udsPage]]) {
  for (const marker of ['server-card.json', 'API-key authentication', 'authenticated client session']) {
    if (!content.toLowerCase().includes(marker.toLowerCase())) {
      fail(`Hatun evidence marker missing from ${file}: ${marker}`)
    }
  }
  for (const staleClaim of ['23 static tools', '16 governed tools', 'Re-deploying']) {
    if (content.includes(staleClaim)) fail(`stale Hatun claim in ${file}: ${staleClaim}`)
  }
}
for (const [file, content] of [
  ['docs/developers/api_reference.md', apiReference],
  ['docs/developers/quickstart.md', quickstart]
]) {
  for (const marker of ['same-origin', '/mcp/', 'MCP integration']) {
    if (!content.includes(marker)) fail(`native MCP evidence marker missing from ${file}: ${marker}`)
  }
  for (const staleClaim of ['roadmap, not live', 'returns **HTTP 405**', 'HTML landing page', 'JSON-RPC `/mcp/` transport is roadmap']) {
    if (content.includes(staleClaim)) fail(`stale native MCP claim in ${file}: ${staleClaim}`)
  }
}
if (!developerHub.includes('target client completes a witnessed session')) {
  fail('developer hub does not bind client configuration to a witnessed session')
}
for (const staleClaim of ['until the live transport accepts JSON-RPC', "fleet's only spec-compliant"]) {
  if (developerHub.includes(staleClaim)) fail(`stale MCP claim in docs/developers/index.md: ${staleClaim}`)
}
for (const staleUdsClaim of ['Coming Soon — June 16, 2026', 'goes live on June 16', 'it opens June 16, 2026']) {
  if (udsPage.includes(staleUdsClaim)) fail(`stale UDS launch claim: ${staleUdsClaim}`)
}
if (!themeIndex.includes("./kanchay/vitepress.css")) fail('KANCHAY adapter is not wired into VitePress')
for (const marker of [':root:not(.dark)', '--text: var(--color-gray-900)', '--link: var(--color-yuyay-700)']) {
  if (!customCss.includes(marker)) fail(`light appearance token binding missing: ${marker}`)
}
for (const marker of [
  '.dot {',
  'inline-size: .65rem',
  'block-size: .65rem',
  'border-radius: var(--radius-full)',
  'background: currentColor',
  '.dot.green',
  '.dot.amber',
  '.dot.gray'
]) {
  if (!customCss.includes(marker)) fail(`status-indicator style missing: ${marker}`)
}
const statusIndicators = [...compliancePage.matchAll(/<span\b[^>]*>/g)]
  .map((match) => match[0])
  .filter((tag) => /\bclass=(['"])dot (?:green|amber|gray)\1/.test(tag))
for (const state of ['green', 'amber', 'gray']) {
  const stateIndicators = statusIndicators.filter((tag) => {
    const classValue = tag.match(/\bclass=(['"])([^'"]*)\1/)?.[2] ?? ''
    return classValue.split(/\s+/).includes('dot') && classValue.split(/\s+/).includes(state)
  })
  if (stateIndicators.length === 0) {
    fail(`accessible compliance status indicator missing: ${state}`)
  }
  if (stateIndicators.some((tag) => !/\baria-hidden=(['"])true\1/.test(tag))) {
    fail(`compliance status indicator is exposed to assistive technology: ${state}`)
  }
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
for (const file of forbiddenSourceContracts) {
  if (existsSync(join(root, 'docs', file))) {
    fail(`documentation source publishes an unavailable client contract: ${file}`)
  }
}

for (const source of collectDocumentationSources(join(root, 'docs'))) {
  const content = readFileSync(source.path, 'utf8')
  for (const marker of forbiddenMcpClientMarkers) {
    if (content.includes(marker)) {
      fail(`unavailable MCP client configuration marker ${marker} in docs/${source.relative}`)
    }
  }
}

if (process.argv.includes('--dist')) {
  const dist = join(root, 'docs', '.vitepress', 'dist')
  if (!existsSync(dist)) {
    fail('built output directory is missing')
  } else {
    const assetDir = join(dist, 'assets')
    if (!existsSync(assetDir)) fail('built assets directory is missing')
    const assetFiles = readdirSync(assetDir).filter((name) => /\.(?:css|js|mjs)$/.test(name)).map((name) => name.toLowerCase())
    if (!assetFiles.some((name) => name.endsWith('.js'))) fail('built output missing JS assets')
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
      const hasModuleBootstrap = /<script[^>]*type=["']module["'][^>]*src=["'][^"']+\.js["'][^>]*>/i.test(builtHome)
      if (!hasModuleBootstrap) fail('built homepage misses module bootstrap script')
    }
  }
}

if (!process.exitCode) console.log('experience-contract: OK')

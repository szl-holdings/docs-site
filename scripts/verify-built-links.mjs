import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'

const root = resolve('docs/.vitepress/dist')
const liveOrigin = 'https://holdings.a-11-oy.com'
const basePath = '/docs-site/'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, out)
    else out.push(path)
  }
  return out
}

if (!existsSync(root)) {
  console.error('built-link-contract: built output directory is missing')
  process.exit(1)
}

const files = walk(root)
const htmlFiles = files.filter((path) => path.endsWith('.html'))
const missing = []
let checked = 0

for (const file of htmlFiles) {
  const rel = relative(root, file).replaceAll('\\', '/')
  const pageUrl = new URL(`${basePath}${rel}`, liveOrigin)
  const html = readFileSync(file, 'utf8')
  const nativeMainCount = [...html.matchAll(/<main\b/g)].length
  const roleMainCount = [...html.matchAll(/\srole="main"/g)].length
  const primaryLabelCount = [...html.matchAll(/aria-label="Primary content"/g)].length
  if (nativeMainCount + roleMainCount !== 1 || primaryLabelCount !== 1) {
    missing.push(`${rel} -> expected exactly one labeled primary-content landmark`)
  }
  if (rel !== '404.html') {
    const documentTitle = html.match(/<title>([^<]+)<\/title>/)?.[1]
    const openGraphTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)">/)?.[1]
    const twitterTitle = html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)">/)?.[1]
    if (!documentTitle || openGraphTitle !== documentTitle || twitterTitle !== documentTitle) {
      missing.push(`${rel} -> page-specific social title mismatch`)
    }
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1]
    if (/^(?:mailto:|tel:|data:|javascript:|#)/i.test(raw)) continue

    let url
    try {
      url = new URL(raw, pageUrl)
    } catch {
      missing.push(`${rel} -> malformed URL ${raw}`)
      continue
    }
    if (url.origin !== liveOrigin) continue
    checked++
    if (!url.pathname.startsWith(basePath)) {
      missing.push(`${rel} -> outside canonical base ${raw}`)
      continue
    }

    let target = join(root, decodeURIComponent(url.pathname.slice(basePath.length)))
    if (url.pathname.endsWith('/')) target = join(target, 'index.html')
    if (!existsSync(target)) missing.push(`${rel} -> ${raw}`)
  }
}

if (missing.length) {
  console.error(`built-link-contract: ${missing.length} broken local reference(s)\n${missing.join('\n')}`)
  process.exit(1)
}

console.log(`built-link-contract: OK (${htmlFiles.length} HTML files, ${checked} local references)`)

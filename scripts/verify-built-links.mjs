import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
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

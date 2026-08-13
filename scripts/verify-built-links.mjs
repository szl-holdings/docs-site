import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { decodeHtmlCharacterReferences, parseHtmlAttributes, tokenizeHtmlTags } from './html-security.mjs'

export const LIVE_ORIGIN = 'https://holdings.a-11-oy.com'
export const BASE_PATH = '/docs-site/'
const ALLOWED_HREF_SCHEMES = new Set(['https:', 'mailto:', 'tel:'])
const ALLOWED_SRC_SCHEMES = new Set(['https:'])
const SAFE_DATA_IMAGE = /^data:image\/(?:png|jpeg|gif|webp);base64,[a-z0-9+/=]+$/i
const SECURITY_ATTRIBUTES = new Set(['href', 'src', 'target', 'rel', 'action', 'formaction', 'data', 'poster', 'srcset', 'srcdoc'])
const FORBIDDEN_ACTIVE_ELEMENTS = new Set(['base', 'object', 'embed'])
const FORBIDDEN_ACTIVE_ATTRIBUTES = new Set(['action', 'formaction', 'poster', 'srcset', 'srcdoc'])
const EXTERNAL_ACTIVE_SRC_ELEMENTS = new Set(['script', 'iframe'])
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
const REQUIRED_SITEMAP_PATHS = new Set([
  '/docs-site/',
  '/docs-site/investors/',
  '/docs-site/investors/diligence.html',
  '/docs-site/developers/',
  '/docs-site/status.html',
  '/docs-site/compliance.html',
  '/docs-site/proof.html'
])

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, out)
    else out.push(path)
  }
  return out
}

function attributeMetadata(source) {
  const result = new Map()
  for (const attribute of parseHtmlAttributes(source)) {
    const name = attribute.name
    if (name === '/') continue
    result.set(name, {
      value: attribute.value,
      raw: attribute.rawValue ?? attribute.value,
      hasUnresolvedCharacterReference: Boolean(attribute.hasUnresolvedCharacterReference)
    })
  }
  return result
}

function attributes(source) {
  const result = new Map()
  for (const [name, metadata] of attributeMetadata(source).entries()) {
    result.set(name, metadata.value)
  }
  return result
}

function assertResolvedCharacterReferences(rel, name, metadata) {
  if (!metadata) return
  if (metadata.hasUnresolvedCharacterReference) {
    return `${rel} -> unresolved character reference in ${name}="${metadata.raw}"`
  }
  return undefined
}

function duplicateSecurityAttributes(source) {
  const seen = new Set()
  const duplicates = new Set()
  for (const attribute of parseHtmlAttributes(source)) {
    const name = attribute.name
    if (!SECURITY_ATTRIBUTES.has(name)) continue
    if (seen.has(name)) duplicates.add(name)
    seen.add(name)
  }
  return [...duplicates]
}

function isSelfClosing(tag) {
  return VOID_ELEMENTS.has(tag.name) || /\/\s*$/.test(tag.attributes)
}

function matchingEndTokenIndex(tags, startIndex) {
  const start = tags[startIndex]
  if (!start || start.closing || isSelfClosing(start)) return startIndex
  let depth = 1
  for (let index = startIndex + 1; index < tags.length; index++) {
    const tag = tags[index]
    if (tag.name !== start.name) continue
    if (tag.closing) depth--
    else if (!isSelfClosing(tag)) depth++
    if (depth === 0) return index
  }
  return -1
}

function elementInnerHtml(html, tags, startIndex) {
  const endIndex = matchingEndTokenIndex(tags, startIndex)
  if (endIndex <= startIndex) return ''
  return html.slice(tags[startIndex].end, tags[endIndex].start)
}

function textContent(html) {
  const tags = tokenizeHtmlTags(html)
  let cursor = 0
  let visible = ''
  for (let index = 0; index < tags.length; index++) {
    const tag = tags[index]
    if (tag.start < cursor) continue
    visible += html.slice(cursor, tag.start)
    if (!tag.closing && attributes(tag.attributes).get('aria-hidden')?.trim().toLowerCase() === 'true') {
      const endIndex = matchingEndTokenIndex(tags, index)
      if (endIndex > index) {
        cursor = tags[endIndex].end
        index = endIndex
        continue
      }
    }
    cursor = tag.end
  }
  visible += html.slice(cursor)
  return decodeHtmlCharacterReferences(visible.replace(/<!--[\s\S]*?-->/g, ' ')).value
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeTitleText(html) {
  return decodeHtmlCharacterReferences(html).value
    .replace(/\s+/g, ' ')
    .trim()
}

function labelledElementHasText(html, id, tags) {
  for (let index = 0; index < tags.length; index++) {
    const tag = tags[index]
    if (tag.closing || attributes(tag.attributes).get('id') !== id) continue
    return Boolean(textContent(elementInnerHtml(html, tags, index)))
  }
  return false
}

function anchorHasAccessibleName(attributesSource, innerHtml, html, ids, tags) {
  const attrs = attributes(attributesSource)
  if (attrs.get('aria-label')?.trim()) return true
  const labelledBy = attrs.get('aria-labelledby')?.trim().split(/\s+/).filter(Boolean) ?? []
  if (labelledBy.length && labelledBy.every((id) => ids.has(id) && labelledElementHasText(html, id, tags))) return true
  if (textContent(innerHtml)) return true
  for (const image of tokenizeHtmlTags(innerHtml)) {
    if (image.closing || image.name !== 'img') continue
    const imageAttrs = attributes(image.attributes)
    const imageRole = imageAttrs.get('role')?.trim().toLowerCase()
    if (imageAttrs.get('aria-hidden')?.trim().toLowerCase() === 'true'
      || imageAttrs.has('hidden')
      || imageAttrs.has('inert')
      || imageRole === 'none'
      || imageRole === 'presentation') continue
    if (imageAttrs.get('alt')?.trim()) return true
  }
  return false
}

function isAllowedScheme(element, attribute, raw, protocol) {
  if (attribute === 'href') return ALLOWED_HREF_SCHEMES.has(protocol)
  if (protocol === 'data:') return element === 'img' && SAFE_DATA_IMAGE.test(raw)
  return ALLOWED_SRC_SCHEMES.has(protocol)
}

function documentIds(tags) {
  const ids = new Set()
  const duplicates = []
  for (const tag of tags) {
    if (tag.closing) continue
    const id = attributes(tag.attributes).get('id')
    if (!id) continue
    if (ids.has(id)) duplicates.push(id)
    ids.add(id)
  }
  return { ids, duplicates }
}

function fragmentFrom(url) {
  if (!url.hash || url.hash === '#') return null
  try {
    return decodeURIComponent(url.hash.slice(1))
  } catch {
    return undefined
  }
}

function targetFor(url, root) {
  if (!url.pathname.startsWith(BASE_PATH)) return null
  try {
    const encoded = url.pathname.slice(BASE_PATH.length)
    if (/%(?:2f|5c)/i.test(encoded)) return undefined
    const decoded = decodeURIComponent(encoded)
    const target = resolve(root, decoded)
    const rel = relative(root, target)
    if (isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`)) return undefined
    return target
  } catch {
    return undefined
  }
}

function htmlTargetFor(url, root) {
  const target = targetFor(url, root)
  if (target === undefined) return undefined
  if (target === null) return null
  return url.pathname.endsWith('/') ? join(target, 'index.html') : target
}

function validateDocumentChrome(rel, html, tags, issues) {
  const startTags = tags.filter((tag) => !tag.closing)
  const nativeMainCount = startTags.filter((tag) => tag.name === 'main').length
  const roleMainCount = startTags.filter((tag) => attributes(tag.attributes).get('role')?.toLowerCase() === 'main').length
  const primaryLabelCount = startTags.filter((tag) => attributes(tag.attributes).get('aria-label') === 'Primary content').length
  if (nativeMainCount + roleMainCount !== 1 || primaryLabelCount !== 1) {
    issues.push(`${rel} -> expected exactly one labeled primary-content landmark`)
  }

  if (rel !== '404.html') {
    const titleIndex = tags.findIndex((tag) => !tag.closing && tag.name === 'title')
    const documentTitle = titleIndex === -1 ? undefined : normalizeTitleText(elementInnerHtml(html, tags, titleIndex))
    const openGraphTitle = startTags
      .filter((tag) => tag.name === 'meta')
      .map((tag) => attributes(tag.attributes))
      .find((attrs) => attrs.get('property') === 'og:title')?.get('content')
    const twitterTitle = startTags
      .filter((tag) => tag.name === 'meta')
      .map((tag) => attributes(tag.attributes))
      .find((attrs) => attrs.get('name') === 'twitter:title')?.get('content')
    if (!documentTitle || openGraphTitle !== documentTitle || twitterTitle !== documentTitle) {
      issues.push(`${rel} -> page-specific social title mismatch`)
    }
    const headingLevels = startTags
      .filter((tag) => /^h[1-6]$/.test(tag.name))
      .map((tag) => Number(tag.name.slice(1)))
    if (headingLevels.filter((level) => level === 1).length !== 1) {
      issues.push(`${rel} -> expected exactly one h1`)
    }
    for (let index = 1; index < headingLevels.length; index++) {
      if (headingLevels[index] > headingLevels[index - 1] + 1) {
        issues.push(`${rel} -> heading level skips h${headingLevels[index - 1]} to h${headingLevels[index]}`)
      }
    }
  }
}

function validateSitemap(root, issues, required) {
  const sitemap = join(root, 'sitemap.xml')
  if (!existsSync(sitemap)) {
    if (required) issues.push('sitemap.xml -> missing generated discovery contract')
    return
  }
  const xml = readFileSync(sitemap, 'utf8')
  const paths = new Set()
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    let url
    try {
      url = new URL(match[1])
    } catch {
      issues.push(`sitemap.xml -> malformed URL ${match[1]}`)
      continue
    }
    if (url.origin !== LIVE_ORIGIN || !url.pathname.startsWith(BASE_PATH)) {
      issues.push(`sitemap.xml -> outside canonical origin/base ${match[1]}`)
      continue
    }
    paths.add(url.pathname)
    const target = htmlTargetFor(url, root)
    if (!target || !existsSync(target)) issues.push(`sitemap.xml -> missing built route ${url.pathname}`)
  }
  for (const path of REQUIRED_SITEMAP_PATHS) {
    if (!paths.has(path)) issues.push(`sitemap.xml -> missing required route ${path}`)
  }
}

/**
 * Deterministically validate the generated Pages artifact. This is intentionally
 * offline: external links are checked for safe syntax and names, never crawled.
 */
export function collectBuiltLinkIssues(rootPath = resolve('docs/.vitepress/dist'), options = {}) {
  const root = resolve(rootPath)
  const requireSitemap = options.requireSitemap ?? true
  if (!existsSync(root)) return { issues: ['built output directory is missing'], htmlFiles: 0, checked: 0 }

  const files = walk(root)
  const htmlFiles = files.filter((path) => path.endsWith('.html'))
  const documents = new Map()
  const documentTags = new Map()
  const issues = []
  let checked = 0

  validateSitemap(root, issues, requireSitemap)

  for (const file of htmlFiles) {
    const rel = relative(root, file).replaceAll('\\', '/')
    const html = readFileSync(file, 'utf8')
  const tags = tokenizeHtmlTags(html)
  const ids = documentIds(tags)
    documents.set(file, ids.ids)
    documentTags.set(file, tags)
    for (const id of ids.duplicates) issues.push(`${rel} -> duplicate id ${id}`)
    validateDocumentChrome(rel, html, tags, issues)

  }

  // Collect every document identity before resolving links, so a forward link
  // to a later file is checked against the same complete ID index.
  for (const file of htmlFiles) {
    const rel = relative(root, file).replaceAll('\\', '/')
    const html = readFileSync(file, 'utf8')
    const tags = documentTags.get(file)
    for (const tag of tags) {
      if (tag.closing) continue
      const attrs = attributeMetadata(tag.attributes)
      const target = attrs.get('target')?.value ?? ''
      for (const name of duplicateSecurityAttributes(tag.attributes)) {
        issues.push(`${rel} -> duplicate security attribute ${name}`)
      }
      if (target.toLowerCase() === '_blank') {
        const relTokens = new Set((attrs.get('rel')?.value ?? '').toLowerCase().split(/\s+/).filter(Boolean))
        if (!relTokens.has('noopener') || !relTokens.has('noreferrer')) {
          issues.push(`${rel} -> target=_blank lacks rel=noopener noreferrer`)
        }
      }
    }

    const pageUrl = new URL(`${BASE_PATH}${rel}`, LIVE_ORIGIN)
    for (let index = 0; index < tags.length; index++) {
      const anchor = tags[index]
      if (anchor.closing || anchor.name !== 'a') continue
      const attrs = attributeMetadata(anchor.attributes)
      const href = attrs.get('href')
      if (!href) continue
      if (attrs.get('aria-hidden')?.value?.toLowerCase() === 'true') continue
      const hrefReferenceIssue = assertResolvedCharacterReferences(rel, 'href', href)
      if (hrefReferenceIssue) {
        issues.push(hrefReferenceIssue)
      }
      let url
      try {
        const candidate = href.value
        url = new URL(candidate, pageUrl)
      } catch {
        issues.push(`${rel} -> malformed URL ${href.raw}`)
        continue
      }
      if (url.origin !== LIVE_ORIGIN
        && !anchorHasAccessibleName(anchor.attributes, elementInnerHtml(html, tags, index), html, documents.get(file), tags)) {
        issues.push(`${rel} -> external link has no accessible name ${href.raw}`)
      }
    }

    for (const tag of tags) {
      if (tag.closing) continue
      const element = tag.name
      const attrs = attributeMetadata(tag.attributes)
      if (FORBIDDEN_ACTIVE_ELEMENTS.has(element)) issues.push(`${rel} -> forbidden active element ${element}`)
      if (element === 'meta' && attrs.get('http-equiv')?.value?.trim().toLowerCase() === 'refresh') {
        issues.push(`${rel} -> forbidden active meta refresh`)
      }
      for (const name of FORBIDDEN_ACTIVE_ATTRIBUTES) {
        if (attrs.has(name)) issues.push(`${rel} -> forbidden active URL attribute ${name}`)
      }
      for (const name of ['href', 'src']) {
        const raw = attrs.get(name)
        if (!raw) continue
        const rawIssue = assertResolvedCharacterReferences(rel, name, raw)
        if (rawIssue) issues.push(rawIssue)
        const targetValue = raw.value
        if (/^javascript:/i.test(targetValue)) {
          issues.push(`${rel} -> forbidden javascript URL ${raw.raw}`)
          continue
        }
        let url
        try {
          url = new URL(targetValue, pageUrl)
        } catch {
          issues.push(`${rel} -> malformed URL ${raw.raw}`)
          continue
        }
        if (!isAllowedScheme(element, name, targetValue, url.protocol)) {
          issues.push(`${rel} -> forbidden URL scheme ${url.protocol} in ${targetValue}`)
          continue
        }
        if (name === 'src' && EXTERNAL_ACTIVE_SRC_ELEMENTS.has(element) && url.origin !== LIVE_ORIGIN) {
          issues.push(`${rel} -> external active source is forbidden for ${element}`)
          continue
        }
        if (url.protocol !== 'https:' || url.origin !== LIVE_ORIGIN) continue
        checked++
        if (!url.pathname.startsWith(BASE_PATH)) {
          issues.push(`${rel} -> outside canonical base ${raw.raw}`)
          continue
        }
        const target = htmlTargetFor(url, root)
        if (target === undefined) {
          issues.push(`${rel} -> malformed URL pathname ${raw.raw}`)
          continue
        }
        if (!target || !existsSync(target)) {
          issues.push(`${rel} -> ${raw.raw}`)
          continue
        }
        const fragment = fragmentFrom(url)
        if (fragment === undefined) {
          issues.push(`${rel} -> malformed URL fragment ${raw.raw}`)
        } else if (fragment && target.endsWith('.html') && !documents.get(target)?.has(fragment)) {
          issues.push(`${rel} -> missing fragment #${fragment} in ${relative(root, target).replaceAll('\\', '/')}`)
        }
      }
    }
  }
  return { issues, htmlFiles: htmlFiles.length, checked }
}

export function verifyBuiltLinks(rootPath = resolve('docs/.vitepress/dist'), options = {}) {
  const result = collectBuiltLinkIssues(rootPath, options)
  if (result.issues.length) {
    throw new Error(`${result.issues.length} broken local reference(s)\n${result.issues.join('\n')}`)
  }
  return result
}

const invokedPath = process.argv[1] ? fileURLToPath(import.meta.url) : ''
if (process.argv[1] && resolve(process.argv[1]) === resolve(invokedPath)) {
  try {
    const result = verifyBuiltLinks()
    console.log(`built-link-contract: OK (${result.htmlFiles} HTML files, ${result.checked} local references)`)
  } catch (error) {
    console.error(`built-link-contract: ${error.message}`)
    process.exitCode = 1
  }
}

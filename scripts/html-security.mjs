/**
 * Tokenize HTML element tags without treating a `>` inside a quoted attribute
 * value as the end of the tag. This is intentionally a small, deterministic
 * tokenizer for generated HTML contracts, not an HTML tree builder.
 */
export function tokenizeHtmlTags(html) {
  const tags = []
  let index = 0

  while (index < html.length) {
    const start = html.indexOf('<', index)
    if (start === -1) break
    if (html.startsWith('<!--', start)) {
      const commentEnd = html.indexOf('-->', start + 4)
      index = commentEnd === -1 ? html.length : commentEnd + 3
      continue
    }

    let cursor = start + 1
    let closing = false
    if (html[cursor] === '/') {
      closing = true
      cursor++
    }
    while (/\s/.test(html[cursor] ?? '')) cursor++
    const nameStart = cursor
    if (!/[A-Za-z]/.test(html[cursor] ?? '')) {
      index = start + 1
      continue
    }
    cursor++
    while (/[A-Za-z0-9:_-]/.test(html[cursor] ?? '')) cursor++
    const nameEnd = cursor

    let quote = null
    let end = -1
    for (; cursor < html.length; cursor++) {
      const character = html[cursor]
      if (quote) {
        if (character === quote) quote = null
      } else if (character === '"' || character === "'") {
        quote = character
      } else if (character === '>') {
        end = cursor + 1
        break
      } else if (character === '<') {
        break
      }
    }
    if (end === -1) {
      index = start + 1
      continue
    }

    tags.push({
      start,
      end,
      closing,
      name: html.slice(nameStart, nameEnd).toLowerCase(),
      prefix: html.slice(start, nameEnd),
      attributes: closing ? '' : html.slice(nameEnd, end - 1),
      raw: html.slice(start, end)
    })
    index = end
  }

  return tags
}

/** Parse attributes after quote-aware tag boundaries have been established. */
const HTML_ENTITY_MAP = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  quot: '"',
  nbsp: ' ',
  copy: '\u00a9',
  reg: '\u00ae',
  trade: '\u2122'
}

function decodeHtmlCharacterReferences(value) {
  let hasUnresolvedCharacterReference = false
  const decoded = value.replaceAll(/&(?:#([0-9]+)|#x([0-9a-fA-F]+)|([a-zA-Z0-9]+));/g, (match, decimal, hex, named) => {
    if (decimal != null) {
      const codePoint = Number.parseInt(decimal, 10)
      if (!Number.isNaN(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff) return String.fromCodePoint(codePoint)
      hasUnresolvedCharacterReference = true
      return match
    }
    if (hex != null) {
      const codePoint = Number.parseInt(hex, 16)
      if (!Number.isNaN(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff) return String.fromCodePoint(codePoint)
      hasUnresolvedCharacterReference = true
      return match
    }
    if (named == null) return match
    const resolved = HTML_ENTITY_MAP[named.toLowerCase()]
    if (resolved == null) {
      hasUnresolvedCharacterReference = true
      return match
    }
    return resolved
  })
  return { value: decoded, hasUnresolvedCharacterReference }
}

export function parseHtmlAttributes(source) {
  const parsed = []
  const matcher = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  for (const match of source.matchAll(matcher)) {
    const raw = match[2] ?? match[3] ?? match[4] ?? ''
    const { value, hasUnresolvedCharacterReference } = decodeHtmlCharacterReferences(raw)
    parsed.push({
      start: match.index,
      end: match.index + match[0].length,
      name: match[1].toLowerCase(),
      value,
      rawValue: raw,
      hasUnresolvedCharacterReference
    })
  }
  return parsed
}

function removeParsedAttributes(source, parsed, name) {
  let cursor = 0
  let output = ''
  for (const attribute of parsed) {
    if (attribute.name !== name) continue
    output += source.slice(cursor, attribute.start)
    cursor = attribute.end
  }
  return output + source.slice(cursor)
}

/** Normalize every target=_blank anchor to one unambiguous safe rel attribute. */
export function normalizeNewWindowRelationships(html) {
  let links = 0
  let cursor = 0
  let normalized = ''
  for (const tag of tokenizeHtmlTags(html)) {
    if (tag.closing || tag.name !== 'a') continue
    const parsed = parseHtmlAttributes(tag.attributes)
    const targets = parsed
      .filter((attribute) => attribute.name === 'target')
      .map((attribute) => attribute.value.toLowerCase())
    if (!targets.includes('_blank')) continue

    const tokens = new Set(parsed
      .filter((attribute) => attribute.name === 'rel')
      .flatMap((attribute) => attribute.value.toLowerCase().split(/\s+/).filter(Boolean)))
    tokens.delete('opener')
    tokens.add('noopener')
    tokens.add('noreferrer')

    const withoutRel = removeParsedAttributes(tag.attributes, parsed, 'rel')
    const selfClosing = /\/\s*$/.test(withoutRel)
    const attributeBody = selfClosing ? withoutRel.replace(/\/\s*$/, '').trimEnd() : withoutRel.trimEnd()
    const replacement = `${tag.prefix}${attributeBody} rel="${[...tokens].sort().join(' ')}"${selfClosing ? ' /' : ''}>`
    normalized += html.slice(cursor, tag.start) + replacement
    cursor = tag.end
    links++
  }
  return { html: normalized + html.slice(cursor), links }
}

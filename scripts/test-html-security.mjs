import assert from 'node:assert/strict'
import test from 'node:test'
import {
  decodeHtmlCharacterReferences,
  normalizeNewWindowRelationships,
  parseHtmlAttributes
} from './html-security.mjs'

test('normalizes mixed-case, single-quoted, unquoted, and duplicate rel attributes', () => {
  const source = `<a target='_blank' REL='opener external' rel=noopener href="https://example.test">Example</a>`
  const result = normalizeNewWindowRelationships(source)
  assert.equal(result.links, 1)
  assert.equal((result.html.match(/\srel=/gi) ?? []).length, 1)
  assert.match(result.html, /rel="external noopener noreferrer"/)
  assert.doesNotMatch(result.html, /\bopener\b/)
})

test('does not mutate anchors without a blank browsing context', () => {
  const source = `<a href="/docs-site/">Home</a>`
  assert.equal(normalizeNewWindowRelationships(source).html, source)
})

test('normalizes attributes after a greater-than sign inside a quoted value', () => {
  const source = `<a title=">" target="_blank" href="https://example.test">Example</a>`
  const result = normalizeNewWindowRelationships(source)
  assert.equal(result.links, 1)
  assert.equal(result.html, `<a title=">" target="_blank" href="https://example.test" rel="noopener noreferrer">Example</a>`)
})

test('normalizes entity-encoded blank targets', () => {
  const source = `<a title=">" target="&#95;blank" href="https://example.test">Example</a>`
  const result = normalizeNewWindowRelationships(source)
  assert.equal(result.links, 1)
  assert.match(result.html, /rel="noopener noreferrer"/)
})

test('normalizes browser-accepted semicolonless numeric blank targets', () => {
  for (const encodedTarget of ['_&#98lank', '_&#x62lank']) {
    const source = `<a target="${encodedTarget}" href="https://example.test">Example</a>`
    const result = normalizeNewWindowRelationships(source)
    assert.equal(result.links, 1)
    assert.match(result.html, /rel="noopener noreferrer"/)
  }
})

test('decodes only one layer and marks nested or invalid references unresolved', () => {
  const decoded = decodeHtmlCharacterReferences('&amp;lt; _&amp;#98;lank')
  assert.equal(decoded.value, '&lt; _&#98;lank')
  assert.equal(decoded.hasUnresolvedCharacterReference, true)

  const [invalid] = parseHtmlAttributes('target="&#x110000;"')
  assert.equal(invalid.value, '&#x110000;')
  assert.equal(invalid.hasUnresolvedCharacterReference, true)
})

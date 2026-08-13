import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeNewWindowRelationships } from './html-security.mjs'

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

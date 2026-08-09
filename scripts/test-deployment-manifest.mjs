import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  ARTIFACT_ROOT_SCHEME,
  buildManifest,
  inventoryArtifact,
  parseRemoteManifest,
  validateContext,
  verifyManifest,
  verifyRemoteManifest,
  witnessCacheKey,
  writeManifest
} from './deployment-manifest.mjs'

const revision = 'a'.repeat(40)
const context = Object.freeze({
  repository: 'szl-holdings/docs-site',
  revision,
  tree: 'c'.repeat(40),
  ref: 'refs/heads/main',
  ref_protected: 'true',
  event: 'push',
  workflow_ref: 'szl-holdings/docs-site/.github/workflows/deploy-pages.yml@refs/heads/main',
  workflow_sha: revision,
  run_id: '12345',
  run_attempt: '1',
  server_url: 'https://github.com'
})

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'docs-deployment-manifest-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(join(root, 'assets'))
  writeFileSync(join(root, 'index.html'), '<!doctype html><title>SZL</title>\n')
  writeFileSync(join(root, 'site.webmanifest'), '{"name":"SZL"}\n')
  writeFileSync(join(root, 'sitemap.xml'), '<urlset/>\n')
  writeFileSync(join(root, 'assets', 'app.123.js'), 'console.log("bound")\n')
  writeFileSync(join(root, 'assets', 'style.123.css'), ':root{color-scheme:dark}\n')
  writeFileSync(join(root, '.nojekyll'), '')
  return root
}

test('writes and verifies a protected exact-source deployment manifest', (t) => {
  const root = fixture(t)
  const manifest = writeManifest(root, context)
  assert.equal(manifest.source.revision, revision)
  assert.equal(manifest.source.ref_protected, true)
  assert.equal(manifest.workflow.revision, revision)
  assert.equal(manifest.artifact.file_count, 6)
  assert.equal(manifest.artifact.root_scheme, ARTIFACT_ROOT_SCHEME)
  assert.equal(manifest.artifact.total_bytes, manifest.artifact.files.reduce((total, file) => total + file.bytes, 0))
  assert.equal(verifyManifest(root, context).artifact.root_sha256, manifest.artifact.root_sha256)
  assert.equal(verifyRemoteManifest(manifest, revision), manifest)
})

test('refuses to overwrite immutable release evidence', (t) => {
  const root = fixture(t)
  writeManifest(root, context)
  assert.throws(() => writeManifest(root, context), /refusing to overwrite release evidence/)
})

test('fails when any inventoried byte changes after binding', (t) => {
  const root = fixture(t)
  writeManifest(root, context)
  writeFileSync(join(root, 'index.html'), '<!doctype html><title>TAMPERED</title>\n')
  assert.throws(() => verifyManifest(root, context), /does not match source or artifact bytes/)
})

test('fails when an unbound file appears after binding', (t) => {
  const root = fixture(t)
  writeManifest(root, context)
  writeFileSync(join(root, 'unexpected.txt'), 'not bound\n')
  assert.throws(() => verifyManifest(root, context), /does not match source or artifact bytes/)
})

test('fails closed on unprotected, stale, or malformed workflow context', () => {
  assert.throws(() => validateContext({ ...context, ref_protected: 'false' }), /not reported protected/)
  assert.throws(() => validateContext({ ...context, workflow_sha: 'b'.repeat(40) }), /does not match source/)
  assert.throws(() => validateContext({ ...context, revision: 'ABC' }), /exact lowercase Git SHA/)
  assert.throws(() => validateContext({ ...context, event: 'pull_request' }), /event is not admitted/)
})

test('fails when manifest fields are added or source identity is changed', (t) => {
  const root = fixture(t)
  writeManifest(root, context)
  const path = join(root, 'deployment.json')
  const manifest = JSON.parse(readFileSync(path, 'utf8'))
  manifest.source.revision = 'b'.repeat(40)
  manifest.unreviewed = true
  writeFileSync(path, `${JSON.stringify(manifest)}\n`)
  assert.throws(() => verifyManifest(root, context), /field set mismatch/)
})

test('fails on duplicate, unordered, or unsafe remote artifact paths', (t) => {
  const root = fixture(t)
  const manifest = buildManifest(root, context)
  const duplicate = structuredClone(manifest)
  duplicate.artifact.files[1] = duplicate.artifact.files[0]
  assert.throws(() => verifyRemoteManifest(duplicate, revision), /duplicate|canonical order/)

  const unsafe = structuredClone(manifest)
  unsafe.artifact.files[0].path = 'https://example.com/escape.js'
  assert.throws(() => verifyRemoteManifest(unsafe, revision), /unsafe|canonical order/)
})

test('fails when the live run URL is not derived from its immutable run identity', (t) => {
  const root = fixture(t)
  const manifest = buildManifest(root, context)
  manifest.workflow.run_url = 'https://example.com/not-github'
  assert.throws(() => verifyRemoteManifest(manifest, revision), /run URL is not canonical/)
})

test('binds public manifest bytes to the exact build-job digest', (t) => {
  const root = fixture(t)
  const manifest = buildManifest(root, context)
  const bytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`)
  const digest = createHash('sha256').update(bytes).digest('hex')
  assert.equal(parseRemoteManifest(bytes, digest, revision).source.tree, context.tree)
  assert.throws(() => parseRemoteManifest(bytes, '0'.repeat(64), revision), /manifest mismatch/)
})

test('uses a unique, source-bound cache key for every witness poll', () => {
  const first = witnessCacheKey(revision, '12345', '1', 1).toString()
  const second = witnessCacheKey(revision, '12345', '1', 2).toString()
  assert.notEqual(first, second)
  assert.match(first, /revision=/)
  assert.match(first, /run=12345/)
  assert.match(first, /attempt=1/)
  assert.match(first, /poll=1/)
})

test('inventory ordering and root digest are deterministic', (t) => {
  const root = fixture(t)
  const first = inventoryArtifact(root)
  const second = inventoryArtifact(root)
  assert.deepEqual(first, second)
  assert.deepEqual(first.files.map((file) => file.path), [...first.files.map((file) => file.path)].sort())
  assert.equal(buildManifest(root, context).artifact.root_sha256, first.root_sha256)
})

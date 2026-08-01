// Post-build contract for the canonical GitHub Pages `/docs-site/` artifact.
// VitePress owns navigation and asset paths through its exact canonical base.
// This deterministic pass only adds accessibility attributes to server-rendered
// chrome and publishes the admitted raw trust evidence. A separate crawler
// verifies the complete generated local-link graph after this pass.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const DIST = join(ROOT, 'docs', '.vitepress', 'dist')
const TRUST_SOURCE = join(ROOT, 'docs', 'trust')
const TRUST_RAW_FILES = [
  'verify.sh',
  'runs/E4-codex-kernel-2026-04-29/decision_receipt.json',
  'runs/E4-codex-kernel-2026-04-29/deployment_contract.json',
  'runs/E4-codex-kernel-2026-04-29/final_state.json',
  'runs/E4-codex-kernel-2026-04-29/final_table_preview.json',
  'runs/E4-codex-kernel-2026-04-29/proof_ledger.jsonl',
  'runs/E4-codex-kernel-2026-04-29/run_identity.json',
  'runs/E4-codex-kernel-2026-04-29/run_manifest.json',
  'runs/E4-codex-kernel-2026-04-29/run_summary.json',
  'runs/E4-codex-kernel-2026-04-29/secrets_status.json',
  'runs/E4-codex-kernel-2026-04-29/trace.jsonl',
  'runs/E4-codex-kernel-2026-04-29/version_lineage.json'
]

function publishTrustEvidence() {
  for (const rel of TRUST_RAW_FILES) {
    const source = join(TRUST_SOURCE, rel)
    if (!existsSync(source)) {
      throw new Error(`missing canonical trust asset: ${rel}`)
    }
    const target = join(DIST, 'trust', rel)
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(source, target)
  }
  return TRUST_RAW_FILES.length
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

function setTagAttribute(tag, name, value) {
  const existing = new RegExp(`\\s${name}(?:="[^"]*")?(?=\\s|>)`)
  if (existing.test(tag)) return tag.replace(existing, ` ${name}="${value}"`)
  return tag.replace(/>$/, ` ${name}="${value}">`)
}

function fixAccessibleChrome(html) {
  let switches = 0
  let landmarks = 0
  html = html.replace(/<button\b[^>]*\bVPSwitchAppearance\b[^>]*>/g, (tag) => {
    switches++
    return setTagAttribute(
      setTagAttribute(tag, 'aria-label', 'Toggle color theme'),
      'title',
      'Toggle color theme'
    )
  })
  html = html.replace(/<div\b[^>]*\bVPContent\b[^>]*>/g, (tag) => {
    landmarks++
    return setTagAttribute(
      setTagAttribute(tag, 'role', 'main'),
      'aria-label',
      'Primary content'
    )
  })
  return { html, landmarks, switches }
}

const files = walk(DIST)
let changed = 0
let accessibleLandmarks = 0
let accessibleSwitches = 0

for (const file of files) {
  let html = readFileSync(file, 'utf8')
  const before = html

  // Make core landmarks and appearance controls accessible before hydration.
  const accessible = fixAccessibleChrome(html)
  html = accessible.html
  accessibleLandmarks += accessible.landmarks
  accessibleSwitches += accessible.switches

  if (html !== before) {
    writeFileSync(file, html)
    changed++
  }
}

const trustFilesPublished = publishTrustEvidence()
console.log(`fix-relative-paths: rewrote ${changed} HTML file(s) of ${files.length} total; labeled ${accessibleSwitches} appearance control(s) and ${accessibleLandmarks} main landmark(s); published ${trustFilesPublished} raw trust evidence file(s).`)

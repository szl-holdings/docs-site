// Post-build: rewrite VitePress relative `./` asset/link refs to the correct
// per-page depth (`../` × depth). VitePress with base:'./' emits `./assets`,
// `./img`, and `./page.html` references that are correct only for root-level
// pages. For pages nested in subdirectories (e.g. flagships/a11oy.html) the
// `./` must become `../`. This makes the static bundle fully relocatable —
// it renders correctly when served behind an unpredictable proxy sub-path
// (the pplx.app preview) without depending on a fixed `base`.
//
// Idempotent and deterministic. Run after `vitepress build`.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DIST = new URL('./docs/.vitepress/dist/', import.meta.url).pathname

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

const files = walk(DIST)
let changed = 0

for (const file of files) {
  // depth = number of directories between this file and dist root
  const rel = relative(DIST, file)
  const depth = rel.split(sep).length - 1
  if (depth === 0) continue // root-level pages already correct

  const prefix = '../'.repeat(depth)
  let html = readFileSync(file, 'utf8')
  const before = html

  // Rewrite href="./..." and src="./..." (handles assets, img, *.html links).
  // Leave protocol-relative, absolute, anchor, and external refs untouched.
  html = html.replace(/((?:href|src)=")\.\/(?!\/)/g, `$1${prefix}`)
  // Rewrite import/module specifiers in inline scripts that use "./assets"
  html = html.replace(/(["'(])\.\/assets\//g, `$1${prefix}assets/`)

  if (html !== before) {
    writeFileSync(file, html)
    changed++
  }
}

console.log(`fix-relative-paths: rewrote ${changed} nested HTML file(s) of ${files.length} total.`)

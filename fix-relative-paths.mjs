// Post-build: make the VitePress static bundle fully relocatable so it renders
// correctly behind an unpredictable proxy sub-path (the pplx.app preview)
// without depending on a fixed `base`.
//
// Two HTML transforms:
//   1. Depth-correct relative refs. VitePress with base:'./' emits `./assets`,
//      `./img`, and `./page.html` references that are only correct for
//      root-level pages. For nested pages (e.g. flagships/a11oy.html) the `./`
//      must become `../` × depth. This pass also depth-corrects base-absolute
//      `/img/` and `/assets/` refs: public-dir assets referenced from markdown
//      as `/img/...` (the VitePress idiom) emit a base-absolute `src="/img/.."`
//      that 404s under a sub-path origin (GitHub Pages /docs-site/, preview
//      proxy). Rewriting them to depth-relative makes them correct from any
//      base — root cause, not a bandaid.
//   2. Explicit directory-index links. The preview proxy does NOT auto-serve
//      index.html for a trailing-slash URL, so rewrite relative links ending
//      in `/` (optionally + #anchor) to point at `index.html` explicitly.
//
// One CSS transform:
//   3. VitePress emits @font-face `src: url(/assets/inter-*.woff2)` with an
//      absolute `/assets/` path inside the bundled stylesheet. Behind a sub-
//      path origin (e.g. GitHub Pages /docs-site/, or the preview proxy) that
//      absolute URL 404s because it resolves at the server root, not under the
//      site base. The stylesheet itself always lives in `assets/`, so the
//      fonts are siblings — rewrite `url(/assets/x.woff2)` to `url(./x.woff2)`,
//      which is correct from any base. Root cause, not a bandaid: it removes
//      the only remaining base-absolute reference the build emits.
//
// Idempotent and deterministic. Runs automatically after `vitepress build`
// (wired into the docs:build script).

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

// Append index.html to relative directory-index links (href ending in `/`,
// optionally followed by an #anchor). Leaves http(s)://, //, #-only,
// mailto:, and tel: refs untouched.
function fixDirIndex(html) {
  return html.replace(/href="([^"]+)"/g, (m, url) => {
    if (/^(https?:|\/\/|#|mailto:|tel:)/.test(url)) return m
    const mm = url.match(/^([^#]*\/)(#.*)?$/)
    if (!mm) return m
    return `href="${mm[1]}index.html${mm[2] || ''}"`
  })
}

// Rewrite base-absolute `/assets/<file>` font/asset URLs inside a stylesheet
// to `./` (same directory as the CSS). Idempotent: only matches `/assets/`,
// never an already-relative `./` ref.
function fixCssAssetUrls(css) {
  return css.replace(/url\(\/assets\//g, 'url(./')
}

function walkExt(dir, ext, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walkExt(p, ext, out)
    else if (name.endsWith(ext)) out.push(p)
  }
  return out
}

const files = walk(DIST)
let changed = 0

// CSS pass (transform 3)
let cssChanged = 0
for (const file of walkExt(DIST, '.css')) {
  const css = readFileSync(file, 'utf8')
  const next = fixCssAssetUrls(css)
  if (next !== css) {
    writeFileSync(file, next)
    cssChanged++
  }
}

for (const file of files) {
  const rel = relative(DIST, file)
  const depth = rel.split(sep).length - 1
  let html = readFileSync(file, 'utf8')
  const before = html

  // 1) depth-correct `./` references (only needed for nested pages)
  const prefix = '../'.repeat(depth)
  if (depth > 0) {
    html = html.replace(/((?:href|src)=")\.\/(?!\/)/g, `$1${prefix}`)
    html = html.replace(/(["'(])\.\/assets\//g, `$1${prefix}assets/`)
  }

  // 1b) depth-correct base-absolute `/img/` and `/assets/` refs in href/src.
  //     `/x` -> `./x` at root (depth 0), `../x` at depth 1, etc. Leaves
  //     protocol-relative `//host` URLs untouched (the `(?!/)` guard).
  const absPrefix = depth === 0 ? './' : prefix
  html = html.replace(
    /((?:href|src)=")\/(img|assets)\//g,
    `$1${absPrefix}$2/`
  )

  // 2) explicit directory-index links (all pages, including root)
  html = fixDirIndex(html)

  if (html !== before) {
    writeFileSync(file, html)
    changed++
  }
}

console.log(`fix-relative-paths: rewrote ${changed} HTML file(s) of ${files.length} total; ${cssChanged} CSS file(s) for base-absolute asset URLs.`)

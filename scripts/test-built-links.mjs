import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  collectBuiltLinkIssues as collectBuiltLinkIssuesRaw,
  verifyBuiltLinks as verifyBuiltLinksRaw
} from './verify-built-links.mjs'
import { normalizeNewWindowRelationships } from './html-security.mjs'

const collectBuiltLinkIssues = (root) => collectBuiltLinkIssuesRaw(root, { requireSitemap: false })
const verifyBuiltLinks = (root) => verifyBuiltLinksRaw(root, { requireSitemap: false })

function fixture(t, files) {
  const root = mkdtempSync(join(tmpdir(), 'docs-built-links-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path)
    mkdirSync(join(target, '..'), { recursive: true })
    writeFileSync(target, content)
  }
  return root
}

function page(body, title = 'Page') {
  return `<!doctype html><html><head><title>${title}</title><meta property="og:title" content="${title}"><meta name="twitter:title" content="${title}"></head><body><main aria-label="Primary content"><h1 id="top">${title}</h1>${body}</main></body></html>`
}

test('accepts safe same-origin fragments and named external links', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="/docs-site/guide/index.html#install">Install</a><a href="https://example.test" target="_blank" rel="noopener noreferrer">Example</a><img src="/docs-site/assets/logo.svg" alt="logo">', 'Home'),
    'guide/index.html': page('<h2 id="install">Install</h2><a href="#top">Back</a>', 'Guide'),
    'assets/logo.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>'
  })
  assert.deepEqual(collectBuiltLinkIssues(root).issues, [])
  assert.equal(verifyBuiltLinks(root).htmlFiles, 2)
})

test('validates normalized new-window attributes after a quoted greater-than sign', (t) => {
  const source = page('<a title=">" target="_blank" href="https://example.test">Example</a>', 'Home')
  const unsafeRoot = fixture(t, { 'index.html': source })
  assert.match(collectBuiltLinkIssues(unsafeRoot).issues.join('\n'), /target=_blank lacks rel=noopener noreferrer/)

  const normalized = normalizeNewWindowRelationships(source)
  assert.equal(normalized.links, 1)
  const safeRoot = fixture(t, { 'index.html': normalized.html })
  assert.deepEqual(collectBuiltLinkIssues(safeRoot).issues, [])
})

test('rejects duplicate ids and unresolved same-page or cross-page fragments', (t) => {
  const root = fixture(t, {
    'index.html': page('<h2 id="duplicate">One</h2><h2 id="duplicate">Two</h2><a href="#missing">Missing</a><a href="/docs-site/guide/index.html#absent">Guide</a>', 'Home'),
    'guide/index.html': page('<h2 id="present">Present</h2>', 'Guide')
  })
  assert.throws(() => verifyBuiltLinks(root), /duplicate id duplicate[\s\S]*missing fragment #missing[\s\S]*missing fragment #absent/)
})

test('rejects unsafe schemes, unsafe new tabs, and unnamed external links', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="javascript:alert(1)">No</a><a href="http://example.test">Insecure</a><a href="https://example.test"><svg></svg></a><a href="https://example.test" target="_blank">New tab</a>', 'Home')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.match(issues, /forbidden javascript URL/)
  assert.match(issues, /forbidden URL scheme http:/)
  assert.match(issues, /external link has no accessible name/)
  assert.match(issues, /target=_blank lacks rel=noopener noreferrer/)
})

test('rejects same-origin references outside the Pages base', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="https://holdings.a-11-oy.com/escape.html">Escape</a>', 'Home')
  })
  assert.throws(() => verifyBuiltLinks(root), /outside canonical base/)
})

test('rejects encoded slash and backslash traversal outside the artifact root', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="/docs-site/%2e%2e%2foutside.html">Slash escape</a><a href="/docs-site/%2e%2e%5coutside.html">Backslash escape</a>', 'Home')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.match(issues, /malformed URL pathname \/docs-site\/%2e%2e%2foutside\.html/i)
  assert.match(issues, /malformed URL pathname \/docs-site\/%2e%2e%5coutside\.html/i)
})

test('decodes character references in security attributes', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="java&#x73;cript:alert(1)">Encoded javascript</a><a href="java&#115cript:alert(2)">Semicolonless javascript</a><a target="&#95;blank" href="https://example.test">Safe</a><a target="_&#98lank" href="https://second.example">Semicolonless blank</a>', 'Home')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.equal((issues.match(/forbidden javascript URL|forbidden URL scheme javascript:/g) ?? []).length, 2)
  assert.equal((issues.match(/target=_blank lacks rel=noopener noreferrer/g) ?? []).length, 2)
})

test('does not recursively unescape double-encoded security values or title text', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="java&amp;#115;cript:alert(1)">Nested reference</a>', 'A &amp;lt; B')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.match(issues, /unresolved character reference in href="java&amp;#115;cript:alert\(1\)"/)
  assert.doesNotMatch(issues, /page-specific social title mismatch/)
})

test('rejects executable data hrefs and unresolved aria-labelledby names', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="data:text/html,%3Cscript%3Ealert(1)%3C/script%3E">Data</a><a href="https://example.test" aria-labelledby="missing"></a>', 'Home')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.match(issues, /forbidden URL scheme data:/)
  assert.match(issues, /external link has no accessible name/)
})

test('validates required sitemap discovery routes and built targets', (t) => {
  const required = {
    'index.html': page('', 'Home'),
    'investors/index.html': page('', 'Investors'),
    'investors/diligence.html': page('', 'Diligence'),
    'developers/index.html': page('', 'Developers'),
    'status.html': page('', 'Status'),
    'compliance.html': page('', 'Compliance'),
    'proof.html': page('', 'Proof')
  }
  const locations = Object.keys(required).map((path) => {
    const route = path === 'index.html' ? '' : path.replace(/index\.html$/, '')
    return `<url><loc>https://holdings.a-11-oy.com/docs-site/${route}</loc></url>`
  }).join('')
  const root = fixture(t, { ...required, 'sitemap.xml': `<urlset>${locations}</urlset>` })
  assert.deepEqual(collectBuiltLinkIssuesRaw(root).issues, [])
})

test('rejects a missing sitemap in the production contract', (t) => {
  const root = fixture(t, { 'index.html': page('', 'Home') })
  assert.match(collectBuiltLinkIssuesRaw(root).issues.join('\n'), /missing generated discovery contract/)
})

test('rejects duplicate security attributes and executable data sources', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="https://example.test" target="_blank" rel="opener" rel="noopener noreferrer">Example</a><script src="data:text/javascript,alert(1)"></script><iframe src="data:text/html,hello"></iframe>', 'Home')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.match(issues, /duplicate security attribute rel/)
  assert.match(issues, /forbidden URL scheme data:/)
})

test('rejects external names hidden from the accessibility tree or blank image alternatives', (t) => {
  const root = fixture(t, {
    'index.html': page('<a href="https://example.test"><span aria-hidden="true">Hidden</span></a><a href="https://second.example"><img alt="   "></a><a href="https://third.example"><img aria-hidden="true" alt="Hidden image"></a><a href="https://fourth.example"><img role="presentation" alt="Presentational image"></a><a href="mailto:test@example.test"><img hidden alt="Hidden email"></a>', 'Home')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.equal((issues.match(/external link has no accessible name/g) ?? []).length, 5)
})

test('rejects active URL-bearing constructs, base overrides, and external executable sources', (t) => {
  const root = fixture(t, {
    'index.html': page('<base href="https://example.test/"><form action="javascript:alert(1)"><button formaction="https://example.test/submit">Submit</button></form><object data="https://example.test/object"></object><img srcset="https://example.test/image.png 1x"><video poster="/docs-site/poster.png"></video><iframe srcdoc="<p>active</p>"></iframe><meta http-equiv="refresh" content="0;url=https://example.test"><script src="https://example.test/app.js"></script>', 'Home')
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  for (const marker of [
    'forbidden active element base',
    'forbidden active URL attribute action',
    'forbidden active URL attribute formaction',
    'forbidden active element object',
    'forbidden active URL attribute srcset',
    'forbidden active URL attribute poster',
    'forbidden active URL attribute srcdoc',
    'forbidden active meta refresh',
    'external active source is forbidden for script'
  ]) assert.match(issues, new RegExp(marker))
})

test('rejects missing h1 and skipped heading levels in generated pages', (t) => {
  const root = fixture(t, {
    'index.html': page('<h3>Skipped</h3>', 'Home'),
    'guide/index.html': '<!doctype html><html><head><title>Guide</title><meta property="og:title" content="Guide"><meta name="twitter:title" content="Guide"></head><body><main aria-label="Primary content"><h2>Missing h1</h2></main></body></html>'
  })
  const issues = collectBuiltLinkIssues(root).issues.join('\n')
  assert.match(issues, /expected exactly one h1/)
  assert.match(issues, /heading level skips h1 to h3/)
})

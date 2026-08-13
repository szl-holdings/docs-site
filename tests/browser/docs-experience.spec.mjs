import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const basePath = '/docs-site/'
const viewports = [
  { name: 'phone-320', width: 320, height: 568 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'wide-1728', width: 1728, height: 1117 }
]

const representativeRoutes = [
  { route: '', name: 'home', heading: /SZL Holdings/ },
  { route: 'investors/', name: 'investors', heading: /Investor Brief/i },
  { route: 'developers/', name: 'developers', heading: /Developer hub/i },
  { route: 'status.html', name: 'status', heading: /Runtime status/i },
  { route: 'compliance.html', name: 'compliance', heading: /Compliance and supply-chain posture/i },
  { route: 'proof.html', name: 'proof', heading: /Proof, source lineage, and DOI boundary/i }
]

function localPath(route) {
  return `${basePath}${route}`
}

async function assertViewportIntegrity(page) {
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    innerHeight: window.innerHeight,
    mainCount: document.querySelectorAll('main, [role="main"]').length,
    labeledMainCount: document.querySelectorAll('main[aria-label="Primary content"], [role="main"][aria-label="Primary content"]').length,
    overflowCandidates: [...document.querySelectorAll('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return { tag: element.tagName, classes: element.className?.toString().slice(0, 100), left: rect.left, right: rect.right, width: rect.width, scrollWidth: element.scrollWidth }
      })
      .filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1)
      .slice(0, 12)
  }))
  expect(metrics.scrollWidth, `document must not hide or create horizontal overflow: ${JSON.stringify(metrics.overflowCandidates)}`).toBeLessThanOrEqual(metrics.clientWidth)
  expect(metrics.mainCount, 'exactly one primary-content landmark').toBe(1)
  expect(metrics.labeledMainCount, 'primary landmark must be named').toBe(1)

  const controls = page.locator('a:visible, button:visible, input:visible, select:visible, textarea:visible, summary:visible')
  const count = await controls.count()
  for (let index = 0; index < count; index++) {
    const box = await controls.nth(index).boundingBox()
    expect(box, `visible control ${index} must have a box`).not.toBeNull()
    if (!box) continue
    const intersectsViewport = box.x + box.width > 0
      && box.x < metrics.clientWidth
      && box.y + box.height > 0
      && box.y < metrics.innerHeight
    if (!intersectsViewport) continue
    expect(box.width, `visible control ${index} width`).toBeGreaterThan(0)
    expect(box.height, `visible control ${index} height`).toBeGreaterThan(0)
    expect(box.x + box.width, `visible control ${index} must not overflow right`).toBeLessThanOrEqual(metrics.clientWidth + 1)
    expect(box.x, `visible control ${index} must not overflow left`).toBeGreaterThanOrEqual(-1)
  }
}

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('scoped routes are responsive, keyboard-safe, and accessible', async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
      const consoleErrors = []
      const failedInternalRequests = []
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      page.on('pageerror', (error) => consoleErrors.push(error.message))
      page.on('requestfailed', (request) => {
        const url = new URL(request.url())
        if (url.origin === 'http://127.0.0.1:4173') failedInternalRequests.push(`${url.pathname}: ${request.failure()?.errorText ?? 'failed'}`)
      })

      for (const target of representativeRoutes) {
        const response = await page.goto(localPath(target.route), { waitUntil: 'networkidle' })
        expect(response?.status(), `${target.route || '/'} must return HTTP 200`).toBe(200)
        await expect(page).toHaveTitle(/SZL Holdings/)
        await expect(page.locator('main h1, [role="main"] h1').first()).toContainText(target.heading)
        await assertViewportIntegrity(page)

        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
        const geometry = axe.violations.length ? await page.evaluate(() => [...document.querySelectorAll('.VPNavBarTitle .title, .VPSidebar, .VPSidebar > .curtain, .VPSidebar > .nav, .VPSidebar .group, .VPSidebarItem > .item, .VPSidebarItem > .item > .VPLink')]
          .slice(0, 12)
          .map((element) => {
            const rect = element.getBoundingClientRect()
            const style = getComputedStyle(element)
            return { tag: element.tagName, classes: element.className, text: element.textContent?.trim().slice(0, 40), top: rect.top, bottom: rect.bottom, height: rect.height, cssTop: style.top, minHeight: style.minHeight, marginTop: style.marginTop, paddingTop: style.paddingTop, transform: style.transform, position: style.position, zIndex: style.zIndex, scrollTop: element.scrollTop, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }
          })) : []
        expect(axe.violations, `${target.route}: ${JSON.stringify({ violations: axe.violations, geometry }, null, 2)}`).toEqual([])
        // Capture the accepted viewport. Chromium's full-page capture scrolls
        // fixed overflow containers and can leak that synthetic scroll state
        // into the next same-origin route.
        await page.screenshot({ path: testInfo.outputPath(`${viewport.name}-${target.name}.png`), fullPage: false })
      }

      await page.goto(localPath(''), { waitUntil: 'networkidle' })

      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
      const focusedBox = await focused.boundingBox()
      expect(focusedBox?.x ?? -1, 'focused control must enter the viewport').toBeGreaterThanOrEqual(-1)
      expect((focusedBox?.x ?? 0) + (focusedBox?.width ?? 0), 'focused control must remain inside the viewport').toBeLessThanOrEqual(viewport.width + 1)
      const outline = await focused.evaluate((element) => getComputedStyle(element).outlineStyle)
      expect(outline).not.toBe('none')

      const motion = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
      expect(motion).toBe(true)

      if (viewport.width < 768) {
        const menu = page.locator('button.VPNavBarHamburger')
        await expect(menu).toBeVisible()
        const box = await menu.boundingBox()
        expect(box?.width ?? 0).toBeGreaterThanOrEqual(44)
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
        await menu.focus()
        await page.keyboard.press('Enter')
        await expect(page.locator('.VPNavScreen')).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(page.locator('.VPNavScreen')).toBeHidden()
        await expect(menu).toHaveAttribute('aria-expanded', 'false')
        await expect(menu).toBeFocused()
      } else {
        await expect(page.locator('button.VPNavBarHamburger')).toBeHidden()
      }

      expect(consoleErrors, 'browser console/page errors').toEqual([])
      expect(failedInternalRequests, 'internal requests must succeed').toEqual([])
    })
  })
}

test('representative investor, developer, status, compliance, and proof routes survive SPA navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  const consoleErrors = []
  const failedInternalRequests = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))
  page.on('requestfailed', (request) => {
    const url = new URL(request.url())
    if (url.origin === 'http://127.0.0.1:4173') failedInternalRequests.push(`${url.pathname}: ${request.failure()?.errorText ?? 'failed'}`)
  })
  const response = await page.goto(localPath(''), { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(200)
  await page.evaluate(() => { window.__szlSpaSentinel = 'hydrated-shell' })

  for (const target of representativeRoutes.slice(1)) {
    const routeLink = page.locator(`a[href="${localPath(target.route)}"]`).first()
    await expect(routeLink, `${target.route} must have a hydrated internal navigation link`).toHaveCount(1)
    await routeLink.evaluate((link) => link.click())
    await expect(page.locator('main h1, [role="main"] h1').first()).toContainText(target.heading)
    expect(new URL(page.url()).pathname, `${target.route} must become the active route`).toBe(localPath(target.route))
    expect(await page.evaluate(() => window.__szlSpaSentinel), `${target.route} must retain the hydrated SPA shell`).toBe('hydrated-shell')
    await assertViewportIntegrity(page)
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    expect(axe.violations, `${target.route}: ${JSON.stringify(axe.violations, null, 2)}`).toEqual([])
    const internalLinks = await page.locator('a[href]').evaluateAll((anchors) => anchors
      .map((anchor) => anchor.href)
      .filter((href) => href.startsWith(location.origin)))
    expect(internalLinks.every((href) => new URL(href).pathname.startsWith('/docs-site/')), `${target.route} has an internal link outside the Pages base`).toBe(true)
  }
  expect(consoleErrors, 'SPA console/page errors').toEqual([])
  expect(failedInternalRequests, 'SPA internal requests must succeed').toEqual([])
})

test('light, ordinary-motion, and forced-colors modes preserve accessible focus and contrast', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' })
  const response = await page.goto(localPath('investors/'), { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(200)
  expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: light)').matches)).toBe(true)
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false)
  let axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([])

  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce', forcedColors: 'active' })
  expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true)
  await page.locator('a[href]').first().focus()
  const focusStyle = await page.locator(':focus').evaluate((element) => ({
    outlineStyle: getComputedStyle(element).outlineStyle,
    outlineWidth: getComputedStyle(element).outlineWidth
  }))
  expect(focusStyle.outlineStyle).not.toBe('none')
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(3)
  axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([])
})

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 }
]) {
  test(`${viewport.name} local document sidebar completes its keyboard lifecycle`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    // Exercise a route that owns an actual configured document sidebar.
    // Top-level pages such as /status.html expose only the outline disclosure.
    const response = await page.goto(localPath('developers/'), { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(200)

    const menu = page.locator('.VPLocalNav .menu')
    const sidebar = page.locator('.VPSidebar')
    const sidebarNav = sidebar.locator('.nav')
    await expect(menu).toBeVisible()
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await expect(sidebar).toBeHidden()

    await menu.click()
    await expect(menu).toHaveAttribute('aria-expanded', 'true')
    await expect(sidebar).toHaveClass(/\bopen\b/)
    await expect(sidebar).toBeVisible()
    await expect(sidebarNav).toBeVisible()
    await sidebarNav.focus()
    await expect(sidebarNav).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await expect(sidebar).not.toHaveClass(/\bopen\b/)
    await expect(sidebar).toBeHidden()
    await expect(menu).toBeFocused()
  })
}

test('mobile navigation honors nonzero top and bottom safe-area insets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(localPath(''), { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: ':root { --szl-safe-top: 17px !important; --szl-safe-bottom: 19px !important; }' })
  const menu = page.locator('button.VPNavBarHamburger')
  await menu.click()
  const geometry = await page.locator('.VPNavScreen').evaluate((screen) => ({
    top: Number.parseFloat(getComputedStyle(screen).top),
    paddingBottom: Number.parseFloat(getComputedStyle(screen).paddingBottom),
    navHeight: Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height'))
  }))
  expect(geometry.top).toBeGreaterThanOrEqual(geometry.navHeight + 17)
  expect(geometry.paddingBottom).toBeGreaterThanOrEqual(19)
})

test('tablet content and local navigation preserve a nonzero top safe-area inset', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto(localPath('status.html'), { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: ':root { --szl-safe-top: 17px !important; }' })
  const geometry = await page.evaluate(() => ({
    navHeight: Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')),
    contentPaddingTop: Number.parseFloat(getComputedStyle(document.querySelector('.VPContent')).paddingTop),
    localNavTop: Number.parseFloat(getComputedStyle(document.querySelector('.VPLocalNav')).top)
  }))
  expect(geometry.contentPaddingTop).toBeGreaterThanOrEqual(geometry.navHeight + 17)
  expect(geometry.localNavTop).toBeGreaterThanOrEqual(geometry.navHeight + 17)
})

test('wide tables scroll locally without widening the document', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto(localPath('status.html'), { waitUntil: 'networkidle' })
  await assertViewportIntegrity(page)
  const tables = page.locator('table')
  await expect(tables.first()).toBeVisible()
  const count = await tables.count()
  for (let index = 0; index < count; index++) {
    const metrics = await tables.nth(index).evaluate((table) => ({
      clientWidth: table.clientWidth,
      scrollWidth: table.scrollWidth,
      overflowX: getComputedStyle(table).overflowX,
      headerCount: table.querySelectorAll('th').length
    }))
    expect(metrics.headerCount, `table ${index} must expose header cells`).toBeGreaterThan(0)
    if (metrics.scrollWidth > metrics.clientWidth) expect(metrics.overflowX).toMatch(/auto|scroll/)
  }
})

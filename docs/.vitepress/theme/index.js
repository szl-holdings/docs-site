import DefaultTheme from 'vitepress/theme'
// KaTeX stylesheet is served from the bundled `katex` dependency (vendored at
// build time by Vite), not a runtime CDN. Doctrine v11: 0 runtime CDN.
import 'katex/dist/katex.min.css'
import './kanchay/vitepress.css'
import './custom.css'

function repairAccessibleChrome() {
  if (typeof document === 'undefined') return
  for (const control of document.querySelectorAll('button.VPSwitchAppearance')) {
    if (!control.getAttribute('aria-label')?.trim()) {
      control.setAttribute('aria-label', 'Toggle color theme')
    }
    if (!control.getAttribute('title')?.trim()) {
      control.setAttribute('title', 'Toggle color theme')
    }
  }
  const content = document.querySelector('.VPContent')
  const nativeMain = content?.querySelector('main')
  if (nativeMain) {
    nativeMain.setAttribute('aria-label', 'Primary content')
    content.removeAttribute('role')
    content.removeAttribute('aria-label')
  } else if (content) {
    content.setAttribute('role', 'main')
    content.setAttribute('aria-label', 'Primary content')
  }
}

let repairQueued = false
function scheduleAccessibleChromeRepair() {
  if (typeof window === 'undefined' || repairQueued) return
  repairQueued = true
  window.requestAnimationFrame(() => {
    repairQueued = false
    repairAccessibleChrome()
  })
}

let mobileEscapeInstalled = false
function installMobileNavigationEscape() {
  if (typeof document === 'undefined' || mobileEscapeInstalled) return
  mobileEscapeInstalled = true
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    const trigger = document.querySelector('button.VPNavBarHamburger[aria-expanded="true"]')
    const screen = document.querySelector('.VPNavScreen')
    if (!trigger || !screen) return
    event.preventDefault()
    trigger.click()
    window.requestAnimationFrame(() => trigger.focus())
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.mixin({
      mounted() {
        installMobileNavigationEscape()
        scheduleAccessibleChromeRepair()
      },
      updated() {
        // VitePress keeps the shell during SPA navigation; repair the newly
        // rendered content after the DOM update as well as at first paint.
        scheduleAccessibleChromeRepair()
      }
    })
  }
}

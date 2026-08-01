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

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.mixin({
      mounted() {
        window.requestAnimationFrame(repairAccessibleChrome)
      }
    })
  }
}

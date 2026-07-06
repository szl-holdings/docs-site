import DefaultTheme from 'vitepress/theme'
// KaTeX stylesheet is served from the bundled `katex` dependency (vendored at
// build time by Vite), not a runtime CDN. Doctrine v11: 0 runtime CDN.
import 'katex/dist/katex.min.css'
import './custom.css'

export default {
  extends: DefaultTheme
}

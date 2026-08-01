import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import katexPlugin from '@vscode/markdown-it-katex'

const katex = katexPlugin.default || katexPlugin
const liveBase = 'https://holdings.a-11-oy.com/docs-site/'

function canonicalPage(page) {
  const path = page.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
  return new URL(path, liveBase).href
}

export default withMermaid(defineConfig({
  base: '/docs-site/',
  mpa: true,
  cleanUrls: false,
  lang: 'en-US',
  title: 'SZL Holdings',
  titleTemplate: ':title · SZL Holdings',
  description: 'Governed AI infrastructure with inspectable source, bounded decisions, and linked evidence.',
  lastUpdated: true,
  appearance: 'dark',

  transformHead({ page, title, description }) {
    const canonical = canonicalPage(page)
    const socialTitle = page === 'index.md'
      ? `SZL Holdings · ${title}`
      : `${title} · SZL Holdings`
    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: socialTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: socialTitle }],
      ['meta', { name: 'twitter:description', content: description }]
    ]
  },

  head: [
    ['link', { rel: 'icon', href: '/docs-site/img/szl-mark.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'manifest', href: '/docs-site/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#030f29' }],
    ['meta', { name: 'color-scheme', content: 'dark light' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SZL Holdings' }],
    ['meta', { property: 'og:image', content: `${liveBase}img/szl-docs-social.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${liveBase}img/szl-docs-social.png` }]
  ],

  markdown: {
    math: false,
    config: (md) => md.use(katex),
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: false
  },

  themeConfig: {
    logo: '/img/szl-mark.svg',
    siteTitle: 'SZL Holdings',
    nav: [
      {
        text: 'Platform',
        items: [
          { text: 'Platform overview', link: '/flagships/' },
          { text: 'a11oy · execution fabric', link: '/flagships/a11oy' },
          { text: 'killinchu · counter-UAS', link: '/flagships/killinchu' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Use cases', link: '/use-cases/' }
        ]
      },
      {
        text: 'Builders',
        items: [
          { text: 'Quickstart', link: '/quickstart' },
          { text: 'Developer hub', link: '/developers/' },
          { text: 'API reference', link: '/api/' },
          { text: 'SDKs', link: '/sdks/' },
          { text: 'Cookbook', link: '/cookbook/' }
        ]
      },
      {
        text: 'Trust',
        items: [
          { text: 'Evidence index', link: '/evidence/' },
          { text: 'Verify a receipt', link: '/developers/verify' },
          { text: 'Proof and lineage', link: '/proof' },
          { text: 'Runtime status', link: '/status' },
          { text: 'Security and compliance', link: '/compliance' }
        ]
      },
      {
        text: 'Company',
        items: [
          { text: 'About SZL', link: '/about' },
          { text: 'KANCHAY design system', link: '/brand' },
          { text: 'Changelog', link: '/changelog' },
          { text: 'GitHub organization', link: 'https://github.com/szl-holdings' },
          { text: 'Hugging Face', link: 'https://huggingface.co/SZLHOLDINGS' }
        ]
      }
    ],

    sidebar: {
      '/flagships/': [{
        text: 'Platform',
        items: [
          { text: 'Overview', link: '/flagships/' },
          { text: 'a11oy', link: '/flagships/a11oy' },
          { text: 'killinchu', link: '/flagships/killinchu' },
          { text: 'Operator', link: '/flagships/operator' },
          { text: 'Provenance Anchor', link: '/flagships/memory' },
          { text: 'Policy', link: '/flagships/sentinel' }
        ]
      }],
      '/developers/': [{
        text: 'Developer hub',
        items: [
          { text: 'Overview', link: '/developers/' },
          { text: 'Quickstart', link: '/developers/quickstart' },
          { text: 'API reference', link: '/developers/api_reference' },
          { text: 'MCP integration', link: '/developers/mcp_integration' },
          { text: 'GraphQL', link: '/developers/graphql' },
          { text: 'Substrate packages', link: '/developers/substrate_packages' },
          { text: 'SDK drop-in', link: '/developers/sdk_drop_in' },
          { text: 'Verify a receipt', link: '/developers/verify' },
          { text: 'Willay API', link: '/developers/willay_api' }
        ]
      }],
      '/api/': [{
        text: 'API reference',
        items: [
          { text: 'Overview', link: '/api/' },
          { text: 'a11oy API', link: '/api/a11oy' },
          { text: 'killinchu API', link: '/api/killinchu' }
        ]
      }],
      '/sdks/': [{
        text: 'SDKs',
        items: [
          { text: 'Overview', link: '/sdks/' },
          { text: 'Python', link: '/sdks/python' },
          { text: 'TypeScript', link: '/sdks/typescript' }
        ]
      }],
      '/trust/': [{
        text: 'Trust',
        items: [
          { text: 'Transparency layer', link: '/trust/' },
          { text: 'Deep dive', link: '/trust/trust-deep' },
          { text: 'Migration provenance', link: '/trust/MIGRATION_PROVENANCE' }
        ]
      }],
      '/evidence/': [{ text: 'Evidence', items: [{ text: 'Evidence index', link: '/evidence/' }] }],
      '/anatomy/': [{
        text: 'Architecture',
        items: [
          { text: 'Anatomy', link: '/anatomy/' },
          { text: 'Mesh', link: '/mesh' },
          { text: '3D showcases', link: '/anatomy/3d-showcases' },
          { text: 'Doctrine v11 + v12', link: '/doctrine/v11-v12' },
          { text: 'PURIQ doctrine', link: '/doctrine/puriq' }
        ]
      }],
      '/cookbook/': [{
        text: 'Cookbook',
        items: [
          { text: 'Overview', link: '/cookbook/' },
          { text: 'Recipes', link: '/cookbook/recipes/' },
          { text: 'Anatomy evolved', link: '/cookbook/anatomy-evolved-v1' }
        ]
      }],
      '/use-cases/': [{
        text: 'Use cases',
        items: [
          { text: 'Overview', link: '/use-cases/' },
          { text: 'Warhacker', link: '/use-cases/warhacker' },
          { text: 'Greene demo', link: '/use-cases/greene-demo' },
          { text: 'Counter-UAS decision layer', link: '/use-cases/iron-dome-brain' },
          { text: 'Sovereign government AI', link: '/use-cases/sovereign-gov' }
        ]
      }]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/szl-holdings' }],
    search: { provider: 'local', options: { detailedView: true } },
    outline: { level: [2, 3], label: 'On this page' },
    editLink: {
      pattern: 'https://github.com/szl-holdings/docs-site/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Public claims link to source and evidence. SLSA L1 is the current stated supply-chain posture.',
      copyright: 'SZL Holdings · ORCID 0009-0001-0110-4173'
    },
    lastUpdated: { text: 'Last updated', formatOptions: { dateStyle: 'medium' } }
  },

  mermaid: { theme: 'neutral' }
}))

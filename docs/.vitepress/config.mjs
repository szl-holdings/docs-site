import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import katexPlugin from '@vscode/markdown-it-katex'
const katex = katexPlugin.default || katexPlugin

// SZL Holdings unified documentation site.
// Tech: VitePress (Vite + Vue 3). Justification in /README.md.
// Math: KaTeX via @vscode/markdown-it-katex. Diagrams: Mermaid.
// Search: built-in local search (MiniSearch). No external service required.

const base = './'

export default withMermaid(defineConfig({
  base,
  // MPA mode: each page is fully static HTML with no client-side router.
  // Combined with a relative base, this lets the site render correctly
  // when served behind an unpredictable proxy sub-path (e.g. the pplx.app
  // preview). At the production root (docs.szlholdings.com) base '/' + SPA
  // can be restored. See README.
  mpa: true,
  lang: 'en-US',
  title: 'SZL Holdings Docs',
  description:
    'Unified documentation for SZL Holdings — math-grounded, Quechua-rooted governed-AI anatomy. Two products, a11oy verticals, twelve organs, PURIQ agentic layer, Doctrine v11/v12.',
  cleanUrls: false,
  lastUpdated: true,
  appearance: 'dark',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap'
    }],
    // KaTeX CSS is bundled from the local `katex` dependency via the custom
    // theme (docs/.vitepress/theme/index.js) — no runtime CDN (Doctrine v11).
    ['meta', { name: 'theme-color', content: '#080c14' }]
  ],

  markdown: {
    math: false,
    config: (md) => {
      md.use(katex)
    },
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: false
  },

  themeConfig: {
    // Inca animated avatar as the navbar logo. Static szl-mark.svg
    // retained on disk at /img/szl-mark.svg (additive — not removed).
    logo: '/img/szl-avatar-animated.gif',
    siteTitle: 'SZL Holdings',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quickstart', link: '/quickstart' },
      {
        text: 'Flagships',
        items: [
          { text: 'a11oy — execution fabric', link: '/flagships/a11oy' },
          { text: 'a11oy Memory — provenance', link: '/flagships/memory' },
          { text: 'a11oy Sentinel — drift detection', link: '/flagships/sentinel' },
          { text: 'killinchu — drone intelligence', link: '/flagships/killinchu' },
          { text: 'a11oy Operator — receipt orchestration', link: '/flagships/operator' }
        ]
      },
      {
        text: 'Anatomy',
        items: [
          { text: 'Architecture (7 organs)', link: '/architecture' },
          { text: 'Mesh — nervous system', link: '/mesh' },
          { text: '3D Showcases', link: '/anatomy/3d-showcases' },
          { text: 'Anatomy + Organs', link: '/anatomy/' },
          { text: 'PURIQ Doctrine', link: '/doctrine/puriq' },
          { text: 'Doctrine v11 + v12', link: '/doctrine/v11-v12' }
        ]
      },
      {
        text: 'Build',
        items: [
          { text: 'Developer Hub', link: '/developers/' },
          { text: 'SDKs', link: '/sdks/' },
          { text: 'API Reference', link: '/api/' },
          { text: 'UDS — Unified Demo Surface (Coming Soon · Jun 16)', link: '/uds/' },
          { text: 'UDS — Deploy & Hand-off', link: '/uds' },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'Cookbook — Recipes', link: '/cookbook/recipes/' },
          { text: 'Use Cases', link: '/use-cases/' }
        ]
      },
      {
        text: 'Trust',
        items: [
          { text: 'Trust — Transparency Layer', link: '/trust/' },
          { text: 'Trust — Deep Dive', link: '/trust/trust-deep' },
          { text: 'Trust — Migration Provenance', link: '/trust/MIGRATION_PROVENANCE' },
          { text: 'Evidence', link: '/evidence/' },
          { text: 'Proof — Lean · Lake · DOIs', link: '/proof' },
          { text: 'Thesis Lineage — v1 → v22', link: '/lineage' },
          { text: 'Data Lake', link: '/lake' },
          { text: 'Changelog', link: '/changelog' },
          { text: 'Compliance & Security', link: '/compliance' },
          { text: 'Status', link: '/status' },
          { text: 'Brand Kit', link: '/brand' }
        ]
      },
      { text: 'About', link: '/about' }
    ],

    sidebar: {
      '/flagships/': [
        {
          text: 'Flagships',
          items: [
            { text: 'Overview', link: '/flagships/' },
            { text: 'a11oy', link: '/flagships/a11oy' },
            { text: 'a11oy Memory', link: '/flagships/memory' },
            { text: 'a11oy Sentinel', link: '/flagships/sentinel' },
            { text: 'killinchu', link: '/flagships/killinchu' },
            { text: 'a11oy Operator', link: '/flagships/operator' }
          ]
        }
      ],
      '/anatomy/': [
        {
          text: 'Anatomy',
          items: [
            { text: 'Anatomy + Organs', link: '/anatomy/' },
            { text: 'Mesh — nervous system', link: '/mesh' },
            { text: '3D Showcases', link: '/anatomy/3d-showcases' }
          ]
        },
        {
          text: 'The 12 Organs',
          collapsed: false,
          items: [
            { text: 'a11oy Memory — cortex', link: '/anatomy/#memory' },
            { text: 'Yuyay — heart', link: '/anatomy/#yuyay' },
            { text: 'Yawar — blood', link: '/anatomy/#yawar' },
            { text: 'Hukulla — immune', link: '/anatomy/#hukulla' },
            { text: 'Kallpa — wires', link: '/anatomy/#kallpa' },
            { text: 'Khipu — DAG', link: '/anatomy/#khipu' },
            { text: 'Lambda — spine', link: '/anatomy/#lambda' },
            { text: 'OTel-VSP — nerves', link: '/anatomy/#otel-vsp' },
            { text: 'Kanchay — brand', link: '/anatomy/#kanchay' },
            { text: 'Hatun — doctrine', link: '/anatomy/#hatun' },
            { text: 'Sumaq — designer', link: '/anatomy/#sumaq' },
            { text: 'Killinchu-bridge', link: '/anatomy/#killinchu-bridge' }
          ]
        }
      ],
      '/doctrine/': [
        {
          text: 'Doctrine',
          items: [
            { text: 'PURIQ Doctrine (v12)', link: '/doctrine/puriq' },
            { text: 'Doctrine v11 + v12 (LOCKED)', link: '/doctrine/v11-v12' }
          ]
        }
      ],
      '/sdks/': [
        {
          text: 'SDKs',
          items: [
            { text: 'Overview', link: '/sdks/' },
            { text: 'Python — szl-python', link: '/sdks/python' },
            { text: 'TypeScript — szl-ts', link: '/sdks/typescript' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'a11oy API', link: '/api/a11oy' },
            { text: 'killinchu API', link: '/api/killinchu' }
          ]
        }
      ],
      '/cookbook/': [
        {
          text: 'Cookbook',
          items: [
            { text: 'Overview', link: '/cookbook/' },
            { text: 'anatomy-evolved-v1', link: '/cookbook/anatomy-evolved-v1' },
            { text: 'Recipes (full library)', link: '/cookbook/recipes/' }
          ]
        }
      ],
      '/developers/': [
        {
          text: 'Developer Hub',
          items: [
            { text: 'Overview', link: '/developers/' },
            { text: 'Quickstart', link: '/developers/quickstart' },
            { text: 'API Reference', link: '/developers/api_reference' },
            { text: 'MCP Integration', link: '/developers/mcp_integration' },
            { text: 'GraphQL', link: '/developers/graphql' },
            { text: 'Substrate Packages', link: '/developers/substrate_packages' },
            { text: 'SDK Drop-in', link: '/developers/sdk_drop_in' },
            { text: 'Verify a receipt', link: '/developers/verify' },
            { text: 'Willay API', link: '/developers/willay_api' }
          ]
        }
      ],
      '/trust/': [
        {
          text: 'Trust',
          items: [
            { text: 'Transparency Layer', link: '/trust/' },
            { text: 'Trust — Deep Dive', link: '/trust/trust-deep' },
            { text: 'Migration Provenance', link: '/trust/MIGRATION_PROVENANCE' }
          ]
        }
      ],
      '/use-cases/': [
        {
          text: 'Use Cases',
          items: [
            { text: 'Overview', link: '/use-cases/' },
            { text: 'Warhacker mission packs', link: '/use-cases/warhacker' },
            { text: 'Greene demo flow', link: '/use-cases/greene-demo' },
            { text: 'Iron-Dome-but-the-brain', link: '/use-cases/iron-dome-brain' },
            { text: 'Sovereign AI for .gov', link: '/use-cases/sovereign-gov' }
          ]
        }
      ],
      '/evidence/': [
        {
          text: 'Evidence',
          items: [
            { text: 'Evidence Index', link: '/evidence/' }
          ]
        }
      ],
      '/uds/': [
        {
          text: 'UDS — Unified Demo Surface',
          items: [
            { text: 'Overview (Coming Soon · Jun 16)', link: '/uds/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/szl-holdings' }
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },

    outline: { level: [2, 3], label: 'On this page' },

    editLink: {
      pattern: 'https://github.com/szl-holdings/docs-site/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message:
        'Doctrine v11 LOCKED · 749/14/163 · kernel c7c0ba17 · Λ = Conjecture 1 · SLSA L1 honest. Math-grounded, Quechua-rooted, zero mysticism (PURIQ v12 agentic layer is additive).',
      copyright:
        'SZL Holdings · Authored by Yachay · ORCID 0009-0001-0110-4173'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'medium' }
    }
  },

  mermaid: {
    theme: 'neutral'
  }
}))

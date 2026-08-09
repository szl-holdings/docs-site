# Status

Public endpoint inventory and last witnessed availability for the SZL surfaces. This page is a
versioned static observation, not a synthetic uptime monitor. A deployed revision is not labelled
operational unless its public readiness surface succeeds in the same observation.

## Deployed source

Every production Pages release publishes `/docs-site/deployment.json`. That machine-readable
record binds the site to an exact protected `szl-holdings/docs-site` commit, the exact release
workflow revision and run, and a SHA-256 inventory/root digest for every uploaded file. The
workflow then reads the public manifest and critical HTML, CSS, JavaScript, sitemap, and web-app
manifest bytes back from the canonical host before it reports success.

This is deployment evidence, not a substitute for runtime liveness. Service availability below
still comes from each product's own health and readiness surfaces.

## Public runtime observation

Observed at **2026-08-09T01:06:19Z** through the public Hugging Face API and unauthenticated public
probes. All three published runtime revisions were provider-paused; none was operational in this
observation.

| Surface | Published revision | Provider state | Public probe | Evidence state |
|---------|--------------------|----------------|--------------|----------------|
| **a11oy** | `d069699e61d93a5e89f734bc3dc76faf44f50b99` | `PAUSED` | `GET /healthz` → HTTP 503 | **UNAVAILABLE** |
| **killinchu** | `83142da9526e2c0ddfe1e78eb99a20940cde0cf3` | `PAUSED` | `GET /api/killinchu/healthz` → HTTP 503 | **UNAVAILABLE** |
| **Hatun-MCP** | `ffa28928e5688107390b1708eed528f31f6beafe` | `PAUSED` | `GET /readyz` → HTTP 503 | **UNAVAILABLE** |
| Anatomy-3D / Operator-3D (Three.js showcases) | none | not deployed | screenshots only — see [3D Showcases](/anatomy/3d-showcases) | **UNAVAILABLE** |

Doctrine v11 remains source-locked at `749 declarations / 14 unique axioms / 163 tracked sorries`
and kernel `c7c0ba17`. Those values are a source contract; this observation did not receive them
from a live runtime.

## Repositories

Flagship repos run CI, CodeQL, SBOM, and DCO workflows on `main`:

- [a11oy](https://github.com/szl-holdings/a11oy) ·
  [killinchu](https://github.com/szl-holdings/killinchu)
- [lutar-lean](https://github.com/szl-holdings/lutar-lean) (kernel) ·
  ouroboros-thesis ·
  [szl-cookbook](https://github.com/szl-holdings/szl-cookbook) ·
  [szl-brand](https://github.com/szl-holdings/szl-brand)

::: info Dedicated status page
A dedicated, auto-refreshing status page (uptime history + incident log) is **in development**.
Until it ships, this page is the canonical endpoint list and each service's `/healthz` is the
real-time source of truth.
:::

## Known honest-status items

- **Hatun-MCP (`szlholdings-hatun-mcp.hf.space`):** the public
  [server card](https://szlholdings-hatun-mcp.hf.space/.well-known/mcp/server-card.json),
  [readiness](https://szlholdings-hatun-mcp.hf.space/readyz), and
  [build information](https://szlholdings-hatun-mcp.hf.space/api/build-info) are currently
  unavailable because the published Space is `PAUSED`. A prior release witnessed the
  Streamable HTTP contract with API-key authentication, receipt chain, and signer, but that
  historical result is not current availability. This observation did not perform an
  authenticated `initialize`/`tools/list`; no authenticated client session was witnessed, and no
  current Hatun client session is claimed. The a11oy and
  killinchu same-origin `/mcp/` endpoints are also unavailable while their Spaces are paused.
- **Roadmap surfaces not yet deployed (removed from the live table):** the Provenance Anchor,
  Operator, and Policy components have **no live Space today** (their retired standalone Space
  hostnames return HTTP 404) and are roadmap/frontier roles, not shipping services. The former
  Operator-3D showcase is likewise not deployed. They are documented honestly under
  [Flagships](/flagships/).
- **"MCP receipts server" Space:** **removed from this table** — `szlholdings-mcp-receipts-server.hf.space`
  is not deployed (HTTP 404) and has no backing repo. The flagship source exposes
  `/khipu/sign` · `/khipu/verify` · `/khipu/pubkey`, but this observation cannot label those routes
  live while the public runtimes are paused.
- **cosign signing:** PENDING — DSSE signatures are `PLACEHOLDER` (see [Compliance](/compliance)).
- **Cardano mainnet anchoring (Provenance Anchor):** in development.
- **Wire D (W3C traceparent):** in-process tracing is implemented in deployed source;
  cross-Space distributed-trace brokering is **NOT wired** (roadmap). Current runtime observation
  is unavailable. See [WIRES D–H](/architecture).
- **Wire E–H (cortex SSE, Khipu receipts, brain mesh, lean-verify):** implemented in-process in
  deployed source; cross-Space orchestration is roadmap and current runtime observation is
  unavailable.
- **UDS public demo:** not witnessed live; retain as roadmap until a public runtime is observed.
- **Unified SDKs (szl-python, szl-ts):** in development.

*Doctrine v11 LOCKED · 749/14/163 · kernel c7c0ba17 · SLSA L1 honest*

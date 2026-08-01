# Status

Live operational status of the SZL surfaces. This page is a static snapshot of the canonical
endpoints; for real-time liveness, hit each service's `/healthz` directly.

## Live flagship services

Two flagships ship today and expose live `/healthz`:

| Surface | Endpoint | Liveness check |
|---------|----------|----------------|
| **a11oy** (governed execution fabric) | [szlholdings-a11oy.hf.space](https://szlholdings-a11oy.hf.space) | `GET /healthz` → doctrine v11 · 749/14/163 |
| **killinchu** (drone-intelligence / counter-UAS) | [szlholdings-killinchu.hf.space](https://szlholdings-killinchu.hf.space) | `GET /api/killinchu/healthz` |
| Anatomy-3D / Operator-3D (Three.js showcases) | not deployed | screenshots only — see [3D Showcases](/anatomy/3d-showcases); `szlholdings-anatomy-3d` / `szlholdings-operator-3d` return HTTP 401 (no Space) |
| **Hatun-MCP** (Model Context Protocol) | [szlholdings-hatun-mcp.hf.space](https://szlholdings-hatun-mcp.hf.space/) | `GET /readyz` → runtime ready, receipt chain verified, signer configured; API-key authentication required. Authenticated client session not witnessed by this release. |

Both shipping flagship `/healthz` endpoints return Doctrine v11 verbatim:
`749 declarations / 14 unique axioms / 163 tracked sorries`, locked at `c7c0ba17`.

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
  [build information](https://szlholdings-hatun-mcp.hf.space/api/build-info) report an
  authenticated Streamable HTTP runtime with a ready receipt chain and configured signer.
  The server card is authoritative for the current catalog; this page does not hard-code a
  tool count. This release did not perform an authenticated `initialize`/`tools/list`, so it
  does not claim a witnessed Hatun client session. Separately, the a11oy and killinchu
  same-origin `/mcp/` endpoints returned successful public `initialize` and `tools/list`
  responses in the current release. Their live catalogs are authoritative and they are not
  the authenticated Hatun runtime.
- **Roadmap surfaces not yet deployed (removed from the live table):** the Provenance Anchor,
  Operator, and Policy components have **no live Space today** (their retired standalone Space
  hostnames return HTTP 404) and are roadmap/frontier roles, not shipping services. The former
  Operator-3D showcase is likewise not deployed. They are documented honestly under
  [Flagships](/flagships/).
- **"MCP receipts server" Space:** **removed from this table** — `szlholdings-mcp-receipts-server.hf.space`
  is not deployed (HTTP 404) and has no backing repo. Receipt signing/verification is live today via
  each shipping flagship's `/khipu/sign` · `/khipu/verify` · `/khipu/pubkey` routes (a11oy verified).
- **cosign signing:** PENDING — DSSE signatures are `PLACEHOLDER` (see [Compliance](/compliance)).
- **Cardano mainnet anchoring (Provenance Anchor):** in development.
- **Wire D (W3C traceparent):** in-process tracing is **LIVE** on every request; cross-Space
  distributed-trace broker is **NOT wired** (roadmap). See [WIRES D–H](/architecture).
- **Wire E–H (cortex SSE, Khipu receipts, brain mesh, lean-verify):** **LIVE in-process**
  within each Space; cross-Space orchestration layer is roadmap.
- **UDS public demo:** launches Warhacker Jun 16, 2026 — not yet live.
- **Unified SDKs (szl-python, szl-ts):** in development.

*Doctrine v11 LOCKED · 749/14/163 · kernel c7c0ba17 · SLSA L1 honest*

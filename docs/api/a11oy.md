# a11oy API

a11oy has both source/package interfaces and documented HTTP route shapes. Neither fact is a
current readiness claim.

::: warning Current runtime evidence — 2026-08-11
The public provider reported `RUNNING` for revision `f5c395e8`, but `GET /healthz` timed out at
both 20 s and 30 s. a11oy is therefore **UNAVAILABLE for readiness** in this release. See
[/status](/status); do not treat `RUNNING` as operational.
:::

## Canonical host and route shapes

This page uses `https://szlholdings-a11oy.hf.space`. No custom-domain equivalence or custom-domain
readiness observation is asserted here.

| Method | Path | Evidence boundary |
|---|---|---|
| GET | `/healthz` | Readiness/liveness probe; timed out in the recorded observation. |
| GET | `/api/a11oy/v1/mcp/tools` | REST tool discovery shape; not current-ready evidence. |
| POST | `/api/a11oy/v1/mcp/call` | Governed tool-call shape; auth/response must be observed per deployment. |
| POST | `/khipu/sign` | Receipt-envelope route shape; a route is not proof of a signer. |
| POST | `/khipu/verify` | Verification route shape; do not expect `verified:true` without a fresh witness. |
| GET | `/khipu/pubkey` | Published key route shape; response not current-witnessed. |
| GET/POST | `/mcp/` | Published same-origin MCP transport; desktop clients are not current-witnessed. |

Other `/api/a11oy/v1/*` routes are source/published-contract documentation. They must be labelled
with their own measured, modeled, roadmap, or unavailable result when a future runtime witness is
published.

## Source-local package work

Do not infer a public registry package from a repository workspace. Build the checked-out source:

```bash
git clone https://github.com/szl-holdings/a11oy.git
cd a11oy
pnpm install --frozen-lockfile
pnpm build
```

Consult the local package manifests for workspace package names and exports. This documentation
does not make an `npm` publication claim for `@szl-holdings/a11oy-policy`,
`@szl-holdings/a11oy-measurement`, or a similarly named package.

## Receipts and signatures

Runtime receipts labelled `DSSE-PLACEHOLDER` or `UNSIGNED` are unsigned. A Merkle/hash chain is
integrity evidence only. Immutable image-signature or provenance material, if independently
published for a full digest, is separate from runtime receipts and does not make a11oy ready.

Λ is Conjecture 1 — advisory, not a theorem. See [Compliance](/compliance) and
[Evidence](/evidence/).

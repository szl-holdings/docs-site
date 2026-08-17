# API reference

This reference describes published HTTP route shapes. It is not an uptime page: consult
[/status](/status) for the current provider and readiness observation.

| Service | Public route family | Current 2026-08-11 evidence |
|---|---|---|
| [a11oy](/api/a11oy) | `/healthz`, `/api/a11oy/v1/*`, `/khipu/*`, `/mcp/` | Provider `RUNNING` at `f5c395e8`; `/healthz` timed out at 20 s and 30 s — **UNAVAILABLE**. |
| [killinchu](/api/killinchu) | `/api/killinchu/healthz`, `/api/killinchu/v1/*`, `/mcp/` | Provider `RUNNING` at `83142da9`; health route HTTP 200 — **AVAILABLE_AT_OBSERVATION** at that observation. |
| Hatun-MCP | `/readyz`, server card, Streamable HTTP MCP | Provider `PAUSED` at `ebc78be2`; `/readyz` 503, quota `3/3` — **UNAVAILABLE**. |

The standalone Provenance Anchor, Operator, Policy, GraphQL, and unified-SDK surfaces are
roadmap/not deployed. They are not public API or package-installation claims.

## Rules for using this catalog

- A route in a table is a **published contract**, not a proof that it currently responds.
- An HTTP 200 readiness probe proves only that route at the observed time/revision; it does not
  prove authorization for another route.
- `DSSE-PLACEHOLDER`/`UNSIGNED` receipts are unsigned. Hash chains and self-digests can support
  integrity checks but do not authenticate a signer.
- Container image signatures and build attestations are separate artifact evidence and do not
  establish runtime readiness or runtime-receipt signing.

Use [Developer API reference](/developers/api_reference) for the host, auth, and client boundary.

# Developer API reference

This is a catalog of **published route shapes**, not a blanket live-service claim. Current
availability is authoritative only on [/status](/status).

For protocol, authentication, and client-compatibility evidence, use the separate
[MCP integration guide](/developers/mcp_integration); a route catalog is not a client witness.

::: warning Observation — 2026-08-11
killinchu revision `83142da9` was **AVAILABLE_AT_OBSERVATION** at `GET /api/killinchu/healthz` (HTTP 200). a11oy
revision `f5c395e8` was provider `RUNNING`, but `GET /healthz` timed out at 20 s and 30 s:
**UNAVAILABLE**. Hatun-MCP revision `ebc78be2` was `PAUSED`; `GET /readyz` returned 503, quota
`3/3`: **UNAVAILABLE**. Do not infer authorization or client compatibility from a readiness probe.
:::

## Service catalog

| Service | Base host | Readiness route | Published route families | Current state |
|---|---|---|---|---|
| a11oy | `https://szlholdings-a11oy.hf.space` | `/healthz` | `/api/a11oy/v1/*`, `/khipu/*`, `/mcp/` | **UNAVAILABLE** for readiness |
| killinchu | `https://szlholdings-killinchu.hf.space` | `/api/killinchu/healthz` | `/api/killinchu/v1/*`, `/khipu/*`, `/mcp/` | **AVAILABLE_AT_OBSERVATION** at the recorded probe only |
| Hatun-MCP | `https://szlholdings-hatun-mcp.hf.space` | `/readyz` | server card, Streamable HTTP MCP | **UNAVAILABLE**; paused/quota blocked |

`https://a-11-oy.com` is not treated as interchangeable with the a11oy Space in this reference:
no custom-domain readiness/equivalence observation is carried by this release.

## a11oy route shapes

| Method | Path | Contract boundary |
|---|---|---|
| GET | `/healthz` | Readiness/liveness probe; timed out in the current observation. |
| GET | `/api/a11oy/v1/mcp/tools` | REST tool discovery shape; not current-ready evidence. |
| POST | `/api/a11oy/v1/mcp/call` | Governed tool-call shape; auth/response must be observed per deployment. |
| POST | `/khipu/sign` | Receipt-envelope route shape; a route is not proof of a signer. |
| POST | `/khipu/verify` | Verification route shape; do not expect `verified:true` without a fresh witness. |
| GET | `/khipu/pubkey` | Published key route shape; no current response is claimed. |
| GET/POST | `/mcp/` | Same-origin transport shape; client compatibility is separately unverified. |

## killinchu route shapes

| Method | Path | Contract boundary |
|---|---|---|
| GET | `/api/killinchu/healthz` | The only current successful public readiness probe in this release. |
| GET | `/api/killinchu/v1/honest` | Honesty disclosure route. |
| POST | `/api/killinchu/v1/remote-id/decode` | Decoder route; input/result availability must be tested against the deployed revision. |
| POST | `/api/killinchu/v1/counter-uas/evaluate` | Evaluation route; output is decision support, not a safety or actuation authorization. |
| GET | `/api/killinchu/v1/lambda` | Lambda-gate definitions; Λ remains Conjecture 1. |
| GET/POST | `/mcp/` | Same-origin transport shape; no generic desktop-client support is claimed. |

## Authentication and receipt rules

No route in this document is an API-key issuance instruction. An unauthenticated HTTP 200
readiness result does not determine authorization for stateful routes. Hatun-MCP has historical
API-key transport evidence, but it is paused and no authenticated current client session was
witnessed. Use local, user-controlled credential flows only after a current operator path exists.

`DSSE-PLACEHOLDER` and `UNSIGNED` mean the receipt is not signed. A self-digest or hash chain
can be independently recomputed for integrity, but cannot establish signer authenticity. Image
signatures/provenance are separate immutable artifacts; see [Compliance](/compliance).

## Roadmap

The standalone Provenance Anchor, Operator, Policy, GraphQL, and unified-SDK surfaces are
**ROADMAP / NOT DEPLOYED**. Their previously documented routes and package names are not callable
or installable claims.

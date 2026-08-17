# killinchu API

killinchu is a documented FastAPI-style public surface for drone-intelligence decision support.
It decodes and evaluates claims; it is not an actuation or safety authorization system.

::: info Current readiness observation — 2026-08-11
Provider state was `RUNNING` at revision `83142da9` and
`GET /api/killinchu/healthz` returned HTTP 200. This is **AVAILABLE_AT_OBSERVATION** for that public readiness probe
only, not a continuous-availability, authentication, or full-route guarantee. Recheck
[/status](/status) before calling another route.
:::

Base host: `https://szlholdings-killinchu.hf.space`

| Method | Path | Description and evidence boundary |
|---|---|---|
| GET | `/api/killinchu/healthz` | Public readiness route observed HTTP 200 on 2026-08-11. |
| GET | `/api/killinchu/v1/honest` | Doctrine and data-limit disclosure. |
| POST | `/api/killinchu/v1/remote-id/decode` | Decode Remote-ID frames; decoded broadcasts remain unauthenticated claims. |
| POST | `/api/killinchu/v1/ads-b/decode` | Decode ADS-B frames; not ground truth. |
| POST | `/api/killinchu/v1/mavlink/parse` | Parse MAVLink frames; not ground truth. |
| POST | `/api/killinchu/v1/counter-uas/evaluate` | Geofence/Λ decision support; never a weapon or effector authorization. |
| GET | `/api/killinchu/v1/lambda` | Λ-gate definitions; Λ is Conjecture 1. |
| GET/POST | `/mcp/` | Published same-origin MCP transport; desktop-client compatibility is not claimed. |

## Authentication and response truth

The observed health endpoint was public. That does not establish the auth requirements or success
state of any stateful route. This page supplies no API key or customer-portal instruction. Use a
current, user-controlled authorization flow only when it is separately documented and witnessed.

Malformed inputs should receive explicit errors, never a silent pass. Treat timeouts, 4xx, 5xx,
or missing runtime evidence as **UNAVAILABLE**, not as a successful governed result.

## Receipts and provenance

A response may include a receipt/hash-chain field. `DSSE-PLACEHOLDER` and `UNSIGNED` mean no
runtime signature is present; a real hash or recomputable digest does not change that. A cosign
signature for an immutable container image, if published, is image-level provenance only and does
not authenticate a runtime receipt. See [Compliance](/compliance).

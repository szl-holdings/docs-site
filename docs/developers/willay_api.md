# WILLAY API — roadmap contract

WILLAY is a proposed governed-turn interface. This page preserves its intended route shapes; it
does not claim that a public JSON API is currently deployed or ready.

::: warning Runtime boundary — 2026-08-11
The a11oy provider was `RUNNING` at revision `f5c395e8`, but `/healthz` timed out at 20 s and
30 s. a11oy readiness is **UNAVAILABLE**. A provider label, source route, or historical HTTP
response must not be turned into a current WILLAY availability claim. See [/status](/status).
:::

## Planned routes

| Method | Path | State |
|---|---|---|
| GET | `/willay` | Historical/route-shape reference only; no current success claim. |
| GET | `/api/a11oy/v1/willay/classifiers` | ROADMAP. |
| POST | `/api/a11oy/v1/willay/inspect` | ROADMAP. |
| POST | `/api/a11oy/v1/willay/messages` | ROADMAP. |
| GET | `/api/a11oy/v1/willay/receipts` | ROADMAP. |
| POST | `/api/a11oy/v1/verify` | ROADMAP. |
| GET | `/api/a11oy/v1/willay/doctrine` | ROADMAP. |

No API-key/customer-portal instruction or generic client configuration is published for this
surface. A future release must bind a route to a source revision, deployed runtime, route-level
authorization behavior, and exact readiness witness before it is labelled callable.

## Receipt truth

A declined/gated response is not automatically signed. `DSSE-PLACEHOLDER` and `UNSIGNED` are
unsigned labels; hash-chain integrity is not signer authentication. See [Compliance](/compliance).

# MCP integration — contract, authentication, and client evidence

An MCP route, a successful server probe, and a successful desktop-client session are different
evidence levels. This page documents their boundary rather than publishing a generic configuration
that has not been witnessed end to end.

::: warning Runtime observation — 2026-08-11
a11oy’s provider was `RUNNING` at `f5c395e8`, but `/healthz` timed out at 20 s and 30 s:
**UNAVAILABLE**. killinchu’s readiness probe returned HTTP 200 at revision `83142da9`, but that
does not establish its MCP transport or desktop clients. Hatun-MCP was `PAUSED` at `ebc78be2`;
`/readyz` returned 503 and provider quota was `3/3`. No authenticated Hatun client session was
performed in this observation. See [/status](/status).
:::

## Published transport shapes

| Surface | Published transport | Current evidence | Authentication/client boundary |
|---|---|---|---|
| a11oy | REST `/api/a11oy/v1/mcp/tools`, `/mcp/` | Route shapes only; readiness unavailable | No current authenticated client session claimed. |
| killinchu | same-origin `/mcp/` | Service readiness observed; transport not separately probed | No generic desktop-client setup claimed. |
| Hatun-MCP | Streamable HTTP server card + MCP transport | Historical API-key transport evidence; current runtime paused | Authentication and desktop-client use are untestable in this observation. |

The a11oy REST routes are useful source/published-contract references, but they are not a current
quickstart while readiness is unavailable. Do not hard-code a tool count; a fresh successful
catalog response is the only current catalog witness.

## Authentication

Hatun-MCP previously used API-key authentication, but a paused service and a 503 readiness response
cannot prove current issuance, scope, authorization, or client compatibility. This documentation
does not provide a customer portal, token, or copy-paste credential configuration. Use only a
user-controlled operator flow once it is current-witnessed.

An unauthenticated readiness probe is not an authorization test. A complete future witness must
record the exact deployment revision, transport, auth method, target client/version, `initialize`,
`tools/list`, `tools/call`, and `ping` results without exposing credentials.

## Safe development path today

1. Build and test a local source checkout.
2. Treat route names as contracts, not as a current service guarantee.
3. Recheck [/status](/status) immediately before a hosted probe.
4. If the relevant readiness row is `UNAVAILABLE`, fail closed and preserve the response; do not
   retry a governed action as though a timeout were an approval.
5. Publish a client-specific configuration only after that exact client has a witnessed session.

## Receipts

Inspect the returned receipt label when a route is available. `DSSE-PLACEHOLDER` and `UNSIGNED`
are not signatures. A receipt hash chain may be integrity evidence, but it is not a substitute for
an authenticated signer. Image-level Sigstore/cosign material is separate provenance evidence.

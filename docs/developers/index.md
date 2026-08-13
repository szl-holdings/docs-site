# Developer hub

The SZL developer path is evidence-first: source contract, provider state, public readiness,
authentication, and client compatibility are separate facts.

::: warning Current runtime observation — 2026-08-11
**killinchu:** provider `RUNNING`, revision `83142da9`, readiness HTTP 200 at
`/api/killinchu/healthz` (**AVAILABLE_AT_OBSERVATION**, point-in-time). **a11oy:** provider `RUNNING`, revision
`f5c395e8`, but `/healthz` timed out at 20 s and 30 s (**UNAVAILABLE**). **Hatun-MCP:** provider
`PAUSED`, revision `ebc78be2`, `/readyz` HTTP 503, quota `3/3` (**UNAVAILABLE**). Read
[/status](/status) before using a hosted command.
:::

## Start here

1. [Quickstart](/quickstart) — reproduce the pinned source, build locally, and call only a
   currently ready public route.
2. [API reference](/api/) — published route shapes and their runtime boundary.
3. [MCP integration](/developers/mcp_integration) — protocol witnesses, authentication, and the
   distinction between a server contract and a desktop-client session.
4. [SDKs](/sdks/) — planned clients; no unverified registry installation path.
5. [Evidence](/evidence/) — source, build, image, receipt, and DOI provenance.

## Truth labels

| Label | Meaning |
|---|---|
| **SOURCE** | Present in a pinned repository revision; not a deployment claim. |
| **PUBLISHED CONTRACT** | Documented route or interface shape; not necessarily available now. |
| **AVAILABLE_AT_OBSERVATION** | A successful public readiness probe at a stated time and revision. |
| **UNAVAILABLE** | A timeout, provider pause, quota block, failed probe, or missing readiness witness. |
| **HISTORICAL** | A prior observation; never promoted to current availability. |
| **ROADMAP** | No released source/runtime/package evidence for the described surface. |

## Route, package, and signature boundary

- A documented HTTP route is not an authorization grant. The route-specific auth state and any
  observed response belong in the API/MCP pages.
- A source workspace is not a registry package. Use a source checkout unless a package’s exact
  registry release and provenance are independently published.
- A hash chain is integrity evidence, not signer authentication. Runtime receipts labelled
  `DSSE-PLACEHOLDER` or `UNSIGNED` are unsigned.
- Image-level cosign/Sigstore material, if present for an immutable digest, is image provenance;
  it neither signs a runtime receipt nor makes a runtime ready.

Doctrine v11 source contract: `749 / 14 / 163` at `c7c0ba17`; Λ is Conjecture 1, not a theorem.

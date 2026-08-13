# Runtime status

This page is the canonical, versioned observation for public SZL runtime availability. It is
not an uptime monitor and it does not promote source, a published revision, or a historical
probe into a current readiness claim.

## Documentation artifact identity

The deployed site's machine-readable `/deployment.json` is the authority for
its exact protected source revision, workflow run, file count, and artifact Merkle root. The Pages
workflow generates that file from the revision it actually checks out; this page never hard-codes
its predecessor as the release source. Documentation identity still does **not** prove that a
product runtime is running or ready.

## Public runtime observation — 2026-08-11

Observed through the public Hugging Face API and unauthenticated public probes. **Provider state**
and **readiness** are separate: a `RUNNING` provider state is not a readiness success.

Observation window ended at **2026-08-11T07:27:11Z**. The same evidence is published as the
machine-readable [`/runtime-status.json`](/runtime-status.json) contract; full revisions, bounded
probe windows, and non-claims in that file are part of this status record.

| Surface | Published revision | Provider state | Readiness probe | Evidence state |
|---|---|---|---|---|
| **a11oy** | `f5c395e81eaa306b2eb1c8bbf8773f07664ce564` | `RUNNING` | `GET /healthz` timed out at both 20 s and 30 s | **UNAVAILABLE** — readiness not observed |
| **killinchu** | `83142da9526e2c0ddfe1e78eb99a20940cde0cf3` | `RUNNING` | `GET /api/killinchu/healthz` → HTTP 200 | **AVAILABLE_AT_OBSERVATION** — this observation only |
| **Hatun-MCP** | `ebc78be2ffffb08241a1da1eb8ebcc6d34a1ab34` | `PAUSED` | `GET /readyz` → HTTP 503; provider quota `current=3`, `limit=3` | **UNAVAILABLE** |

The a11oy timeout is an availability result, not evidence that a route is absent or that its
source is invalid. The killinchu result is a point-in-time readiness observation, not a
continuous-availability guarantee. No authenticated Hatun-MCP `initialize` or `tools/list`
session was performed in this observation.

## How to read developer commands

- **Source-local** commands run against a checked-out repository and can be reproduced without a
  public runtime.
- **Published contract** means a route shape exists in source or prior documentation. It is not a
  current availability promise.
- **Historical witness** identifies a past observed response and must include its date.
- **AVAILABLE_AT_OBSERVATION** is reserved for a successful probe in the table above.
- **UNAVAILABLE** means an integration command must fail closed; do not treat a timeout, 503, or
  provider `RUNNING` state as success.

Developer pages link here before presenting a hosted command. Commands against a11oy or
Hatun-MCP are not a current quickstart while this observation remains `UNAVAILABLE`.

## Route and authentication boundary

| Runtime | Canonical public readiness route | Authentication evidence in this observation |
|---|---|---|
| a11oy | `/healthz` | No authenticated session was tested; readiness is unavailable. |
| killinchu | `/api/killinchu/healthz` | Public readiness returned HTTP 200; this does not establish authorization for other routes. |
| Hatun-MCP | `/readyz` | The service is paused. Prior API-key transport evidence is historical, not a current client-session claim. |

The same-origin `/mcp/` transports and `/khipu/*` route shapes are not independently labelled
ready by this observation. See [MCP integration](/developers/mcp_integration) for the client
boundary and [API reference](/api/) for the route catalog.

## Supply-chain and receipt truth

- **Runtime receipts:** no current runtime receipt signature is claimed. A hash-chain or
  self-digest demonstrates integrity of the supplied bytes; it does not authenticate a signer
  when the receipt is labelled `DSSE-PLACEHOLDER` or `UNSIGNED`.
- **Image signatures:** image-level cosign/Sigstore evidence, if published for an immutable image
  digest, is a separate artifact class. It does not make a paused or timing-out runtime ready and
  does not sign a runtime receipt.
- **Build provenance:** source CI, SBOMs, and attestations describe their named build artifacts.
  They are not deployment or readiness evidence.
- **SLSA:** the documented posture is **L1 (honest)**. L2/L3 are not claimed.

## Source and proof contract

Doctrine v11 is source-locked at `749 declarations / 14 unique axioms / 163 raw sorry tokens`,
measured at exact commit `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f` with the repository-owned
counter. That is a pinned source contract, not a value received from a public runtime or a claim
about the differently bound `lutar-v18.0.0` tag. Reproduce it on the [Evidence](/evidence/) page.

*Runtime observation ended 2026-08-11T07:27:11Z · deployed docs identity: `/deployment.json` · SLSA L1 honest*

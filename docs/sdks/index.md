# SDKs

`szl-python` and `szl-ts` are planned unified client interfaces. They are **not published package
releases** in this documentation snapshot. Do not run an install command for a package name until
its exact registry version, integrity, source revision, and release provenance are published.

## What is available today

| Need | Supported path | Evidence boundary |
|---|---|---|
| Lean source/proof reproduction | Clone the pinned `lutar-lean` source snapshot | Source contract, not runtime evidence. |
| a11oy development | Clone/build the a11oy source workspace | Source-local; public readiness currently unavailable. |
| killinchu public readiness | `GET /api/killinchu/healthz` after checking [/status](/status) | HTTP 200 observed on 2026-08-11 only. |
| Receipt integrity | Recompute the documented hash/self-digest when bytes are available | Integrity is not signer authentication. |

The standalone Provenance Anchor, Operator, and Policy roles remain roadmap/not deployed. Their
names are not registry-package or cloneable-repository promises in this page.

## Planned clients

| SDK | State | Installation rule |
|---|---|---|
| `szl-python` | Planned | No PyPI command is published. |
| `szl-ts` | Planned | No npm/pnpm command is published. |
| Agentic Mesh SDK | Roadmap | No JavaScript, Python, or Go registry package is published. |

See [Python](/sdks/python), [TypeScript](/sdks/typescript), and
[Source-local packages](/developers/substrate_packages). Current runtime availability belongs on
[/status](/status), not in an SDK package claim.

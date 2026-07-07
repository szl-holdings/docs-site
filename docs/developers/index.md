# Developer Hub

**SZL Holdings developer hub** · Doctrine v11 (LOCKED 749 declarations / 14 unique axioms / 163 tracked sorries) · License: Apache-2.0

> Every action signed. Every decision gated. Every receipt verifiable.

SZL Holdings builds a **formally-verified governance gate for agentic AI**. This section is the
developer-facing entry point: quickstart, full API reference, MCP integration, and runnable examples.
Build your own "organ" on the same substrate the shipping flagships use.

> **Migrated here from [`szl-holdings/developers`](https://github.com/szl-holdings/developers).**
> This is the canonical published home of the developer docs. The source repo remains active
> during the consolidation but is now marked deprecated in favor of this site.

## ◇ Featured: the Holographic Estate

The frontier tier rendered as one live 3D holographic lattice — ~50 governed surfaces, each lit
by a live a11oy endpoint. Vendored WebGL2 with optional WebGPU; 0 runtime CDN; mobile-friendly.
**[Open the Holographic Estate →](https://szlholdings-a11oy.hf.space/holographic)**

## The shipping flagships

Two flagships ship today with live `/healthz`:

| Flagship | Role | Live base URL |
|----------|------|---------------|
| **a11oy** | Λ-gate router / policy + receipt substrate; hosts the Hatun-MCP catalog. Bundles the **Sentinel** (policy / immune), **Memory** (provenance anchoring) and **Operator** (receipt-DAG) verticals. | `https://szlholdings-a11oy.hf.space` |
| **killinchu** | Defense vertical — counter-UAS / drone intelligence | `https://szlholdings-killinchu.hf.space` |

Both shipping flagships return Doctrine v11 verbatim from `/healthz`: `749 declarations / 14 unique axioms / 163 tracked sorries`, locked at `c7c0ba17`. Λ uniqueness is **Conjecture 1 (NOT a theorem)** — stated honestly. SLSA **L1 (honest)**.

## Pages

| Doc | What it covers |
|-----|----------------|
| [Quickstart](/developers/quickstart) | 5-minute walkthrough: install client, list tools, dispatch a command, verify a receipt |
| [API Reference](/developers/api_reference) | Every public endpoint across the shipping flagships |
| [MCP Integration](/developers/mcp_integration) | Add the Hatun-MCP server to Claude Desktop / Cursor |
| [GraphQL](/developers/graphql) | Unified GraphQL surface — example queries, Apollo Client, MCP-vs-GraphQL |
| [Substrate Packages](/developers/substrate_packages) | Monorepo `platform/packages/` — build your own organ |
| [SDK Drop-in](/developers/sdk_drop_in) | **Agentic Mesh SDK** — wrap *any* app (Next.js/FastAPI/Express/Go/CLI) in 3 lines |
| [Verify](/developers/verify) | Verify a signed receipt against the org public key |
| [Willay API](/developers/willay_api) | Willay gated-turn API surface |

## Examples at a glance

- [`python_quickstart.py`](https://github.com/szl-holdings/docs-site/blob/main/docs/developers/EXAMPLES/python_quickstart.py) — sign a payload, verify, build a Khipu chain
- [`mcp_claude_config.json`](https://github.com/szl-holdings/docs-site/blob/main/docs/developers/EXAMPLES/mcp_claude_config.json) — drop-in Claude Desktop config
- [`policy_filter_example.py`](https://github.com/szl-holdings/docs-site/blob/main/docs/developers/EXAMPLES/policy_filter_example.py) — submit a payload, get verdict + receipt
- [`operator_command_example.py`](https://github.com/szl-holdings/docs-site/blob/main/docs/developers/EXAMPLES/operator_command_example.py) — dispatch a personal-aide command
- [`willay_quickstart.py`](https://github.com/szl-holdings/docs-site/blob/main/docs/developers/EXAMPLES/willay_quickstart.py) — a Willay gated turn

## The provenance model in one paragraph

You call a flagship endpoint. The a11oy **Sentinel** policy gate evaluates the input deny-by-default. The decision is wrapped
in a **DSSE** (Dead Simple Signing Envelope) signed with ECDSA-P256-SHA256, and chained onto the
**Khipu Merkle DAG** — a hash-linked, summation-checked ledger that is **replay-verifiable offline.**
You can verify any receipt against the organ's public key (`/khipu/pubkey`). Deploy the whole thing
**airgapped** with UDS Zarf bundles.

## Related repos

- **[szl-holdings/platform](https://github.com/szl-holdings/platform)** — substrate monorepo (`packages/`)
- **[szl-holdings/hatun-mcp](https://github.com/szl-holdings/hatun-mcp)** — the doctrine-aware MCP server (the fleet's only spec-compliant Streamable HTTP MCP transport)
- **[szl-holdings/lutar-lean](https://github.com/szl-holdings/lutar-lean)** — Lean 4 / Mathlib formalization (749/14/163)
- **DOI** [10.5281/zenodo.20434308](https://doi.org/10.5281/zenodo.20434308) · **ORCID** [0009-0001-0110-4173](https://orcid.org/0009-0001-0110-4173)

---

Doctrine v11 LOCKED · 749/14/163 · kernel c7c0ba17 · Λ = Conjecture 1 · Apache-2.0

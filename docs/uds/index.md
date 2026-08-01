# UDS — Unified Demo Surface

::: warning Roadmap — public launch not witnessed
The **Unified Demo Surface (UDS)** is not a publicly witnessed end-to-end deployment.
This page documents the surface being wired. Until a deployment is independently
verified, use the individual flagship REST surfaces or the authenticated
[Hatun-MCP](#mcp-governed-tools) runtime with the evidence boundary below.
:::

UDS is the single, governed demo surface that fans a customer request out across the
five SZL flagships, gathers each organ's signed verdict, and returns a **3-of-4
Byzantine-fault-tolerant consensus receipt** — every step provenanced on the Khipu
chain.

> Doctrine v11 **LOCKED** — 749 declarations / 14 axioms / 163 sorries · locked_at `c7c0ba17`.
> SLSA L1 (honest). Λ = Conjecture 1 (not a theorem). Quechua names are brand naming only.

## What UDS does

1. **Single intake** — one request hits the UDS aggregator (`killinchu` acts as the
   consensus aggregator at the `/api/killinchu/uds/v1/*` surface).
2. **Fan-out to organs** — each flagship (`a11oy`, `memory`, `sentinel`, `operator`,
   `killinchu`) signs its verdict with its own ECDSA-P256 cosign key
   (`<organ>-cosign`).
3. **Quorum** — a canonical receipt is emitted only when **3 of 4** organ signatures
   agree (the BFT safety property). Disagreement yields a clearly-labelled rejection
   receipt.
4. **Provenance** — the consensus receipt is pushed to the public Khipu chain and a
   Rekor transparency entry, so any party can re-verify the decision years later.

## MCP-governed tools

Until UDS opens publicly, the dedicated **Hatun-MCP** service reports a ready
Streamable HTTP runtime at `https://szlholdings-hatun-mcp.hf.space/`. Its public
[server card](https://szlholdings-hatun-mcp.hf.space/.well-known/mcp/server-card.json)
requires API-key authentication and is the source of truth for the current catalog; no
tool count is frozen here. This release has not witnessed an authenticated client session.
See the [MCP integration guide](/developers/mcp_integration) and the
[flagship pages](/flagships/) for the evidence states of today-available surfaces.

## Honesty labels

- **UDS public demo is not yet live** — no public launch is claimed without an
  independently witnessed deployment. The consensus primitive
  (`/api/killinchu/uds/v1/mission/execute`, `/consensus/verify`) is the surface being
  wired; this page changes state only after that evidence exists.
- Per-organ signatures are **real ECDSA-P256-SHA256** over the DSSE PAE — verifiable
  with `cosign verify-blob --key <organ>.pub`.
- Drone positions used in UDS killinchu demos are **deterministic simulated** (seeded),
  and geofence zones are a **static snapshot** — both clearly labelled at the API.

---

*Doctrine v11 LOCKED · 749 / 14 / 163 · c7c0ba17 — signed Yachay `<yachay@szlholdings.dev>` · Co-Authored-By: Perplexity Computer Agent · Apache-2.0.*

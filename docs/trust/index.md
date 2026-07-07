# Trust — Public Transparency Layer

> A measurable governance operator on the receipt-bus σ-algebra of agentic AI — publishing Covenant Proof Standard run artifacts from real production executions with `mocked:false` evidence chains for external auditability.

> **Migrated here from [`szl-holdings/szl-trust`](https://github.com/szl-holdings/szl-trust).**
> This is the canonical published home of the trust/transparency docs. The source repo remains
> active during consolidation but is now marked deprecated in favor of this site.

## What this is

The trust layer is the public transparency layer of the SZL Holdings governed AI platform. It publishes Covenant Proof Standard (CPS) run artifacts — hash-chained, cryptographically verifiable governance receipts from real production executions. The canonical reference run is the **E4 Codex Kernel (2026-04-29)**: 12 receipts, all `mocked:false`, 12 proof-ledger steps, with a `deployment_contract.json` anchoring the full run to a specific `repo_commit`. External auditors, partners, and regulators can verify every decision without SZL tooling.

## Why it matters

Regulated AI must demonstrate that decisions were made within approved policy bounds — and that evidence is not fabricated post-hoc. This layer provides the artifact registry: every receipt is deterministic (same inputs + policy → same byte-string), hash-chained (no receipt can be inserted without breaking the chain), and published at rest (no live system to query). This is what Article 12 of the EU AI Act and NIST AI RMF traceability requirements look like in practice.

## Deep dive

See **[Trust architecture (deep dive)](/trust/trust-deep)** for the full inclusion-proof chain, the Rekor-style transparency-log anchor, and the layered verification paths for a sophisticated external reviewer.

## E4 Codex Kernel run at a glance

| Metric | Value |
|--------|-------|
| Run ID | `E4-codex-kernel-governed-loop-unified-replit-all-in-one` |
| Date | 2026-04-29 |
| Receipts | 12 (`mocked:false` on all) |
| Proof ledger steps | 12 (hash-chained, covenant-v1) |
| Span validators | `state_transition_rule`, `drift_bounds`, `human_gate`, `evidence_provenance` — all PASS |
| Policy version | `covenant-v1` |
| Repo commit | `7eb623f8b870128e615ac6be9880e0265204b454` |

## Verify it yourself

Receipts are plain JSON, verifiable without any SZL tooling. The **raw run artifacts and the
`verify.sh` script remain the CC-BY-4.0 registry of record** in the source repository
[`szl-holdings/szl-trust`](https://github.com/szl-holdings/szl-trust) under
[`runs/E4-codex-kernel-2026-04-29/`](https://github.com/szl-holdings/szl-trust/tree/main/runs/E4-codex-kernel-2026-04-29)
— they are intentionally not re-hosted here so the audit registry has a single source of truth:

```bash
git clone https://github.com/szl-holdings/szl-trust && cd szl-trust

# Inspect the E4 Codex Kernel run
cat runs/E4-codex-kernel-2026-04-29/run_manifest.json | jq '.deliverables'
cat runs/E4-codex-kernel-2026-04-29/proof_ledger.jsonl | head -3 | jq '.'

# Verify mocked:false on all receipts
cat runs/E4-codex-kernel-2026-04-29/trace.jsonl | jq '[.decision_receipt.mocked] | unique'
# → [false]

# Or run the one-shot verifier (5 checks, < 30s, no SZL tooling)
./verify.sh
```

## Scope (honest)

- **Not a live execution system.** A read-only audit artifact registry — it publishes receipts, it does not execute AI decisions.
- **Not independently sufficient for trust.** Receipts should be verified against the Ouroboros runtime and Covenant Policy Engine; this layer does not ship the verifier.
- **Not a general-purpose blockchain ledger.** Receipts are JSON artifacts anchored by Merkle roots; Cardano anchoring (via the a11oy Memory provenance anchor) is separate.

---

Doctrine v11 LOCKED · 749/14/163 · kernel c7c0ba17 · Λ = Conjecture 1 · CC-BY-4.0

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

Receipts are plain JSON, verifiable without proprietary SZL tooling. The canonical
docs-site copy now contains the one-shot [`verify.sh`](https://github.com/szl-holdings/docs-site/blob/main/docs/trust/verify.sh)
and the byte-identical [E4 run artifact set](https://github.com/szl-holdings/docs-site/tree/main/docs/trust/runs/E4-codex-kernel-2026-04-29).
The immutable source commit, per-file SHA-256 values, and migration boundary are recorded in
[Migration provenance](https://github.com/szl-holdings/docs-site/blob/main/docs/trust/MIGRATION_PROVENANCE.md).

```bash
git clone https://github.com/szl-holdings/docs-site && cd docs-site

# Inspect the canonical E4 Codex Kernel copy
jq '.deliverables' docs/trust/runs/E4-codex-kernel-2026-04-29/run_manifest.json
head -3 docs/trust/runs/E4-codex-kernel-2026-04-29/proof_ledger.jsonl | jq '.'

# Verify mocked:false on every trace receipt
jq -s '[.[].decision_receipt.mocked] | unique' \
  docs/trust/runs/E4-codex-kernel-2026-04-29/trace.jsonl
# → [false]

# Run the one-shot verifier; it prefers the colocated canonical receipt
bash docs/trust/verify.sh
```

The predecessor repository remains readable for provenance and rollback. Its lifecycle is
`deprecated`, not `archived`, until the owner-authorized GitHub mutation and post-archive
smoke tests are complete.

## Scope (honest)

- **Not a live execution system.** A read-only audit artifact registry — it publishes receipts, it does not execute AI decisions.
- **Not independently sufficient for trust.** Receipts should be verified against the Ouroboros runtime and Covenant Policy Engine; this layer does not ship the verifier.
- **Not a general-purpose blockchain ledger.** Receipts are JSON artifacts anchored by Merkle roots; Cardano anchoring (via the a11oy Memory provenance anchor) is separate.

---

Doctrine v11 LOCKED · 749/14/163 · kernel c7c0ba17 · Λ = Conjecture 1 · CC-BY-4.0

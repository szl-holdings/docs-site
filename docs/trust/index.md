# Trust - Public Transparency Layer

> A read-only registry of historical governance artifacts. It helps a reviewer inspect included
> bytes and provenance fields; it is not a live execution service or evidence of current
> production availability.

> **Migrated from [`szl-holdings/szl-trust`](https://github.com/szl-holdings/szl-trust).** This
> docs site is the canonical published location during the stated migration lifecycle.

## What this is

The Trust layer publishes Covenant Proof Standard (CPS) artifact sets: JSON receipts, a
hash-linked ledger, manifests, and a local verifier. These artifacts can support an integrity
review of the bytes that are actually included. They do not independently establish a current
runtime, an externally witnessed deployment, a customer workflow, or a signature that is not
present in the reviewed artifact.

The canonical E4 Codex Kernel artifact set is a **historical deterministic demonstration**. Its
own lineage identifies `model_provider` as `proxy_or_offline_emulator`, its model version as
`deterministic`, and its final state as `demo_epoch`. Its `mocked:false` fields describe the
receipt data; they do not convert this demonstration into production-runtime evidence.

## E4 artifact set at a glance

| Field | Included artifact value | Truth label |
|-------|-------------------------|-------------|
| Run ID | `E4-codex-kernel-governed-loop-unified-replit-all-in-one` | `HISTORICAL` |
| Date | 2026-04-29 | `HISTORICAL` |
| Receipts | 12 with `mocked:false` fields | `MODELED` demonstration evidence |
| Proof ledger | 12 hash-linked steps | inspectable local artifact |
| Model provider | `proxy_or_offline_emulator` | `MODELED` |
| Final state | `demo_epoch` | demonstration state |
| Runtime availability | not established by this artifact | consult [Runtime status](/status) |

## What a reviewer can check locally

The docs-site copy contains [`verify.sh`](https://github.com/szl-holdings/docs-site/blob/main/docs/trust/verify.sh)
and the [E4 artifact set](https://github.com/szl-holdings/docs-site/tree/main/docs/trust/runs/E4-codex-kernel-2026-04-29).
The [migration provenance](/trust/MIGRATION_PROVENANCE) page records the file boundary.

```bash
git clone https://github.com/szl-holdings/docs-site && cd docs-site

jq '.deliverables' docs/trust/runs/E4-codex-kernel-2026-04-29/run_manifest.json
head -3 docs/trust/runs/E4-codex-kernel-2026-04-29/proof_ledger.jsonl | jq '.'
jq -s '[.[].decision_receipt.mocked] | unique' \
  docs/trust/runs/E4-codex-kernel-2026-04-29/trace.jsonl
bash docs/trust/verify.sh
```

Command output only verifies what the command and its present dependencies actually return. A
failed network call or absent signature is a discrepancy to report, not a condition this page can
silently upgrade.

## Scope boundary

- **Not a live execution system.** It publishes historical artifacts and does not execute AI decisions.
- **Not independently sufficient for trust.** Review the exact source, runtime, and policy context separately.
- **Not a general-purpose blockchain ledger.** The files are JSON artifacts with hash-link fields;
  Cardano mainnet anchoring is not claimed here.
- **Not a signature authority.** Receipt-signature posture is governed by [Compliance](/compliance)
  and must be verified on the exact artifact.

For an investor-facing map of this boundary, see the [Diligence index](/investors/diligence).

# Trust Architecture - Artifact Review Guide

This page explains what a reviewer can and cannot infer from the public Trust artifacts. It is
designed for investors and auditors who need an evidence boundary before reading a receipt,
manifest, or hash chain.

## First, establish the artifact class

The public E4 Codex Kernel set is a historical deterministic demonstration, not a current
production-runtime witness. Its included lineage identifies `proxy_or_offline_emulator` and
`deterministic`; its final-state artifact is labeled `demo_epoch`. The presence of `mocked:false`
fields does not establish external deployment, a live customer workflow, or independent operation.

| Question | What the included files can support | What they cannot support alone |
|---|---|---|
| Are the included bytes internally consistent? | local hash/manifest/ledger inspection | a claim about a current remote deployment |
| Did the documented demo emit receipt fields? | the historical trace fields | a claim of production use |
| Is a chain structurally continuous? | step-order and hash-link checks where the data permits | a cryptographic signature claim without a signature |
| Is a public runtime available? | nothing by itself | check [Runtime status](/status) |

## Layer 1 - local artifact inspection

`verify.sh` and the JSON set provide a convenience path to inspect the published files. Treat any
result as scoped to the exact revision and dependencies used. The script does not turn a static
artifact into a live system witness.

```bash
git clone https://github.com/szl-holdings/docs-site && cd docs-site

jq '.version_lineage' docs/trust/runs/E4-codex-kernel-2026-04-29/run_summary.json
jq '.final_state.epoch_label' docs/trust/runs/E4-codex-kernel-2026-04-29/final_state.json
head -3 docs/trust/runs/E4-codex-kernel-2026-04-29/proof_ledger.jsonl | jq '.'
```

## Layer 2 - signatures require exact evidence

Do not infer a DSSE or ECDSA signature from a receipt schema, a hash chain, a public key, or a
successful parser. The reviewer must inspect the exact envelope and signature bytes, then verify
them with the applicable public key and algorithm. If an envelope, signature, key identity, or
verification command is absent or fails, the correct result is `UNAVAILABLE` or failed verification.

The central [Compliance](/compliance) page is authoritative for the published Khipu
receipt-signature posture. A container-image signature, if independently verified for a pinned
digest, is a different artifact and does not establish a receipt signature or live runtime.

## Layer 3 - hash-chain review

The included `proof_ledger.jsonl` is intended to be reviewed as a sequence of artifacts. A
reviewer can check continuity, per-file digests, and manifest values using the exact published
revision. Such checks demonstrate byte-level consistency within the inspected set; they do not
prove source provenance, remote storage persistence, or an external consensus system.

## Layer 4 - external anchors and witnesses

Any Rekor, Sigstore, or multi-party witness assertion must be evaluated as a separate, pinned
artifact with a current verification result. This site does not use a historical URL, a theoretical
protocol description, or a code sample as a substitute for that evidence.

The doctrine's formal statements also retain their own status: Lambda is Conjecture 1, and the
broader proof corpus is `MIXED`. See [Evidence](/evidence/) and [Proof](/proof).

## Reviewer checklist

1. Record the exact artifact path, commit, digest, and observation date.
2. Identify whether it is `REAL`, `MEASURED`, `MODELED`, `ROADMAP`, or `UNAVAILABLE`.
3. Check [Runtime status](/status) separately for operational availability.
4. Verify signatures only when the exact signed bytes and verification material are present.
5. Keep proof status separate from source and runtime status.

For the public investment and engagement path, use the [Investor brief](/investors/) and
[Diligence index](/investors/diligence).

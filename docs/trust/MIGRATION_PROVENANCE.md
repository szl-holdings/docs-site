# szl-trust migration provenance

Status: **candidate patch; not yet published to GitHub**

This receipt binds the canonical docs-site copy to
`szl-holdings/szl-trust@1f021cc6204d3eea272e246a8d81405511e924a1`.
The eleven E4 run artifacts are byte-identical copies. The verifier was copied and
then canonicalized so it prefers its colocated receipt and falls back to the
`docs-site` raw path, never the deprecated repository.

## File integrity

| Canonical path under `docs/trust/` | Source SHA-256 | Canonical SHA-256 | Result |
|---|---|---|---|
| `verify.sh` | `43b6d897504108c148a67b6c7d019b95eefcaf8be1901fb307b7f8d8b765e2af` | `5fba3dc739a9564654c6991fcae6162837394b75f71f04bb5682471645c089c5` | EXPECTED_CHANGE: canonical path resolution |
| `runs/E4-codex-kernel-2026-04-29/decision_receipt.json` | `c78ce4d1d08b66635581d74329e31bdac9fda4b40c632374adcc78edcd513f16` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/deployment_contract.json` | `b0d01a4db045653b052c6cf8a3c2f81dcf62fd04f1ea63d6c318aadd7470be19` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/final_state.json` | `f74d791fc57b0d1abbb16a8e8886acbef71513116beeb777ec149639a976bbe3` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/final_table_preview.json` | `a02e963fc506051b7f83be1eb2c115208acc8366b8111f6619e81c738907b8ac` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/proof_ledger.jsonl` | `dda5764ce378481a0208c831f85a99574a41d6fffffa96ab3a320eae26d19797` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/run_identity.json` | `67b63d8d876112aa74e004f98e3681f7a37062c0d3474eda5f12113a3bc93bfb` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/run_manifest.json` | `a2d4d2935cb21ea30fa4f1ede560c091a8c558b54c00c26a7b0cee28a5265e8c` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/run_summary.json` | `dbaa645fdd22806bc70c516be55c24b44d2bcf87a2d10abd0167795946d90833` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/secrets_status.json` | `6e3a664cb437b565da07edbb75168413e966de7536e88c670d18085c1ce0b235` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/trace.jsonl` | `7a6f6f76cbcd2be7e98107a8c48a2056e91295406be82f18f0774cf36f705c47` | same | BYTE_IDENTICAL |
| `runs/E4-codex-kernel-2026-04-29/version_lineage.json` | `389b69e01a7ae9095d91d394bf8727e8d9dbe651c89acec01d3e676bb684955f` | same | BYTE_IDENTICAL |

## Verification

```bash
bash -n docs/trust/verify.sh
bash docs/trust/verify.sh
```

The first command validates shell syntax. The second prefers the colocated E4 receipt,
then performs the live public-key and Lean-kernel checks. Network-dependent results must
be recorded separately from the immutable artifact-integrity result.

## Lifecycle boundary

- The predecessor is `deprecated`, not `archived`.
- No GitHub mutation or public deployment is asserted by this file.
- Archive only after this patch is merged, the canonical raw links return HTTP 200,
  inbound links are repointed, and rollback links have been smoke-tested.
- The original repository remains the provenance source pinned above; the docs site is
  the canonical discoverability and verification surface.


# Doctrine source ledger query

> **Current executable scope:** reproduce the exact Lean source snapshot locally. Cross-runtime
> agreement is **UNAVAILABLE** because a11oy readiness timed out and the relevant killinchu action
> route was not probed. A mutable dataset `main` file is not an immutable doctrine witness.

## Exact source measurement

```bash
LUTAR_REV=c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f
git clone --filter=blob:none --no-checkout https://github.com/szl-holdings/lutar-lean.git lutar
cd lutar
git checkout --detach "$LUTAR_REV"
test "$(git rev-parse HEAD)" = "$LUTAR_REV" || exit 1
python3 -I -B .github/scripts/lean_numbers.py --repo-path . --ref "$LUTAR_REV"
```

Locally remeasured on 2026-08-11 with the repository-owned counter:

- 749 declarations;
- 14 unique axioms (15 raw declarations);
- 163 raw `sorry` tokens, 149 outside pure line comments.

Lambda remains Conjecture 1. This exact snapshot is not the commit referenced by annotated tag
`lutar-v18.0.0`; do not bind the tag and commit as one artifact.

## Historical runtime comparison

Older recipe text queried a mutable `szl-lake/resolve/main/lake_index.json` and the a11oy and
killinchu `/v1/honest` route shapes. That method cannot establish durable agreement because:

1. `main` can advance after the observation;
2. provider `RUNNING` does not prove route readiness;
3. the 2026-08-11 a11oy readiness probe timed out;
4. the killinchu health response did not witness `/v1/honest`;
5. a response needs an exact repository revision and preserved bytes.

To promote the cross-surface comparison, pin the dataset revision and SHA-256, capture each exact
runtime revision, perform bounded route probes, preserve raw responses, and compare the full
snapshot identity—not only the eight-character prefix.

## Evidence boundary

The repository counter is source evidence. It does not prove a runtime, deployment, signature,
or lake publication. See [/evidence/](/evidence/), [/status](/status), and
[/compliance](/compliance).

---

*Exact source measurement available · cross-runtime ledger agreement UNAVAILABLE*

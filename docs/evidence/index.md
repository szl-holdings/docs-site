# Evidence and reproduction

Every claim must identify its evidence class and anchor. For a deployed documentation artifact,
`/deployment.json` is the exact source/workflow/file-root authority; it does
not certify a product runtime.

## Locked source contract

Doctrine v11's measured source contract is exact commit
`c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f`. It is **not** the commit referenced by annotated tag
`lutar-v18.0.0`, so the two identifiers must not be presented as one artifact:

```bash
LUTAR_REV=c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f
git clone --filter=blob:none --no-checkout https://github.com/szl-holdings/lutar-lean.git lutar
cd lutar
git checkout --detach "$LUTAR_REV"
test "$(git rev-parse HEAD)" = "$LUTAR_REV" || { echo "wrong locked snapshot"; exit 1; }
python3 -I -B .github/scripts/lean_numbers.py --repo-path . --ref "$LUTAR_REV"
```

Locally remeasured on 2026-08-11 with that checked-in counter: `749 declarations / 14 unique
axioms / 163 raw sorry tokens` (`149` outside pure line comments). This is a pinned source
assertion. To inspect current `main`, resolve and print its full SHA first, then label the output
**CURRENT SOURCE**. Never substitute a tag or shallow default-branch clone for this snapshot.

## Runtime observation

The dated public observation is maintained on [/status](/status): a11oy was `RUNNING` but
readiness **UNAVAILABLE** (timeouts), killinchu was **AVAILABLE_AT_OBSERVATION** for its documented health probe,
and Hatun-MCP was `PAUSED`/**UNAVAILABLE**. Runtime source, provider state, readiness, and an
authenticated client session remain distinct evidence classes.

## DOI register

| DOI | Stated role | Boundary |
|---|---|---|
| [10.5281/zenodo.20434276](https://doi.org/10.5281/zenodo.20434276) | Ouroboros Thesis v18.0, versioned | Cite the versioned deposit; it is not a current runtime witness. |
| [10.5281/zenodo.19944926](https://doi.org/10.5281/zenodo.19944926) | Concept DOI | Always-latest reference; do not use as immutable-release evidence. |
| [10.5281/zenodo.20424992](https://doi.org/10.5281/zenodo.20424992) | Ouroboros Thesis v14, versioned deposit (`paper-v14-1.0.2`) | The deposit title/version is identified here; record the deposited filename and SHA-256 before binding a file to source evidence. |
| [10.5281/zenodo.20434308](https://doi.org/10.5281/zenodo.20434308) | Lutar Lean 4 Formal Proofs v18.0.0 companion | Companion identity is not a source-revision binding; record the deposited filename and SHA-256 before treating a file as source evidence. |

The former thesis repository is retired. This release does not rely on an unavailable repository
`CITATION.cff` as the complete DOI source. A future expanded register must carry each deposit’s
version, artifact filename, SHA-256, and relation to a named source revision.

## Receipt and image evidence

`DSSE-PLACEHOLDER` and `UNSIGNED` mean a runtime receipt is unsigned. A SHA-256/SHA3-256 hash
chain or self-digest can be recomputed for integrity but cannot authenticate a signer. Image
cosign/Sigstore verification, if independently published for a full immutable digest, applies to
that image only; it does not sign a runtime receipt or establish runtime readiness.

See [Proof](/proof), [Verify](/developers/verify), and [Compliance](/compliance).

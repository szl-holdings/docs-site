# Proof, source lineage, and DOI boundary

The proof corpus is source evidence. It is not a claim that a public application endpoint is
currently ready.

## Locked proof contract

Doctrine v11's measured snapshot is `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f`:
`749 declarations / 14 unique axioms / 163 raw sorry tokens`. It is not the commit referenced by
tag `lutar-v18.0.0`. Λ is Conjecture 1, not a theorem. Reproduce the exact revision:

```bash
LUTAR_REV=c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f
git clone --filter=blob:none --no-checkout https://github.com/szl-holdings/lutar-lean.git lutar
cd lutar
git checkout --detach "$LUTAR_REV"
test "$(git rev-parse HEAD)" = "$LUTAR_REV" || exit 1
python3 -I -B .github/scripts/lean_numbers.py --repo-path . --ref "$LUTAR_REV"
```

The browser Lean kernel can type-check supplied source; that is a source/proof check. It does not
authenticate a hosted runtime, image, receipt signer, or deployment. A current default-branch
clone must record its resolved full SHA and is not silently equivalent to the locked contract.

## Runtime boundary

The a11oy `/proof` route is a published route shape, not a current proof-replay service promise.
In the 2026-08-11 observation, a11oy’s provider was `RUNNING` at `f5c395e8`, but `/healthz`
timed out at 20 s and 30 s. Readiness is **UNAVAILABLE**. The current killinchu health result and
the paused Hatun-MCP result are tracked independently on [/status](/status).

## DOI lineage

- [10.5281/zenodo.20434276](https://doi.org/10.5281/zenodo.20434276) is the cited versioned
  Ouroboros Thesis v18.0 deposit.
- [10.5281/zenodo.19944926](https://doi.org/10.5281/zenodo.19944926) is an always-latest concept
  DOI; it is not immutable-release evidence.
- Supporting/Lean material must be bound to a deposit version, artifact filename, and checksum
  before it is used as reproducibility evidence.

The former thesis repository is retired. Do not rely on an unreachable repository `CITATION.cff`
as the current DOI authority; use the versioned deposit plus the DOI register in
[Evidence](/evidence/).

## Signature and provenance boundary

Proof-source checks, container image signatures, build attestations, and runtime receipt signatures
answer different questions. A receipt labelled `DSSE-PLACEHOLDER` or `UNSIGNED` is unsigned even
when its hash chain is intact. A valid image signature for a full immutable digest does not sign a
runtime receipt and does not make a runtime ready. See [Compliance](/compliance).

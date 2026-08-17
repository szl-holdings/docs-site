# Data Lake

The **SZL Data Lake** page is an unverified catalog of repository/dataset paths. No exact Hugging
Face revision, file inventory root, or per-record signature result is bound here, so this page is
not itself diligence evidence.

- **GitHub front door**: <https://github.com/szl-holdings/szl-lake>
- **HF dataset front door (mutable unless a revision is supplied)**: <https://huggingface.co/datasets/SZLHOLDINGS/szl-lake>
- **Dataset DOI**: **UNAVAILABLE** on this page. `10.5281/zenodo.20434276` is the separate
  Ouroboros Thesis v18 deposit, not a verified lake identifier.

## Catalogued paths (presence/integrity must be checked at an exact revision)

- `attestations/` — Section 889, SLSA level, CMMC L1 self-attestation
- `doctrine/` — claimed v11 material; authoritative local measurement uses exact commit `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f`
- `keys/` — public-key candidates; identity/fingerprint binding is artifact-specific
- `khipu/` — receipt-shaped records (NDJSON / Parquet); signature state is artifact-specific
- `papers/` — Zenodo paper record references
- `sboms/` — CycloneDX SBOM pointers
- `trajectories/` — Bounded-recursion execution traces

## Cross-references

- [Formal proofs (lutar-lean)](https://github.com/szl-holdings/lutar-lean)
- [Doctrine kernel commit `c7c0ba17`](https://github.com/szl-holdings/lutar-lean/commit/c7c0ba17)

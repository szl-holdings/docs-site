---
title: Thesis Lineage — v1 → v22
description: Verified versioned deposits, prose-only versions, and the always-latest concept DOI in SZL's thesis lineage.
---

# Thesis Lineage — v1 → v22

**The intellectual provenance of SZL Holdings.** This timeline distinguishes verified versioned
DOIs from prose-only version labels and the always-latest concept DOI. A concept DOI is not an
immutable identifier for every version.

- **Author:** Stephen P. Lutar Jr. · ORCID [0009-0001-0110-4173](https://orcid.org/0009-0001-0110-4173)
- **Concept DOI (always-latest):** [10.5281/zenodo.19944926](https://doi.org/10.5281/zenodo.19944926)
- **Doctrine:** v11 LOCKED — 749 declarations / 14 unique axioms / 163 raw sorry tokens @ `c7c0ba17`.
  The later A5 structure-field obligation is not bound to that locked snapshot; this page does not
  carry an exact revision for its later source state.
- **Λ status:** **Conjecture 1 — never a theorem.**
- **Canonical source:** [szl-papers / THESIS_LINEAGE.md](https://github.com/szl-holdings/szl-papers/blob/main/thesis/THESIS_LINEAGE.md)

## Canonical timeline

| Ver | Date | DOI | Key contribution |
|----|------|-----|------------------|
| **v1** | 2026-04-28 | [zenodo.19867281](https://doi.org/10.5281/zenodo.19867281) | The Ouroboros Loop — looped computation as a system primitive |
| **v2** | 2026-04-30 | [zenodo.19934129](https://doi.org/10.5281/zenodo.19934129) | "The Loop Is the Product" — first empirical pass |
| **v3** | 2026-05-02 | [zenodo.19983066](https://doi.org/10.5281/zenodo.19983066) | The **Lutar Invariant** Λ — closed-form aggregator |
| **v4** | 2026-05-04 | [zenodo.20020841](https://doi.org/10.5281/zenodo.20020841) | The Lutar Omega formalism |
| **v5** | 2026-05-04 | [zenodo.20020846](https://doi.org/10.5281/zenodo.20020846) | Prisca-GraphRAG + Tawa SAE |
| **v6** | 2026-05-04 | [zenodo.20020845](https://doi.org/10.5281/zenodo.20020845) | Sealed constitutional guardrails |
| **v7** | 2026-05-04 | [zenodo.20020848](https://doi.org/10.5281/zenodo.20020848) | Tiered continual learning |
| **v8** | 2026-05-04 | [zenodo.20020849](https://doi.org/10.5281/zenodo.20020849) | Free-energy active inference |
| **v9** | 2026-05-05 | [zenodo.20053148](https://doi.org/10.5281/zenodo.20053148) | Unified-Operational — the Lutar Invariant family |
| **v10** | 2026-05-05 | [zenodo.20053163](https://doi.org/10.5281/zenodo.20053163) | Exhaustive-Audit — the audit-closure operator Λ |
| **v11** | 2026-05-11 | [zenodo.20119582](https://doi.org/10.5281/zenodo.20119582) | Applied Λ — measured per-request overhead |
| **v12** | 2026-05-14 | **versioned DOI unavailable** | The Λ-Ouroboros substrate — first four machine-checked Lean proofs (Λ still Conjecture 1 at this stage) |
| **v13** | 2026-05-18 | **versioned DOI unavailable** | Anatomy as architecture |
| **v14** | 2026-05-28 | [zenodo.20173912](https://doi.org/10.5281/zenodo.20173912) | Verifiable multi-agent anatomy; **Λ downgraded to Conjecture 1** |
| **v15** | 2026-05-28 | [zenodo.20195368](https://doi.org/10.5281/zenodo.20195368) | Knot calculus for governed decision receipts |
| **v16** | 2026-05-28 | **versioned DOI unavailable** | Λ-invariant stack + Feynman path-integral audit |
| **v17** | 2026-05-28 | **versioned DOI unavailable** | Wheelerian audit closure; Shannon doctrine (Kraft) |
| **v18** | 2026-05-30 | [zenodo.20434276](https://doi.org/10.5281/zenodo.20434276) | **Multi-track Substrate Expansion** — 29 modules |
| **v19** | — | *(no release — version gap; v18 → v20)* | — |
| **v20** | 2026-06-01 | **versioned DOI unavailable** | "The Culmination" — mixed-proof anatomical substrate |
| **v21** | 2026-06-01 | **versioned DOI unavailable** | **The PURIQ-OS Substrate** — proposed 12-organ architecture, 23 formulas |
| **v22** | 2026-06-03 | **DOI pending (founder mint)** | **"Convergence"** — A5 merge, Cauchy_ND partial, VCG, Rounds 10–11, Sim-to-Real (α=0.10) (SLSA L1 honest — L2 roadmap) |

::: tip v19 gap
Numbering jumped v18 → v20 during the late-May consolidation. There is no v19 paper or DOI; this is documented, not a missing artifact.
:::

## How innovation rounds (R1–R11) converge with thesis versions

```mermaid
flowchart TB
    subgraph THESIS["Thesis lineage (prose + DOI)"]
        direction LR
        v1[v1 Loop] --> v3[v3 Lambda invariant] --> v11[v11 Applied Lambda]
        v11 --> v14[v14 Lambda to Conjecture 1] --> v18[v18 Substrate]
        v18 --> v20[v20 Culmination] --> v21[v21 PURIQ-OS] --> v22[v22 Convergence]
    end
    subgraph ROUNDS["Innovation rounds (Lean formalization)"]
        direction LR
        R1[R1-R6 core axioms A1-A4] --> R7[R7-R8 anatomy]
        R7 --> R9[R9 7-organ + Cauchy_ND + VCG]
        R9 --> R10[R10 Physics/Quantum/CS/Crypto]
        R10 --> R11[R11 formula frontier]
    end
    R1 -.grounds.-> v14
    R7 -.grounds.-> v18
    R9 -.grounds.-> v21
    R9 --> A5[A5 permutation-invariance structure-field obligation<br/>later source - exact revision unbound here]
    R10 -.in review.-> v22
    R11 -.in flight.-> v22
    A5 --> v22
    subgraph KERNEL["Locked kernel"]
        K[lutar-lean c7c0ba17<br/>749 decl - 14 axioms - 163 raw sorry tokens<br/>later source snapshots require separate measurement]
    end
    v11 --> K
    subgraph LATER["Later source state"]
        LS[A5-bearing snapshot<br/>exact revision unbound on this page]
    end
    A5 --> LS
    v22 --> LS
    LAMBDA{{"Lambda = Conjecture 1 - NEVER a theorem<br/>until all Cauchy_ND sorries close on main"}}
    K --> LAMBDA
```

## Recent advances landing in v22 (2026-06-03)

Honest status — A5 is documented as merged in later source history, but no exact A5-bearing
revision is bound on this page. The remaining items are described as **on-branch / in review**:

1. **A5 structure-field obligation — documented as merged (PR #148), later source.**
   `IsPermutationInvariant` is described as a structure field/obligation, not a locked-kernel
   axiom. It is not present in the `c7c0ba17` evidence binding above. This page does not assert an
   exact later revision or transfer the locked snapshot's measured counts to that later state.
2. **VCG truthfulness — in review (PR #172).** Dominant-strategy truth + individual rationality.
3. **Cauchy_ND partial closure — in review (PRs #173/#174/#175).** Topology landed true forms;
   functional analysis closed with 1 honest t=0 sorry; symmetric closed with A5 dependency.
4. **SLSA L1 (honest).** A 5/5 GHCR signature claim is **UNAVAILABLE** here because no full image
   digests, verification material, or readback are attached. **L2 provenance attestation is roadmap.**
5. **Innovation Rounds 10–11 — in review / in flight.** Physics, quantum, CS, crypto, distsys.
6. **Sim-to-Real benchmark (draft).** Walrus parallel; mean **α-gap = 0.10** across five regimes.

::: warning Λ remains Conjecture 1
The uniqueness chain is complete only when all Cauchy_ND sorries close on `main`. They have not. No SZL surface elevates Λ to a theorem (Λ = Conjecture 1, NOT a theorem).
:::

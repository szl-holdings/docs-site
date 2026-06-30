# Proof — Lean kernel, data lake, and DOIs

Every SZL claim is meant to be checked. This page is the **proof index**: the machine-checked
Lean kernel, the public attestation lake, and the persistent Zenodo DOIs. For the full
reproduction commands and commit anchors, see [Evidence](/evidence/).

> Doctrine v11 **LOCKED** — 749 declarations / 14 unique axioms / 163 tracked sorries ·
> kernel `c7c0ba17`. **Λ = Conjecture 1** (not a theorem). **SLSA L1 honest** (cosign-signed, keyless Sigstore — L2 provenance attestation is roadmap, not yet claimed).

## See the math — interactive proof replay

Don't take our word for it — **type-check the proofs yourself, in your browser, zero install.**
The flagship **a11oy** ships an interactive [`/proof`](https://szlholdings-a11oy.hf.space/proof)
surface: a Tao-Blueprint-style dependency graph over SZL's real formal core, where each green node
carries the **verbatim Lean 4 source** from [`lutar-lean`](https://github.com/szl-holdings/lutar-lean)
and a **See the math** button that loads that source into the official
[Lean 4 web kernel](https://live.lean-lang.org) and checks it live.

We label honestly:

| Node | Status | Honest label |
|------|--------|-------------|
| **Theorem U** (Λ-uniqueness, conditional) | proven · **axiom-free** · sorry-free | green — `#print axioms` = Lean core only |
| **8 locked-proven formulas** `{F1,F4,F7,F11,F12,F18,F19,F22}` | proven · self-contained | green — type-check live in-browser |
| **Conjecture 1** (Λ-uniqueness, **unconditional**) | **OPEN** — machine-checked **false** under A1–A5 | gray — ships statement-only with a real `sorry`; never green |
| **Conjecture 2** (Khipu BFT safety) | open | gray — not yet formalized |

> **Honest scope.** F12 (Kuramoto) and F19 (Bekenstein) prove the **additive fragment only** — not
> the full nonlinear / physical model — per [`PROVEN_FORMULAS.md`](https://github.com/szl-holdings/lutar-lean/blob/main/PROVEN_FORMULAS.md).
> The locked-proven count is **8**, machine-enforced by `Lutar.Wave8.AxiomDisclosure.locked_count_eight`.

Type-check a real SZL formula now, no install (opens the Lean 4 web kernel, source pre-loaded):

- [▶ F1 — Replay-Hash Determinism](https://live.lean-lang.org/#code=%2F--%20F1%20%E2%80%94%20Replay-Hash%20Determinism.%20Pure%20deterministic%20replay%20is%20stable.%20-%2F%0Atheorem%20f1_replay_hash_determinism%20%7B%CE%B1%20%CE%B2%20%3A%20Type%7D%20%28f%20%3A%20%CE%B1%20%E2%86%92%20%CE%B2%29%20%28x%20%3A%20%CE%B1%29%20%3A%0A%20%20%20%20f%20x%20%3D%20f%20x%20%3A%3D%20rfl&theme=dark)
- [▶ F18 — Reed–Solomon RS(10,6) erasure tolerance](https://live.lean-lang.org/#code=%2F--%20F18%20%E2%80%94%20Reed%E2%80%93Solomon%20RS%2810%2C6%29%20parity%20count.%20-%2F%0Atheorem%20f18_reed_solomon_parity_count%20%3A%20%2810%20-%206%20%3A%20Nat%29%20%3D%204%20%3A%3D%20by%20decide%0A%2F--%20F18%27%20%E2%80%94%20Erasure%20tolerance%3A%20erasing%20e%20%E2%89%A4%204%20shards%20leaves%2010%20%E2%88%92%20e%20%E2%89%A5%206.%20-%2F%0Atheorem%20f18_erasure_tolerance%20%28e%20%3A%20Nat%29%20%28h%20%3A%20e%20%E2%89%A4%204%29%20%3A%206%20%E2%89%A4%2010%20-%20e%20%3A%3D%20by%20omega&theme=dark)

Each link loads SZL's actual Lean source — the kernel re-checks it from scratch. The full graph
(Theorem U, all 8 formulas, and the open conjectures with their honest `sorry`) lives on the
interactive [a11oy `/proof`](https://szlholdings-a11oy.hf.space/proof) surface.

## Lean kernel — `lutar-lean`

The machine-checked proof corpus.

- **Repo:** [`szl-holdings/lutar-lean`](https://github.com/szl-holdings/lutar-lean) — `Lutar/`
- **Locked snapshot:** tag `lutar-v18.0.0` / `c7c0ba17` — **749 / 14 / 163** (`lake build` clean)
- **Key files:** `Lutar/Axioms.lean` (A1–A4), `Lutar/Khipu/SummationInvariant.lean`,
  `Lutar/QEC/KitaevSurface`, `Lutar/DPI/DPIBound.lean` (Pinsker)
- **PURIQ obligations:** `formulas/PuriqLean.lean` — `puriq_halting_safety`,
  `puriq_lambda_monotone`, `puriq_khipu_integrity`, `puriq_bekenstein_bound` (all `sorry`-tagged, never hidden)

Reproduce the canonical figures yourself:

```bash
gh repo clone szl-holdings/lutar-lean /tmp/lutar -- --depth 1
cd /tmp/lutar
DECL=$(grep -rE '^(theorem|lemma|def|abbrev|axiom) ' --include='*.lean' Lutar/ | wc -l)
SORRY=$(grep -rE '\bsorry\b' --include='*.lean' Lutar/ | wc -l)
echo "Lean: $DECL declarations / $SORRY sorries"
```

> **Honest scope.** `lake build` requires Mathlib (~12 GB); the sandbox cannot build it, so
> Lean verification is performed in **GitHub Actions CI only**. Λ uniqueness remains a
> **Conjecture** — it depends on the open `CAUCHY_ND` sorry (`Uniqueness.lean:120`) plus a
> missing symmetry axiom.

## Data lake — `szl-lake`

The public attestation lake: DSSE receipts, doctrine snapshots, Khipu chains, SBOMs, and
evaluation trajectories.

- **GitHub:** [`szl-holdings/szl-lake`](https://github.com/szl-holdings/szl-lake)
- **Hugging Face:** [`SZLHOLDINGS/szl-lake`](https://huggingface.co/datasets/SZLHOLDINGS/szl-lake)
- **Layout (7 dirs):** `attestations/` · `doctrine/` · `keys/` · `khipu/` · `papers/` · `sboms/` · `trajectories/`
- **Lean companion DOI:** [10.5281/zenodo.20424992](https://doi.org/10.5281/zenodo.20424992)

## Zenodo DOIs

The Ouroboros Thesis and supporting artifacts are deposited with persistent DOIs.

| DOI | Role |
|-----|------|
| [10.5281/zenodo.20434276](https://doi.org/10.5281/zenodo.20434276) | **Ouroboros Thesis v18.0** (versioned) — cited by every flagship |
| [10.5281/zenodo.19944926](https://doi.org/10.5281/zenodo.19944926) | **Concept DOI** (always-latest) |
| [10.5281/zenodo.20424992](https://doi.org/10.5281/zenodo.20424992) | Lean companion |
| [10.5281/zenodo.20434308](https://doi.org/10.5281/zenodo.20434308) · [20431181](https://doi.org/10.5281/zenodo.20431181) | Supporting artifacts |

A complete, versioned list is maintained in the thesis repository's `CITATION.cff`. The
[Evidence page](/evidence/) carries the full DOI register and commit anchors.

---
*Doctrine v11 LOCKED · 749/14/163 · kernel c7c0ba17 · Λ = Conjecture 1 · SLSA L1 honest (L2 provenance attestation = roadmap)*

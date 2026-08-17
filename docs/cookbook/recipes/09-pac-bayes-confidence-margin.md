# PAC-Bayes confidence-margin fixture

> **MODELED_FIXTURE:** exercise the McAllester-1999 PAC-Bayes arithmetic with a pinned
> implementation. This recipe does not establish a risk bound for an SZL dataset, policy, or
> deployed runtime.
>
> **MODELED_FIXTURE inputs/result:** `n=100,000`, `KL=0.5`, `δ=0.05`, `R̂=0.05` → arithmetic
> result ≈ `0.057` (`nonVacuous: true` for these fixture values only).

How confident can you be that a passing Λ-gate generalizes beyond the sample you measured it on?
PAC-Bayes supplies a conditional tail-bound framework. The arithmetic implementation is pinned
and linked at an immutable
`szl-cookbook` revision:
[`recipes/knot-calculus-v1/code/src/pac-bayes-bound.ts`](https://github.com/szl-holdings/szl-cookbook/blob/1be98cc0fed44fba98bfb89a1056c6f3364ae736/recipes/knot-calculus-v1/code/src/pac-bayes-bound.ts).

> **Honest scope.** The closed-form arithmetic is proved in Lean (**TH13**
> `governanceHead_PACBayes_bound`); the probabilistic `Pr ≥ 1−δ` quantifier is the documented
> residual `sorry`. The worked `n`, `KL`, `δ`, `R̂`, and `0.057` result are a
> **MODELED_FIXTURE**, not measured production evidence. A real claim additionally requires a
> bound dataset and sampling process, prior and posterior, loss function, exact evaluation
> artifact, and runtime/source revision. The wrappers that connect those artifacts to the
> arithmetic remain unproven obligations. Λ remains **Conjecture 1**.

---

## The inequality

With probability ≥ 1−δ over an i.i.d. n-sample, for posterior Q and prior P over governance
policies,

\[
R(Q) \le \hat{R}(Q) + \sqrt{\frac{\mathrm{KL}(Q\,\|\,P) + \ln\!\frac{2\sqrt{n}}{\delta}}{2n}}.
\]

---

## Prerequisites

```bash
git clone https://github.com/szl-holdings/szl-cookbook.git
cd szl-cookbook
git checkout 1be98cc0fed44fba98bfb89a1056c6f3364ae736
cd recipes/knot-calculus-v1/code && npm install
```

---

## Quickstart (runnable fixture, in the pinned repo)

```bash
cd recipes/knot-calculus-v1/code
npx tsx tests/demo.ts          # step 3 prints the PAC-Bayes bound for the worked example
```

Or call the function directly:

```ts
import { pacBayesBound } from "./src/pac-bayes-bound";
const r = pacBayesBound({ empiricalRisk: 0.05, klDivergence: 0.5, sampleSize: 100_000, delta: 0.05 });
console.log(r);
// => { slack: ~0.0070, upperBound: ~0.0571, nonVacuous: true }
```

Reproduce in pure Python (no deps):

```python
import math
def pac_bayes(R_hat, KL, n, delta):
    slack = math.sqrt((KL + math.log(2 * math.sqrt(n) / delta)) / (2 * n))
    ub = R_hat + slack
    return {"slack": slack, "upperBound": ub, "nonVacuous": ub < 1.0}
print(pac_bayes(0.05, 0.5, 100_000, 0.05))
# => {'slack': 0.00705…, 'upperBound': 0.05705…, 'nonVacuous': True}
```

---

## Full walkthrough

### Step 1 — Bind an empirical risk R̂(Q)

Replay your receipts (e.g., a compliance regime from **[recipe 03](03-fine-tune-compliance-regime.md)**)
and count the fraction where the gate's decision disagreed with the ground-truth label. That
fraction can be R̂(Q) only after the dataset, sampling procedure, label provenance, loss, exclusions,
and exact receipt/runtime revisions are recorded. The `0.05` in this recipe is not such a
measurement; it is a **MODELED_FIXTURE**.

### Step 2 — Estimate KL(Q‖P)

P must be a precisely defined prior selected without using the evaluation sample; Q must be the
exact posterior evaluated. For a diagonal-Gaussian parameterization, KL has a closed form, but the
parameterization and computation still need artifact bindings. The `0.5` here is a
**MODELED_FIXTURE**, not a measured doctrine-prior divergence.

### Step 3 — Choose n and δ

For an evidence-bearing claim, n must identify the sampled observations and δ must be selected and
recorded as part of the evaluation protocol. Here `100,000` and `0.05` are
**MODELED_FIXTURE** values. The arithmetic slack shrinks like \(1/\sqrt{n}\), conditional on the
bound's assumptions and valid bindings.

### Step 4 — Read the margin

The fixture can compute `lambda_floor − upperBound_on_failure` as arithmetic. Calling that
difference a safety margin requires the missing dataset/sampling, prior/posterior, bounded-loss,
source/runtime, and wrapper-proof bindings. The `0.057` result is therefore
**MODELED_FIXTURE**, not a real distribution-free safety claim.

### Step 5 — Non-vacuity check

`nonVacuous: true` means only that the computed fixture upper bound is below 1. It does not prove
that the inputs describe a real system. If a fully bound evaluation is vacuous, more valid samples
or a justified posterior closer to its predeclared prior may tighten it. Literature examples do
not supply the missing SZL artifact bindings.

---

## Lean obligation

| Theorem | File | Status |
|---|---|---|
| TH13 `governanceHead_PACBayes_bound` | `lutar-lean/Lutar/PACBayes.lean` | closed-form proved; Pr-quantifier open |

Unproven wrapper obligations include: dataset identity and provenance; sampling/i.i.d. conditions;
prior independence and exact posterior identity; bounded loss and label semantics; reproducible
R̂/KL computation; exact source/runtime/evaluation revisions; and a verified wrapper that passes
those bound values to the pinned arithmetic without substitution.

---

## See also

- **[03 — Fine-tune a compliance regime](03-fine-tune-compliance-regime.md)** — produces R̂ and KL.
- **[08 — Receipt knot algebra](08-receipt-knot-algebra.md)** — same demo program.
- Code: [pac-bayes-bound.ts](https://github.com/szl-holdings/szl-cookbook/blob/1be98cc0fed44fba98bfb89a1056c6f3364ae736/recipes/knot-calculus-v1/code/src/pac-bayes-bound.ts)

## Cite this recipe

```bibtex
@misc{szl_cookbook_pac_bayes_2026,
  title        = {PAC-Bayes confidence margin (SZL Cookbook recipe 09)},
  author       = {{SZL Holdings}},
  year         = {2026},
  howpublished = {\url{https://github.com/szl-holdings/szl-cookbook/blob/main/recipes/09-pac-bayes-confidence-margin.md}},
  note         = {McAllester-1999; TH13 closed-form proved, Pr-quantifier open. Λ = Conjecture 1.}
}
```

References: McAllester 1999, COLT; McAllester 2003, *Machine Learning* 51:5–21; Lotfi et al. 2023,
arXiv:2312.17173 (NeurIPS); Amari 1985 (Springer LNS 28), 2016 (Springer).

---
*Doctrine v11 LOCKED — 749/14/163 — kernel `c7c0ba17` · Λ = Conjecture 1 · SLSA L1 (honest)*

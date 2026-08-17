# Materials-bound arithmetic fixture

::: warning Local modeled evidence only
This recipe does not establish a materials organ, a PDD registry, a prediction route, a receipt
chain, or a signature. Current a11oy execution is `UNAVAILABLE`. The only executable claim below
is standard-library arithmetic over explicitly modeled inputs.
:::

The migrated source combined two distinct ideas:

- a Pointwise Distance Distribution (PDD) as a crystal-structure descriptor; and
- a PAC-Bayes upper-bound calculation for a modeled predictor.

Those ideas must be verified independently. A descriptor match is not proof that two crystals are
identical, and arithmetic evaluation of a published bound is not evidence that a model, dataset,
or runtime satisfies its assumptions.

## Executable McAllester-style arithmetic fixture

For empirical risk \(\hat R\), divergence term \(\mathrm{KL}(Q\|P)\), sample count \(n\), and
confidence parameter \(\delta\), this page evaluates the displayed expression:

\[
R(Q) \leq \hat R(Q) +
\sqrt{\frac{\mathrm{KL}(Q\|P) + \ln(2\sqrt{n}/\delta)}{2n}}.
\]

The inputs are illustrative and labeled `MODELED_FIXTURE`; they are not measurements.

```python
import json
import math


def modeled_bound(empirical_risk: float, kl: float, n: int, delta: float) -> float:
    if not 0.0 <= empirical_risk <= 1.0:
        raise ValueError("empirical_risk must be in [0, 1]")
    if kl < 0.0 or n <= 0 or not 0.0 < delta < 1.0:
        raise ValueError("require kl >= 0, n > 0, and delta in (0, 1)")
    penalty = math.sqrt((kl + math.log(2.0 * math.sqrt(n) / delta)) / (2.0 * n))
    return min(1.0, empirical_risk + penalty)


fixture = {
    "empirical_risk": 0.02,
    "kl": 1.5,
    "n": 1000,
    "delta": 0.05,
    "input_state": "MODELED_FIXTURE",
}
result = modeled_bound(
    fixture["empirical_risk"], fixture["kl"], fixture["n"], fixture["delta"]
)
report = {
    "bound": result,
    "input_state": fixture["input_state"],
    "runtime_state": "UNAVAILABLE",
    "signature_state": "UNAVAILABLE",
}
assert 0.0 <= report["bound"] <= 1.0
print(json.dumps(report, indent=2, sort_keys=True))
```

This code proves only that Python evaluated the displayed expression for the displayed inputs. It
does not validate independence assumptions, data provenance, posterior construction, predictive
performance, or a Lean theorem.

## PDD boundary

The audited docs snapshot does not provide a pinned executable PDD implementation, registry
snapshot, tolerance policy, or current route witness. Therefore no novelty verdict is produced
here. Any future `novel` result must mean only "no match under this exact descriptor, registry,
and tolerance" unless injectivity and all operational assumptions are separately established.

## Evidence state

| Surface | Current status |
|---|---|
| Displayed bound arithmetic | `MODELED_LOCAL_FIXTURE` |
| PAC-Bayes literature | `CITED_PRIOR_ART` |
| Exact model and evaluation dataset | `UNAVAILABLE` |
| PDD implementation and registry | `SOURCE_ARTIFACT_UNAVAILABLE` |
| Materials route, receipt, and signature | `UNAVAILABLE` |
| Lean closure for this bound/application | `NOT_ESTABLISHED_HERE` |

References: D. McAllester, "PAC-Bayesian model averaging," COLT (1999); D. Widdowson and
V. Kurlin, "Resolving the data ambiguity for periodic crystals," NeurIPS (2022).

---

*A local arithmetic result is not a certified model, materials verdict, receipt, or deployment.*

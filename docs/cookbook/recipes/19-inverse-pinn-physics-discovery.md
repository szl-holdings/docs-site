# Inverse-PINN modeled fixture

::: warning Historical configuration; runtime unavailable
The migrated recipe recorded an illustrative Duffing-oscillator result near `0.989` and a set of
gate thresholds. No pinned current inverse engine, input trajectory, route response, receipt, or
signature is established here. The recorded value remains `HISTORICAL_MODELED_FIXTURE`.
:::

For the Duffing oscillator

\[
m x'' + c x' + \delta x + \alpha x^3 = F\cos(\omega t),
\]

an inverse method may fit parameters such as \(\alpha\) from trajectory data. A credible result
requires the exact trajectory, preprocessing, solver revision, hyperparameters, residuals,
identifiability diagnostics, and uncertainty method. None of those is replaced by the local gate
fixture below.

## Executable historical gate fixture

This standard-library code evaluates only the threshold shape retained in the migrated recipe. It
does not train a PINN, recover a parameter, or reproduce the historical value.

```python
import json

HISTORICAL_THRESHOLDS = {
    "min_causal_weight": 0.99,
    "max_grad_norm": 1e-5,
    "max_kappa_fim": 1e6,
    "min_fisher": 1e-8,
}


def historical_gate(metrics: dict[str, float]) -> str:
    checks = [
        metrics["min_causal_weight"] > HISTORICAL_THRESHOLDS["min_causal_weight"],
        metrics["grad_norm"] < HISTORICAL_THRESHOLDS["max_grad_norm"],
        metrics["kappa_fim"] < HISTORICAL_THRESHOLDS["max_kappa_fim"],
        metrics["min_fisher"] > HISTORICAL_THRESHOLDS["min_fisher"],
    ]
    return "MODELED_FIXTURE_PASS" if all(checks) else "MODELED_FIXTURE_FAIL_CLOSED"


fixture_metrics = {
    "min_causal_weight": 0.995,
    "grad_norm": 2e-16,
    "kappa_fim": 1.0,
    "min_fisher": 0.1,
}
report = {
    "gate_result": historical_gate(fixture_metrics),
    "historical_reported_alpha": 0.9894,
    "evidence_state": "HISTORICAL_MODELED_FIXTURE",
    "runtime_state": "UNAVAILABLE",
    "receipt_state": "UNAVAILABLE",
}
assert report["gate_result"] == "MODELED_FIXTURE_PASS"
print(json.dumps(report, indent=2, sort_keys=True))
```

A fixture pass means only that the displayed numbers satisfy the displayed inequalities. It is
not evidence of convergence, identifiability, parameter recovery, physical plausibility, or live
execution.

## Promotion contract

A current inverse-discovery claim requires:

1. immutable trajectory bytes and provenance;
2. exact solver source, environment, configuration, and random-state controls;
3. independently reproduced residual, gradient, Fisher, and uncertainty calculations;
4. negative and non-identifiable cases that fail closed;
5. an artifact-specific receipt and signature result, if claimed; and
6. exact runtime request/response evidence, if an endpoint is claimed.

## Evidence state

| Surface | Current status |
|---|---|
| Duffing equation and PINN literature | `CITED_PRIOR_ART` |
| Threshold evaluator above | `HISTORICAL_MODELED_FIXTURE` |
| Reported alpha near 0.989 | `HISTORICAL_MODELED_FIXTURE_NOT_REPRODUCED` |
| Current solver and input trajectory | `SOURCE_ARTIFACT_UNAVAILABLE` |
| Route, receipt, and signature | `UNAVAILABLE` |

References: M. Raissi, P. Perdikaris, and G. E. Karniadakis, *Journal of Computational Physics*
378 (2019), 686-707; G. Duffing (1918).

---

*A threshold fixture is not a reproduced inverse-physics result or an operational service.*

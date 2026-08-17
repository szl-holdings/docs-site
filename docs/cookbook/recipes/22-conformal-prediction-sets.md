# Conformal prediction sets — modeled fixture

::: warning No empirical coverage claim
The prior example used 20 bootstrap samples, not an immutable exchangeable held-out calibration
artifact. It therefore cannot establish a production marginal-coverage guarantee. The hosted route
is also **UNAVAILABLE**.
:::

## Method boundary

Conformal coverage statements depend on a precisely defined nonconformity score, exchangeability
assumptions, held-out calibration data, quantile convention, and target population. A toy result
must be labelled **SAMPLE / MODELED**.

```python
def label_fixture(prediction_set, calibration_n):
    return {
        "prediction_set": prediction_set,
        "calibration_n": calibration_n,
        "label": "MODELED_FIXTURE",
        "empirical_coverage_claim": "UNAVAILABLE",
    }

assert label_fixture(["A", "B"], 20)["empirical_coverage_claim"] == "UNAVAILABLE"
```

Promotion requires immutable held-out calibration bytes/digest, exact source/model revision,
executed calibration/test split, observed coverage with uncertainty, and drift/recalibration policy.

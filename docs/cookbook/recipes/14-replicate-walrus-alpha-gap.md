# Replicate an alpha-gap calculation

The alpha gap is a method for comparing two explicitly labelled score observations:
`abs(lambda_simulated - lambda_observed)`. This page does not claim a published Walrus dataset,
authenticated broadcast telemetry, or a currently witnessed killinchu action route.

## Runnable arithmetic contract

```python
def alpha_gap(lambda_simulated, lambda_observed):
    for label, value in {"lambda_simulated": lambda_simulated, "lambda_observed": lambda_observed}.items():
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not 0 <= value <= 1:
            raise ValueError(f"{label} must be a number in [0, 1]")
    return abs(float(lambda_simulated) - float(lambda_observed))

assert alpha_gap(0.92, 0.88) == 0.04
```

## Measurement protocol

To call a result measured, preserve:

1. the simulated input bytes and generator seed;
2. the observed frame bytes, transport, timestamp, and unauthenticated/spoofable label;
3. decoder source revision and configuration;
4. the exact scoring implementation/revision;
5. both raw outputs and the recomputed gap;
6. uncertainty and acceptance threshold chosen before observing the result.

A locally calculated number without those inputs is **MODELED**, not sim-to-real evidence. See
[killinchu API boundary](/api/killinchu) and [/status](/status).

---

*Arithmetic contract executable · broadcast/runtime measurement UNAVAILABLE*

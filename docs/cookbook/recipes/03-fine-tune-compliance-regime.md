# Build a local compliance overlay

This source-local example applies stricter customer floors to an explicitly supplied axis vector.
It does not mutate the Doctrine snapshot, call an unavailable runtime, or claim certification.

> Snapshot anchor: `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f`. Lambda remains Conjecture 1.

## Runnable local example

```python
import math

AXES = [
    "soundness", "calibration", "robustness", "provenance", "consent",
    "reversibility", "transparency", "fairness", "containment", "attestation",
    "freshness", "authority", "auditability",
]

def evaluate_overlay(axis_scores, default_floor=0.90, overrides=None):
    overrides = overrides or {}
    missing = [axis for axis in AXES if axis not in axis_scores]
    if missing:
        raise ValueError(f"missing axes: {missing}")
    failures = [axis for axis in AXES if axis_scores[axis] < overrides.get(axis, default_floor)]
    geometric_mean = math.exp(sum(math.log(max(axis_scores[axis], 1e-12)) for axis in AXES) / len(AXES))
    return {
        "label": "MODELED_LOCAL_OVERLAY",
        "lambda_overlay": round(geometric_mean, 6),
        "pass": not failures,
        "failed_axes": failures,
        "source_snapshot": "c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f",
    }

fixture = {axis: 0.96 for axis in AXES}
fixture["fairness"] = 0.91
result = evaluate_overlay(fixture, overrides={"fairness": 0.95})
assert result["pass"] is False and result["failed_axes"] == ["fairness"]
print(result)
```

## Evidence boundary

- Fixture scores are modeled inputs, not a live product measurement.
- The overlay is customer policy, not a proof improvement or compliance certification.
- A receipt wrapper remains integrity-only unless exact signature verification succeeds.
- A hosted call requires a fresh [/status](/status) and route/auth witness.

See [Evidence](/evidence/), [Compliance](/compliance), and the local
[receipt verification procedure](01-verify-a-receipt-end-to-end.md).

---

*Source-local overlay executable · runtime/certification/signature claims not made*

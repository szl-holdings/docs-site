# Kitaev-inspired surface drift detection

This is a classical analogy and deterministic local detector—not a physical quantum code and not
a current runtime integration. It flags windowed parity changes in a supplied 13-axis vector.

## Runnable local example

```python
AXIS_COUNT = 13

def syndrome(scores, reference, tolerance=0.03):
    if len(scores) != AXIS_COUNT or len(reference) != AXIS_COUNT:
        raise ValueError("exactly 13 axes are required")
    drifted = [abs(value - baseline) > tolerance for value, baseline in zip(scores, reference)]
    return [int(drifted[i] ^ drifted[i + 1] ^ drifted[i + 2]) for i in range(AXIS_COUNT - 2)]

baseline = [0.93] * AXIS_COUNT
assert syndrome(baseline, baseline) == [0] * 11

changed = baseline.copy()
changed[4] = 0.80
result = syndrome(changed, baseline)
assert any(result)
print(result)
```

## Operational boundary

Real monitoring requires a revision-bound source of axis values, timestamps, freshness limits,
drift persistence policy, and preserved alert evidence. The a11oy action route and killinchu axis
route were not witnessed in the current observation; do not silently replace the fixture with
those hosts. Route any admitted alert only after [/status](/status) and authentication close.

Lambda remains Conjecture 1. A detector alert is a modeled governance signal, not a theorem or an
autonomous action authority.

---

*Deterministic local detector executable · hosted integration UNAVAILABLE*

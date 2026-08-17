# Counter-UAS verdict — simulated input contract

::: warning Action route UNAVAILABLE
killinchu's health route was `AVAILABLE_AT_OBSERVATION`; the counter-UAS action route, auth
behavior, payload result, and receipt signature were not witnessed. This is a local fixture
contract, not a live verdict.
:::

Remote-ID, ADS-B, and MAVLink fields are unauthenticated/spoofable claims. Any decision must remain
advisory and must not authorize autonomous lethal action.

## Deterministic local gate example

```python
from math import hypot

def evaluate_fixture(track, fence, trust_score):
    distance = hypot(track["lat"] - fence["lat"], track["lon"] - fence["lon"])
    inside = distance <= fence["radius_degrees"]
    allowed = inside and trust_score >= 0.90
    return {
        "label": "SIMULATED_FIXTURE",
        "decision": "ALLOW" if allowed else "DENY",
        "inside_fixture_geofence": inside,
        "trust_score": trust_score,
        "receipt_signature_state": "UNAVAILABLE",
    }

result = evaluate_fixture(
    {"lat": 40.0, "lon": -74.0},
    {"lat": 40.0, "lon": -74.0, "radius_degrees": 0.01},
    0.92,
)
assert result["label"] == "SIMULATED_FIXTURE"
```

This simplified fixture is not the product algorithm, a physical-distance calculation, or sensor
evidence. Promote a hosted example only with exact route/readiness/auth/request/response and
artifact-specific receipt verification. See [killinchu API](/api/killinchu).

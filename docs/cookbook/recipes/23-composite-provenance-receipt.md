# Composite provenance record — label-preserving local contract

::: danger Hosted composition and signature UNAVAILABLE
No live a11oy sub-surface, composite response, measured-energy result, or verified signature is
bound here. This local function preserves evidence labels; it does not create new guarantees.
:::

```python
ORDER = {"UNAVAILABLE": 0, "MODELED": 1, "MEASURED": 2, "VERIFIED": 3}

def compose(parts):
    if not parts:
        raise ValueError("at least one named part is required")
    for part in parts:
        if part["label"] not in ORDER:
            raise ValueError(f"unsupported label: {part['label']}")
    weakest = min(parts, key=lambda part: ORDER[part["label"]])["label"]
    return {
        "contract": "szl.composite-record/local-v1",
        "parts": parts,
        "composite_label": weakest,
        "signature_state": "UNAVAILABLE",
    }

record = compose([
    {"name": "policy_fixture", "label": "MODELED"},
    {"name": "energy", "label": "UNAVAILABLE"},
])
assert record["composite_label"] == "UNAVAILABLE"
```

Composition cannot upgrade its weakest part. A hash/self-digest is integrity evidence, not a
signature. Runtime promotion requires exact source/revision, preserved inputs/outputs, each
sub-verifier result, and independent composite readback.

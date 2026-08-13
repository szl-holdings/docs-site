# Evidence-pack self-digest protocol

::: danger Hosted pack UNAVAILABLE
No exact a11oy evidence-pack response is bound. The procedure below verifies supplied bytes only;
it does not claim those bytes came from a live runtime or carry a valid signature.
:::

```python
import hashlib, json

def verify_pack_bytes(raw: bytes, expected_sha3_256: str):
    actual = hashlib.sha3_256(raw).hexdigest()
    if actual != expected_sha3_256:
        raise ValueError(f"digest mismatch: {actual}")
    value = json.loads(raw)
    return {"integrity": "VERIFIED", "signature_state": value.get("signature_state", "UNAVAILABLE")}
```

For a real audit pack, preserve the exact response bytes, immutable runtime/source revision,
request/auth context, expected digest from an independent channel, file inventory, and signature
verification material. A self-digest proves only supplied-byte integrity; it does not establish
origin, completeness, freshness, deployment, or signer identity.

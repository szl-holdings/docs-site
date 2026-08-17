# Memory provenance — source contract

::: danger Runtime and canonical signed sample UNAVAILABLE
The Memory role is source-described as in-process a11oy behavior. There is no independently
witnessed standalone service, current recall route result, or canonical signed lake receipt bound
to this page.
:::

## Intended invariant

A recalled item should carry an immutable identifier for the write/evidence record that introduced
it. A sequence number alone is insufficient; durable verification needs exact record bytes,
content digest, source revision, and artifact-specific signature state.

## Local structural check

```python
def validate_recall(item):
    required = {"text", "source_record_sha256", "source_revision", "signature_state"}
    missing = required - item.keys()
    if missing:
        raise ValueError(f"missing provenance fields: {sorted(missing)}")
    if len(item["source_record_sha256"]) != 64:
        raise ValueError("source_record_sha256 must be full length")
    if item["signature_state"] not in {"UNSIGNED", "SIGNATURE_VERIFIED", "UNAVAILABLE"}:
        raise ValueError("invalid signature state")
    return True
```

The check validates shape only. It does not fetch a memory, recompute the named record digest, or
verify a signature. Those require pinned bytes and the [receipt protocol](01-verify-a-receipt-end-to-end.md).

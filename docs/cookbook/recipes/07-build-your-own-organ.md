# Local organ contract fixture

::: warning Historical design; local evidence only
This recipe does **not** establish a deployed organ, UDS integration, mesh registration, a
`DoctrineLock` custom resource, or a signed receipt. The current a11oy runtime observation is
`UNAVAILABLE`; see [Runtime status](/status).
:::

The migrated cookbook described every organ as an HTTP service with `/healthz`, `/v1/honest`, and
an action route. That is a historical interface proposal, not a witnessed universal contract. The
fixture below preserves the useful local properties without pretending that deployment or signing
exists:

- the Doctrine v11 figures are bound to an exact snapshot;
- serialization is deterministic;
- each local receipt binds the previous digest; and
- the signature state is explicit and fail-closed.

## Executable local fixture

This example uses only the Python standard library and performs no network or filesystem writes.

```python
import hashlib
import json

DOCTRINE = {
    "version": "v11",
    "declarations": 749,
    "axioms_unique": 14,
    "sorries_total": 163,
    "snapshot_commit": "c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f",
    "lambda_uniqueness": "CONJECTURE_NOT_THEOREM",
}


def canonical_bytes(value: object) -> bytes:
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def local_receipt(previous_digest: str, request: dict) -> dict:
    payload = {
        "schema": "szl.organ.local-fixture/v1",
        "organ": "yupay",
        "request": request,
        "decision": "DENY_UNTIL_POLICY_AND_RUNTIME_ARE_WITNESSED",
        "doctrine": DOCTRINE,
    }
    digest = hashlib.sha256(
        previous_digest.encode("ascii") + b"\n" + canonical_bytes(payload)
    ).hexdigest()
    return {
        "payload": payload,
        "previous_digest": previous_digest,
        "digest": digest,
        "signature_state": "UNSIGNED_LOCAL_FIXTURE",
        "deployment_state": "UNAVAILABLE",
    }


receipt = local_receipt("0" * 64, {"operation": "increment", "amount": 1})
assert len(receipt["digest"]) == 64
assert receipt["signature_state"] == "UNSIGNED_LOCAL_FIXTURE"
assert receipt["payload"]["decision"].startswith("DENY_")
print(json.dumps(receipt, indent=2, sort_keys=True))
```

The digest proves only that the displayed local bytes were hashed as shown. It is not DSSE, does
not authenticate an issuer, and is not a substitute for an artifact-specific signature.

## What is required before calling an organ operational

Promotion requires all of the following evidence for one exact revision:

1. an exact source commit and immutable image digest;
2. the actual route schema and executable contract tests;
3. the exact UDS package and every referenced CRD, with admission and rollback results;
4. a documented runtime signing key identity and a verified signed sample receipt;
5. protected deployment evidence plus live route readback; and
6. mesh discovery and receipt-chain verification against those same deployed bytes.

An organization-level cosign public key verifies only artifacts signed by its matching identity. It
must not be presented as the runtime receipt key without an explicit, verified binding.

## Evidence state

| Surface | Current status |
|---|---|
| Local deterministic fixture | `MODELED_LOCAL_FIXTURE` |
| HTTP organ contract | `HISTORICAL_DESIGN` |
| Runtime policy decision | `UNAVAILABLE` |
| DSSE signature | `UNAVAILABLE` |
| UDS package and CRDs | `UNAVAILABLE` |
| Mesh registration and deployed readback | `UNAVAILABLE` |

See also [Runtime status](/status), [Compliance](/compliance), and the
[UDS evidence boundary](/uds/).

---

*Doctrine v11 locked snapshot: `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f`; Lambda uniqueness remains a conjecture.*

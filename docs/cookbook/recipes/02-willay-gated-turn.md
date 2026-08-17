# WILLAY gated-turn receipt-state protocol

::: danger Runtime and signed sample UNAVAILABLE
a11oy readiness timed out in the dated observation. No exact WILLAY response, receipt bytes, key
identity, or verified signature result is bound here.
:::

## Source-described behavior

A WILLAY implementation is expected to distinguish allowed and refused actions and to return an
honest receipt state. `PLACEHOLDER-UNSIGNED` must remain **UNSIGNED**; a `signed` field or DSSE
shape is not verification evidence.

## Promotion procedure

1. Recheck a11oy readiness and route/auth behavior at an exact revision.
2. Preserve request and raw response bytes.
3. Confirm the policy outcome from those bytes.
4. If a signature is present, preserve the exact signed payload serialization, algorithm, public
   identity/material, signature, and verifier output.
5. Label the result `SIGNATURE_VERIFIED` only on observed success; otherwise use `UNSIGNED`,
   `UNAVAILABLE`, or `FAILED`.

## Fail-closed client skeleton

```python
def classify_receipt(receipt):
    if receipt.get("honesty") in {"PLACEHOLDER-UNSIGNED", "DSSE_PLACEHOLDER"}:
        return "UNSIGNED"
    if receipt.get("verification") is True and receipt.get("verified_key_fingerprint"):
        return "SIGNATURE_VERIFIED"
    return "UNAVAILABLE"
```

The skeleton prevents a placeholder from becoming “signed”; it does not itself verify
cryptography or a hosted route. See [Verification](/developers/verify) and
[Runtime status](/status).

# Local Cardano metadata candidate

::: warning No on-chain or signature proof
This recipe creates a deterministic metadata **candidate** from synthetic local receipts. It does
not read a mutable data lake, verify a DSSE signature, submit a transaction, or prove a Cardano
anchor. No canonical signed receipt sample or current a11oy runtime is established here.
:::

A Merkle root can compactly bind an ordered collection of bytes. Publishing such a root on a
ledger can provide a later proof-of-existence, but only when the input bytes, signature results,
transaction, network, and confirmed readback are all retained. Hashing unverified receipts does
not make them authentic.

## Executable local fixture

The following standard-library example has no network dependency. Its receipts are explicitly
synthetic and unsigned.

```python
import hashlib
import json

RECEIPTS = [
    {
        "seq": 2,
        "receipt_id": "fixture-b",
        "payload": {"decision": "DENY"},
        "signature_state": "UNSIGNED_SYNTHETIC_FIXTURE",
    },
    {
        "seq": 1,
        "receipt_id": "fixture-a",
        "payload": {"decision": "DENY"},
        "signature_state": "UNSIGNED_SYNTHETIC_FIXTURE",
    },
]


def canonical_bytes(value: object) -> bytes:
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def merkle_root(leaves: list[bytes]) -> bytes:
    if not leaves:
        return b"\x00" * 32
    layer = list(leaves)
    while len(layer) > 1:
        if len(layer) % 2:
            layer.append(layer[-1])
        layer = [
            hashlib.sha256(layer[i] + layer[i + 1]).digest()
            for i in range(0, len(layer), 2)
        ]
    return layer[0]


ordered = sorted(RECEIPTS, key=lambda item: (item["seq"], item["receipt_id"]))
leaves = [hashlib.sha256(canonical_bytes(item)).digest() for item in ordered]
root = merkle_root(leaves).hex()

# CIP-20 uses metadata label 674 for transaction messages. This is only a local candidate.
messages = [
    "szl.khipu.anchor/v1",
    f"sha256:{root[:32]}",
    f"continue:{root[32:]}",
]
assert all(len(message.encode("utf-8")) <= 64 for message in messages)
candidate = {
    "674": {"msg": messages},
    "evidence_state": "LOCAL_CANDIDATE_NOT_SUBMITTED",
}
print(json.dumps(candidate, indent=2, sort_keys=True))
```

The resulting root binds the exact synthetic fixture bytes in the displayed order. It proves
nothing about a11oy, an issuer, a public lake, or a Cardano transaction.

## Promotion contract

An on-chain claim requires an immutable evidence bundle containing:

1. the exact receipt bytes and deterministic leaf order;
2. artifact-specific signature verification results and signer identity;
3. the root-building implementation revision and reproducible test vectors;
4. the signed transaction body, network identifier, and transaction hash;
5. terminal confirmation/finality evidence from an independent ledger reader; and
6. a readback showing that the confirmed metadata contains the same root.

Until those items exist, the only valid status is `LOCAL_CANDIDATE_NOT_SUBMITTED`. Wallet access,
funding, or a command template would not by itself satisfy the contract.

## Evidence state

| Surface | Current status |
|---|---|
| Synthetic receipt bytes | `MODELED_LOCAL_FIXTURE` |
| Receipt authenticity | `UNAVAILABLE` |
| Merkle computation | `LOCAL_EXECUTABLE_EXAMPLE` |
| Cardano metadata | `LOCAL_CANDIDATE_NOT_SUBMITTED` |
| Confirmed ledger readback | `UNAVAILABLE` |

Reference: [CIP-20 transaction messages](https://cips.cardano.org/cip/CIP-20).

---

*Hash anchoring is not signing, authentication, finality, or proof of a deployed runtime.*

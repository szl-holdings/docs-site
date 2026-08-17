# E8 receipt-geometry design note

::: warning Runtime and project implementation unavailable
No pinned SZL encoder, decoder, route response, receipt, or deployment is established by this
recipe. The material below separates cited E8 mathematics from a proposed digest mapping. It is
not receipt verification and adds no cryptographic security.
:::

The E8 lattice attains the optimal sphere-packing density in eight dimensions. That mathematical
result is cited prior art. A system may choose to map data into eight coordinates and compare them
with a lattice, but such a mapping is a separate engineering artifact with its own correctness and
security obligations.

Minimum-distance geometry can detect some perturbations relative to a fixed encoding. It does
**not** authenticate an issuer, provide collision resistance, prove a receipt chain, or establish
Byzantine-fault tolerance.

## Executable local partition fixture

This standard-library example performs only the historical recipe's 256-bit-to-eight-word
partition. It does not claim that the resulting point is in E8 and does not run a closest-point
decoder.

```python
def digest_words(digest_hex: str) -> list[int]:
    raw = bytes.fromhex(digest_hex)
    if len(raw) != 32:
        raise ValueError("expected one 256-bit digest")
    return [int.from_bytes(raw[offset : offset + 4], "big") for offset in range(0, 32, 4)]


fixture_digest = "d0361e9f2c8d8ac96a1cdab46a6f45de3ed697a9e767d7ccccce2d69b60ae73c"
words = digest_words(fixture_digest)
assert len(words) == 8
assert all(0 <= word < 2**32 for word in words)
print(words)
```

The output is a deterministic local representation of the fixture digest only. A canonical E8
scheme would still need to define coordinate scaling, coset selection, encoding and decoding,
round-trip behavior, error thresholds, and versioned test vectors.

## Promotion contract

Before an SZL E8 receipt claim can be called implemented, it needs:

1. a pinned encoder/decoder source revision and exact algorithm specification;
2. executable positive, negative, boundary, and round-trip vectors;
3. a binding from exact receipt bytes to the digest and from the digest to the lattice codeword;
4. a clear error model and an explicit statement of what the scheme cannot detect;
5. cryptographic receipt authentication evaluated separately; and
6. exact runtime request/response evidence if an endpoint is claimed.

## Evidence state

| Claim | Current status |
|---|---|
| E8 sphere-packing result | `CITED_PRIOR_ART` |
| Eight-word digest partition above | `MODELED_LOCAL_FIXTURE` |
| SZL E8 encoder or closest-point decoder | `SOURCE_ARTIFACT_UNAVAILABLE` |
| SZL E8 route and deployed response | `UNAVAILABLE` |
| Receipt authentication or adversarial security | `NOT_ESTABLISHED` |

References: M. Viazovska, "The sphere packing problem in dimension 8," *Annals of Mathematics*
185 (2017), 991-1015; J. H. Conway and N. J. A. Sloane, *Sphere Packings, Lattices and Groups*,
3rd edition, Springer (1999).

---

*Cited lattice geometry is not evidence of an SZL runtime, implementation, or security proof.*

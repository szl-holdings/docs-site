# Verify evidence yourself

Verification is artifact-specific. Source, image provenance, runtime readiness, receipt integrity,
and receipt signing must not be substituted for one another.

## 1. Verify the locked source contract

```bash
LUTAR_REV=c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f
git clone --filter=blob:none --no-checkout https://github.com/szl-holdings/lutar-lean.git lutar
cd lutar
git checkout --detach "$LUTAR_REV"
test "$(git rev-parse HEAD)" = "$LUTAR_REV" || exit 1
python3 -I -B .github/scripts/lean_numbers.py --repo-path . --ref "$LUTAR_REV"
```

Remeasured values: `749 declarations / 14 unique axioms / 163 raw sorry tokens`. A `main` checkout is current-source evidence only;
record its full resolved SHA and do not call it the locked snapshot by implication.

## 2. Verify runtime readiness separately

The current dated observation is on [/status](/status): killinchu `/api/killinchu/healthz` was
HTTP 200 at revision `83142da9`; a11oy `/healthz` timed out at revision `f5c395e8`; Hatun-MCP
`/readyz` returned 503 while paused at quota `3/3`.

```bash
# Recheck immediately before use; a 200 only proves this route at this moment.
curl --fail-with-body --max-time 30 \
  https://szlholdings-killinchu.hf.space/api/killinchu/healthz
```

Do not use this as evidence that an unrelated route is authorized or that a desktop client works.

## 3. Verify receipt integrity and signing independently

- A hash chain or recomputed self-digest can prove integrity of the bytes supplied to you.
- `DSSE-PLACEHOLDER` and `UNSIGNED` mean the runtime receipt lacks a cryptographic signature.
- Do not expect a current `/khipu/sign` round trip from a11oy while readiness is unavailable, and
  do not claim a runtime signer without a fresh exact-revision witness.

## 4. Verify image provenance separately

An image-level cosign/Sigstore verification is valid only for a named immutable image digest and
its published verification materials. It is not a runtime-receipt verification and it cannot make
a paused or timing-out runtime ready. This release makes no generic image tag, Rekor-index, or
cosign-success claim without a matching immutable artifact record.

The documented supply-chain posture is **SLSA L1 (honest)**. L2 and L3 are not claimed. See
[Compliance](/compliance).

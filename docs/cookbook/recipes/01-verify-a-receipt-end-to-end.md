# Verify a receipt without upgrading its evidence class

::: danger No canonical signed sample is claimed here
The retired recipe fetched mutable `main` receipt bytes and a mutable public key, then described
the outcome as canonical end-to-end proof. That is not durable evidence. This replacement fails
closed until an exact receipt, revision, key identity, and observed verifier result are supplied.
:::

## Required inputs

Record these values before verification:

```bash
RECEIPT_URL='https://huggingface.co/datasets/SZLHOLDINGS/szl-lake/resolve/<40-hex-revision>/<path>'
RECEIPT_SHA256='<64-hex-digest>'
KEY_URL='https://raw.githubusercontent.com/szl-holdings/.github/<40-hex-revision>/cosign.pub'
KEY_SHA256='<64-hex-digest>'
```

Do not substitute `main`, a branch, an unpinned redirect, or an eight-character revision.

## 1 · Verify downloaded bytes

```bash
curl --fail-with-body --location --proto '=https' --tlsv1.2 "$RECEIPT_URL" -o receipt.json
curl --fail-with-body --location --proto '=https' --tlsv1.2 "$KEY_URL" -o cosign.pub
printf '%s  %s\n' "$RECEIPT_SHA256" receipt.json | sha256sum --check --strict
printf '%s  %s\n' "$KEY_SHA256" cosign.pub | sha256sum --check --strict
```

## 2 · Classify the artifact before verifying

- `DSSE-PLACEHOLDER` or `PLACEHOLDER-UNSIGNED` is **UNSIGNED**.
- A recomputed digest or hash chain is integrity evidence, not signer authentication.
- A DSSE envelope is not signed merely because it contains a `signatures` field.
- Image cosign evidence does not verify a runtime receipt.

## 3 · Run the artifact-specific verifier

Use the algorithm and exact signed-byte serialization declared by the artifact contract. Preserve:

- the verifier version and command;
- stdout/stderr and exit code;
- public-key/certificate fingerprint;
- receipt SHA-256;
- signature bytes and algorithm;
- transparency entry when one is explicitly part of the contract.

Only an observed success over the pinned bytes may be labeled **SIGNATURE_VERIFIED**. Otherwise use
**UNSIGNED**, **UNAVAILABLE**, or **FAILED**, as applicable.

## 4 · Verify source and runtime separately

Receipt verification does not prove the producing service is currently ready. Source lineage,
runtime readiness, image provenance, and receipt signing remain separate gates. Continue with the
[verification guide](/developers/verify), [runtime status](/status), and
[compliance boundary](/compliance).

---

*Pinned-byte procedure available · canonical signed sample UNAVAILABLE*

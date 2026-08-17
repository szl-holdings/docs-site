# Verify an immutable OCI artifact with cosign and Rekor

::: danger No flagship signature result is claimed here
The prior recipe asserted public Rekor indices for two products without binding full OCI digests,
certificates, entries, or observed verification output. This replacement is a procedure. Its
current artifact result is **UNAVAILABLE**.
:::

## Required inputs

```bash
IMAGE='ghcr.io/szl-holdings/<name>@sha256:<64-hex-digest>'
EXPECTED_IDENTITY='https://github.com/szl-holdings/<repo>/.github/workflows/<workflow>@refs/heads/main'
```

Reject tags, short digests, wildcard identities, and values copied from an unpinned README.

## Verification

```bash
cosign verify "$IMAGE" \
  --certificate-identity "$EXPECTED_IDENTITY" \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  --output json > cosign.verify.json
```

Preserve the command/tool version, exact image digest, certificate subject/issuer, signature,
integrated time, Rekor UUID/index when present, JSON SHA-256, exit code, and a registry readback.
Only that named artifact may be labeled **IMAGE_SIGNATURE_VERIFIED**.

## Evidence boundary

- Cosign/Rekor proves neither a current deployment nor application readiness.
- Image signing does not sign a runtime receipt.
- SLSA L1 source/build metadata does not imply L2/L3 provenance.
- An offline bundle needs the same signed material and a local transparency/checkpoint strategy.

See [/compliance](/compliance) and [/status](/status).

---

*Verification procedure available · named flagship result UNAVAILABLE · SLSA L1 honest*

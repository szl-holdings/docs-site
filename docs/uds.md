# UDS — deployment evidence checklist

::: danger UNAVAILABLE — do not treat these templates as released artifacts
No immutable GHCR digest, matching SBOM identity, observed cosign verification result, or deployed
UDS witness is bound on this page. OCI tags such as `uds-v0.2.0` are not asserted to exist. This is
a fail-closed hand-off checklist for a future release, not a customer deployment claim.
:::

The checklist below defines what a real Zarf/UDS hand-off must contain. For the proposed
multi-organ surface, see [Unified Demo Surface](/uds/). For current runtime state, see
[/status](/status).

## 1 · Bind an immutable artifact

Record all of the following before exposing a pull command:

- `repository@sha256:<64 hex>` — never a mutable tag alone;
- the protected source revision and build run that produced it;
- the OCI manifest media type and platform set;
- CycloneDX/SPDX artifact names and SHA-256 values;
- an exact registry readback of the digest.

Only after those fields exist may an operator substitute a real value for this placeholder:

```bash
UDS_REF='ghcr.io/szl-holdings/<flagship>@sha256:<UNAVAILABLE>'
test "$UDS_REF" != 'ghcr.io/szl-holdings/<flagship>@sha256:<UNAVAILABLE>' || exit 1
zarf package pull "oci://$UDS_REF"
```

## 2 · Verify provenance separately

A valid release record must preserve the exact `cosign verify --output json` result, certificate
identity, OIDC issuer, integrated time/log material, and artifact digest. Until that record exists,
the verification state is **UNAVAILABLE**:

```bash
cosign verify "$UDS_REF" \
  --certificate-identity-regexp='^https://github.com/szl-holdings/' \
  --certificate-oidc-issuer='https://token.actions.githubusercontent.com' \
  --output json
```

Image/OCI verification does not sign runtime receipts and does not prove a deployment is ready.

## 3 · Deploy only after admission

The deployment gate requires a supported UDS Core version, exact cluster inventory, policy result,
resource capacity, rollback plan, and protected approval evidence. A future executable command must
use the same admitted immutable `$UDS_REF`; this page does not claim it has run.

## 4 · Receipt keys

The proposed chart contract uses an Ed25519 receipt key and explicit rotation lineage. Before this
becomes an operational claim, publish the exact chart revision, hook manifests, secret ownership,
key-custody policy, recovery/rotation test, and a verified pre/post-rotation receipt pair. Never
place private key material in documentation or source control.

## 5 · Air-gap closure

An air-gap claim requires an exported bundle digest, complete image/SBOM/signature inventory, an
offline verification transcript, a no-egress deployment observation, and restore/rollback proof.
Without that evidence, “self-contained” and “no registry egress required” remain design goals.

## Section 889 policy boundary

The documented design lists five named vendors for an admission policy. That source policy does not
confer federal authorization, maturity certification, hardened-registry admission, impact-level
authorization, or procurement certification. Publish a policy test and admitted
deployment receipt before calling the control operational.

---

*Deployment template · artifact/provenance/deployment state UNAVAILABLE · SLSA L1 honest*

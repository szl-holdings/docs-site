# UDS bundle deployment admission checklist

::: danger Deployment UNAVAILABLE
No five-service UDS bundle, immutable OCI digest set, cosign readback, or live cluster witness is
attached to this recipe. Do not treat historical tag examples as published artifacts.
:::

## Required release inventory

Before deployment, bind every component to:

- protected source revision;
- `repository@sha256:<64 hex>` image/package identity;
- SBOM filename and SHA-256;
- artifact-specific cosign verification JSON;
- supported UDS Core/Zarf version;
- resource, network, policy, rollback, and receipt-key admission results.

## Fail-closed template

```bash
BUNDLE_REF='oci://ghcr.io/szl-holdings/uds-bundle@sha256:<UNAVAILABLE>'
case "$BUNDLE_REF" in *'<UNAVAILABLE>'*) echo 'no admitted immutable bundle' >&2; exit 1;; esac
zarf package pull "$BUNDLE_REF"
zarf package inspect "$BUNDLE_REF"
```

Only after the pull/readback, provenance, and local admission gates pass may the same immutable
reference be supplied to a deployment command. Preserve the exact cluster inventory, stdout,
exit code, workload readiness, rollback result, and receipt bytes.

## Doctrine and quorum boundary

The locally measured Doctrine snapshot is
`c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f` (`749 / 14 / 163 raw sorry tokens`). It does not
prove a bundle or quorum ran. A real quorum claim additionally requires independent participant
identities, exact verdict bytes, signature results, algorithm/version, and replay evidence.

See [UDS deployment evidence checklist](/uds) and [Compliance](/compliance).

---

*Deployment plan available · bundle/runtime/quorum evidence UNAVAILABLE*

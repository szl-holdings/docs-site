# Air-gap deployment evidence protocol

::: danger Bundle and deployment UNAVAILABLE
No real `uds-v0.2.0` artifact, immutable digest, offline signature bundle, or five-service cluster
witness is attached. This protocol intentionally contains no executable tag-based install command.
:::

## Connected-side preparation

1. Resolve every package/image to a full digest.
2. Export OCI manifests/blobs, SBOMs, licenses, signatures, certificates, transparency bundle or
   checkpoint, and protected source/build metadata.
3. Create a sorted inventory with byte sizes and SHA-256 for every file.
4. Scan the materialized bytes and preserve tool versions/output.
5. Sign the inventory as its own artifact and verify it before transfer.

## Transfer and offline verification

On the disconnected side, recompute every inventory digest, verify the inventory signature using
pre-admitted trust material, verify each artifact without network fallback, and prove the process
attempts no egress. Stop on any missing or mismatched byte.

## Deployment and rollback

Deploy only the verified immutable references to a supported isolated cluster. Preserve cluster
inventory, policy results, workload readiness, receipt-key custody/rotation evidence, failure
injection, rollback, restore, and post-rollback readiness. “Files copied” is not an air-gap
deployment witness.

## Promotion result

Only the exact bundle that passes all connected/offline/deployment gates may be labelled
**AIRGAP_VERIFIED_AT_OBSERVATION**. Current result: **UNAVAILABLE**.

See [UDS deployment evidence checklist](/uds) and [Compliance](/compliance).

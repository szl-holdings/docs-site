# Warhacker / UDS briefing — historical plan

::: warning No current event or cluster witness
This page preserves a briefing concept. No current `kind` cluster, UDS bundle, cosign-verified
pointer manifest, live attestation append, or customer/event execution is claimed.
:::

## Problem framing

The intended briefing contrasts ordinary delivery controls—SBOMs, signatures, deployment
manifests, and observability—with SZL's proposed policy/receipt overlay. Each layer keeps its own
evidence class; a Lean source obligation does not verify an OCI signature or a cluster.

## Historical seven-part plan

1. State the verification gap and threat model.
2. Inspect immutable source/image candidates.
3. Verify artifact provenance and inventory.
4. Deploy only to an isolated admitted cluster.
5. Append a content-addressed integrity record.
6. Run the named Lean/source check separately.
7. Exercise failure/rollback and report unresolved gates.

## What must exist before a live briefing

- admitted bundle/image digests and SBOM roots;
- exact cosign verification JSON and signer identity;
- cluster inventory, protected deployment run, and workload readiness;
- preserved attestation/receipt bytes with explicit signature state;
- theorem names/source revisions for any proof statement;
- no-egress/rollback results and independent live readback.

Without those artifacts the briefing remains **HISTORICAL / MODELED**, not an operational demo.
See [UDS](/uds/), [Compliance](/compliance), and [Runtime status](/status).

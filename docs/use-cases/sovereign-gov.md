# Sovereign-government deployment — design and admission gates

::: danger Deployment UNAVAILABLE
No immutable UDS bundle digest, five-service readiness witness, air-gap result, receipt-signature
set, or customer deployment is attached. This is a proposed workflow, not a shipped deployment.
:::

## Intended outcome

An admitted sovereign deployment would keep named workloads, policy enforcement, evidence, and
receipt verification within a controlled environment. “Sovereign” does not by itself prove
security, compliance, no egress, or operational readiness.

## Required gates

1. Immutable source/image/package digests and SBOM hashes.
2. Exact cosign/certificate results for those digests.
3. Supported cluster/UDS/Zarf versions and capacity inventory.
4. Network/no-egress, identity, secret custody, backup, rotation, and rollback tests.
5. Policy tests tied to the named legal/control baseline; no blanket certification language.
6. Receipt bytes with integrity/signature states kept distinct.
7. Protected deployment run plus exact live/readiness readback.
8. Independent witness and a customer-specific acceptance record.

## Fail-closed hand-off

Use the [UDS deployment checklist](/uds) and [UDS design contract](/uds/). Until every required
field is populated with immutable evidence, commands must retain `<UNAVAILABLE>` placeholders and
exit before pulling or deploying.

## Safety boundary

This architecture is decision support and governance infrastructure. It does not authorize
autonomous lethal action and it does not convert modeled outcomes into measured operational facts.

---

*Design use case · artifact/deployment/customer evidence UNAVAILABLE*

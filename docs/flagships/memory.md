# a11oy Memory - provenance anchor

> **Status:** Memory is documented as an a11oy in-process capability and a roadmap provenance
> role. It is not claimed as a separately deployed public service; see [Runtime status](/status).

## Overview

**a11oy Memory** documents receipt-provenance techniques including append-only delta logs,
Lamport ordering, and a Shor-encoding representation. The proposed external Cardano anchoring
path is not a mainnet claim. It remains a roadmap item stated on [Runtime status](/status).

The source description should be read as an implementation and architecture reference. It does
not establish a currently reachable anchoring service, a signed receipt, or an immutable external
ledger for every decision.

## Mathematical references

| Property | Documented scope | Reference |
|----------|------------------|-----------|
| Convergence | proposed compression-operator framing | [Banach, 1922](https://doi.org/10.4064/fm-3-1-133-181) |
| Error correction | Shor-encoding representation in the provenance design | [Shor, 1995](https://doi.org/10.1103/PhysRevA.52.R2493) |
| Causal order | Lamport timestamps in receipt-event ordering | [Lamport, 1978](https://doi.org/10.1145/359545.359563) |

The formal-methods and runtime evidence for any specific property must be read from its pinned
artifact. The broad proof posture is `MIXED`; see [Evidence](/evidence/) and [Proof](/proof).

## Source and evidence

- **Role status:** `ROADMAP` as a standalone provenance service.
- **Source:** [`a11oy`](https://github.com/szl-holdings/a11oy)
- **External anchoring:** Cardano mainnet anchoring is `ROADMAP`, not a current claim.
- **Receipt signatures:** [Compliance](/compliance) and the exact artifact are authoritative.
- **Specification:** [Ouroboros Thesis](https://doi.org/10.5281/zenodo.20434276)

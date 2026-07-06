---
title: "UDS Mesh — the nervous system"
description: "The trace + receipt mesh: what is LIVE, what is in-process, what is roadmap."
outline: deep
---

# UDS Mesh — the nervous system

The SZL substrate is modeled as a body. Two flagships ship today — **a11oy** (the
policy + receipt heart) and **killinchu** (drone-intelligence courier) — alongside three
roadmap/frontier roles: the **Provenance Anchor** (convergent memory sync), the
**Operator** (decision/receipt console), and the **Policy** drift detector (fail-closed
safety gate). Two structural organs complete the anatomy (**skeleton** = vessels /
deployment fabric, **wires** = the W3C-`traceparent` nervous signal). The mesh is the
**nervous system** that carries trace context + DSSE receipts between them.

::: tip Honest status legend
`LIVE` = wired and verified in-process · `IN-PROC` = real within a single organ, not
cross-pod · `ROADMAP` = v0.4.0, not shipped. **Honesty over checklist.**
The honest roles are Provenance Anchor, Operator, and Policy. Roadmap components have no live
Space today.
:::

```mermaid
flowchart TB
    classDef live fill:#0f3a2e,stroke:#5ad1c0,color:#e8eef7;
    classDef inproc fill:#2a3550,stroke:#7aa2ff,color:#e8eef7;
    classDef roadmap fill:#3a2f0f,stroke:#e0c060,color:#e8eef7;

    subgraph BODY["SZL UDS substrate — anatomy"]
      direction TB
      OPERATOR["🧠 brain / nervous-cortex<br/><b>Operator</b> — decision console<br/>(roadmap; issues commands)"]:::roadmap
      A11OY["❤️ heart / switch-fabric<br/><b>a11oy</b> — policy + receipt substrate<br/>/honest · MCP tools<br/>Wire D traceparent + DSSE Khipu DAG"]:::live
      ANCHOR["🩸 blood / memory cortex<br/><b>Provenance Anchor</b> — convergent sync<br/>(roadmap; KL-drift bounded)"]:::roadmap
      POLICY["🛡️ immune system<br/><b>Policy</b> — fail-closed safety gate<br/>(roadmap; ALLOW/DENY)"]:::roadmap
      KILLINCHU["📡 nervous / courier<br/><b>killinchu</b> — drone-intelligence relay<br/>(shipping flagship)"]:::live
      VESSELS["🦴 skeleton / deployment fabric<br/><b>vessels</b> — structural proving ground"]:::roadmap
      WIRES["🔌 wires / W3C trace context<br/>traceparent: 00-&lt;trace&gt;-&lt;span&gt;-01<br/>tracestate: szl=&lt;span&gt;"]:::live
    end

    RECEIPTS["📜 szl-receipts<br/>DSSE Khipu Merkle DAG<br/>(receipt sink)"]:::inproc

    OPERATOR -->|"Wire C: /v1/events + Khipu ingest (ROADMAP)"| A11OY
    A11OY -->|"Wire B: /v1/verdict + /v1/inspect (IN-PROC)"| POLICY
    A11OY -->|"Wire E: SSE cortex-subscribe (IN-PROC ring buffer)"| ANCHOR
    A11OY -->|"Wire F: /v1/receipts/ingest (IN-PROC)"| VESSELS
    A11OY -->|"DSSE receipt (traceparent embedded) — LIVE"| RECEIPTS

    WIRES -.->|"traceparent on every request (LIVE in-process)"| A11OY
    WIRES -.-> KILLINCHU
```

## Wire status table (verified 2026-06-03)

| Wire | Edge | What it carries | Status |
|---|---|---|---|
| **B** | a11oy ↔ Policy (immune) | gate verdict / inspect | **IN-PROC (Policy = roadmap role)** |
| **C** | a11oy ↔ Operator (receipt stream) | decision events + Khipu ingest | **ROADMAP (Operator not deployed)** |
| **D** | W3C traceparent | real trace-id/span-id generation + propagation | **LIVE in-process; cross-Space broker NOT wired** |
| **E** | a11oy ↔ Provenance Anchor (cortex sync) | decision SSE events | **IN-PROC (in-memory ring buffer)** |
| **F** | a11oy ↔ vessels (receipts) | DSSE receipts into Khipu DAG | **LIVE (in-process)** |
| OTLP | any organ → collector | OTEL span export | **NOT WIRED — schema only (roadmap)** |
| cross-pod | organ ↔ organ over k8s Service | mTLS service mesh (Istio Package CR) | **ROADMAP v0.4.0** (verified: in-cluster ClusterIP call times out today) |

## What is real vs. aspirational

**Real, verified live (2026-06-03):**

- a11oy emits **real W3C trace context** — `traceparent: 00-<trace>-<span>-01`,
  `tracestate: szl=<span>`, plus an `x-szl-wire-d: LIVE` marker — on every HTTP response.
  Incoming `trace_id` is preserved across the request (propagation verified).
- **a11oy** binds that traceparent into every **DSSE Khipu receipt** envelope (verified
  by decoding the base64 DSSE payload — the traceparent is embedded).
- Span **schemas** are published under a `szl.mesh.*` envelope as internal topic
  identifiers (`a11oy.graph`, plus reserved keys for the roadmap roles); these are
  technical schema names, not user-facing product names.
- In-cluster proof: a11oy runs 1/1 Ready in the `szl-stress` kind cluster and serves
  `{"status":"ok"}` on port 7860.

**Honest gaps (not yet wired):**

- **No OTLP export.** No `opentelemetry` package, no exporter, no collector — spans are a
  documented schema, not a live telemetry signal.
- **DSSE receipts are UNSIGNED** today (`signatures: []`) — the cosign private key
  (`SZL_COSIGN_PRIVATE_PEM`) is not present in the runtime.
- **Cross-pod organ traffic is NOT wired.** An in-cluster ClusterIP call times out; there
  is no Istio `Package` CR / service-discovery wiring in the bundle charts.
- **The Operator, Provenance Anchor, and Policy roles are roadmap** — they have no live
  Space today; only a11oy and killinchu ship.

> Until modules actually call each other across pods and spans are exported, this is a
> **live in-process governance signal**, not distributed telemetry — honestly short of a
> full service mesh. See `uds-bundles/mesh/docs/roadmap/MESH_INTERCONNECT.md`.

---

*Sources:
[`uds-bundles/mesh/schemas/spans/`](https://github.com/szl-holdings/uds-bundles/tree/main/mesh/schemas/spans),
[`MESH_INTERCONNECT.md`](https://github.com/szl-holdings/uds-bundles/blob/main/mesh/docs/roadmap/MESH_INTERCONNECT.md),
and the flagship `szl_provenance.py` / `szl_wire.py` runtime. Verified live by the
uds-fully-operational squad. Λ Conjecture 1 (not a theorem) · 749/14/163 v11 LOCKED ·
SLSA L1 honest · Section 889 = 5 vendors.*

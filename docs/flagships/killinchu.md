# killinchu — drone intelligence

<div class="quechua">
<strong>Etymology.</strong> Quechua <strong><em>killinchu</em></strong> = <strong>kestrel</strong>,
a small Andean falcon — a precise hunter that hovers, watches, and strikes only when the
target is resolved. Gloss: <a href="https://kaikki.org/eswiktionary/">kaikki.org Quechua</a>.
</div>

## Overview

`killinchu` 🦅 is the SZL **drone-intelligence flagship**: a source-described **counter-UAS
rule engine** with **Λ-gate governance**, Khipu receipt structures, and protocol-ingest
implementations. These are source capabilities; the dated hosted observation below witnessed
only the health route.

**Anatomy mapping:** killinchu is the **embodied bridge organ** — the
[Killinchu-bridge](/anatomy/#killinchu-bridge) — that extends digital governance to
physical-space actuation (see sub-formula [SF-12](/doctrine/puriq#sf-12)).

## Source-described protocol decoders

The repository describes the following decoder implementations. They were not exercised against
the hosted revision during this docs release, so this section is not a runtime witness.

| Protocol | Decoder | Standard |
|----------|---------|----------|
| **Remote ID** | OpenDroneID / ASTM F3411-22a 25-byte parser (Basic ID, Location/Vector, Self ID, System, Operator ID) | ASTM F3411 |
| **ADS-B** | Mode-S 1090ES (DF17) via `pyModeS` v3, incl. CPR even/odd global position | RTCA DO-260B |
| **MAVLink** | v1/v2 frame parsing via `pymavlink` (HEARTBEAT and beyond) | MAVLink |

- **Drone database** — 53 systems across allied, dual-use, adversary, and counter-UAS
  categories, organized by US DoD UAS Groups 1–5, each with telemetry surfaces, specs, and
  sourced notes.
- **Counter-UAS Λ-gate** — a **haversine** geofence breach check fused with a
  [13-axis `yuyay_v3`](/doctrine/v11-v12) governance score (Λ); decisions emit a DSSE Khipu
  receipt anchored in an in-memory Merkle DAG (real SHA-256).
- **Swarm topology** — **Union-Find** connected-component detection over proximity graphs to
  flag coordinated swarms.

## Honesty disclosure (Doctrine v11)

Source documentation describes `GET /api/killinchu/v1/honest` as returning this disclosure as
JSON. The dated hosted observation did not call that route:

- **Λ is a Conjecture, not a Theorem.** The 13-axis governance score is a decision aid, not a proof of safety.
- **DSSE receipt signatures are `PLACEHOLDER`** — Sigstore CI signing is not yet wired. Receipts carry a real SHA-256 Merkle digest but an unsigned envelope. **SLSA L1 honest.**
- **Broadcast Remote ID, ADS-B, and civilian MAVLink are unauthenticated and spoofable.** Every decoded field is a *claim*, not ground truth. Malformed input returns an honest error, never a silent pass.
- Formal corpus at v11 lock: <span class="locked">749 declarations</span> / <span class="locked">14 unique axioms</span> / <span class="locked">163 sorries</span>.

## API

At exact observed revision `83142da9526e2c0ddfe1e78eb99a20940cde0cf3`, hosted evidence is
strictly limited to `GET /api/killinchu/healthz` returning HTTP 200 on 2026-08-11. Every `/v1/*`
entry below is a source-described route shape, not a hosted response witness. See the
[full API reference](/api/killinchu) for that same boundary.

| Method | Path | Evidence boundary |
|--------|------|-------------------|
| GET | `/healthz` | **HOSTED HEALTH WITNESS:** HTTP 200 at the exact observed revision and time only. |
| GET | `/readyz` | Source-described; not separately witnessed. |
| GET | `/v1/honest` | Source-described honesty-disclosure shape; not runtime-witnessed. |
| POST | `/v1/remote-id/decode` | Source-described OpenDroneID / ASTM F3411 decoder shape; not runtime-witnessed. |
| POST | `/v1/ads-b/decode` | Source-described ADS-B decoder shape; not runtime-witnessed. |
| POST | `/v1/mavlink/parse` | Source-described MAVLink parser shape; not runtime-witnessed. |
| GET | `/v1/drones/database` · `/v1/drones/{id}` | Source-described database routes; not runtime-witnessed. |
| POST | `/v1/counter-uas/evaluate` | Source-described geofence/Λ/receipt shape; not runtime-witnessed. |
| GET/POST | `/v1/swarm/topology` | Source-described topology routes; not runtime-witnessed. |
| GET | `/v1/threats/active` | Source-described threat-board route; not runtime-witnessed. |
| POST | `/v1/receipt/emit` · GET `/v1/receipt/ledger` | Source-described receipt routes; not runtime-witnessed. |
| GET | `/v1/lambda` | Source-described Λ-axis route; not runtime-witnessed. |
| GET | `/v1/research` · `/v1/samples` | Source-described research/sample routes; not runtime-witnessed. |

## Historical request shapes — not a live API witness

```text
GET  /api/killinchu/v1/honest
POST /api/killinchu/v1/remote-id/decode
     {"hex":"<Remote-ID frame>"}
POST /api/killinchu/v1/counter-uas/evaluate
     {"track":{"lat":"<lat>","lon":"<lon>"},"geofence":{"center":["<lat>","<lon>"],"radius_m":500}}
```

These examples document historical/source-level shapes only. They are not a claim that an action
route is currently callable, authorized, compatible with the example payload, or reproducible at
the hosted revision. Establish each of those properties with a fresh, exact-revision response
before operational use.

## Stack

FastAPI · uvicorn · `pyModeS` v3 · `pymavlink` · React + Vite SPA (wouter) ·
MapLibre GL (OpenFreeMap tokenless tiles) · Docker on Hugging Face Spaces.

## Source & evidence

- **Repo:** [github.com/szl-holdings/killinchu](https://github.com/szl-holdings/killinchu)
- **Observed host (health only):** [szlholdings-killinchu.hf.space](https://szlholdings-killinchu.hf.space) — health HTTP 200 at revision `83142da9526e2c0ddfe1e78eb99a20940cde0cf3`; no `/v1/*` response is witnessed here.
- **License:** Apache-2.0 · Doctrine v11 · ORCID [0009-0001-0110-4173](https://orcid.org/0009-0001-0110-4173)
- **Legal boundaries:** counter-UAS engagement guidance is decision-support only; see the repo's `LEGAL_BOUNDARIES.md`.

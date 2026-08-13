# UDS — Unified Demo Surface

::: danger UNAVAILABLE — design contract, not a public runtime
No exact-revision public UDS deployment, multi-organ execution, quorum receipt, per-organ
signature set, or Rekor entry has been independently witnessed. Hatun-MCP was `PAUSED` and
returned HTTP 503 in the dated [/status](/status) observation. Do not run this page as an
integration guide until those gates have evidence.
:::

UDS is the proposed single governed surface for composing SZL product roles. This page records
the architecture and the evidence required to promote it; it does not assert that five independent
services, a consensus deployment, or a signed-receipt pipeline currently exists.

> Doctrine source snapshot: `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f` — locally measured
> `749 declarations / 14 unique axioms / 163 raw sorry tokens`. Lambda remains Conjecture 1.

## Proposed execution contract

1. **Intake** — a versioned request enters a named aggregator route.
2. **Fan-out** — independently deployed roles evaluate the same content-addressed input.
3. **Quorum** — a declared quorum rule evaluates byte-identical, signer-bound verdicts.
4. **Receipt** — the aggregator emits an integrity record and, only when proven, a signature.
5. **Publication** — immutable receipt bytes, key/certificate identity, and transparency material
   are retained together.

Those steps are design requirements. A source route or diagram does not prove any step ran.

## Promotion evidence required

| Gate | Required evidence | Current state |
|---|---|---|
| Deployment | Exact source revision, immutable image digests, protected deployment run, live readback | **UNAVAILABLE** |
| Organ independence | Named live endpoints and revisions for every quorum participant | **UNAVAILABLE** |
| Quorum | Request bytes, participant verdict bytes, algorithm/version, and replay result | **UNAVAILABLE** |
| Receipt signing | Signature algorithm, exact signed bytes, signer identity, public verification material, verified result | **UNAVAILABLE** |
| Rekor/transparency | Immutable log index and entry readback bound to the receipt digest | **UNAVAILABLE** |
| MCP | Authenticated `initialize` plus catalog/tool witness at an exact Hatun-MCP revision | **UNAVAILABLE** |

## Published route shapes

Source documentation names `/api/killinchu/uds/v1/mission/execute` and
`/api/killinchu/uds/v1/consensus/verify` as proposed route shapes. They are not current public
quickstarts. See [MCP integration](/developers/mcp_integration), [API reference](/api/), and
[Compliance](/compliance) before interpreting a response.

## Simulation boundary

Drone positions in UDS examples are deterministic simulated inputs, and geofence zones are static
fixtures. Simulation can test orchestration logic; it cannot establish deployment, sensor
authenticity, runtime availability, or signature provenance.

---

*Design contract · runtime/signature/transparency state UNAVAILABLE · SLSA L1 honest*

# a11oy API (package surface)

[a11oy](/flagships/a11oy) is consumed as **TypeScript packages**, not a public HTTP API — its
governance surface is reached exclusively through the
[`szl-holdings/platform`](https://github.com/szl-holdings/platform) layer. This page documents
the package interface.

## Packages

| Package | npm | Key exports |
|---------|-----|-------------|
| `@szl-holdings/a11oy-policy` | published | `CovenantPolicy`, `ApprovalGate`, `PolicyDecision` |
| `@szl-holdings/a11oy-measurement` | published | `SignalScore`, `PRISMFrame`, `DriftReport` |
| `packages/knowledge` | workspace | `KnowledgeGraph`, `OntologyQuery`, `DomainNode` |
| `packages/qec-integrity` | workspace | `QECLineage`, `IntegrityProof`, `CSSVector` |

## `CovenantPolicy.evaluate`

```ts
import { CovenantPolicy, type PolicyDecision } from '@szl-holdings/a11oy-policy'

const policy = new CovenantPolicy()
const decision: PolicyDecision = policy.evaluate({
  action: 'deploy-model',
  axes: {
    moralGrounding: 0.97,        // sacred, floor 0.95
    measurabilityHonesty: 0.96,  // sacred, floor 0.95
    empiricalGrounding: 0.93,    // structural, floor 0.90
    // ...remaining structural + introspection axes
  },
})

// decision.passed       → boolean (conjunctive AND over all 13 axes)
// decision.failedAxes   → string[] of axes below floor
// decision.continuumHash → receipt hash
```

The Λ-invariant constrains evaluation: no recommendation below the configured confidence
threshold reaches the approval gate without escalation. See the
[a11oy flagship page](/flagships/a11oy) for the 7-layer pipeline.

---

## Live HTTP API (a11oy Space)

In addition to the TypeScript package surface above, the governed a11oy organ runs as a
FastAPI/Starlette service with a public, read-mostly HTTP surface. Base host:

> Live base: [`https://a-11-oy.com`](https://a-11-oy.com/api/a11oy/v1/pinn/health)

Every governed action emits a **Khipu receipt** (SHA3-256 hash chain; receipts are honestly
labelled `signed` or `DSSE_PLACEHOLDER` when no signing key is present in the runtime). All
returned values carry honest labels — `MODELED` (fit to data, not measured), `SAMPLE`
(illustrative inputs), or `MEASURED`. The Λ aggregate is **Conjecture 1 — advisory only, capped
≤ 0.99, never a proof.** The locked-proven theorem count is **8** {F1, F4, F7, F11, F12, F18,
F19, F22} at kernel `c7c0ba17`. (The Merkle-Functor compositional-closure theorem is
machine-checked in `lutar-lean` CI but is **experimental** — it does **not** change the locked
count of 8.)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/a11oy/v1/govern/infer` | Governed inference: routes to an eligible model, runs Λ-gate + conformal block, returns a signed receipt |
| POST | `/api/a11oy/v1/pinn/identify` | Inverse-PINN parameter identification (demos: `duffing`, `calphad`); self-doubt RED gate on non-identifiable params |
| GET | `/api/a11oy/v1/pinn/health` | PINN organ liveness + supported systems |
| GET / POST | `/api/a11oy/v1/e8/verify` | E8-lattice encoding of a receipt digest — **error-detection geometry only** |
| GET | `/api/a11oy/v1/specdec/health` | Speculative-decoding readiness (same-family draft+target probe) |
| POST | `/api/a11oy/v1/specdec/run` | Speculative-decoding run — **honest ROADMAP label** when no same-family pair is reachable |
| POST | `/api/a11oy/v1/materials/novelty` | Governed crystal-novelty check (isometry-invariant PDD fingerprint) + receipt |
| POST | `/api/a11oy/v1/materials/certify` | PAC-Bayes (McAllester 1999) certified risk bound + receipt |
| GET | `/api/a11oy/v1/assurance/evidence-pack` | Single offline-verifiable auditor pack with a `sha3_256` self-digest |
| GET | `/api/lake/v1/health` | Receipt ledger (szl-lake) health + per-organ chain heads |

### Governed inference — `POST /govern/infer`

Routes a prompt to the smallest eligible model (sensitivity-first → GREEN license → smallest
tier → max context), runs the Λ-gate and a split-conformal coverage block, and returns a
decision plus a receipt.

```bash
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/govern/infer \
  -H 'content-type: application/json' \
  -d '{"prompt":"What is the capital of France?"}' | jq .
```

```json
{
  "decision": "allow",
  "answer": "The capital of France is Paris.",
  "governance": {
    "lambda": 0.97,
    "lambda_kind": "Conjecture 1 (advisory; NOT a theorem)",
    "gates": [{"gate": "threat-signature-scan", "fired": false},
              {"gate": "pii-egress-guard", "fired": false}]
  },
  "conformal": {
    "coverage_target": 0.9, "coverage_achieved": 0.9062,
    "method": "split-conformal finite-sample quantile (Vovk 1999; Angelopoulos & Bates 2021)",
    "label": "CP-90 SAMPLE"
  },
  "doctrine": {"locked_proven": ["F1","F4","F7","F11","F12","F18","F19","F22"]}
}
```

### Inverse-PINN — `POST /pinn/identify`

Recovers physical/material parameters from data via an inverse physics-informed engine
(NumPy-only spectral surrogate). A **self-doubt gate** labels any non-identifiable parameter
(Fisher `< 1e-08` or `κ(FIM) ≥ 1e+08`) **RED/UNIDENTIFIABLE** and refuses to assert it.

```bash
# Duffing oscillator → GREEN, recovers alpha ≈ 1.0
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/pinn/identify \
  -H 'content-type: application/json' -d '{"demo":"duffing"}' | jq .

# CALPHAD Redlich-Kister L0/L1/L2 recovery → GREEN
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/pinn/identify \
  -H 'content-type: application/json' -d '{"demo":"calphad"}' | jq .

# Ill-posed CALPHAD (high noise, few points) → RED / REFUSE
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/pinn/identify \
  -H 'content-type: application/json' -d '{"demo":"calphad","case":"ill_posed"}' | jq .
```

Each discovered parameter is labelled `MODELED` and ships a 95% CI, Fisher information, a
convergence label (`GREEN`/`RED`), and an F19 Bekenstein-bound plausibility check (the
inequality is locked-proven; the application is MODELED with SAMPLE R, E unless supplied).

### E8 lattice receipt verification — `GET/POST /e8/verify`

Maps a 256-bit receipt digest to 8 × 32-bit coordinates and finds the nearest E8 lattice point
(Conway & Sloane closest-point). `min_squared_distance == 0` ⇒ the vector lies exactly on E8.

```bash
curl -s "https://a-11-oy.com/api/a11oy/v1/e8/verify" | jq .
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/e8/verify \
  -H 'content-type: application/json' \
  -d '{"digest":"d0361e9f2c8d8ac96a1cdab46a6f45de3ed697a9e767d7ccccce2d69b60ae73c"}' | jq .
```

> **Honest posture.** E8 is the densest sphere packing in ℝ⁸ —
> proven by **Viazovska (2016, *Annals of Mathematics* 185:991–1015)** and formalized in Lean
> (EPFL). This endpoint **cites** that result as prior art for the encoding geometry. E8 here
> provides **error-DETECTION geometry only** (minimum-distance separation between codepoints).
> It does **NOT** give adversarial-substitution resistance, collision resistance, tamper-proofing,
> or BFT safety, and adds **zero** to the locked-proven count.

### Speculative decoding — `GET /specdec/health`, `POST /specdec/run`

Governed speculative decoding (Leviathan et al. 2023, arXiv:2211.17192, reimplemented from the
public paper). Lossless speculative decoding requires a draft+target sharing the **same
tokenizer/vocabulary**. When no same-family pair is reachable on the mesh, the endpoint returns
an honest **`SPEC-DECODE ROADMAP`** label with a MODELED acceptance-rejection accounting curve —
**no faked speedup, `measured: UNAVAILABLE`**.

```bash
curl -s https://a-11-oy.com/api/a11oy/v1/specdec/health | jq .
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/specdec/run \
  -H 'content-type: application/json' -d '{"prompt":"Hello"}' | jq '.payload.label, .payload.measured'
```

### Governed materials predictor — `POST /materials/novelty`, `POST /materials/certify`

The materials organ exposes two governed surfaces (note: there is **no** `/materials/predict`).

**Novelty** — submit a crystal (lattice + sites); returns an isometry-invariant
Pointwise-Distance-Distribution (Kurlin-style) fingerprint, a novelty verdict, and a chained
receipt. Injectivity of the fingerprint is **Conjecture 2 — ROADMAP, NOT proven**.

```bash
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/materials/novelty \
  -H 'content-type: application/json' \
  -d '{"a":3.6,"b":3.6,"c":3.6,"alpha":90,"beta":90,"gamma":90,
       "sites":[{"el":"Cu","x":0,"y":0,"z":0},{"el":"Au","x":0.5,"y":0.5,"z":0.5}]}' | jq .
```

**Certify** — PAC-Bayes risk bound. Supply explicit `{empirical_risk, kl, n, delta}` or a
`{family}` preset (`intermetallics`, `oxides`, `refractory_hea`). The McAllester (1999) bound
**formula is proven on paper and the computation is exact**; the **Lean proof is an open
SORRY/ROADMAP** (`Lutar/Materials/PACBayesMaterials.lean`) — not in the locked-8. Preset inputs
are labelled `SAMPLE/MODELED`.

```bash
curl -s -X POST https://a-11-oy.com/api/a11oy/v1/materials/certify \
  -H 'content-type: application/json' -d '{"family":"intermetallics"}' | jq .
```

### Auditor evidence pack — `GET /assurance/evidence-pack`

Assembles a single offline-verifiable pack at request time from already-live a11oy surfaces
(assurance matrix, Khipu organ chain heads, lake health, doctrine, cosign public key). The
envelope carries a **`pack_sha3_256` self-digest** that any auditor can recompute offline with
zero server round-trip:

```bash
curl -s https://a-11-oy.com/api/a11oy/v1/assurance/evidence-pack \
  | jq '{pack_sha3_256, digest_canonicalization, signature}'
```

```python
import httpx, json, hashlib
env = httpx.get("https://a-11-oy.com/api/a11oy/v1/assurance/evidence-pack", timeout=60).json()
canon = json.dumps(env["pack"], sort_keys=True, separators=(",", ":"), ensure_ascii=False)
recomputed = hashlib.sha3_256(canon.encode("utf-8")).hexdigest()
assert recomputed == env["pack_sha3_256"], "tamper detected"
print("offline self-digest verified:", recomputed)
```

The pack is `signed: false` / `DSSE_PLACEHOLDER` when no demo signing key is present in the
runtime — **honest-unsigned**. The sha3_256 self-digest is always independently recomputable.

### Receipt ledger — `GET /api/lake/v1/health`

```bash
curl -s https://a-11-oy.com/api/lake/v1/health | jq .
```

Returns the szl-lake receipt store status: `chain_alg: sha3_256`, total receipt count, and the
per-organ `chain_head` for each writer (`a11oy-kernel`, `a11oy-pinn`, …). See the
[Data Lake page](/lake) for the ledger model.

## Honesty disclosure

Every frontier surface above adheres to Doctrine v11 honest-labels:

- **8 locked-proven** formulas at kernel `c7c0ba17` — never inflated. Corpus framing:
  *8 proven / ~35 wired / ~185 corpus.*
- **Λ = Conjecture 1** — advisory aggregate, capped ≤ 0.99, never a theorem, never 1.0.
- **E8** = error-detection geometry citing Viazovska 2016 — **not** security.
- **specdec** = honest ROADMAP when no same-family pair is reachable — no faked speedup.
- Values are **MODELED** unless explicitly MEASURED; receipts are honestly signed or unsigned.

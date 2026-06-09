# API Reference

This section documents the live HTTP surfaces of the SZL flagships. Where a flagship publishes
an **OpenAPI** spec, this site renders it; where a spec is not yet published, the endpoint
tables below are the authoritative reference.

::: info OpenAPI auto-generation status
- **killinchu** — live FastAPI service; its OpenAPI schema is served at
  `/openapi.json` on the Space. The [killinchu API page](/api/killinchu) mirrors it.
- **a11oy** — consumed as a TypeScript package, not a public HTTP API. Its typed surface is
  documented on the [flagship page](/flagships/a11oy).
- **Provenance Anchor / Operator / Policy** (retired codenames *amaru* / *rosie* / *sentra*)
  — roadmap roles, not released as packages or public HTTP APIs today.
- **Auto-generated OpenAPI doc pages** for any future public HTTP service are **in development**;
  this index will render them as specs publish.
:::

## Live HTTP surfaces

| Flagship | Surface | Reference |
|----------|---------|-----------|
| [killinchu](/api/killinchu) | FastAPI on HF Space — counter-UAS, decoders, receipts | [/api/killinchu/*](https://szlholdings-killinchu.hf.space/api/killinchu/v1/honest) |
| [a11oy](/flagships/a11oy) | TypeScript package (no public HTTP) | [flagship page](/flagships/a11oy) |
| Provenance Anchor *(codename amaru, retired)* | roadmap — not released | [flagship page](/flagships/amaru) |
| Operator *(codename rosie, retired)* | roadmap — not released | [flagship page](/flagships/rosie) |
| Policy *(codename sentra, retired)* | roadmap — not released | [flagship page](/flagships/sentra) |

## Conventions

- **Receipts.** Every state-changing call returns a Khipu receipt:
  `{ sha256, prevRoot, lamport, signature, chain_verified }` with `signature: "DSSE-PLACEHOLDER"`.
- **Honest errors.** Malformed input returns a 4xx with an explicit error body — never a silent
  pass (a Doctrine v11 §2 measurability-honesty requirement).
- **Health.** Services expose `/healthz` (liveness) and `/readyz` (readiness).

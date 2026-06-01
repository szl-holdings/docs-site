# Status

Live operational status of the SZL surfaces. This page is a static snapshot of the canonical
endpoints; for real-time liveness, hit each service's `/healthz` directly.

## Live services

| Surface | Endpoint | Liveness check |
|---------|----------|----------------|
| killinchu API | [szlholdings-killinchu.hf.space](https://szlholdings-killinchu.hf.space) | `GET /api/killinchu/healthz` |
| Anatomy-3D | [szlholdings-anatomy-3d.static.hf.space](https://szlholdings-anatomy-3d.static.hf.space/) | static Space |
| Rosie-3D | [szlholdings-rosie-3d.static.hf.space](https://szlholdings-rosie-3d.static.hf.space/) | static Space |
| MCP receipts server | `szlholdings-mcp-receipts-server.hf.space` | `GET /gradio_api/info` (17 tools) |

## Repositories

All flagship repos run CI, CodeQL, SBOM, and DCO workflows on `main`:

- [a11oy](https://github.com/szl-holdings/a11oy) · [amaru](https://github.com/szl-holdings/amaru) ·
  [sentra](https://github.com/szl-holdings/sentra) · [killinchu](https://github.com/szl-holdings/killinchu) ·
  [rosie](https://github.com/szl-holdings/rosie)
- [lutar-lean](https://github.com/szl-holdings/lutar-lean) (kernel) ·
  [ouroboros-thesis](https://github.com/szl-holdings/ouroboros-thesis) ·
  [szl-cookbook](https://github.com/szl-holdings/szl-cookbook) ·
  [szl-brand](https://github.com/szl-holdings/szl-brand)

::: info Dedicated status page
A dedicated, auto-refreshing status page (uptime history + incident log) is **in development**.
Until it ships, this page is the canonical endpoint list and each service's `/healthz` is the
real-time source of truth.
:::

## Known honest-status items

- **cosign signing:** PENDING — DSSE signatures are `PLACEHOLDER` (see [Compliance](/compliance)).
- **Cardano mainnet anchoring (amaru):** in development.
- **Cross-mesh W3C traceparent (OTel-VSP Wire D):** in development; in-process tracing is live.
- **Unified SDKs (szl-python, szl-ts):** in development.

# Developer quickstart — evidence before integration

::: warning Runtime boundary — observed 2026-08-11
Use the killinchu readiness route only after rechecking [/status](/status): it was **AVAILABLE_AT_OBSERVATION** at
revision `83142da9`. a11oy was provider `RUNNING` at `f5c395e8` but readiness timed out twice;
it is **UNAVAILABLE**. Hatun-MCP was `PAUSED` with `/readyz` HTTP 503 and quota `3/3`; it is
**UNAVAILABLE**. No current authenticated Hatun client session is claimed.
:::

## 1. Establish the source contract

```bash
LUTAR_REV=c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f
git clone --filter=blob:none --no-checkout https://github.com/szl-holdings/lutar-lean.git lutar
cd lutar
git checkout --detach "$LUTAR_REV"
test "$(git rev-parse HEAD)" = "$LUTAR_REV"
python3 -I -B .github/scripts/lean_numbers.py --repo-path . --ref "$LUTAR_REV"
```

This pins the Doctrine v11 source contract. It does not query a hosted runtime. See
[Evidence](/evidence/) for the count command and DOI lineage.

## 2. Check public readiness before any integration

```bash
curl --fail-with-body --max-time 30 \
  https://szlholdings-killinchu.hf.space/api/killinchu/healthz
```

The observed HTTP 200 is a point-in-time public readiness fact. It does not assert that every
killinchu route is public, authenticated, signed, or continuously available.

## 3. Use published routes with their current state

| Surface | Published route family | Current evidence |
|---|---|---|
| killinchu | `/api/killinchu/v1/*` | Readiness observed; inspect [API](/api/killinchu) before a call. |
| a11oy | `/healthz`, `/api/a11oy/v1/*`, `/mcp/` | Route shapes documented; readiness unavailable in this observation. |
| Hatun-MCP | `/readyz`, server card, authenticated Streamable HTTP | Paused; authentication and client session not current-witnessed. |

Do not paste keys into a shell transcript or chat. This documentation does not offer a customer
portal or generic API-key bootstrap because no such end-to-end issuance flow is currently
witnessed here.

## 4. Build from source instead of assuming a package is published

```bash
git clone https://github.com/szl-holdings/a11oy.git
cd a11oy
pnpm install --frozen-lockfile
pnpm build
```

Use local manifests and repository instructions for workspace packages. `szl-python`, `szl-ts`,
and the Agentic Mesh SDK are planned surfaces, not registry-installable releases.

## 5. Read receipts honestly

Receipt verification has two distinct questions: a locally recomputed hash chain/self-digest may
support integrity; signer authentication requires a real signature. A receipt labelled
`DSSE-PLACEHOLDER` or `UNSIGNED` is not authenticated. Image-level signature evidence is separate
and does not make the running service ready. See [Verify](/developers/verify).

## Continue

- [API reference](/api/) — route catalog and availability boundary.
- [MCP integration](/developers/mcp_integration) — protocol/auth/client truth.
- [SDKs](/sdks/) — planned package surfaces.

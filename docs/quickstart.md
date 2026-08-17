# Quickstart — start with evidence

This quickstart starts with a reproducible source checkout, then shows the public-runtime
boundary. It intentionally does not present a timing-out or paused service as an executable
integration path.

::: warning Runtime status — observed 2026-08-11
**killinchu is AVAILABLE_AT_OBSERVATION** at `GET /api/killinchu/healthz` (HTTP 200) for the recorded revision.
**a11oy is UNAVAILABLE for readiness**: its provider is `RUNNING` at `f5c395e8`, but `/healthz`
timed out at both 20 s and 30 s. **Hatun-MCP is PAUSED** and `/readyz` returned HTTP 503 because
the provider quota was `3/3`. Recheck [Runtime status](/status) before every hosted call.
:::

## 1. Reproduce the pinned doctrine source

The locked contract is not a claim about a running Space. It is the exact Lean snapshot
`c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f`; do not conflate it with the separately bound
`lutar-v18.0.0` tag.

```bash
LUTAR_REV=c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f
git clone --filter=blob:none --no-checkout https://github.com/szl-holdings/lutar-lean.git lutar
cd lutar
git checkout --detach "$LUTAR_REV"
test "$(git rev-parse HEAD)" = "$LUTAR_REV" || { echo "wrong locked snapshot"; exit 1; }
python3 -I -B .github/scripts/lean_numbers.py --repo-path . --ref "$LUTAR_REV"
```

The remeasured values are `749 declarations / 14 unique axioms / 163 raw sorry tokens`. A clone of `main` answers a different question;
print its full SHA and label its result **CURRENT SOURCE**, not the locked contract. See
[Evidence](/evidence/) for DOI and source-lineage rules.

## 2. Build a flagship from source

Use source-local commands when registry publication has not been independently evidenced. The
following builds the checked-out a11oy source; it is not a claim that a public package registry
or hosted runtime is available.

```bash
git clone https://github.com/szl-holdings/a11oy.git
cd a11oy
pnpm install --frozen-lockfile
pnpm build
```

Consult the checked-out repository's `README`, lockfile, and package manifests for the current
local package names. Do not substitute an undocumented `npm install @scope/name` command for a
source checkout.

## 3. Call the currently ready public route

Only killinchu has a successful public readiness probe in the 2026-08-11 observation:

```bash
curl --fail-with-body --max-time 30 \
  https://szlholdings-killinchu.hf.space/api/killinchu/healthz
```

An HTTP 200 from that readiness endpoint establishes only the recorded public readiness result.
It does not authenticate other endpoints, prove a client integration, or prove receipt signing.
Use [killinchu API](/api/killinchu) for the published route shapes and recheck `/status` first.

## 4. Handle unavailable runtime paths honestly

Do not make a production call to a11oy or Hatun-MCP based on this snapshot:

```bash
# a11oy readiness was UNAVAILABLE in the 2026-08-11 observation.
# This diagnostic is expected to time out until a fresh successful readiness observation exists.
curl --connect-timeout 20 --max-time 30 -i \
  https://szlholdings-a11oy.hf.space/healthz
```

No API key, customer portal, or generic desktop configuration is documented here because none is
a currently witnessed end-to-end integration path. See [MCP integration](/developers/mcp_integration)
for the separate protocol/authentication boundary.

## Receipt and signing boundary

A receipt hash chain or a recomputed self-digest supports integrity of supplied bytes. It is not
a signature. Treat a receipt labelled `DSSE-PLACEHOLDER` or `UNSIGNED` as unsigned. Container
image cosign evidence, where available for an immutable image digest, is separate from a runtime
receipt and does not establish runtime readiness. See [Compliance](/compliance).

## Next steps

- [Developer hub](/developers/) — exact route, auth, package, and client boundaries.
- [API reference](/api/) — published route catalog; availability remains on [/status](/status).
- [SDKs](/sdks/) — planned SDK surfaces and source-local interim work.
- [Evidence](/evidence/) — pinned Lean reproduction, artifact lineage, and DOIs.

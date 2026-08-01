# MCP integration — verified interfaces and evidence states

SZL exposes governed tools through three interfaces. The a11oy REST surface and the
same-origin a11oy and killinchu MCP transports are directly callable today. The separate
Hatun-MCP service reports a ready, authenticated Streamable HTTP runtime. Those states are
not interchangeable, and none alone proves that a specific desktop client completed a
session.

## a11oy REST surface — available now

The canonical a11oy integration is:

- `GET https://szlholdings-a11oy.hf.space/api/a11oy/v1/mcp/tools` — discover the
  live tool catalog.
- `POST https://szlholdings-a11oy.hf.space/api/a11oy/v1/mcp/call` — invoke a
  governed tool.

The tool catalog is the source of truth for the names and capabilities currently
available. See the [API reference](./api_reference.md) for the full route contract and
the [quickstart](./quickstart.md) for an end-to-end example.

```bash
# Discover the currently available governed tools.
curl -s https://szlholdings-a11oy.hf.space/api/a11oy/v1/mcp/tools \
  -H 'Accept: application/json'

# Invoke one tool through the live REST contract.
curl -s -X POST https://szlholdings-a11oy.hf.space/api/a11oy/v1/mcp/call \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"tool":"lambda_score","args":{}}'
```

## a11oy and killinchu native MCP — protocol witnessed

The application Spaces publish same-origin Streamable HTTP endpoints:

- `https://szlholdings-a11oy.hf.space/mcp/`
- `https://szlholdings-killinchu.hf.space/mcp/`

For this release, both endpoints returned JSON discovery cards and successful JSON-RPC
`initialize` and `tools/list` responses using protocol revision `2024-11-05`. The live
discovery cards and `tools/list` responses remain authoritative for each catalog; this
documentation does not freeze a volatile tool count.

That is a protocol witness, not a blanket client-compatibility claim. Desktop clients can
differ in transport and authentication support, so publish a client-specific setup only
after that exact client completes initialization.

## Hatun-MCP — runtime ready, authentication required

The dedicated Hatun service publishes these read-only runtime contracts:

- [server card](https://szlholdings-hatun-mcp.hf.space/.well-known/mcp/server-card.json)
  — declares the live catalog and required API-key authentication.
- [readiness](https://szlholdings-hatun-mcp.hf.space/readyz) — reports the receipt chain
  and signer readiness state.
- [build information](https://szlholdings-hatun-mcp.hf.space/api/build-info) — reports
  the observed source revision, transport, and protocol revision.

The server card is the source of truth for the current tool set; this documentation does
not freeze a volatile tool count. This release has **not** completed an authenticated
`initialize` and `tools/list` session with an operator credential, so the precise evidence
label is **RUNTIME READY · AUTH REQUIRED · CLIENT SESSION NOT WITNESSED**. Runtime metadata
is not promoted into an end-to-end client claim.

## Claude Desktop and Cursor

No drop-in Claude Desktop or Cursor configuration is published yet. Those clients
need both a compatible transport and an authorized credential. Publishing a generic
configuration before an authenticated client session is witnessed would erase that
boundary.

No generic bridge command is asserted here. A reviewed client configuration will be
published only after that client completes a clean session; a Hatun configuration also
requires credential onboarding.

## Roadmap acceptance gate

Desktop-client setup moves from unwitnessed to available only when all of these are true
on the deployed service:

1. `initialize`, `tools/list`, `tools/call`, and `ping` pass through the target client.
2. The advertised protocol version and tool schemas match the live responses.
3. Governed calls preserve the same policy, kernel, and receipt semantics as the REST
   surface.
4. Claude Desktop and Cursor complete a clean setup from the published configuration.
5. The documentation and downloadable configuration are bound to that witnessed
   deployment.

Until then, use the live REST routes above, connect to the witnessed same-origin
transports through a client that natively supports their contract, or use Hatun only
through authorized operator onboarding. This boundary is deliberate: a familiar
configuration snippet is not evidence that a client session works.

## Security and response truth

- Treat the live tool catalog as authoritative; do not hard-code a tool count in client
  integrations.
- Inspect each response's receipt and verification fields rather than assuming a signing
  mode.
- Do not send secrets in tool arguments unless the specific tool contract explicitly
  admits them.
- Keep caller-side logs and receipts subject to the same data-handling policy as the
  original payload.

*Co-Authored-By: Perplexity Computer Agent · Apache-2.0*

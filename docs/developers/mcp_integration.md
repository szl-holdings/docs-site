# MCP integration — verified surface and roadmap

SZL exposes governed tools through a live REST interface today. A native Model Context
Protocol JSON-RPC transport for Claude Desktop, Cursor, and other MCP clients is a
**roadmap capability**, not a production claim.

## Available now

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

## Claude Desktop and Cursor

No drop-in Claude Desktop or Cursor configuration is published yet. Those clients
expect a working JSON-RPC MCP transport, while the deployed `/mcp/` route is currently
an HTML landing page and does not satisfy that transport contract.

Do not point an MCP bridge at `/mcp/`. Doing so presents an integration that cannot
complete client initialization. A reviewed client configuration will be published only
after the JSON-RPC transport is deployed and independently verified.

## Roadmap acceptance gate

Native MCP client support moves from roadmap to available only when all of these are
true on the deployed service:

1. `initialize`, `tools/list`, `tools/call`, and `ping` pass over the declared transport.
2. The advertised protocol version and tool schemas match the live responses.
3. Governed calls preserve the same policy, kernel, and receipt semantics as the REST
   surface.
4. Claude Desktop and Cursor complete a clean setup from the published configuration.
5. The documentation and downloadable configuration are bound to that witnessed
   deployment.

Until then, use the live REST routes above. This boundary is deliberate: a familiar
configuration snippet is not evidence that a protocol endpoint works.

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

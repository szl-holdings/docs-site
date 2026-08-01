# Agentic Mesh SDK — roadmap interface, not a published package

The Agentic Mesh SDK is the proposed thin wrapper for applying SZL's
**gate → sign → chain → verify** contract to an existing application. This page
records the intended interface so implementation work has a stable target.

> **STATUS: ROADMAP / NOT PUBLISHED.** There are currently no public
> `sdk-js`, `sdk-py`, `sdk-go`, or `examples` repositories in the SZL Holdings
> organization, and the package names shown in older drafts are not published
> distribution channels. Do not run `npm install`, `pip install`, or `go get`
> commands for those names. A package is not operational until source, tests,
> signed release provenance, and a public package-registry receipt all exist.

Doctrine v11 (749 / 14 / 163) · Apache-2.0 · maintained by Yachay
`<yachay@szlholdings.dev>`.

## Supported integration today

Use one of the paths that is actually published:

1. Call the live a11oy REST/MCP contracts documented in
   [API reference](./api_reference.md) and
   [MCP integration](./mcp_integration.md).
2. Build directly from the governed source packages in the existing
   [`szl-holdings/platform`](https://github.com/szl-holdings/platform/tree/main/packages)
   monorepo, following [Substrate packages](./substrate_packages.md).
3. Use the reviewed recipes in
   [`szl-holdings/szl-cookbook`](https://github.com/szl-holdings/szl-cookbook)
   when a concrete integration example is available.

## Planned language surfaces

| Language | Planned surface | Current state |
|---|---|---|
| JavaScript / TypeScript | `ProvenancedMesh` and framework middleware | interface sketch only |
| Python | decorator/context-manager wrapper and ASGI/WSGI middleware | interface sketch only |
| Go | explicit `Gate` function and receipt verifier | interface sketch only |

The names below are design placeholders. They intentionally do not include
package-manager commands because no registry publication has been verified.

## Planned basic interface

### Node / TypeScript design

```ts
import { ProvenancedMesh } from "@szl/agentic-mesh";

const mesh = new ProvenancedMesh({
  flagship: "https://szlholdings-a11oy.hf.space",
});

const { value, receipt } = await mesh.gate(
  () => yourBusinessLogic(input),
  { intent: "user-action" },
);
```

### Python design

```python
from szl_agentic_mesh import ProvenancedMesh

mesh = ProvenancedMesh(flagship="https://szlholdings-a11oy.hf.space")

@mesh.gate(intent="user-action")
def your_business_logic(value):
    return value * 2
```

### Go design

```go
mesh := szlmesh.New(szlmesh.Config{
    Flagship: "https://szlholdings-a11oy.hf.space",
})
result, err := mesh.Gate(
    func() (any, error) { return doWork(input), nil },
    szlmesh.GateOptions{Intent: "user-action"},
)
```

These snippets are **API design examples**, not proof that the imports resolve.

## Required implementation contract

A future SDK release must prove all of the following before this page can be
changed from ROADMAP to operational:

- deny-by-default policy evaluation before execution;
- DSSE or an equally explicit signed-envelope format;
- deterministic local receipt verification;
- append-only chain integrity with a documented storage boundary;
- no substitution of an ephemeral local key for a hosted organizational key
  without an explicit `LOCAL` or `UNAVAILABLE` label;
- framework middleware that does not silently swallow denied actions;
- network-failure behavior that is specified and tested;
- package-registry provenance and immutable source-to-artifact binding;
- examples that execute in CI against the exact released package versions.

## Planned middleware shapes

```ts
// Proposed Express shape
app.use(szlExpress(mesh));

// Proposed Next.js route shape
export const POST = withProvenance(mesh, handler, {
  intent: "api:checkout",
});
```

```python
# Proposed FastAPI shape
app.add_middleware(SZLMeshMiddleware, mesh=mesh)
```

## Air-gapped direction

The intended design is not hardwired to the hosted SZLHOLDINGS services. A
future implementation should support a self-hosted governed endpoint and a
clearly labelled local-only mode. Until that code is published and tested, use
the existing substrate packages and deployment guidance rather than inferring
that an SDK release exists.

## Verification boundary

A public repository link, package name, or code sample is not evidence of a
shipping SDK. The operational claim requires all of these together:

1. public source repository;
2. passing protected CI;
3. signed release artifact;
4. registry publication;
5. runnable version-pinned example;
6. receipt verification against the released bytes.

This page will be upgraded only when that evidence exists.

<!-- SPDX-License-Identifier: Apache-2.0 -->
# GraphQL — the unified SZL surface

The **SZL GraphQL Gateway** is the roadmap design for one typed endpoint over the
SZL substrate — the shipping flagships (a11oy and killinchu) plus planned
Provenance Anchor, Operator, and Policy roles. The design requires every query
and mutation to enter the same governed receipt chain as the underlying REST
surfaces. Doctrine v11 · Apache-2.0.

> **⚠️ STATUS: ROADMAP — NOT YET DEPLOYED OR PUBLISHED AS A STANDALONE REPOSITORY.**
> There is currently no public `szl-holdings/graphql-gateway` repository and no
> live GraphQL Space. The URLs and schema below are design targets, not executable
> production endpoints. Use the live REST and MCP contracts documented in
> [API_REFERENCE.md](./API_REFERENCE.md) and [MCP_INTEGRATION.md](./MCP_INTEGRATION.md).

- Planned endpoint (not live): `https://szlholdings-graphql-gateway.hf.space/graphql`
- Planned explorer (not live): `https://szlholdings-graphql-gateway.hf.space/graphiql`
- Planned SDL (not live): `https://szlholdings-graphql-gateway.hf.space/graphql/sdl`

The proposed implementation is code-first GraphQL over FastAPI and is intended
to remain compatible with Apollo Federation v2 if independent flagship
subgraphs are introduced.

---

## Schema (design excerpt)

```graphql
type Flagship { id: ID!, name: String!, healthz: HealthStatus!, doctrine: Doctrine!, wireD: WireDStatus!, signedReceipts: [Receipt!]! }
type Receipt { hash: String!, prevHash: String, payload: JSON!, signature: String!, signedAt: DateTime!, organ: String! }
type Doctrine { version: String!, declarations: Int!, axioms: Int!, sorries: Int!, lockedAt: String! }
type Formula { id: ID!, name: String!, statement: String!, leanProved: Boolean!, sorryTagged: Boolean! }
type Mesh { flagships: [Flagship!]!, totalReceipts: Int!, chainIntegrity: Boolean!, slos: [SLO!]! }

type Query {
  mesh: Mesh!
  flagship(id: ID!): Flagship
  receipt(hash: String!): Receipt
  formulas: [Formula!]!
  formula(id: ID!): Formula
  recall(query: String!, organ: String): [RecallResult!]!
}
type Mutation {
  sign(payload: JSON!, organ: String!): Receipt!
  dispatchCommand(organ: String!, command: String!, payload: JSON!): Receipt!
}
```

## Example design queries

Mesh overview:

```graphql
query Mesh {
  mesh {
    totalReceipts
    chainIntegrity
    flagships { id name healthz { ok } doctrine { version declarations sorries } }
    slos { flagship objective current }
  }
}
```

A single flagship and its receipts:

```graphql
query Flagship {
  flagship(id: "a11oy") {
    name
    wireD { enabled keyid }
    signedReceipts { hash signedAt organ }
  }
}
```

A proposed signing mutation:

```graphql
mutation Sign {
  sign(payload: { action: "demo", note: "hello mesh" }, organ: "a11oy") {
    hash prevHash signature signedAt organ
  }
}
```

## Client sketch — not runnable until the gateway ships

```ts
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://szlholdings-graphql-gateway.hf.space/graphql",
  cache: new InMemoryCache(),
});

const { data } = await client.query({
  query: gql`
    query Mesh {
      mesh {
        chainIntegrity
        flagships { id name doctrine { version } }
      }
    }
  `,
});
```

The following command is retained only as a proposed wire-format example. It is
expected to return `404` until a reviewed gateway implementation is actually
published.

```bash
curl -s https://szlholdings-graphql-gateway.hf.space/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ mesh { totalReceipts chainIntegrity } }"}'
```

## MCP vs GraphQL

| | **Hatun-MCP / a11oy MCP REST** | **GraphQL Gateway design** |
|---|---|---|
| Best for | LLM agents and tool-calling clients | apps, dashboards, scripts, typed clients |
| Protocol | MCP-compatible governed REST/tool surface | GraphQL over HTTP |
| Discovery | `/api/a11oy/v1/mcp/tools` | introspection / SDL / explorer |
| Governance | current receipt and policy controls | must preserve the same controls |
| Live today? | REST surface is operational | not deployed |

Current rule: **agents and software should use the published REST/MCP contracts.**
GraphQL remains a design document until source, CI, deployment, and immutable
runtime evidence exist.

See also: [MCP_INTEGRATION.md](./MCP_INTEGRATION.md),
[API_REFERENCE.md](./API_REFERENCE.md).

---

Doctrine v11 — LOCKED, verbatim: **749 / 14 / 163** · locked_at `c7c0ba17`.

Signed: Yachay `<yachay@szlholdings.dev>`
Co-Authored-By: Perplexity Computer Agent

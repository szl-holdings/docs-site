# Agentic Mesh SDK — roadmap interface

The Agentic Mesh SDK is a design target, not a published package. There are no verified
registry releases or public `sdk-js`, `sdk-py`, or `sdk-go` repositories asserted by this page.
Do not run `npm install`, `pip install`, or `go get` for its placeholder names.

## Supported path

Build from a checked-out source repository and use its local manifests:

```bash
git clone https://github.com/szl-holdings/a11oy.git
cd a11oy
pnpm install --frozen-lockfile
pnpm build
```

Hosted route shapes are separately documented in [API reference](/developers/api_reference).
The current a11oy readiness observation is **UNAVAILABLE**; a source checkout does not change
that. See [/status](/status).

## Planned interface

```ts
// Design sketch only — no package publication is claimed.
import { ProvenancedMesh } from '@szl/agentic-mesh'

const mesh = new ProvenancedMesh({ flagship: 'https://example.invalid' })
```

Any implementation must preserve an explicit failure state: it may not replace a hosted
organizational key with a local ephemeral key without a clear `LOCAL` or `UNAVAILABLE` label.
It must distinguish an integrity-only receipt from a signed receipt, and it must fail closed on
network failure or an unavailable readiness observation.

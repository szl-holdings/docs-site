# szl-ts

`szl-ts` is a **planned** unified TypeScript SDK. No npm or pnpm package release is asserted in
this documentation snapshot. Do not run `npm install` or `pnpm add` for a named SZL SDK until a
registry receipt identifies its exact version, integrity, source revision, and provenance.

## Design target, not executable API

```ts
// Planned, not importable today.
import { Client } from '@szl-holdings/szl'

const client = new Client()
const decision = client.policy.evaluate({ action: 'example', axes: {} })
```

The names in this example are interface placeholders. They do not establish publication for
`@szl-holdings/szl`, `@szl-holdings/a11oy-policy`, `@szl-holdings/a11oy-measurement`, memory, or
Operator packages.

## Source-local path today

```bash
git clone https://github.com/szl-holdings/a11oy.git
cd a11oy
pnpm install --frozen-lockfile
pnpm build
```

Use local workspace manifests for exports and package names. The Operator, Memory, and Sentinel
standalone roles are roadmap/not deployed, so this page does not direct readers to clone or
install them.

## Runtime boundary

Building source does not make a hosted integration ready. In the dated 2026-08-11 observation,
a11oy readiness was **UNAVAILABLE** despite provider `RUNNING`; killinchu’s health route was
**AVAILABLE_AT_OBSERVATION** at one public probe. Recheck [/status](/status) before a hosted request.

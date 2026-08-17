# Source-local substrate work

The platform source may contain workspace packages, but a workspace directory is not a public
package registry release. This page documents source-local development only.

```bash
git clone https://github.com/szl-holdings/platform.git
cd platform
# Read the local README, pyproject.toml, package.json, and lockfiles before installing a workspace.
```

Do not infer that a directory name is a stable import name, a published wheel, or an npm package.
Use the exact local manifest and its pinned dependencies. If a future package is publicly
published, documentation must name its registry, exact version, integrity, source revision, and
release provenance.

## Organ boundary

Source-local code can implement a deny-by-default decision flow and a hash-linked receipt chain.
It must label `DSSE-PLACEHOLDER`/`UNSIGNED` receipts as unsigned and must not present a local
ephemeral key as an organizational runtime signer. A source build does not prove public runtime
availability; see [/status](/status).

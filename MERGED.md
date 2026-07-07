# Docs-Site Consolidation Manifest

> **Status: content MIGRATED for `developers`, `szl-cookbook`, `szl-trust` — source repos are STILL ACTIVE (deprecated, not archived).**
> _Last verified: 2026-07-06._
>
> **History (2026-07-06, earlier in the day):** A prior version of this file claimed the
> source repositories were "✅ archived" and that the org had shrunk "45 → 19 repos." Both
> claims were **false** and were retracted; at that point this repo held only single-file
> README stubs for each planned directory.
>
> **Update (2026-07-06, Wave D):** The real page content of `developers`, `szl-cookbook`, and
> `szl-trust` has now been **migrated into this site's published `docs/` tree** (see the table
> below). The three source repos are marked **deprecated** with a `DEPRECATED.md` + README
> banner pointing here, but are **NOT archived** — archival remains a separate, deliberate
> founder action. The org still contains **37 repositories (33 active, 4 archived)**; there is
> no verified "45 → 19" reduction.

This repository is the single published docs site (`docs.szlholdings.com`), built with VitePress.
The table below tracks the true current state of each planned move.

| Directory (published) | Source Repo | Migration status (verified 2026-07-06) | Source repo state |
|-----------------------|-------------|-----------------------------------------|-------------------|
| `docs/developers/` | [szl-holdings/developers](https://github.com/szl-holdings/developers) | **Migrated** — 8 pages (quickstart, api_reference, mcp_integration, graphql, substrate_packages, sdk_drop_in, verify, willay_api) + `index.md` + 5 runnable `EXAMPLES/` | **Active**, now **deprecated** (banner → this site); NOT archived |
| `docs/cookbook/recipes/` + `docs/cookbook/skills/` | [szl-holdings/szl-cookbook](https://github.com/szl-holdings/szl-cookbook) | **Migrated** — 25 recipe pages + `index.md`, and 9 claude-code skill pages | **Active**, now **deprecated** (banner → this site); NOT archived |
| `docs/trust/` | [szl-holdings/szl-trust](https://github.com/szl-holdings/szl-trust) | **Migrated** — `index.md` (transparency overview) + `trust-deep.md` (deep dive). The raw `runs/E4-codex-kernel-2026-04-29/` artifact set and `verify.sh` are **intentionally not re-hosted** — they stay the single-source CC-BY-4.0 audit registry in the source repo (doctrine Invariant 9); `docs/trust/index.md` links there to clone + run `verify.sh` | **Active**, now **deprecated** (banner → this site); NOT archived |
| `investor/` | [szl-holdings/investor-public-summary] | **Planned — stub only** | State **unverified** — repo not resolvable via API on 2026-07-06; do not claim "archived" until confirmed |

## What was migrated in Wave D

1. **developers** → `docs/developers/` — the developer-hub pages are now first-class VitePress
   pages, wired into the site nav ("Developer Hub") and a dedicated sidebar. The **Holographic
   Estate** link (`https://szlholdings-a11oy.hf.space/holographic`) is preserved on the
   developers index page.
2. **szl-cookbook** → `docs/cookbook/recipes/` + `docs/cookbook/skills/` — the full runnable
   recipe library (23 numbered recipes + `anatomy-build-report` + `chakra-unification`) plus the
   nine claude-code `SKILL.md` patterns. A generated `recipes/index.md` lists them; the existing
   cookbook overview links to it.
3. **szl-trust** → `docs/trust/` — the transparency-layer overview (`index.md`) and the
   `TRUST_DEEP.md` deep dive, wired into the Trust nav + sidebar. The raw E4 Codex Kernel run
   artifacts (`run_manifest.json`, `proof_ledger.jsonl`, `trace.jsonl`,
   `deployment_contract.json`, etc.) and `verify.sh` are **deliberately left in the source repo**
   as the single audit registry of record: doctrine Invariant 9 requires every committed
   `*_receipt.json` to carry `doctrine:v11` + Λ = Conjecture 1, and the CC-BY-4.0 registry
   should have exactly one source of truth. `docs/trust/index.md` points readers to
   `szl-holdings/szl-trust` to clone the run and execute `verify.sh`.

The site was rebuilt with `vitepress build docs` after migration — **build passes**.

## What still remains (future waves / founder steps)

1. **Redirects / canonical links** so external references to the old repos resolve to the new
   pages (GitHub Pages redirect map or `.well-known`).
2. **Archival of the source repos** — only **after** redirects are live may `developers`,
   `szl-cookbook`, and `szl-trust` be archived. Archival is a deliberate founder action, not an
   assumption baked into this manifest. Until then the source repos stay active and carry a
   `DEPRECATED.md` + banner pointing here (reversible per the CONSOLIDATION SAFETY RULE).

## Repository count — the honest number

As of 2026-07-06 the `szl-holdings` org has **37 repositories total: 33 active and 4 archived**.
There is no verified "45 → 19" reduction. Any repo-count claim used for diligence should cite this
live figure.

---

Doctrine v11 LOCKED 749/14/163 · kernel c7c0ba17

Signed-off-by: Stephen P. Lutar Jr. <stephenlutar2@gmail.com>

# Docs-Site Consolidation Manifest

> **Status: consolidation PLANNED / IN PROGRESS — source repos are STILL ACTIVE.**
> _Last verified: 2026-07-06._
>
> **Honesty correction (2026-07-06):** An earlier version of this file claimed the
> source repositories below were "✅ archived" and that the org had shrunk "45 → 19
> repos." Both claims were **false** and have been retracted. As of the verification
> date, `developers`, `szl-cookbook`, and `szl-trust` are all **still active** (several
> carry commits from today), and this repo currently holds only **single-file README
> stubs** for each planned directory — real content migration has **not** happened yet.
> The org actually contains **37 repositories (33 active, 4 archived)**, not 19.
> This correction restores compliance with the Doctrine v11 honest-by-design rule
> (a governance document must not misstate the state of the world).

This repository is intended to eventually absorb several documentation repos into a
single published docs site (`docs.szlholdings.com`). That consolidation is **not
complete**. The table below tracks the true current state of each planned move.

| Directory | Source Repo | Migration status | Source repo state (verified 2026-07-06) |
|-----------|------------|------------------|------------------------------------------|
| `developers/` | [szl-holdings/developers](https://github.com/szl-holdings/developers) | Planned — stub only | **Active** (commits today) — NOT archived |
| `cookbook/` | [szl-holdings/szl-cookbook](https://github.com/szl-holdings/szl-cookbook) | Planned — stub only | **Active** (commits today) — NOT archived |
| `trust/` | [szl-holdings/szl-trust](https://github.com/szl-holdings/szl-trust) | Planned — stub only | **Active** (recent commits) — NOT archived |
| `investor/` | [szl-holdings/investor-public-summary](https://github.com/szl-holdings/investor-public-summary) | Planned — stub only | State **unverified** — repo not resolvable via API on 2026-07-06; do not claim "archived" until confirmed |

## What "consolidation" will require (future waves)

1. Real content migration from each source repo into the corresponding directory
   here (the current directories contain only a `README.md` stub, not the full docs).
2. Redirects / canonical links so external references do not break.
3. Only **after** content has actually moved and redirects are live may a source
   repo be archived — and archival is a separate, deliberate action, not an
   assumption baked into this manifest.

## Repository count — the honest number

As of 2026-07-06 the `szl-holdings` org has **37 repositories total: 33 active and
4 archived**. There is no verified "45 → 19" reduction. Any repo-count claim used
for diligence should cite this live figure, not the retracted one.

---

Doctrine v11 LOCKED 749/14/163 · kernel c7c0ba17

Signed-off-by: Stephen P. Lutar Jr. <stephenlutar2@gmail.com>

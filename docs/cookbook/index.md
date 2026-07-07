# Cookbook

The cookbook is a set of **runnable, Lean-backed recipes** maintained in
[`szl-holdings/szl-cookbook`](https://github.com/szl-holdings/szl-cookbook). Each recipe is a
self-contained artifact: TypeScript + Lean code, payloads, citations, and explicit Series-A
acceptance evidence. No marketing prose — every recipe states what it proves and how it was
tested.

## Recipes

**The full recipe library (23 recipes + 9 claude-code skills) is now migrated and published here:
[Cookbook — Recipes →](/cookbook/recipes/).**

| Recipe | What it is | Status |
|--------|-----------|--------|
| [anatomy-evolved-v1](/cookbook/anatomy-evolved-v1) | Per-organ evolution with Lean obligations and Series-A test evidence (8 organs) | sealed 2026-05-18 |
| [Full recipe index](/cookbook/recipes/) | All 23 runnable recipes + 9 skills, migrated from `szl-cookbook` | migrated |
| `doctrine-dinn-v1` | Doctrine-DINN floor loss with a Lean floor proof (`DoctrineDINNFloor.lean`) | in repo |
| `anatomy-build-report` | The anatomy build report | in repo |
| `chakra-unification` | Cross-organ unification notes | in repo |

::: info More recipes
The recipe set grows with the corpus. The canonical, current list is the `recipes/` directory of
[`szl-holdings/szl-cookbook`](https://github.com/szl-holdings/szl-cookbook). Recipes added after
this site's last build are **in development** here until the next docs deploy — the repo is
always the source of truth.
:::

## Recipe contract

Every recipe carries:

- **Code** — a `code/` tree that is `tsc --noEmit` clean and smoke-tested.
- **Lean** — the obligation(s) the recipe discharges or honestly `sorry`-tags.
- **Citations** — every external claim sourced (papers, DOIs).
- **Acceptance evidence** — explicit pass criteria (exit codes, test counts, ban-list cleanliness).

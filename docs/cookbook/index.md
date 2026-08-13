# Cookbook

::: danger Historical library — execution is not currently witnessed
These migrated recipes preserve design and source examples. They are **not** a blanket runnable,
live, signed, or deployment-verified contract. The a11oy readiness observation is `UNAVAILABLE`,
custom-domain equivalence was not observed, and several examples contain modeled or placeholder
artifacts. Check [/status](/status), [/compliance](/compliance), and the exact recipe before use.
:::

The cookbook is an archived set of Lean/source-backed patterns migrated from
[`szl-holdings/szl-cookbook`](https://github.com/szl-holdings/szl-cookbook). A recipe becomes an
executable current quickstart only after its exact source revision, route, payload, response,
signature state, and timestamp are independently witnessed.

## Recipes

**The full historical recipe library (23 recipes + 9 agent-instruction patterns) is preserved here:
[Cookbook — Recipes →](/cookbook/recipes/).**

| Recipe | What it is | Status |
|--------|-----------|--------|
| [anatomy-evolved-v1](/cookbook/anatomy-evolved-v1) | Per-organ evolution with Lean obligations and Series-A test evidence (8 organs) | sealed 2026-05-18 |
| [Full recipe index](/cookbook/recipes/) | 23 historical recipes + 9 instruction patterns, migrated from `szl-cookbook` | archived pending per-recipe witness |
| `doctrine-dinn-v1` | Doctrine-DINN floor loss with a Lean floor proof (`DoctrineDINNFloor.lean`) | in repo |
| `anatomy-build-report` | The anatomy build report | in repo |
| `chakra-unification` | Cross-organ unification notes | in repo |

::: info More recipes
The source list grows with the corpus. The canonical source list is the `recipes/` directory of
[`szl-holdings/szl-cookbook`](https://github.com/szl-holdings/szl-cookbook). Recipes added after
this site's last build are **in development** here until the next docs deploy — the repo is
the source of truth for bytes—not evidence that a route or deployment currently works.
:::

## Recipe contract

Recipe source may carry:

- **Code** — a `code/` tree that is `tsc --noEmit` clean and smoke-tested.
- **Lean** — the obligation(s) the recipe discharges or honestly `sorry`-tags.
- **Citations** — every external claim sourced (papers, DOIs).
- **Acceptance criteria** — historical or proposed pass criteria; require fresh execution evidence.

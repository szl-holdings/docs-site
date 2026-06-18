# 3D Showcases

Two interactive WebGL (Three.js) visualisations of the SZL anatomy were built for local
review. They are **not deployed as live Spaces today** — the static screenshots below are the
honest, reviewable artifact. (See [Status](/status) for the live-surface inventory.)

> Honesty note: earlier drafts embedded these as live Hugging Face Spaces. Those Spaces
> (`szlholdings-anatomy-3d`, `szlholdings-rosie-3d`) are **not deployed**, so the live embeds
> were removed rather than left as broken frames. The Three.js sources remain in the SZL
> workspace; redeploying them as static Spaces is a roadmap item.

## Anatomy-3D {#anatomy-3d}

An explorable model of the twelve organs and the wires (KALLPA) between them — exploded view,
receipt-pulse propagation, and single-organ inspection. Screenshots from the local build:

| Default | Exploded | Single organ |
|---|---|---|
| ![Anatomy-3D default](/img/3d/anatomy-default.png) | ![Anatomy-3D exploded](/img/3d/anatomy-exploded.png) | ![Anatomy-3D organ inspect](/img/3d/anatomy-organ.png) |

| Receipt pulse | Wires toggled |
|---|---|
| ![Anatomy-3D receipt pulse](/img/3d/anatomy-pulse.png) | ![Anatomy-3D wires toggled](/img/3d/anatomy-wires.png) |

**What you are looking at:** each node is one [organ](/anatomy/); the edges are
[KALLPA](/anatomy/#kallpa) wires carrying receipts; the pulse animation traces a
[Yawar](/anatomy/#yawar) ledger append propagating through the
[Khipu](/anatomy/#khipu) DAG.

## Operator-DAG showcase {#operator-3d}

A focused visualisation of the a11oy Operator receipt DAG (Operator is the receipt-orchestration
role of a11oy; internal codename *rosie*, retired), the brain-jack mesh, and the
frontier-capability map across the ecosystem. Screenshots from the local build:

| Default | Brain-jack mesh |
|---|---|
| ![Operator-3D default](/img/3d/rosie-default.png) | ![Operator-3D brain-jack mesh](/img/3d/rosie-brainjack.png) |

| Frontier map | Ecosystem |
|---|---|
| ![Operator-3D frontier](/img/3d/rosie-frontier.png) | ![Operator-3D ecosystem](/img/3d/rosie-ecosystem.png) |

**What you are looking at:** the brain-jack mesh shows the [PURIQ](/doctrine/puriq)
`decide → act → reflect` decision flow; the frontier map highlights each flagship's
verified frontier capability.

## Source

- **Anatomy-3D:** built with Three.js; source in the SZL workspace under `anatomy_3d_v2`.
- **Operator-3D:** built with Three.js; source under `rosie_3d` (internal codename, retired).
- Neither is deployed as a live Space today; the canonical VitePress build is the single source
  of truth, and the screenshots above are the reviewable artifact until a static-Space redeploy
  lands on the roadmap.

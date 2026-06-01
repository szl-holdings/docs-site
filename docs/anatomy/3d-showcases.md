# 3D Showcases

Two interactive WebGL showcases visualise the SZL anatomy. They run live on Hugging Face
Spaces and are embedded below; static screenshots are provided as a fallback and for offline
review. Both are real builds (Three.js) — no placeholders.

## Anatomy-3D {#anatomy-3d}

An explorable model of the twelve organs and the wires (KALLPA) between them. Toggle the
exploded view, watch the receipt pulse propagate, and inspect a single organ.

<div class="showcase-frame">
  <iframe src="https://szlholdings-anatomy-3d.static.hf.space/"
          title="SZL Anatomy-3D" loading="lazy"
          allow="fullscreen; xr-spatial-tracking"
          referrerpolicy="no-referrer"></iframe>
</div>

> Live at [szlholdings-anatomy-3d.static.hf.space](https://szlholdings-anatomy-3d.static.hf.space/).
> If the embed is blocked by your browser, open it directly.

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

## Rosie-3D {#rosie-3d}

A focused visualisation of [rosie](/flagships/rosie)'s receipt DAG, the brain-jack mesh, and
the frontier-capability map across the ecosystem.

<div class="showcase-frame">
  <iframe src="https://szlholdings-rosie-3d.static.hf.space/"
          title="SZL Rosie-3D" loading="lazy"
          allow="fullscreen; xr-spatial-tracking"
          referrerpolicy="no-referrer"></iframe>
</div>

> Live at [szlholdings-rosie-3d.static.hf.space](https://szlholdings-rosie-3d.static.hf.space/).

| Default | Brain-jack mesh |
|---|---|
| ![Rosie-3D default](/img/3d/rosie-default.png) | ![Rosie-3D brain-jack mesh](/img/3d/rosie-brainjack.png) |

| Frontier map | Ecosystem |
|---|---|
| ![Rosie-3D frontier](/img/3d/rosie-frontier.png) | ![Rosie-3D ecosystem](/img/3d/rosie-ecosystem.png) |

**What you are looking at:** the brain-jack mesh shows the [PURIQ](/doctrine/puriq)
`decide → act → reflect` decision flow live; the frontier map highlights each flagship's
verified frontier capability.

## Source

- **Anatomy-3D:** built with Three.js; source in the SZL workspace under `anatomy_3d_v2`.
- **Rosie-3D:** built with Three.js; source under `rosie_3d`.
- Both deploy as static HF Spaces. Embedding here is via `<iframe>` so the canonical build
  remains the single source of truth.

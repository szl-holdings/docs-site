---
layout: home
title: Governed AI that can show its work
description: Product, developer, and evidence documentation for the SZL governed-AI stack.

hero:
  name: SZL Holdings
  text: Governed AI that can show its work.
  tagline: Build systems that act under policy, preserve the decision trail, and keep every public claim tied to inspectable evidence.
  image:
    src: /img/szl-mark.svg
    alt: SZL Holdings KANCHAY mark
  actions:
    - theme: brand
      text: Start building
      link: /quickstart
    - theme: alt
      text: Examine the evidence
      link: /evidence/
    - theme: alt
      text: Understand the platform
      link: /flagships/

features:
  - title: Decide under policy
    details: a11oy is the governed execution fabric. It evaluates action, policy, measurement, and integrity before a result is admitted.
    link: /flagships/a11oy
  - title: Operate in the real world
    details: killinchu applies the same decision discipline to counter-UAS inputs and emits a receipt trail for review.
    link: /flagships/killinchu
  - title: Verify the claim
    details: Source, proof state, receipts, runtime status, and current limitations live beside the product story—not in a separate trust theater.
    link: /evidence/
---

## One company. Three ways in.

<div class="szl-audience">
  <a href="./about.html"><span class="szl-kicker">Investor</span><strong>See the category and wedge</strong><span>Understand the platform, product surfaces, governance moat, and what is shipping versus roadmap.</span></a>
  <a href="./developers/index.html"><span class="szl-kicker">Developer</span><strong>Get to a working call</strong><span>Choose an API or SDK, run the quickstart, inspect the response contract, and verify a receipt.</span></a>
  <a href="./evidence/index.html"><span class="szl-kicker">Evaluator</span><strong>Audit before you trust</strong><span>Start with evidence, proof state, lineage, runtime status, and explicit limitations.</span></a>
</div>

## The system today

<div class="szl-rail">
  <article class="szl-card">
    <span class="szl-status" data-state="real">REAL</span>
    <h3>a11oy execution fabric</h3>
    <p>Governed command and action infrastructure with public source, API documentation, evidence surfaces, and explicit runtime status.</p>
    <a href="./flagships/a11oy.html">Platform dossier →</a>
  </article>
  <article class="szl-card">
    <span class="szl-status" data-state="real">REAL</span>
    <h3>killinchu counter-UAS</h3>
    <p>A domain product that turns airspace inputs into bounded decisions and reviewable receipts. Product claims remain linked to source and evidence.</p>
    <a href="./flagships/killinchu.html">Product dossier →</a>
  </article>
  <article class="szl-card">
    <span class="szl-status" data-state="roadmap">ROADMAP</span>
    <h3>Frontier roles</h3>
    <p>Provenance Anchor and Policy remain roadmap roles; Operator is documented as a frontier role. These labels are not upgraded by presentation.</p>
    <a href="./flagships/index.html">Status map →</a>
  </article>
</div>

## What makes the architecture different

Most AI stacks optimize the answer. SZL focuses on the act: what was requested, what policy
admitted, which evidence was available, what was unavailable, and which receipt lets another party
replay the decision boundary.

<div class="szl-proofline"><span class="szl-kicker">01 · Bound</span><div><strong>Define the permitted action space.</strong><br>Policy and resource constraints narrow what the system may do before execution.</div></div>
<div class="szl-proofline"><span class="szl-kicker">02 · Decide</span><div><strong>Evaluate the request under measured state.</strong><br>Unavailable inputs remain unavailable; modeled values stay labeled modeled.</div></div>
<div class="szl-proofline"><span class="szl-kicker">03 · Receipt</span><div><strong>Preserve the decision trail.</strong><br>Source, identity, policy outcome, and evidence references remain available for review.</div></div>

[Read the architecture →](./architecture.html)

## Evidence before adjectives

| Question | Start here |
|---|---|
| What is in source? | [GitHub organization](https://github.com/szl-holdings) |
| What can a developer run? | [Quickstart](./quickstart.html) and [Developer hub](./developers/index.html) |
| What is proven, axiomatized, or still open? | [Proof](./proof.html) and [Doctrine register](./doctrine/v11-v12.html) |
| What is live versus unavailable? | [Runtime status](./status.html) |
| How do I inspect a receipt? | [Verification guide](./developers/verify.html) |
| What is the current supply-chain posture? | [Security and compliance](./compliance.html) |

No single page upgrades a claim. `REAL`, `MEASURED`, `MODELED`, `ROADMAP`, and `UNAVAILABLE` keep
their meaning across product, documentation, GitHub, and evidence surfaces.

## Citation

```bibtex
@software{szl_holdings_2026,
  author    = {Lutar, Stephen P.},
  title     = {SZL Holdings: Sovereign Governed AI},
  year      = {2026},
  publisher = {Zenodo},
  version   = {Doctrine v11 LOCKED},
  doi       = {10.5281/zenodo.20434276},
  url       = {https://github.com/szl-holdings}
}
```

This documentation uses the versioned [KANCHAY design system](./brand.html). Its generated bundle,
source revision, and integrity manifest are committed beside the site theme.

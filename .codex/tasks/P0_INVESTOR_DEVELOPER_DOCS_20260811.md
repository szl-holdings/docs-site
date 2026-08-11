# P0 — Investor/developer documentation and evidence closure

## Authority and source

- Repository: `szl-holdings/docs-site`
- Starting protected-main revision: `7b4cd2f9d2f3bc563374b4441f7c687084833b14`
- Current protected source, current VitePress configuration, current public-claim doctrine, and current deployed Pages contract are authoritative.
- Work only on this task PR branch. Do not write directly to protected `main`.

## Mission

Turn the current documentation site into a concise, responsive, evidence-first front door that an investor can understand quickly and a developer can use without tribal knowledge. Inspect, edit, build, test, and leave complete source changes on this branch. Do not return another roadmap.

## Required work

### 1. Current-state and payload reconciliation

Inspect the current navigation, homepage, architecture, product/status, evidence, deployment, API, and getting-started content, plus every repository-native task or payload. Classify discovered payloads as:

- `APPLIED_AND_VERIFIED`
- `SUPERSEDED_BY_NEWER_SOURCE`
- `ALREADY_SATISFIED`
- `BLOCKED_EXTERNAL_AUTHORITY`

Do not restore an older shell, stale count, retired name, or superseded product narrative.

### 2. Investor journey

Build one obvious path that explains, without overclaiming:

- what SZL Holdings and A11oy are;
- the flagship business wedge and why it matters;
- the governed execution loop;
- which capabilities are real, demo, measured, modeled, blocked, or roadmap;
- the product/portfolio map;
- proof, architecture, risk, security, and diligence routes;
- how to request a demo or continue diligence without a dead CTA.

Keep the first viewport compact and legible on phones. Avoid a wall of cards or long unscannable paragraphs.

### 3. Developer journey

Build one obvious path covering:

- architecture and repository map;
- local prerequisites and exact start commands;
- APIs, Workcells/kernels, governance gateway, receipts, and verification;
- current limitations and known gaps;
- how to reproduce tests and evidence;
- links to canonical GitHub and Hugging Face artifacts.

Every command and link must be current and internally consistent. Do not invent packages, endpoints, credentials, or deployment authority.

### 4. Responsive and accessibility closure

For every changed page/navigation component, close reproducible issues involving:

- phone, tablet, laptop, and wide-desktop layout;
- clipped tabs/navigation or horizontal overflow;
- touch targets, keyboard focus, semantic headings, reduced motion, and contrast;
- wide Markdown tables that fail on mobile;
- stale or broken anchors and cross-repository links;
- hydration, client navigation, and Pages base-path behavior.

### 5. Qualification and evidence

Run the repository’s exact current install, type/build, link, experience-contract, and deployment-contract checks. At minimum cover:

- clean dependency installation using the repository-declared package manager;
- VitePress production build;
- current experience and evidence contracts;
- internal and external link/anchor checks;
- responsive browser checks at 320, 390, 768, 1366, and 1728 CSS pixels;
- keyboard navigation and no horizontal overflow;
- `git diff --check` and secret scan.

Update this task with files changed, root causes, commands/outcomes, screenshots or exact screenshot blockers, payload dispositions, remaining external blockers, and non-claims. Store proof under the repository’s existing evidence/audit convention.

## Hard boundaries

- No direct protected-main write, force push, self-approval, or administrator bypass.
- No secret retrieval or mutation.
- No fabricated customer, revenue, certification, partnership, deployment, model, proof, or energy claim.
- No copied vendor content or trade dress.
- No GitHub Pages or Hugging Face publication claim from this task.
- Preserve exact-head checks, independent review, protected merge, immutable Pages artifact, and public byte readback as release authority.

## Definition of done

The branch contains tested documentation/source changes or a proof-backed `ALREADY_SATISFIED` result; the investor and developer paths are clear on all target screen sizes; links and commands are current; truth labels are explicit; payload dispositions are recorded; and no reproducible documentation or responsive defect in scope remains unowned.

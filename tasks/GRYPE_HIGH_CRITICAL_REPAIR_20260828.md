# Exact Grype HIGH/CRITICAL remediation

PR #76 exact head `81c0bcfad6c9aa377f777cdc82098545bef5e74c` fails run `33145381210`, job `98765111551` in Grype 0.110.0 with DB v6.1.9 built 2026-08-27. The job scans `dir:.`, outputs SARIF, and fails on `high`, but the log does not expose the matched packages.

## Required work

1. Reproduce the exact scan with the same Grype version/database semantics and emit a bounded JSON or table inventory of every HIGH/CRITICAL match: vulnerability ID, package name/version/type, path/lockfile, fixed version, and whether the finding is direct or transitive.
2. Upgrade, replace, or remove the vulnerable dependency in every canonical package manifest and lockfile. Do not add ignores, allowlists, `only-fixed`, severity changes, `continue-on-error`, or failure masking.
3. Add a dependency/lockfile contract that prevents the vulnerable version or equivalent stale resolution from returning where practical.
4. Preserve the responsive/accessibility changes in this PR.
5. Run the full Experience contract, responsive browser/accessibility suite, production build, DCO, lockfile checks, Trivy, Grype, CodeQL, doctrine, and secret scanning.
6. Delete this task file in the implementation commit and request a fresh exact-head review.

Keep the PR draft until terminal green.
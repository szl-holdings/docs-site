# Compliance and supply-chain posture

This page is the authoritative posture for this documentation release. A source commit, build
attestation, image signature, runtime receipt, and runtime readiness are different evidence
classes. None may be promoted into another.

| Claim | Current documented posture | What it does not prove |
|---|---|---|
| Documentation source | Exact source/workflow/artifact identity from `/deployment.json` | Product deployment or runtime readiness. |
| SLSA | **L1 (honest)** | L2 or L3 provenance. |
| SBOM / CI / DCO | Source/build controls when attached to their named artifact | A deployed image or a live runtime. |
| Image signature | Separate immutable-image evidence, only with full digest and published verification material | A signed runtime receipt or a ready service. |
| Runtime receipt | `DSSE-PLACEHOLDER` or `UNSIGNED` means unsigned | Signer authentication from a hash chain. |
| Hash chain / self-digest | Integrity of supplied bytes when recomputed | Signer identity, non-repudiation, or availability. |
| Runtime availability | See [/status](/status) | Continuous uptime or authorization for unrelated routes. |

## Runtime evidence — 2026-08-11

a11oy was provider `RUNNING` at `f5c395e81eaa306b2eb1c8bbf8773f07664ce564` but readiness timed
out at 20 s and 30 s: **UNAVAILABLE**. killinchu was `RUNNING` at
`83142da9526e2c0ddfe1e78eb99a20940cde0cf3` and its documented health route returned HTTP 200:
**AVAILABLE_AT_OBSERVATION** for that dated probe only. Hatun-MCP was `PAUSED` at
`ebc78be2ffffb08241a1da1eb8ebcc6d34a1ab34`; `/readyz`
returned 503 and quota was `3/3`: **UNAVAILABLE**.

## Signature rule

No page may call a runtime receipt “signed,” “verified,” or “non-repudiable” unless a fresh,
exact-revision runtime witness records the signature algorithm, key identity, verification result,
and relevant public key/certificate material. Do not use a cosign image result as that witness.

## Claims not made

- SLSA L2/L3, FedRAMP, CMMC, Iron Bank, SOC 2, IL5, or Cardano-mainnet anchoring.
- A public SDK/package release without a registry receipt and immutable release provenance.
- A current API-key customer portal or generic desktop client configuration.
- Continuous service availability from a source commit, a provider `RUNNING` label, or a historical
  HTTP response.

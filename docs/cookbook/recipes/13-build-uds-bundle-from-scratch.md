# Build a UDS bundle source candidate

::: warning Source-local only
This recipe prepares a candidate bundle from checked-out source. It does not assert registry
publication, signature verification, cluster deployment, quorum, or runtime readiness.
:::

## Candidate manifest

Create a bundle manifest that uses immutable digests only:

```yaml
kind: UDSBundle
metadata:
  name: szl-candidate
  version: 0.0.0-local
packages:
  - name: flagship
    repository: ghcr.io/szl-holdings/<name>
    digest: sha256:<UNAVAILABLE>
```

The placeholder intentionally fails admission. Replace it only with a registry-read-back digest
produced by a protected source-bound build.

## Acceptance gates

1. Validate schema and lock every package/image by digest.
2. Preserve source revision, build run, artifact root, and SBOM hashes.
3. Verify signatures for the exact digests; retain JSON output and identities.
4. Scan the materialized bundle and document admitted findings.
5. Deploy to an isolated supported cluster and capture readiness/failure evidence.
6. Exercise rollback and no-egress behavior.
7. Verify any runtime receipt separately from image provenance.

Doctrine snapshot `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f` is source evidence only; a
service `/v1/honest` response is not a substitute for these gates.

See [UDS evidence checklist](/uds), [Compliance](/compliance), and
[runtime status](/status).

---

*Source candidate procedure available · publication/deployment evidence UNAVAILABLE*

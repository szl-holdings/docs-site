# szl-python

`szl-python` is a **planned** unified Python SDK. No PyPI release is asserted here; therefore this
page intentionally contains no `pip install szl` command.

## Design target, not executable API

The following shape is a design sketch for future compatibility. It must not be copied into a
production integration until a versioned source and package receipt exist.

```python
# Planned, not importable today.
from szl import Client

client = Client()
decision = client.policy.evaluate(action="example", axes={})
```

## Source-local path today

Use source repositories and their checked-in manifests rather than an unverified registry name:

```bash
git clone https://github.com/szl-holdings/lutar-lean.git
git clone https://github.com/szl-holdings/a11oy.git
```

Pin the Lean lock to exact commit `c7c0ba17c2eaec60ad38ea9172b4a0d9ca0b582f` when reproducing Doctrine v11; the `lutar-v18.0.0` tag resolves elsewhere. Build a11oy using
its local README and lockfile. The a11oy public readiness observation is currently **UNAVAILABLE**;
killinchu readiness was **AVAILABLE_AT_OBSERVATION** only at the dated probe. See [/status](/status).

## Receipt boundary

Future SDKs must preserve receipt labels. `DSSE-PLACEHOLDER` or `UNSIGNED` is unsigned; a hash
chain/self-digest is integrity evidence, not a cryptographic signer. Image provenance is separate.

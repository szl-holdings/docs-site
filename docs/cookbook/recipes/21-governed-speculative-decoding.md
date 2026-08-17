# Speculative-decoding accounting model

::: warning No hardware measurement or runtime evidence
This page provides a local illustrative accounting proxy. It does not establish a draft/target
model pair, tokenizer compatibility, sampling-preserving verification, throughput, output parity,
energy use, a receipt, or a deployed route. All such operational states are `UNAVAILABLE`.
:::

Speculative decoding uses a smaller draft model to propose tokens and a target model to verify
them. The published algorithms define acceptance and correction procedures needed to preserve the
target distribution. A simple cost curve cannot prove that property and cannot predict production
speed without measurements on an exact model pair and hardware/software stack.

## Executable local accounting proxy

The following standard-library fixture assumes an illustrative independent acceptance rate and an
illustrative draft-cost ratio. Its `speedup_proxy` is a unitless planning number, not a theorem or
benchmark.

```python
import json


def accounting_proxy(k: int, alpha: float, draft_cost_ratio: float) -> dict:
    if k <= 0:
        raise ValueError("k must be positive")
    if not 0.0 <= alpha <= 1.0:
        raise ValueError("alpha must be in [0, 1]")
    if draft_cost_ratio < 0.0:
        raise ValueError("draft_cost_ratio must be non-negative")

    accepted_proposals_proxy = k * alpha
    output_tokens_proxy = 1.0 + accepted_proposals_proxy
    cost_units_proxy = 1.0 + k * draft_cost_ratio
    return {
        "k": k,
        "alpha": alpha,
        "draft_cost_ratio": draft_cost_ratio,
        "accepted_proposals_proxy": accepted_proposals_proxy,
        "output_tokens_proxy": output_tokens_proxy,
        "cost_units_proxy": cost_units_proxy,
        "speedup_proxy": output_tokens_proxy / cost_units_proxy,
        "evidence_state": "MODELED_LOCAL_PROXY_NOT_A_MEASUREMENT",
    }


report = accounting_proxy(k=4, alpha=0.7, draft_cost_ratio=0.15)
assert report["evidence_state"] == "MODELED_LOCAL_PROXY_NOT_A_MEASUREMENT"
print(json.dumps(report, indent=2, sort_keys=True))
```

This fixture deliberately does not name models or emit future response fields. Model availability
is mutable, and no exact admitted pair or hardware witness is bound to this page.

## Measurement and promotion contract

An operational speculative-decoding claim requires one immutable evidence set containing:

1. exact target and draft model revisions, weights digests, tokenizer digest, and licenses;
2. the exact decoding implementation and sampling parameters;
3. a correctness test showing distribution-preserving behavior for the implemented algorithm;
4. warm-up policy, prompts/dataset, random seeds, run count, latency distribution, and token counts;
5. target-only and speculative baselines on the same authorized hardware and software stack;
6. output-quality or distribution-parity analysis, plus energy telemetry when energy is claimed;
7. an artifact-specific signed receipt when signing is claimed; and
8. immutable runtime readback for the exact deployed revision.

No model pull, route probe, or future example response can substitute for those results.

## Evidence state

| Surface | Current status |
|---|---|
| Speculative-decoding algorithms | `CITED_PRIOR_ART` |
| Local arithmetic above | `MODELED_LOCAL_PROXY_NOT_A_MEASUREMENT` |
| Exact compatible model pair | `UNAVAILABLE` |
| Sampling-preservation result | `UNAVAILABLE` |
| Hardware throughput, quality, and energy | `UNAVAILABLE` |
| Runtime route, receipt, and signature | `UNAVAILABLE` |

References: Y. Leviathan, M. Kalman, and Y. Matias, arXiv:2211.17192 (2023); C. Chen et al.,
arXiv:2302.01318 (2023).

---

*Modeled accounting is not measured throughput, lossless parity, or an operational runtime.*

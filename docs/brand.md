# Brand Kit

SZL's anatomy names the public-claim surface [Kanchay](/anatomy/#kanchay), from Quechua
*kanchay* (light or radiance). The brand doctrine requires claims to be calibrated against the
same honesty axes described elsewhere in this site. This page does not claim that a deployed
runtime automatically enforces those axes.

## Canonical source

The canonical repository for the documented brand assets and design-system source is
[`szl-holdings/szl-brand`](https://github.com/szl-holdings/szl-brand). Repository contents and
licenses must be checked at the exact revision used by a consumer.

## Bundled KANCHAY design system

The current docs source vendors a KANCHAY bundle under `docs/.vitepress/theme/kanchay/`. Its
manifest binds the local asset bytes to an exact source revision:

| Bundle field | Exact local value |
|---|---|
| Contract | `szl.design-system/v1` |
| Bundle version | `1.1.0` |
| Source repository | `https://github.com/szl-holdings/szl-brand` |
| Source revision | `5b43015b66f254ee08330b39adcc1acb4d0c219d` |
| Integrity algorithm | `sha256` |
| Manifest root | `152ff983953d9fb240aba144c2556f9af50fe9e047185bafe6dcdf54d2934e1a` |

The manifest enumerates `system.css`, `tokens.json`, `metadata.schema.json`, and `vitepress.css`
with an individual SHA-256 digest for each file. The theme source imports the CSS bundle;
`custom.css` contains docs-specific adapter rules. These are source-level facts. Deployed-byte
status remains a separate [runtime and publication question](/status).

### Selected bundled color tokens

| Token | Hex | Documented role |
|---|---|---|
| `--color-yawar-500` | `#c0392b` | Yawar brand scale |
| `--color-yuyay-500` | `#168f89` | Yuyay brand scale |
| `--color-hatun-500` | `#c08f2f` | Hatun brand scale |
| `--color-gray-950` | `#0a0f1e` | Deep neutral |
| `--color-success` | `#1f9d57` | Semantic success |
| `--color-warning` | `#c08f2f` | Semantic warning |
| `--color-error` | `#c0392b` | Semantic error |
| `--color-info` | `#2f7fb5` | Semantic information |

The complete token inventory is in `docs/.vitepress/theme/kanchay/tokens.json`; the checked-in
manifest, not this selected table, is the byte authority for the bundle.

## Typography

- **Body:** Inter (400-800).
- **Mono/code:** JetBrains Mono (400-700).

## Usage rules

- **No mysticism.** Brand language is etymological and mathematical, never ritual.
- **No overclaim.** Do not claim `SLSA L3`, `zero sorry`, or unscoped `fully verified`.
- **Evidence first.** Bind any published visual or token claim to exact source and output bytes.
- **Attribution.** Follow the license in the exact source artifact and credit SZL Holdings, ORCID
  [0009-0001-0110-4173](https://orcid.org/0009-0001-0110-4173), where required.

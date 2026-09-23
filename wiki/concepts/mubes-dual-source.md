---
title: Program Kerja and MUBES LPJ
type: concept
tags: [mubes, lpj, program-kerja, merge]
related:
  - strapi-data-layer.md
  - mubes-security.md
  - ../reference/content-models.md
sources:
  - docs/codemaps/mubes-flow.md
  - osis-smait-fi/src/lib/mubes-proker.ts
  - osis-smait-fi/src/lib/strapi.ts
  - osis-smait-fi/src/components/mubes/MubesProkerPresentation.tsx
---

# Program Kerja and MUBES LPJ

## Two sources

`program-kerja` is the public shell: title, slug, category, purpose, implementation, responsible members, public Capaian/Evaluasi, questionnaire URL, and documentation.

`mubes-lpj` is the confidential hearing record linked one-to-one to Program Kerja: ordered sections, approval status, budget realization, funding source, constraints, and receipts. Its older scalar narrative fields remain optional fallbacks.

## Join and normalization

`fetchMubesProkerList()` loads Program Kerja, LPJ, and Sekbid records in parallel. LPJ records are indexed by related Program Kerja numeric ID, `documentId`, and slug. Program records are normalized and grouped into Sekbid 1–8. If Strapi is unavailable or has no Program Kerja rows, the portal uses `FALLBACK_MUBES_PROKER`; that fallback is not live CMS truth.

Structured `dokumentasi_items` take precedence over legacy `dokumentasi` media in the MUBES normalizer. LPJ `sections` are sorted by `order`. Runtime resolves body text via `findLpjSectionIsi`: match optional `jenis` first, then case-insensitive substrings in `judul`.

## Context-specific precedence

Public Capaian/Evaluasi:

- prefer `program-kerja.capaian` and `evaluasi_deskripsi`;
- fill missing values from LPJ sections titled Capaian/Evaluasi;
- use `evaluasi_internal` as the final Evaluasi fallback.

Portal presentation (`MubesProkerPresentation` document shell — modal + full):

| UI block | Source |
| --- | --- |
| Status badge | `lpj.status_pengesahan` |
| PJ portrait(s) | `program-kerja.penanggung_jawab` (+ `ketua_foto` fallback) |
| Anggaran / sumber / nota | `lpj.realisasi_anggaran`, `sumber_dana`, `nota_kwitansi` |
| 1 Pendahuluan | section `pendahuluan`/`tujuan` → `lpj.pendahuluan` → `proker.tujuan` |
| 2 Golongan Sasaran | section `golongan_sasaran` → `lpj.golongan_target` → `proker.golongan_target` |
| 3 Capaian | section `capaian` → `proker.capaian` |
| 4 Teknis | section `teknis_waktu` → `lpj.teknis_pelaksanaan` → `proker.teknis_pelaksanaan` |
| 5 Evaluasi Internal | section `evaluasi_internal` → `lpj.evaluasi_internal` → `proker.evaluasi_deskripsi` |
| Kendala / kuesioner | optional: `lpj.kendala_solusi` or section; `proker.evaluasi_form_url` |
| Dokumentasi grid | `dokumentasi_items` then legacy `dokumentasi` |

Empty numbered points are hidden (no dummy placeholder copy). Budget card always shows (Rp 0 when empty).

## Editorial invariants

- One LPJ should relate to one Program Kerja.
- Published Program Kerja does not imply its LPJ is published.
- Prefer setting section `jenis`; judul keywords remain a compatibility path.
- `status_pengesahan` is the single LPJ hearing-status source.
- Public routes must never serialize the complete LPJ object.

See [Portal MUBES access](mubes-security.md) and [content models](../reference/content-models.md).

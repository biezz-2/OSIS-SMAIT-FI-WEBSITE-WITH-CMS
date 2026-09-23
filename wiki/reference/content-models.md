---
title: Program Kerja and LPJ Content Models
type: reference
tags: [schema, program-kerja, mubes-lpj, components]
related:
  - ../concepts/mubes-dual-source.md
  - ../guides/content-manager-layout-bootstrap.md
sources:
  - strapi-cms/src/api/program-kerja/content-types/program-kerja/schema.json
  - strapi-cms/src/api/mubes-lpj/content-types/mubes-lpj/schema.json
  - strapi-cms/src/components/program-kerja/lpj-section.json
  - strapi-cms/src/components/program-kerja/dokumentasi-item.json
---

# Program Kerja and LPJ Content Models

## `api::program-kerja.program-kerja`

Public, draft-and-publish collection.

- Identity: required `judul`, required UID `slug`, required `kategori`.
- Narrative: `tujuan`, `golongan_target`, `teknis_pelaksanaan`, `capaian`, `evaluasi_deskripsi`.
- Scheduling: dates, description, and location.
- Editorial state: custom `status` in addition to Strapi draft/publish.
- Media: legacy repeatable `dokumentasi`, structured repeatable `dokumentasi_items`, banner, and legacy chair photos.
- Presentation: preview toggle, Evaluasi visibility, frame mode, grid layout, compression controls.
- Relations: many-to-many `sekbid` and `penanggung_jawab`.
- Components: repeatable `tujuan_detail` and `dokumentasi_items`.

## `api::mubes-lpj.mubes-lpj`

Confidential, draft-and-publish collection.

- One-to-one `program_kerja` relation.
- Primary body: repeatable `sections`.
- Finance: optional decimal `realisasi_anggaran`, `sumber_dana`, and repeatable `nota_kwitansi`.
- Legacy narrative fallbacks: `pendahuluan`, `golongan_target`, `teknis_pelaksanaan`, `evaluasi_internal`, and JSON `kendala_solusi`.
- Required `status_pengesahan`: `draft`, `ditinjau`, or `disahkan`.

Only `status_pengesahan` is required among the LPJ workflow/finance fields.

## `program-kerja.lpj-section`

- Optional `jenis` enum.
- Required `judul`.
- Required text `isi`.
- Optional integer `order`, default `0`.

Runtime normalizers sort by `order` and keep `jenis`. `findLpjSectionIsi` prefers `jenis`, then judul substring match.

## `program-kerja.dokumentasi-item`

- Required `judul`.
- Optional text `deskripsi`.
- Required single image or video `media`.
- Integer `order`, default `0`.

The MUBES data path prefers these structured items and falls back to legacy media.

See [dual-source resolution](../concepts/mubes-dual-source.md).

---
title: Content Manager Layout Bootstrap
type: guide
tags: [strapi, bootstrap, content-manager, editorial]
related:
  - ../concepts/strapi-data-layer.md
  - ../reference/content-models.md
sources:
  - strapi-cms/src/index.ts
  - strapi-cms/src/components/program-kerja/lpj-section.json
  - strapi-cms/src/components/program-kerja/dokumentasi-item.json
---

# Content Manager Layout Bootstrap

Strapi bootstrap calls `ensureDefaultMediaAssets()`, which also makes selected fields visible and understandable in Content Manager.

## Mechanism

`ensureContentManagerField()` reads the relevant layout from `strapi_core_store_settings` through Knex. Strapi core-store configuration is not a Document Service content model. The helper:

1. creates missing field metadata;
2. updates labels and descriptions;
3. inserts a missing field before a requested neighbor or appends it;
4. updates the stored JSON only when a change is required.

This makes the bootstrap idempotent and preserves existing layout rows.

## Managed layouts

Program Kerja receives editorial labels for target audience, questionnaire URL, responsible members, structured documentation, Capaian, Evaluasi, and visitor visibility.

MUBES LPJ places `sections` before finance and labels hearing status, budget, funding, receipts, and legacy fallback fields.

The `program-kerja.lpj-section` component exposes semantic type, display title, body, and order. The `program-kerja.dokumentasi-item` component exposes title, description, media, and order.

## Editing guidance

- Change the schema when persistence or validation changes.
- Change bootstrap metadata when labels, descriptions, visibility, or row placement changes.
- Keep layout keys aligned with the exact content-type/component UID.
- Do not replace the Knex core-store access with `strapi.documents()`.
- Remember that current frontend LPJ matching uses section titles, even though editors can set `jenis`.

See [content models](../reference/content-models.md) and [Strapi data layer](../concepts/strapi-data-layer.md).

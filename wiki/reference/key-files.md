---
title: Key File Reference
type: reference
tags: [files, routes, entrypoints]
related:
  - ../overview.md
  - ../concepts/architecture.md
  - ../concepts/mubes-security.md
sources:
  - docs/codemaps/architecture.md
  - docs/codemaps/frontend.md
  - docs/codemaps/backend.md
  - docs/codemaps/mubes-flow.md
---

# Key File Reference

## Architecture and data

- `osis-smait-fi/src/lib/strapi.ts` — REST client, cache policy, media URLs, and public LPJ highlights.
- `osis-smait-fi/src/lib/mubes-proker.ts` — Program Kerja/LPJ normalization, join, grouping, and static fallback.
- `osis-smait-fi/src/lib/mubes-access.ts` — Clerk claim resolution and MUBES authorization.
- `osis-smait-fi/src/components/mubes/MubesProkerPresentation.tsx` — hearing narrative, finance, receipts, and documentation presentation.
- `strapi-cms/src/index.ts` — audit registration, RBAC, public permissions, seeding, publication, and Content Manager layout bootstrap.

## Routes

- `osis-smait-fi/src/app/portal-mubes/page.tsx` — dynamic portal entry.
- `osis-smait-fi/src/app/portal-mubes/proker/[slug]/page.tsx` — full Program Kerja portal view.
- `osis-smait-fi/src/app/api/mubes/lpj/[slug]/route.ts` — gated complete LPJ BFF.
- `osis-smait-fi/src/app/api/program-kerja/[slug]/lpj-public/route.ts` — narrow public Capaian/Evaluasi response.
- `osis-smait-fi/src/app/api/webhooks/clerk/route.ts` — Clerk-to-Strapi identity bridge.
- `osis-smait-fi/src/proxy.ts` — Clerk request integration and cache headers, not route authorization.

## Schemas

- `strapi-cms/src/api/program-kerja/content-types/program-kerja/schema.json`
- `strapi-cms/src/api/mubes-lpj/content-types/mubes-lpj/schema.json`
- `strapi-cms/src/components/program-kerja/lpj-section.json`
- `strapi-cms/src/components/program-kerja/dokumentasi-item.json`

## Canonical source maps

- `docs/codemaps/architecture.md`
- `docs/codemaps/frontend.md`
- `docs/codemaps/backend.md`
- `docs/codemaps/mubes-flow.md`

For the conceptual map, return to the [overview](../overview.md).

---
title: Strapi Data Layer
type: concept
tags: [strapi, rest, caching, rbac, media]
related:
  - architecture.md
  - mubes-dual-source.md
  - ../reference/content-models.md
sources:
  - osis-smait-fi/src/lib/strapi.ts
  - strapi-cms/src/index.ts
  - docs/codemaps/backend.md
---

# Strapi Data Layer

## Frontend client

`osis-smait-fi/src/lib/strapi.ts` centralizes REST access and media normalization.

- `fetchStrapiAPI()` selects the internal CMS URL on the server and the public URL in the browser.
- Published responses use `revalidate: 60` and tag `strapi`; preview requests append `status=draft` and use `no-store`.
- A five-second abort timeout bounds CMS requests.
- `getStrapiMediaUrl()` accepts Strapi v4/v5 media shapes, external URLs, responsive formats, and local fallbacks.
- Public Program Kerja detail currently populates legacy `dokumentasi`; the MUBES aggregation also populates structured `dokumentasi_items.media`.

## Backend content services

Strapi APIs use core controllers, routers, and services. New content operations should use `strapi.documents('api::<name>.<name>')`, preferring `documentId` over numeric IDs.

`strapi-cms/src/index.ts` registers audit middleware for create, update, delete, publish, and unpublish actions. Bootstrap then:

1. configures CMS roles;
2. grants Public `find` and `findOne` only to the visitor whitelist;
3. seeds initial data;
4. bootstraps Content Manager layouts and default media;
5. publishes selected visitor drafts;
6. starts optional MySQL synchronization.

`mubes-lpj` belongs to editor RBAC but is excluded from Public permissions.

## Public and elevated reads

Public content can be read without a token when its content type is in the bootstrap whitelist. Confidential content must be fetched only on the server with `STRAPI_ELEVATED_TOKEN`, after the route applies its own authorization policy.

The public Capaian/Evaluasi resolver is a deliberate narrow exception: it reads LPJ server-side but returns only those text highlights, never finance or receipt data.

See [Program Kerja and MUBES LPJ](mubes-dual-source.md), [Portal MUBES access](mubes-security.md), and [content models](../reference/content-models.md).

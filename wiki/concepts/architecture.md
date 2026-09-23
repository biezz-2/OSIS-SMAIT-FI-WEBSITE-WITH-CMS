---
title: System Architecture
type: concept
tags: [architecture, nextjs, strapi, bff]
related:
  - ../overview.md
  - strapi-data-layer.md
  - mubes-security.md
sources:
  - docs/codemaps/architecture.md
  - docs/codemaps/frontend.md
  - docs/codemaps/backend.md
---

# System Architecture

## Repository topology

The root package is an orchestration layer. `osis-smait-fi/` and `strapi-cms/` keep separate manifests, dependencies, builds, and runtime processes.

```text
Browser -> Nginx -> Next.js :3002 -> Strapi :1337 -> database
                \-> Clerk
```

Next owns rendering, App Router pages, session-aware server components, and `/api/*` BFF handlers. Strapi owns content schemas, media, publication state, permissions, and editorial layouts.

## Data paths

Public pages fetch published Strapi REST data through `fetchStrapiAPI`. On the server, absolute public CMS URLs are normalized to `STRAPI_INTERNAL_URL`; in the browser they resolve to `NEXT_PUBLIC_STRAPI_URL`. Published fetches default to 60-second revalidation under the `strapi` tag, while draft mode uses `no-store`.

Confidential MUBES reads use a separate path:

1. Next reads the Clerk session.
2. `getMubesAccess()` validates approval and role.
3. A server component or BFF handler calls Strapi with `STRAPI_ELEVATED_TOKEN`.
4. The browser receives only the response shape intended for that route.

## Deployment and persistence

The live model is VPS + Nginx + PM2, not serverless. The database client is selected with `DATABASE_CLIENT`; code supports MySQL, PostgreSQL, and SQLite. Configuration must remain environment-driven.

## Invariants

- Never expose elevated Strapi credentials to client code.
- Never grant Strapi Public read access to MUBES LPJ, MUBES sidang, access-control, or audit content types.
- Use Strapi 5 Document Service for content operations; the Content Manager core-store layout is the explicit exception.
- In Next 16, request middleware behavior lives in `osis-smait-fi/src/proxy.ts`, not `middleware.ts`.

See [Strapi data layer](strapi-data-layer.md), [Portal MUBES access](mubes-security.md), and [local development](../guides/local-development.md).

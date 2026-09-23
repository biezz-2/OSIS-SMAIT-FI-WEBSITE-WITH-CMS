---
title: Agora Acta Overview
type: overview
tags: [nextjs, strapi, mubes, monorepo]
related:
  - concepts/architecture.md
  - concepts/strapi-data-layer.md
  - concepts/mubes-dual-source.md
  - concepts/mubes-security.md
sources:
  - docs/codemaps/architecture.md
  - docs/codemaps/frontend.md
  - docs/codemaps/backend.md
  - docs/codemaps/mubes-flow.md
---

# Agora Acta

Agora Acta is a repository-level workspace containing a Next.js 16 public site and BFF in `osis-smait-fi/`, plus a Strapi 5 CMS in `strapi-cms/`. The root `package.json` coordinates both applications with `concurrently`; it is not an npm-workspaces package graph.

## Runtime map

- Next.js `16.2.11` and React `19.2.4` render the public OSIS site, Edufest, and Portal MUBES.
- Strapi `5.51.0` owns public content, media, Program Kerja, and confidential MUBES records.
- Production uses Nginx and PM2. Next listens on port `3002`; Strapi listens on `1337`.
- Server Components and route handlers use `STRAPI_INTERNAL_URL`; browser-safe media and public REST use `NEXT_PUBLIC_STRAPI_URL`.
- Clerk provides identity. Sensitive LPJ data reaches approved users through the Next BFF with the server-only `STRAPI_ELEVATED_TOKEN`.

## Core boundaries

`program-kerja` is the public program shell. `mubes-lpj` is the confidential source for hearing sections, approval status, finance, and receipts. The application joins both sources server-side and applies context-specific fallback rules rather than one universal merge.

Strapi bootstrap configures RBAC, public read permissions, seed data, publication, audit middleware, and Content Manager layouts. MUBES content types are deliberately absent from Public permissions.

## Start here

- [System architecture](concepts/architecture.md)
- [Strapi data layer](concepts/strapi-data-layer.md)
- [Program Kerja and MUBES LPJ](concepts/mubes-dual-source.md)
- [Portal MUBES access](concepts/mubes-security.md)
- [Local development](guides/local-development.md)
- [Content Manager bootstrap](guides/content-manager-layout-bootstrap.md)
- [Content model reference](reference/content-models.md)
- [Key file reference](reference/key-files.md)

---
title: Portal MUBES Security and Access
type: concept
tags: [security, clerk, bff, mubes]
related:
  - architecture.md
  - mubes-dual-source.md
  - ../guides/local-development.md
sources:
  - docs/codemaps/mubes-flow.md
  - osis-smait-fi/src/lib/mubes-access.ts
  - strapi-cms/src/index.ts
---

# Portal MUBES Security and Access

MUBES uses two independent controls.

## Origin lock

Strapi Public permissions omit `mubes-lpj`, `mubes-sidang`, `akses-user`, `audit-log`, and `login-event`. Unauthenticated direct REST reads must return `403`. Default core controllers add no replacement policy, so preserving this permission boundary is mandatory.

## Delivery lock

`getMubesAccess()` reads the Clerk session and resolves metadata from session claim variants, falling back to the Clerk Users API. Access requires:

- a signed-in `userId`;
- `publicMetadata.status === 'approved'`;
- role `admin`, `administrator`, `bph`, `member`, `operator`, or `admin_pembina`.

Missing metadata defaults to pending. The gate trusts Clerk metadata at request time; it does not query Strapi `akses-user` on every request.

`GET /api/mubes/lpj/[slug]` repeats this gate, then calls Strapi with `STRAPI_ELEVATED_TOKEN` and `cache: 'no-store'`. Portal server components pass `includeLpj: access.allowed` to the MUBES aggregation. `src/proxy.ts` supplies Clerk middleware and cache headers but does not authorize portal routes.

## Identity synchronization

The Clerk webhook creates or updates `akses-user` and sets new users to pending. Approval in Strapi is synchronized back into Clerk public metadata by the `akses-user` lifecycle. Updated claims may require a session refresh.

## Narrow public exception

The public Program Kerja page may expose Capaian and Evaluasi text resolved from LPJ through a server-only helper and `/api/program-kerja/[slug]/lpj-public`. This is an explicit content decision; it does not expose budget, funding source, receipts, or the complete LPJ payload.

## Security rules

- Never prefix the elevated token with `NEXT_PUBLIC_`.
- Never import elevated fetch helpers into client components.
- Never cache the complete LPJ response publicly.
- Never auto-approve a signup solely from a name match.
- Treat Clerk metadata synchronization and session freshness as part of revocation behavior.

Verification steps are in [local development](../guides/local-development.md).

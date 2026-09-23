---
title: Local Development
type: guide
tags: [development, nextjs, strapi, verification]
related:
  - ../concepts/architecture.md
  - ../concepts/mubes-security.md
  - ../reference/key-files.md
sources:
  - docs/codemaps/architecture.md
  - docs/codemaps/frontend.md
  - docs/codemaps/mubes-flow.md
---

# Local Development

## Prerequisites

Use a supported Node version for Strapi (`>=20 <=26`). Install dependencies at the repository root and in each application according to the checked-in lockfiles. Copy environment templates locally and never commit secret values.

Important frontend variables are `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_INTERNAL_URL`, `STRAPI_ELEVATED_TOKEN`, Clerk keys, `CLERK_WEBHOOK_SECRET`, `REVALIDATE_SECRET`, and `PREVIEW_SECRET`. Backend configuration includes Strapi secrets, database variables, public URL, frontend URL, and `CLERK_SECRET_KEY`.

## Commands

From the repository root:

```bash
npm run dev
npm run build
npm run start
```

The root commands coordinate both applications. For one application, use `npm run dev:solo` in `osis-smait-fi/` or `npm run develop` in `strapi-cms/`. Expected local services are Next on `3002` and Strapi on `1337`.

## MUBES smoke checks

With both services running:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "$NEXT_PUBLIC_STRAPI_URL/api/mubes-lpjs"
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:3002/api/mubes/lpj/some-slug"
node scripts/verify-mubes-schemas.js
```

The first two checks should return `403` without credentials. A public `200` from the direct Strapi LPJ endpoint is a security regression.

For an authorized end-to-end check: sign up through Clerk, confirm a pending `akses-user`, approve it in Strapi Admin, refresh the Clerk session, then verify the portal receives LPJ while a signed-out browser does not.

## Troubleshooting

- Public pages show no new content: confirm the document is published and cache revalidation has run.
- Portal remains pending: verify Strapi lifecycle synchronization and refresh the Clerk session.
- BFF returns configuration error: verify server-only `STRAPI_ELEVATED_TOKEN`.
- Program list shows static data: Strapi returned no usable Program Kerja rows or the fetch failed.

See [Portal MUBES security](../concepts/mubes-security.md) and [key files](../reference/key-files.md).

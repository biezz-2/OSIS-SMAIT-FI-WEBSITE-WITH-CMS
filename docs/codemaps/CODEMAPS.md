# Agora Acta Codemaps Index (AI agents)

**Purpose:** Single navigation index for monorepo architecture maps used by coding agents. **Canonical location: `docs/codemaps/`**. **Last updated: 2026-09-22.** Deep-dive files (`frontend.md`, `backend.md`, `mubes-flow.md`, `devops-workflows.md`) are owned by other agents — this index only fixes paths, tree, and guardrails.

**Mirrors:** `.devin/codemaps/` holds copies of deep-dives + architecture for Devin-compatible tooling. Empty root folder `codemaps/` is **not** authoritative. Root `CODEMAPS.md` should redirect agents here.

---

## Quick navigation

| Map | Path | Scope |
| :--- | :--- | :--- |
| **This index** | [`docs/codemaps/CODEMAPS.md`](CODEMAPS.md) | Topology + guardrails |
| **Architecture** | [`docs/codemaps/architecture.md`](architecture.md) | System context, domains, env names, request flow |
| **Frontend** | [`docs/codemaps/frontend.md`](frontend.md) | Next.js App Router (`osis-smait-fi`) |
| **Backend** | [`docs/codemaps/backend.md`](backend.md) | Strapi v5 (`strapi-cms`) |
| **MUBES flow** | [`docs/codemaps/mubes-flow.md`](mubes-flow.md) | Dual-layer Clerk + BFF + LPJ |
| **DevOps** | [`docs/codemaps/devops-workflows.md`](devops-workflows.md) | PM2, Nginx, env, deploy |
| Long-form human docs | [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/PRD.md`](../PRD.md) | Narrative; resolve path conflicts in favor of codemaps |

Devin mirror (same basenames): `.devin/codemaps/architecture.md`, `frontend.md`, `backend.md`, `mubes-flow.md`, `devops-workflows.md`.

---

## Monorepo topology (live)

```
AGORAACTA_WEBSITE/                          # agoraacta-website-workspace@1.0.0
├── package.json                            # concurrently: dev | start | build
├── ecosystem.config.js                     # PM2: osis-next-frontend :3002, osis-strapi-backend :1337
├── CODEMAPS.md                             # root pointer → prefer docs/codemaps/
├── osis-smait-fi/                          # Next 16.2.11 · React 19.2.4 · Tailwind 4 · Clerk
│   ├── src/proxy.ts                        # clerkMiddleware + cache headers
│   ├── src/app/                            # pages + api/* route handlers
│   ├── src/components/ · lib/ · hooks/ · context/
│   ├── next.config.ts                      # CSP, images, HSTS
│   └── AGENTS.md                           # Next 16 agent rules
├── strapi-cms/                             # Strapi 5.51.0 · Document API · uploads/
│   ├── config/ · src/api/ (24 CTs) · src/index.ts
│   └── .env.example
├── docs/
│   ├── ARCHITECTURE.md · PRD*.md · MUBES_*.md · CHANGELOG/
│   └── codemaps/                           # ★ canonical agent maps (this folder)
├── .devin/codemaps/                        # mirror for Devin
├── codemaps/                               # empty — ignore
├── scripts/ · plans/ · other-program/ · Desain_Sementara/
└── CLAUDE.md · CHANGELOG.md · README.md
```

**Stack snapshot:** Frontend Next App Router + Clerk; CMS Strapi headless; DB via `DATABASE_CLIENT` (`mysql` \| `postgres` \| `sqlite`; prod target PostgreSQL 16 per ops/changelog); runtime PM2 on VPS behind Nginx.

**Domains present:** public OSIS site, Edufest Infinity, Portal MUBES (dual-layer LPJ). **Not present:** e-voting, general student aspirasi portal routes.

---

## Primary agent guardrails

1. **Canonical docs path:** Edit/read `docs/codemaps/*` first. Do not treat root `codemaps/` or stale `.devin/`-only links as sole source. When updating architecture, mirror to `.devin/codemaps/architecture.md`.
2. **Next.js 16:** Breaking APIs vs older Next — read `osis-smait-fi/AGENTS.md` and local Next docs before routing/cache changes. Edge auth lives in `osis-smait-fi/src/proxy.ts`.
3. **Strapi 5:** Use `strapi.documents('api::…')`, not legacy entity service.
4. **MUBES isolation:** Public must not read `mubes-lpj` / `mubes-sidang`. Access only via Next BFF `osis-smait-fi/src/app/api/mubes/lpj/[slug]/route.ts` + Clerk (`getMubesAccess`) + `STRAPI_ELEVATED_TOKEN`.
5. **Media:** Always `getStrapiMediaUrl()` in `osis-smait-fi/src/lib/strapi.ts` — never hardcode localhost/IP.
6. **Gallery:** `/galeri/galeri-preview-infinity` — keep gap `0px`, `rounded-none`; prefer Strapi image formats over compress proxy regressions.
7. **Secrets:** Document env **names** only; never commit tokens. See architecture §7 and `strapi-cms/.env.example`.
8. **Scope:** Do not invent e-voting or unscoped student-portal features. After shipping: update `CHANGELOG.md` + `docs/CHANGELOG/CHANGELOG.md` (`CLAUDE.md`).
9. **Deep-dives:** Leave `frontend.md` / `backend.md` / `mubes-flow.md` / `devops-workflows.md` content to their owners unless fixing broken paths that contradict this index or `architecture.md`.

---

## Workspace scripts (root)

| Script | Action |
| :--- | :--- |
| `npm run dev` | `osis-smait-fi` `dev:solo` + `strapi-cms` `dev` |
| `npm run start` | both production starts via concurrently |
| `npm run build` | build frontend then Strapi |
| PM2 | `pm2 start ecosystem.config.js` from repo root |

# Devin AI Project Codemaps & Architecture Index
# Project: OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara)

This document and the `.devin/codemaps/` directory serve as the authoritative index and navigation map for Devin (and automated software agents).

---

## 🧭 Quick Navigation Map
- **Root Devin Codemap Index**: [CODEMAPS.md](CODEMAPS.md)
- **Architecture & System Design**: [.devin/codemaps/architecture.md](.devin/codemaps/architecture.md)
- **Frontend App Router (`osis-smait-fi`)**: [.devin/codemaps/frontend.md](.devin/codemaps/frontend.md)
- **Backend Strapi CMS (`strapi-cms`)**: [.devin/codemaps/backend.md](.devin/codemaps/backend.md)
- **Dual-Layer MUBES Security & Data Flow**: [.devin/codemaps/mubes-flow.md](.devin/codemaps/mubes-flow.md)
- **DevOps, PM2 & Environment Config**: [.devin/codemaps/devops-workflows.md](.devin/codemaps/devops-workflows.md)

---

## 🏢 Monorepo Topology
```
AGORAACTA_WEBSITE/ (Workspace Root)
│
├── osis-smait-fi/                  # [FRONTEND] Next.js 16 (React 19, Tailwind CSS v4, App Router)
│   ├── src/
│   │   ├── app/                    # App Router Pages & API Routes
│   │   ├── components/             # Reusable UI, Layout, Scenes, MUBES components
│   │   ├── lib/                    # Helpers, Strapi fetchers, Client Cache, Lenis
│   │   ├── hooks/                  # Custom React Hooks
│   │   ├── context/                # React Contexts
│   │   └── styles/                 # Global styles & module CSS
│   ├── public/                     # Static assets (images, audio, icons)
│   └── package.json                # Frontend dependencies
│
├── strapi-cms/                     # [BACKEND] Strapi v5 Headless CMS (PostgreSQL 16)
│   ├── config/                     # Server, database, plugins, middlewares
│   ├── src/
│   │   ├── api/                    # 22+ Content Types (endpoints, services, schemas)
│   │   ├── components/             # Reusable Strapi components
│   │   └── index.ts                # Bootstrap, register lifecycle, RBAC setup
│   ├── public/uploads/             # Managed media uploads
│   └── package.json                # Backend dependencies
│
├── docs/                           # Technical documentation & PRD records
│   ├── ARCHITECTURE.md             # Core system design & decision records
│   ├── PRD.md                      # Product Requirement Document
│   ├── MUBES_ARCHITECTURE_WALKTHROUGH.md # MUBES FigJam & security blueprint
│   └── codemaps/                   # Mirror copy of Devin codemaps
│
├── .devin/                         # Devin Agent Dedicated Instructions & Codemaps
│   └── codemaps/                   # Deep-dive module maps
│
├── ecosystem.config.js             # PM2 production supervisor
└── package.json                    # Monorepo task runner (concurrently)
```

---

## ⚡ Primary Agent Execution Guardrails
1. **Frontend App Directory**: Next.js 16 breaking patterns apply. Check `osis-smait-fi/AGENTS.md` before making routing or caching modifications.
2. **Strapi v5 Document API**: Strapi 5 uses `strapi.documents('api::xyz.xyz')` rather than legacy entity service.
3. **MUBES Dual-Layer Isolation**: Public API responses for LPJ/Sidang must return HTTP 403. Access is strictly governed via Next.js BFF (`/api/mubes/lpj/[slug]`) with Clerk Session and Strapi elevated token.
4. **Media Normalization**: Use `getStrapiMediaUrl()` helper in `osis-smait-fi/src/lib/strapi.ts` for all media assets. Never hardcode localhost or IP URLs.
5. **No Regressions on Gallery**: Gap in Infinite Gallery (`/galeri/galeri-preview-infinity`) must stay `0px` with `rounded-none`.

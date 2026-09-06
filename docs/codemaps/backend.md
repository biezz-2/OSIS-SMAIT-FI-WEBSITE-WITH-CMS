# Backend Codemap: `strapi-cms`
# Stack: Strapi v5 (v5.51.0), PostgreSQL 16 (Port 5433), Node.js >=20

## 1. Directory Structure

```
strapi-cms/
├── config/                           # Environment & Server Config
│   ├── server.ts                     # Port (1337), host, app keys
│   ├── database.ts                   # PostgreSQL connection configuration
│   ├── admin.ts                      # Admin panel auth tokens & API salt
│   ├── api.ts                        # Global REST settings (pagination, limits)
│   ├── middlewares.ts                # CORS, security headers, upload limits
│   └── plugins.ts                    # Users-permissions & custom plugins
│
├── src/
│   ├── index.ts                      # Bootstrap lifecycle, role definitions, initial seed
│   ├── api/                          # Content-Type APIs (Models, Controllers, Services)
│   │   ├── anggota-osis/             # OSIS members, roles, hierarchy, social links
│   │   ├── sekbid/                   # 8 Seksi Bidang schemas & descriptions
│   │   ├── program-kerja/            # Work programs linked to Sekbid & timeline
│   │   ├── mubes-lpj/                # [CONFIDENTIAL] MUBES accountability reports
│   │   ├── mubes-sidang/             # [CONFIDENTIAL] Assembly agenda & proceedings
│   │   ├── akses-user/               # Role-based access whitelist for MUBES
│   │   ├── audit-log/                # Security access logs for MUBES inspections
│   │   ├── event/                    # General events & major agendas (Edufest)
│   │   ├── galeri-foto/              # Photo gallery collections & tags
│   │   ├── artikel-mading/           # Digital wall magazine articles & categories
│   │   ├── edufest-division/         # Committees for annual festival
│   │   ├── edufest-member/           # Committee members
│   │   ├── edufest-timeline/         # Schedule for annual festival
│   │   ├── edufest-config/           # Festival global settings (banner, theme)
│   │   ├── navbar-config/            # Dynamic navigation items
│   │   ├── footer-config/            # Dynamic footer information
│   │   ├── inbox/                    # User contact & suggestions inbox
│   │   └── notification/             # Broadcast notifications & alerts
│   │
│   ├── components/                   # Strapi Shared Reusable Component Schemas
│   │   ├── layout/                   # Dynamic page block components
│   │   └── shared/                   # Shared media, buttons, links, SEO metadata
│   │
│   └── extensions/                   # Plugin customizations
│
├── public/uploads/                   # Local media store directory
└── scripts/                          # Database sync, seed, & utility scripts
```

---

## 2. Key Content Types & Roles

| Content-Type API | Role Access Policy | Sensitive Data |
|---|---|---|
| `api::anggota-osis` | Public: `find`, `findOne` | No (Public profiles only) |
| `api::program-kerja` | Public: `find`, `findOne` | No |
| `api::mubes-lpj` | Public: **BLOCKED (403)** / Authenticated API: Full | **YES** (Financials, internal evaluations) |
| `api::mubes-sidang` | Public: **BLOCKED (403)** / Authenticated API: Full | **YES** (Internal assembly protocols) |
| `api::akses-user` | Public: **BLOCKED (403)** | **YES** (User email whitelist & roles) |
| `api::audit-log` | Public: **BLOCKED (403)** | **YES** (IP address, user agent, timestamps) |

---

## 3. Strapi 5 Programming Conventions
- **Document API**: Use `strapi.documents('api::content-type.content-type')` instead of legacy `strapi.entityService`.
- **Database Access**: Configured in `config/database.ts` reading from `.env`:
  - `DATABASE_HOST`, `DATABASE_PORT` (default 5433 for Docker `mubes-postgres`), `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`.
- **Lifecycle Bootstrap**: `src/index.ts` automatically asserts Public and Authenticated permissions on startup.

# System Architecture & Topology Codemap
# Target: Devin AI Assistant

## 1. Network & Process Topologies

```
[ Internet / Browser Client ]
             │ (HTTPS / HTTP)
             ▼
      [ Nginx Reverse Proxy ]
      ├── :3002 (Web & BFF) ──> [ Next.js 16 (App Router) ] (PM2: osis-next-frontend)
      └── :1337 (API / CMS) ──> [ Strapi v5 Headless CMS ] (PM2: osis-strapi-backend)
                                     │ (TCP Port 5433)
                                     ▼
                            [ PostgreSQL 16 DB ] (Container: mubes-postgres)
```

### Production Runtime (PM2)
- Monorepo Supervisor: `ecosystem.config.js`
  - `osis-next-frontend`: `npm run start:solo` in `./osis-smait-fi` (Port: `3002`)
  - `osis-strapi-backend`: `npm run start` in `./strapi-cms` (Port: `1337`)

---

## 2. Core Architectural Patterns

### A. Dual-Layer Isolation (MUBES Protocol)
- **Problem**: School organization needs to project general public info to guests while simultaneously allowing internal assembly (MUBES) operators to audit LPJ and budget balance on the exact same pages without layout shifts.
- **Solution**:
  - Unauthenticated visitors hit ISR/SSR pages with sanitized Strapi data.
  - Operator activates shortcut (`Ctrl+Shift+M`) -> Clerk Modal Login -> Session token verified by Next.js Backend-For-Frontend (BFF).
  - Next.js BFF calls Strapi with elevated internal token, injecting LPJ accordion data directly into the active DOM.
  - Zero URL redirection, Zero Layout Shift.

### B. High-Performance Media Pipeline
- Raw uploads stored in `strapi-cms/public/uploads/`.
- Frontend utilizes `osis-smait-fi/src/lib/strapi.ts` (`getStrapiMediaUrl`) to format relative media paths into absolute CDN URLs.
- Next.js Image optimization bypasses internal compression proxy for pre-rendered formats (`formats.medium`, `formats.large`) to optimize Core Web Vitals (LCP/CLS).

### C. WebGL 3D & Smooth Interactivity
- **Lenis Smooth Scroll**: Initialized in `osis-smait-fi/src/lib/lenis.ts`.
- **Three.js & Shaders**: Interactive scenes in `osis-smait-fi/src/components/scenes/` and `/edufest-infinity`.
- **D3 + Topojson**: 3D Globe visualization in `osis-smait-fi/src/components/globe/`.

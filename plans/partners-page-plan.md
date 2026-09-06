# Partners Page Implementation Plan

## Overview
Add a full-featured Partners page to the OSIS SMAIT FI website with:
- PrismaHero (already done) + HeroLiquidMetal section below it
- Partner showcase cards driven by a new Strapi `partner` collection
- Hero text customizable from Strapi `Halaman Utama` with slug `partners`

## Architecture

```mermaid
flowchart TD
    A[/partners page.tsx/] --> B[Navbar]
    A --> C[PrismaHero - video hero]
    A --> D[HeroLiquidMetal - shader section]
    A --> E[PartnersShowcase - partner cards]
    A --> F[Footer]
    
    C -->|fetch| G[Strapi Halaman slug=partners]
    E -->|fetch| H[Strapi Partner collection]
    
    G -->|judul_hero, sub_judul, deskripsi, banner_image| C
    H -->|nama, role, github_url, avatar, deskripsi| E
```

## Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `osis-smait-fi/src/components/ui/hero-liquid-metal.tsx` | LiquidMetal shader hero component |
| `osis-smait-fi/src/components/partners/PartnersShowcase.tsx` | Partner cards grid component |
| `strapi-cms/src/api/partner/content-types/partner/schema.json` | Strapi collection schema |
| `strapi-cms/src/api/partner/controllers/partner.ts` | Strapi controller |
| `strapi-cms/src/api/partner/routes/partner.ts` | Strapi routes |
| `strapi-cms/src/api/partner/services/partner.ts` | Strapi service |

### Modified Files
| File | Change |
|------|--------|
| `osis-smait-fi/package.json` | Add `@paper-design/shaders-react` |
| `osis-smait-fi/src/lib/strapi.ts` | Add `fetchPartnersFromStrapi` |
| `osis-smait-fi/src/app/partners/page.tsx` | Wire Strapi data + add sections |

## Strapi Partner Schema
```json
{
  "kind": "collectionType",
  "collectionName": "partners",
  "info": {
    "singularName": "partner",
    "pluralName": "partners",
    "displayName": "Partner"
  },
  "attributes": {
    "nama": { "type": "string", "required": true },
    "role": { "type": "string" },
    "github_url": { "type": "string" },
    "website_url": { "type": "string" },
    "deskripsi": { "type": "text" },
    "avatar": { "type": "media", "multiple": false },
    "urutan": { "type": "integer", "default": 0 },
    "is_active": { "type": "boolean", "default": true }
  }
}
```

## Initial Partner Data
- **biezz-2**: Core developer, website infrastructure and Strapi CMS architect
- **junior-draft**: Developer partner, frontend contribution and collaboration

## Dependencies
- `@paper-design/shaders-react` — WebGL shader for LiquidMetal visual effect

# Frontend Codemap: `osis-smait-fi`
# Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript

## 1. Directory Tree & Key Responsibilities

```
osis-smait-fi/src/
├── app/                              # Next.js App Router (Rute & Handlers)
│   ├── layout.tsx                    # Root layout: font loading, Lenis, Navbar & Footer
│   ├── page.tsx                      # Landing Home: Hero, LatestEvent, Intro, etc.
│   ├── about/page.tsx                # About Agora Acta: Vision, Mission, Core Team
│   ├── anggota/page.tsx              # Member Directory: BPH, Sekbid 1-8 (Dynamic Strapi)
│   ├── events/                       # Events Listing & Detail Pages
│   ├── galeri/                       # Gallery system: Infinity 2D grid viewer
│   ├── media-sosial/page.tsx         # Social Media Hub (YouTube, Instagram, TikTok)
│   ├── portal-mubes/page.tsx         # Dedicated MUBES Management & Access Portal
│   ├── program-kerja/                # Program Kerja grid & Detail view
│   ├── sekbid/                       # Seksi Bidang 1-8 Detail view
│   ├── edufest-infinity/             # WebGL 3D Event Portal (Scenes, Globe, Timeline)
│   ├── sitemap.ts                    # Dynamic sitemap generation
│   ├── robots.ts                     # Search engine crawler policies
│   └── api/                          # Route Handlers (BFF & Utilities)
│       ├── mubes/                    # BFF for MUBES LPJ verification & data injection
│       ├── strapi-webhook/           # On-demand cache revalidation endpoint
│       ├── compress-image/           # Dynamic image thumbnail & webp compressor
│       ├── webhooks/clerk/           # Clerk user sync & fuzzy match to Anggota OSIS
│       └── audio-proxy/              # Audio streaming proxy for Edufest
│
├── components/                       # UI Component Modules
│   ├── Navbar.tsx                    # Responsive navigation bar with glassmorphic style
│   ├── Footer.tsx                    # Footer with school info & social links
│   ├── home/                         # Landing sections (Hero, LatestEvent, Intro)
│   ├── anggota/                      # Member card & hierarchy rendering
│   ├── program-kerja/                # Program Kerja card, grid & detail layout
│   ├── scenes/                       # Three.js / WebGL canvas scenes
│   ├── globe/                        # D3 & Three.js 3D interactive globe
│   ├── ui/                           # Reusable micro-components (buttons, modals, inputs)
│   └── events/                       # Event cards & registration components
│
├── lib/                              # Core Utility Modules
│   ├── strapi.ts                     # API client, fetcher, URL normalizer & endpoints
│   ├── lenis.ts                      # Smooth scroll controller
│   ├── search.ts                     # In-memory client search algorithm
│   ├── image-cache.ts                # Dimension & layout cache for infinite gallery
│   └── utils.ts                      # Classname merge (clsx + tailwind-merge)
```

---

## 2. Critical Route Handlers & Integration Endpoints

| Path | Purpose | Security / Access |
|---|---|---|
| `/api/mubes/lpj/[slug]` | BFF endpoint for LPJ detail & real-time financial data | Clerk Auth + Internal Bearer Token |
| `/api/strapi-webhook` | Trigger on-demand revalidation on CMS publish/update | Secret Webhook Header Verification |
| `/api/webhooks/clerk` | Syncs Clerk accounts with `anggota-osis` in Strapi | Svix cryptographic signature check |
| `/api/compress-image` | On-the-fly image optimization via Sharp | Public caching enabled |

---

## 3. Important Implementation Notes for Devin
- **Font Styling**: Uses Inter / Google Fonts injected via Next.js `next/font`.
- **CSS Engine**: Uses Tailwind CSS v4 (`@tailwindcss/postcss`).
- **Smooth Panning Physics**: The infinite gallery in `src/app/galeri/galeri-preview-infinity/page.tsx` uses custom velocity animation loops. **Do not modify `GAP = 0` or change `rounded-none`**.

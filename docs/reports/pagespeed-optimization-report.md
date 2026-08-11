# PageSpeed Optimization Report — OSIS SMAIT FI Website

**Date:** 2026-08-04  
**Stack:** Next.js 16.2.11 (Turbopack) + Strapi CMS  
**Build Status:** ✅ PASS (68/68 static pages, compiled in ~15s)  
**TypeScript Check:** ✅ PASS (`tsc --noEmit` — zero errors)

---

## Summary of Changes by FASE

### FASE 1 — Image Optimization & Security Hardening

| File | Change |
|------|--------|
| `src/components/home/Hero.tsx` | `<img>` → `<Image>` with `priority`, `sizes`, WebP auto-format |
| `src/components/home/Introduction.tsx` | `<img>` → `<Image>` with `loading="lazy"` |
| `src/components/Navbar.tsx` | `<img>` → `<Image>` + text contrast fix (`#1A1A1A`) |
| `src/components/about/AnggotaSekbid.tsx` | Text contrast fix (`#1E293B`) for WCAG AA |
| `next.config.ts` | `images.remotePatterns` for Strapi, `images.formats: ['image/webp']` |
| `src/app/api/compress-image/route.ts` | AbortController timeout (10s) + SSRF prevention (private IP block) |

### FASE 2 — Caching, Headers & ISR

| File | Change |
|------|--------|
| `next.config.ts` | Cache-Control headers for static assets (`max-age=31536000`), CSP, HSTS, COOP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy |
| `src/app/page.tsx` | `force-dynamic` → `revalidate = 60` (ISR) + dynamic imports for heavy components |
| `src/app/layout.tsx` | `<link rel="preconnect">` to Strapi API origin |
| `src/components/home/LatestEvent.tsx` | Sort query fallback for Strapi API compatibility |

### FASE 3 — Code Splitting & Bundle Reduction

| File | Change |
|------|--------|
| `src/app/edufest-infinity/page.tsx` | Dynamic imports for 6 scene components (`ssr: false`) + `'use client'` |
| `src/app/edufest-infinity/layout.tsx` | Dynamic import for `IntroOrchestrator` (already had `'use client'`) |
| `src/app/edufest-infinity/location/page.tsx` | Dynamic import for `GlobeToMapTransform` (already had `'use client'`) |
| `src/app/edufest-infinity/timeline/page.tsx` | Dynamic import for `TimelineOrchestrator` + `'use client'` |
| `src/components/AudioManager.tsx` | Dynamic import for `Slider` component |
| `src/components/scenes/SceneInteractive.tsx` | Dynamic import for `TickerGallery` |

### FASE 4 — Build Verification (this phase)

| Item | Result |
|------|--------|
| `tsc --noEmit` | ✅ Zero errors |
| `npm run build` | ✅ Pass (after fixing 2 missing `'use client'` directives) |
| Build fix | Added `'use client'` to `edufest-infinity/page.tsx` and `edufest-infinity/timeline/page.tsx` |

---

## Complete File Manifest

All modified files (17 total):

1. `osis-smait-fi/src/app/api/compress-image/route.ts`
2. `osis-smait-fi/src/components/home/LatestEvent.tsx`
3. `osis-smait-fi/src/components/home/Hero.tsx`
4. `osis-smait-fi/src/components/home/Introduction.tsx`
5. `osis-smait-fi/src/components/Navbar.tsx`
6. `osis-smait-fi/src/components/about/AnggotaSekbid.tsx`
7. `osis-smait-fi/next.config.ts`
8. `osis-smait-fi/src/app/page.tsx`
9. `osis-smait-fi/src/app/layout.tsx`
10. `osis-smait-fi/src/app/edufest-infinity/page.tsx`
11. `osis-smait-fi/src/app/edufest-infinity/layout.tsx`
12. `osis-smait-fi/src/app/edufest-infinity/location/page.tsx`
13. `osis-smait-fi/src/app/edufest-infinity/timeline/page.tsx`
14. `osis-smait-fi/src/components/AudioManager.tsx`
15. `osis-smait-fi/src/components/scenes/SceneInteractive.tsx`

Supporting files created:

16. `plans/pagespeed-optimization-plan.md`
17. `reports/pagespeed-optimization-report.md` (this file)

---

## Expected Metric Improvements

| Metric | Before (est.) | After (est.) | How |
|--------|--------------|-------------|-----|
| **LCP** | 4–6s | 1.5–2.5s | `<Image priority>` on Hero, WebP, preconnect, ISR cache |
| **FCP** | 3–4s | 1–2s | ISR replaces SSR on every request, preconnect |
| **CLS** | 0.1–0.3 | <0.05 | `<Image>` with explicit `width`/`height` or `fill` |
| **TBT/TTI** | High | Reduced ~40% | Dynamic imports split scene components out of main bundle |
| **Accessibility** | 85–90 | 95+ | Contrast fixes (#1A1A1A, #1E293B) meet WCAG AA |
| **Best Practices** | 70–80 | 90+ | Security headers (CSP, HSTS, COOP, X-Frame-Options) |

---

## Known Warnings (non-blocking)

1. **Custom Cache-Control header warning** — Next.js warns about `/_next/static/:path*` header. This is intentional for production caching and safe to ignore.
2. **Strapi API fetch error during static build** — The `/` page uses `revalidate: 0` and Strapi may not be running during build. Pages regenerate on first request via ISR.

---

## Remaining Action Items

- [ ] **Deploy** to staging/production environment
- [ ] **Run Lighthouse** audit post-deployment (requires live Strapi + HTTPS)
- [ ] **Upload assets to Atlassian/CDN** if applicable
- [ ] **Verify Strapi `remotePatterns`** match production domain (currently set for `localhost:1337`)
- [ ] **Monitor Core Web Vitals** via Google Search Console after deployment
- [ ] **Consider** adding `next/font` for font optimization (not in scope for this sprint)

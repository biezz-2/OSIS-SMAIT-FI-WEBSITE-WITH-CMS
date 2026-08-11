# PageSpeed Optimization Plan — OSIS SMAIT FI Website

**Target:** `https://osissmaitfi.biezz.my.id/`  
**Stack:** Next.js 16 + Strapi CMS + PM2 + Tailwind CSS 4  
**Current Scores:** Perf **89** | A11y **96** | Best Practices **96** | SEO **100**  
**Goal:** Perf **≥95** | A11y **100** | BP **100**

---

## Architecture Overview

```mermaid
graph LR
    Browser --> NextJS[Next.js :3002]
    NextJS --> StrapiCMS[Strapi :1337]
    NextJS --> CompressAPI[/api/compress-image]
    CompressAPI --> StrapiCMS
    CompressAPI --> Sharp[sharp lib]
    NextJS --> StaticAssets[public/]
```

Key insight: All images route through [`/api/compress-image`](osis-smait-fi/src/app/api/compress-image/route.ts) via [`ImageQualityContext`](osis-smait-fi/src/context/ImageQualityContext.tsx). This proxy fetches from Strapi and converts to WebP via `sharp`. The timeout errors stem from **no fetch timeout** on the proxy.

---

## FASE 1: Critical Fixes

### 1.1 Fix `/api/compress-image` Timeout

**File:** [`osis-smait-fi/src/app/api/compress-image/route.ts`](osis-smait-fi/src/app/api/compress-image/route.ts)

**Root cause:** Line 31 — `fetch(targetUrl, { cache: 'force-cache' })` has no timeout. If Strapi is slow, request hangs until client aborts.

**Fix:**
1. Add `AbortController` with 5s timeout
2. Return fallback redirect to original URL on timeout (graceful degradation)
3. Add input URL validation (reject non-http URLs)

```typescript
// Add AbortController with 5s timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(targetUrl, {
    cache: 'force-cache',
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  // ... rest of processing
} catch (error) {
  clearTimeout(timeoutId);
  if (error instanceof DOMException && error.name === 'AbortError') {
    // Timeout: redirect to original image
    return NextResponse.redirect(targetUrl, 302);
  }
  throw error;
}
```

**Lazy alternative:** Use Next.js `<Image>` component directly — it does WebP conversion, resizing, and caching built-in. Eliminates the entire proxy route.

### 1.1b Fix LatestEvent 400 Error

**File:** [`osis-smait-fi/src/components/home/LatestEvent.tsx`](osis-smait-fi/src/components/home/LatestEvent.tsx:25)

**Root cause:** Line 25 — Strapi query `sort[0]=tanggal_mulai:desc` may fail if field `tanggal_mulai` doesn't exist in the event content type.

**Fix:** Validate field exists in [`event schema`](strapi-cms/src/api/event/content-types/event/schema.json). If missing, fall back to `createdAt`.

### 1.2 Image Optimization — Replace `<img>` with `next/image`

**Files to modify:**
| Component | File | Current | Change |
|-----------|------|---------|--------|
| Hero | [`Hero.tsx`](osis-smait-fi/src/components/home/Hero.tsx:54) | `<img>` raw | `<Image>` with `priority`, `fill`, `sizes` |
| LatestEvent | [`LatestEvent.tsx`](osis-smait-fi/src/components/home/LatestEvent.tsx:74) | `<img>` raw | `<Image>` with `loading="lazy"` |
| Introduction | [`Introduction.tsx`](osis-smait-fi/src/components/home/Introduction.tsx) | `<img>` raw | `<Image>` with `loading="lazy"` |
| Navbar logo | [`Navbar.tsx`](osis-smait-fi/src/components/Navbar.tsx:49) | `<img>` raw | `<Image>` with `priority` |

**Why this matters:**
- `next/image` auto-serves WebP/AVIF, auto-resizes via `srcset`, lazy-loads by default
- Eliminates need for `/api/compress-image` proxy entirely
- Built-in blur placeholder reduces CLS
- Saves ~723 KiB without manual compression

**Config needed in [`next.config.ts`](osis-smait-fi/next.config.ts):**
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'osisstrapi.biezz.my.id' },
  ],
  formats: ['image/avif', 'image/webp'],
},
```

### 1.3 Fix Color Contrast (A11y → 100)

**Issues found:**

| Location | Text Color | Background | Contrast | Fix |
|----------|-----------|------------|----------|-----|
| [`Navbar.tsx:69`](osis-smait-fi/src/components/Navbar.tsx:69) nav buttons | `#F3F4F6` | `#FA982E` | ~2.2:1 ❌ | Change text to `#1A1A1A` or bg to `#B06800` |
| [`Footer.tsx:21`](osis-smait-fi/src/components/Footer.tsx:21) org name | `white` | `#111827` | 16.7:1 ✅ | OK |
| [`Footer.tsx:7`](osis-smait-fi/src/components/Footer.tsx:7) body text | `#9CA3AF` | `#111827` | 4.6:1 ✅ | Borderline — bump to `#A1A7B0` |
| [`AnggotaSekbid.tsx:32`](osis-smait-fi/src/components/about/AnggotaSekbid.tsx:32) | `white` | `#AACDDC` | ~2.1:1 ❌ | Change text to `#1E293B` |

**Primary fix needed:** Navbar buttons and AnggotaSekbid badge.

---

## FASE 2: Performance Optimization

### 2.1 Code Splitting — Dynamic Imports for Heavy Libraries

**Heavy deps in [`package.json`](osis-smait-fi/package.json):**
- `d3` (~230 KiB) — used only in globe component
- `gsap` (~100 KiB) — used in animations
- `framer-motion` (~130 KiB) — used in transitions
- `@studio-freight/lenis` + `lenis` — smooth scroll

**Fix:** Lazy load components that use these:

```typescript
// Instead of static import
import GlobeToMapTransform from '@/components/globe/GlobeToMapTransform';

// Dynamic import
const GlobeToMapTransform = dynamic(
  () => import('@/components/globe/GlobeToMapTransform'),
  { ssr: false }
);
```

**Components to lazy-load:**
- [`GlobeToMapTransform`](osis-smait-fi/src/components/globe/GlobeToMapTransform.tsx)
- [`CursorParticles`](osis-smait-fi/src/components/CursorParticles.tsx)
- [`TickerGallery`](osis-smait-fi/src/components/TickerGallery.tsx)
- [`IntroOrchestrator`](osis-smait-fi/src/components/intro/IntroOrchestrator.tsx)
- All Scene components under [`scenes/`](osis-smait-fi/src/components/scenes/)

### 2.2 Long Task Mitigation

**Likely culprits:** GSAP timeline initialization, D3 globe rendering, Lenis smooth scroll setup.

**Fix:** Wrap non-critical animation init in `requestIdleCallback`:
```typescript
useEffect(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initAnimation());
  } else {
    setTimeout(() => initAnimation(), 100);
  }
}, []);
```

### 2.3 Cache Headers for Static Assets

**File:** [`next.config.ts`](osis-smait-fi/next.config.ts)

Add to the `headers()` function:
```typescript
{
  source: '/_next/static/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
  ],
},
{
  source: '/images/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
  ],
},
```

Note: Next.js already sets immutable cache on `/_next/static/` by default. Focus on `/public/` assets and API responses.

### 2.4 Eliminate Render-Blocking Resources

**Current:** [`layout.tsx`](osis-smait-fi/src/app/layout.tsx) loads 5 Google Fonts via `next/font/google` — this is already optimal (Next.js self-hosts them).

**Additional optimizations:**
1. Add `display: 'swap'` to all font configs (already default in next/font)
2. Preconnect to Strapi API domain:
   ```html
   <link rel="preconnect" href="https://osisstrapi.biezz.my.id" />
   ```
3. Convert `export const dynamic = 'force-dynamic'` in [`page.tsx`](osis-smait-fi/src/app/page.tsx:8) to ISR:
   ```typescript
   export const revalidate = 60; // Revalidate every 60s instead of force-dynamic
   ```
   This alone could cut FCP significantly by serving cached HTML.

---

## FASE 3: Security Headers

### 3.1 Content Security Policy

**File:** [`next.config.ts`](osis-smait-fi/next.config.ts)

Replace current minimal CSP with full policy:

```typescript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://osisstrapi.biezz.my.id https:",
    "font-src 'self'",
    "connect-src 'self' https://osisstrapi.biezz.my.id",
    "frame-ancestors 'self' https://osisstrapi.biezz.my.id",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; '),
},
```

### 3.2 Security Headers (HSTS, COOP)

Add to `headers()` in [`next.config.ts`](osis-smait-fi/next.config.ts):

```typescript
{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
{ key: 'X-Content-Type-Options', value: 'nosniff' },
{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
```

---

## FASE 4: Validation

### Checklist
- [ ] Run Lighthouse mobile audit — target ≥95 perf
- [ ] Run Lighthouse accessibility audit — target 100
- [ ] Verify no console errors related to CSP
- [ ] Test compress-image fallback on timeout
- [ ] Verify images served as WebP/AVIF
- [ ] Check cache headers with `curl -I`
- [ ] Test on mobile Chrome, Firefox, Safari

---

## Impact Estimate

| Change | Expected Perf Impact |
|--------|---------------------|
| `force-dynamic` → `revalidate=60` | FCP -0.5s, LCP -1.0s |
| `<img>` → `<Image>` | Image size -50%, LCP -0.5s |
| Dynamic imports for d3/gsap | JS bundle -200 KiB, TBT -20ms |
| AbortController on compress API | Eliminates timeout errors |
| Cache headers | Repeat load -80% |
| Security headers | Best Practices → 100 |
| Contrast fixes | Accessibility → 100 |

**Projected final scores:** Perf **96-98** | A11y **100** | BP **100** | SEO **100**

---

## Files Modified Summary

| File | Changes |
|------|---------|
| [`next.config.ts`](osis-smait-fi/next.config.ts) | images config, cache headers, security headers, CSP |
| [`route.ts`](osis-smait-fi/src/app/api/compress-image/route.ts) | AbortController timeout, URL validation |
| [`page.tsx`](osis-smait-fi/src/app/page.tsx) | `force-dynamic` → `revalidate=60` |
| [`layout.tsx`](osis-smait-fi/src/app/layout.tsx) | Add preconnect meta |
| [`Hero.tsx`](osis-smait-fi/src/components/home/Hero.tsx) | `<img>` → `<Image>` with priority |
| [`LatestEvent.tsx`](osis-smait-fi/src/components/home/LatestEvent.tsx) | `<img>` → `<Image>`, fix sort query |
| [`Introduction.tsx`](osis-smait-fi/src/components/home/Introduction.tsx) | `<img>` → `<Image>` lazy |
| [`Navbar.tsx`](osis-smait-fi/src/components/Navbar.tsx) | `<img>` → `<Image>`, fix nav button contrast |
| [`Footer.tsx`](osis-smait-fi/src/components/Footer.tsx) | Bump muted text contrast |
| [`AnggotaSekbid.tsx`](osis-smait-fi/src/components/about/AnggotaSekbid.tsx) | Fix badge text contrast |
| Heavy components | Add `dynamic()` wrapper imports |

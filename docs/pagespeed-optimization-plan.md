# 🚀 Rencana Optimasi PageSpeed — Website OSIS SMAIT FI

**Target**: `https://osissmaitfithrahinsani.sch.id/`  
**Stack**: Next.js 16 + Strapi CMS + PM2 + Tailwind CSS 4  
**Skor Saat Ini**: Performa **89** | Aksesibilitas **96** | Praktik Terbaik **96** | SEO **100**  
**Target Skor**: Performa **≥95** | Aksesibilitas **100** | Praktik Terbaik **100**

---

## 🏗️ Ikhtisar Arsitektur

```mermaid
graph LR
    Browser --> NextJS[Next.js :3002]
    NextJS --> StrapiCMS[Strapi :1337]
    NextJS --> CompressAPI[/api/compress-image]
    CompressAPI --> StrapiCMS
    CompressAPI --> Sharp[sharp lib]
    NextJS --> StaticAssets[public/]
```

**Wawasan Utama**: Semua gambar melewati [`/api/compress-image`](osis-smait-fi/src/app/api/compress-image/route.ts) melalui [`ImageQualityContext`](osis-smait-fi/src/context/ImageQualityContext.tsx). Proxy ini mengambil gambar dari Strapi dan mengonversinya ke WebP menggunakan `sharp`. Masalah *timeout* terjadi karena tidak adanya batas waktu (*fetch timeout*) pada proxy tersebut.

---

## 🛠️ FASE 1: Perbaikan Kritis

### 1.1 Perbaikan Timeout `/api/compress-image`

**Berkas**: [`osis-smait-fi/src/app/api/compress-image/route.ts`](osis-smait-fi/src/app/api/compress-image/route.ts)

**Penyebab Utama**: Baris 31 — `fetch(targetUrl, { cache: 'force-cache' })` tidak memiliki timeout. Jika Strapi lambat, permintaan akan menggantung hingga klien membatalkannya.

**Solusi**:
1. Tambahkan `AbortController` dengan timeout 5 detik.
2. Kembalikan *fallback redirect* ke URL asli jika terjadi timeout (degradasi anggun).
3. Tambahkan validasi URL input (tolak URL non-http).

```typescript
// Tambahkan AbortController dengan timeout 5 detik
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(targetUrl, {
    cache: 'force-cache',
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  // ... proses selanjutnya
} catch (error) {
  clearTimeout(timeoutId);
  if (error instanceof DOMException && error.name === 'AbortError') {
    // Timeout: redirect ke gambar asli
    return NextResponse.redirect(targetUrl, 302);
  }
  throw error;
}
```

**Alternatif Efisien**: Gunakan komponen `<Image>` dari Next.js secara langsung — fitur ini sudah mencakup konversi WebP, pengubahan ukuran, dan caching bawaan, sehingga menghilangkan kebutuhan akan proxy route.

### 1.2 Perbaikan Error 400 pada LatestEvent

**Berkas**: [`osis-smait-fi/src/components/home/LatestEvent.tsx`](osis-smait-fi/src/components/home/LatestEvent.tsx:25)

**Penyebab Utama**: Baris 25 — Query Strapi `sort[0]=tanggal_mulai:desc` dapat gagal jika field `tanggal_mulai` tidak ada dalam *content type* event.

**Solusi**: Validasi keberadaan field di [`event schema`](strapi-cms/src/api/event/content-types/event/schema.json). Jika tidak ada, gunakan fallback ke `createdAt`.

### 1.3 Optimasi Gambar — Ganti `<img>` dengan `next/image`

**Berkas yang Dimodifikasi**:

| Komponen | Berkas | Saat Ini | Perubahan |
|-----------|------|---------|----------|
| Hero | [`Hero.tsx`](osis-smait-fi/src/components/home/Hero.tsx:54) | `<img>` raw | `<Image>` dengan `priority`, `fill`, `sizes` |
| LatestEvent | [`LatestEvent.tsx`](osis-smait-fi/src/components/home/LatestEvent.tsx:74) | `<img>` raw | `<Image>` dengan `loading="lazy"` |
| Introduction | [`Introduction.tsx`](osis-smait-fi/src/components/home/Introduction.tsx) | `<img>` raw | `<Image>` dengan `loading="lazy"` |
| Logo Navbar | [`Navbar.tsx`](osis-smait-fi/src/components/Navbar.tsx:49) | `<img>` raw | `<Image>` dengan `priority` |

**Mengapa ini penting?**
- `next/image` otomatis menyajikan WebP/AVIF, mengubah ukuran via `srcset`, dan melakukan lazy-load secara default.
- Menghilangkan kebutuhan proxy `/api/compress-image` sepenuhnya.
- *Blur placeholder* bawaan mengurangi CLS.
- Menghemat ~723 KiB tanpa kompresi manual.

**Konfigurasi yang dibutuhkan di [`next.config.ts`](osis-smait-fi/next.config.ts):**
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'osisstrapi.biezz.my.id' },
  ],
  formats: ['image/avif', 'image/webp'],
},
```

### 1.4 Perbaikan Kontras Warna (A11y $\rightarrow$ 100)

**Masalah yang Ditemukan**:

| Lokasi | Warna Teks | Latar Belakang | Kontras | Solusi |
|----------|-----------|----------------|----------|--------|
| [`Navbar.tsx:69`](osis-smait-fi/src/components/Navbar.tsx:69) tombol nav | `#F3F4F6` | `#FA982E` | ~2.2:1 ❌ | Ubah teks ke `#1A1A1A` atau bg ke `#B06800` |
| [`Footer.tsx:21`](osis-smait-fi/src/components/Footer.tsx:21) nama org | `white` | `#111827` | 16.7:1 ✅ | OK |
| [`Footer.tsx:7`](osis-smait-fi/src/components/Footer.tsx:7) teks body | `#9CA3AF` | `#111827` | 4.6:1 ✅ | Batas minimum — naikkan ke `#A1A7B0` |
| [`AnggotaSekbid.tsx:32`](osis-smait-fi/src/components/about/AnggotaSekbid.tsx:32) | `white` | `#AACDDC` | ~2.1:1 ❌ | Ubah teks ke `#1E293B` |

---

## ⚡ FASE 2: Optimasi Performa

### 2.1 Code Splitting — Dynamic Imports untuk Library Berat

**Dependensi Berat di [`package.json`](osis-smait-fi/package.json):**
- `d3` (~230 KiB) — hanya digunakan di komponen globe.
- `gsap` (~100 KiB) — digunakan dalam animasi.
- `framer-motion` (~130 KiB) — digunakan dalam transisi.
- `@studio-freight/lenis` + `lenis` — smooth scroll.

**Solusi**: Lazy load komponen yang menggunakan library tersebut:

```typescript
// Alih-alih import statis
import GlobeToMapTransform from '@/components/globe/GlobeToMapTransform';

// Gunakan dynamic import
const GlobeToMapTransform = dynamic(
  () => import('@/components/globe/GlobeToMapTransform'),
  { ssr: false }
);
```

**Komponen yang harus di-lazy-load**:
- [`GlobeToMapTransform`](osis-smait-fi/src/components/globe/GlobeToMapTransform.tsx)
- [`CursorParticles`](osis-smait-fi/src/components/CursorParticles.tsx)
- [`TickerGallery`](osis-smait-fi/src/components/TickerGallery.tsx)
- [`IntroOrchestrator`](osis-smait-fi/src/components/intro/IntroOrchestrator.tsx)
- Semua komponen Scene di bawah [`scenes/`](osis-smait-fi/src/components/scenes/)

### 2.2 Mitigasi Long Task

**Penyebab potensial**: Inisialisasi timeline GSAP, rendering globe D3, setup smooth scroll Lenis.

**Solusi**: Bungkus inisialisasi animasi non-kritis dalam `requestIdleCallback`:
```typescript
useEffect(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initAnimation());
  } else {
    setTimeout(() => initAnimation(), 100);
  }
}, []);
```

### 2.3 Cache Headers untuk Aset Statis

**Berkas**: [`next.config.ts`](osis-smait-fi/next.config.ts)

Tambahkan pada fungsi `headers()`:
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

### 2.4 Eliminasi Resource yang Menghambat Render

**Optimasi Tambahan**:
1. Tambahkan `display: 'swap'` pada semua konfigurasi font (sudah default di `next/font`).
2. Preconnect ke domain API Strapi:
   ```html
   <link rel="preconnect" href="https://osisstrapi.biezz.my.id" />
   ```
3. Ubah `export const dynamic = 'force-dynamic'` di [`page.tsx`](osis-smait-fi/src/app/page.tsx:8) menjadi ISR:
   ```typescript
   export const revalidate = 60; // Revalidasi setiap 60 detik
   ```
   Hal ini dapat memotong FCP secara signifikan dengan menyajikan HTML yang di-cache.

---

## 🛡️ FASE 3: Security Headers

### 3.1 Content Security Policy (CSP)

**Berkas**: [`next.config.ts`](osis-smait-fi/next.config.ts)

Ganti CSP minimal saat ini dengan kebijakan lengkap:
```typescript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval dibutuhkan untuk Next.js dev
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

Tambahkan ke `headers()` di [`next.config.ts`](osis-smait-fi/next.config.ts):
```typescript
{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
{ key: 'X-Content-Type-Options', value: 'nosniff' },
{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
```

---

## ✅ FASE 4: Validasi

### Checklist
- [ ] Jalankan audit Lighthouse mobile — target perf $\ge$ 95
- [ ] Jalankan audit aksesibilitas Lighthouse — target 100
- [ ] Verifikasi tidak ada error konsol terkait CSP
- [ ] Uji fallback `compress-image` saat timeout
- [ ] Verifikasi gambar disajikan sebagai WebP/AVIF
- [ ] Cek cache headers dengan `curl -I`
- [ ] Uji di Chrome, Firefox, dan Safari mobile

---

## 📊 Estimasi Dampak

| Perubahan | Estimasi Dampak Performa |
|--------|---------------------------|
| `force-dynamic` $\rightarrow$ `revalidate=60` | FCP -0.5s, LCP -1.0s |
| `<img>` $\rightarrow$ `<Image>` | Ukuran gambar -50%, LCP -0.5s |
| Dynamic imports d3/gsap | Bundle JS -200 KiB, TBT -20ms |
| AbortController pada API kompresi | Menghilangkan error timeout |
| Cache headers | Pemuatan ulang -80% |
| Security headers | Best Practices $\rightarrow$ 100 |
| Perbaikan kontras | Aksesibilitas $\rightarrow$ 100 |

**Proyeksi Skor Akhir**: Performa **96-98** | Aksesibilitas **100** | Praktik Terbaik **100** | SEO **100**

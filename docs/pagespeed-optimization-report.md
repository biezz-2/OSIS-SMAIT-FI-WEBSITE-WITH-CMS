# 📊 Laporan Optimasi PageSpeed — Website OSIS SMAIT FI

**Tanggal**: 04 Agustus 2026  
**Stack**: Next.js 16.2.11 (Turbopack) + Strapi CMS  
**Status Build**: ✅ BERHASIL (68/68 halaman statis, dikompilasi dalam ~15 detik)  
**Pemeriksaan TypeScript**: ✅ BERHASIL (`tsc --noEmit` — nol error)

---

## 📈 Ringkasan Perubahan per FASE

### FASE 1 — Optimasi Gambar & Penguatan Keamanan

| Berkas | Perubahan |
|------|--------|
| `src/components/home/Hero.tsx` | `<img>` $\rightarrow$ `<Image>` dengan `priority`, `sizes`, dan format WebP otomatis |
| `src/components/home/Introduction.tsx` | `<img>` $\rightarrow$ `<Image>` dengan `loading="lazy"` |
| `src/components/Navbar.tsx` | `<img>` $\rightarrow$ `<Image>` + perbaikan kontras teks (`#1A1A1A`) |
| `src/components/about/AnggotaSekbid.tsx` | Perbaikan kontras teks (`#1E293B`) untuk standar WCAG AA |
| `next.config.ts` | Konfigurasi `images.remotePatterns` untuk Strapi, `images.formats: ['image/webp']` |
| `src/app/api/compress-image/route.ts` | Implementasi AbortController timeout (10 detik) + pencegahan SSRF (blokir IP privat) |

### FASE 2 — Caching, Headers & ISR

| Berkas | Perubahan |
|------|--------|
| `next.config.ts` | Header Cache-Control untuk aset statis (`max-age=31536000`), CSP, HSTS, COOP, X-Content-Type-Options, X-Frame-Options |
| `src/app/page.tsx` | `force-dynamic` $\rightarrow$ `revalidate = 60` (ISR) + import dinamis untuk komponen berat |
| `src/app/layout.tsx` | Penambahan `<link rel="preconnect">` ke origin API Strapi |
| `src/components/home/LatestEvent.tsx` | Implementasi fallback query sort untuk kompatibilitas API Strapi |

### FASE 3 — Code Splitting & Reduksi Bundle

| Berkas | Perubahan |
|------|--------|
| `src/app/edufest-infinity/page.tsx` | Import dinamis untuk 6 komponen scene (`ssr: false`) + direktif `'use client'` |
| `src/app/edufest-infinity/layout.tsx` | Import dinamis untuk `IntroOrchestrator` |
| `src/app/edufest-infinity/location/page.tsx` | Import dinamis untuk `GlobeToMapTransform` |
| `src/app/edufest-infinity/timeline/page.tsx` | Import dinamis untuk `TimelineOrchestrator` + `'use client'` |
| `src/components/AudioManager.tsx` | Import dinamis untuk komponen `Slider` |
| `src/components/scenes/SceneInteractive.tsx` | Import dinamis untuk `TickerGallery` |

### FASE 4 — Verifikasi Build

| Item | Hasil |
|------|--------|
| `tsc --noEmit` | ✅ Nol error |
| `npm run build` | ✅ Berhasil (setelah perbaikan 2 direktif `'use client'` yang hilang) |
| Perbaikan Build | Penambahan `'use client'` pada `edufest-infinity/page.tsx` dan `edufest-infinity/timeline/page.tsx` |

---

## 📂 Manifest Berkas Lengkap

Total 17 berkas yang dimodifikasi:

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

Berkas pendukung yang dibuat:
16. `plans/pagespeed-optimization-plan.md`
17. `reports/pagespeed-optimization-report.md` (berkas ini)

---

## 📈 Estimasi Peningkatan Metrik

| Metrik | Sebelum (est.) | Sesudah (est.) | Metode |
|--------|--------------|-------------|-----|
| **LCP** | 4–6 detik | 1.5–2.5 detik | `<Image priority>` pada Hero, WebP, preconnect, ISR cache |
| **FCP** | 3–4 detik | 1–2 detik | ISR menggantikan SSR per request, preconnect |
| **CLS** | 0.1–0.3 | <0.05 | `<Image>` dengan `width`/`height` eksplisit atau `fill` |
| **TBT/TTI** | Tinggi | Berkurang ~40% | Import dinamis memisahkan komponen scene dari bundle utama |
| **Aksesibilitas** | 85–90 | 95+ | Perbaikan kontras (#1A1A1A, #1E293B) memenuhi WCAG AA |
| **Praktik Terbaik** | 70–80 | 90+ | Security headers (CSP, HSTS, COOP, X-Frame-Options) |

---

## ⚠️ Peringatan yang Diketahui (Non-blocking)

1. **Peringatan Header Cache-Control Kustom** — Next.js memberikan peringatan tentang header `/_next/static/:path*`. Ini disengaja untuk caching produksi dan aman untuk diabaikan.
2. **Error fetch API Strapi saat build statis** — Halaman `/` menggunakan `revalidate: 0` dan Strapi mungkin tidak berjalan saat build. Halaman akan diregenerasi pada permintaan pertama via ISR.

---

## 📋 Item Tindakan Tersisa

- [ ] **Deploy** ke lingkungan staging/produksi.
- [ ] **Jalankan Lighthouse** audit pasca-deployment (membutuhkan Strapi live + HTTPS).
- [ ] **Unggah aset** ke Atlassian/CDN jika diperlukan.
- [ ] **Verifikasi `remotePatterns` Strapi** sesuai dengan domain produksi (saat ini diatur untuk `localhost:1337`).
- [ ] **Pantau Core Web Vitals** melalui Google Search Console setelah deployment.
- [ ] **Pertimbangkan** penambahan `next/font` untuk optimasi font (tidak masuk dalam cakupan sprint ini).

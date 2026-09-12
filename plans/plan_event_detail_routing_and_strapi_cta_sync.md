# Rencana Kerja: Perbaikan Bug 404 Detail Event & Standardisasi Routing CTA Strapi

## 1. Ringkasan Masalah & Root Cause Analysis
- **Gejala**: Akses ke detail event `https://osissmaitfi.biezz.my.id/events/guidelight` menghasilkan error **404 This page could not be found**.
- **Penyebab Utama**:
  1. Pada database Strapi (`events`), data event **Guidelight** memiliki:
     - `nama`: `"Guidelight"`
     - `slug`: `"event"` *(default/salah input saat pembuatan di Strapi)*
     - `cta_url`: `"https://osissmaitfi.biezz.my.id/events/guidelight"`
  2. Di komponen `EventCard.tsx`, tombol *View Event Details* mengutamakan `cta_url`, sehingga mengarahkan browser ke `/events/guidelight`.
  3. Dynamic route Next.js `src/app/events/[slug]/page.tsx` menerima `slug = "guidelight"`.
  4. Fungsi `fetchEventBySlug("guidelight")` melakukan request API:
     `/api/events?filters[slug][$eq]=guidelight&populate=*`
     Karena di Strapi slug-nya adalah `"event"`, Strapi mengembalikan array kosong `[]`, memicu `notFound()` (404).

## 2. Tujuan & Spesifikasi
1. Semua event menggunakan struktur path standar:
   `https://osissmaitfi.biezz.my.id/events/[nama-event-di-kolom-cta]`
2. Sinkronisasi otomatis antara kolom `cta_url` dan `slug` di Strapi CMS agar tidak terjadi inkonsistensi input manusia di masa mendatang.
3. Resilience pada resolver Next.js: pencarian detail event mendukung pencarian via `slug` maupun ekstraksi dari `cta_url` (dual-lookup `$or`).

## 3. Rencana Langkah Implementasi Terstruktur

### Fase 1: Perbaikan Data di Database Strapi (Quick Patch)
- Update entry Guidelight (draft dan published) di database Strapi agar field `slug` diselaraskan menjadi `'guidelight'`.
- Validasi endpoint `/api/events?filters[slug][$eq]=guidelight` mengembalikan HTTP 200 dengan data lengkap.

### Fase 2: Sinkronisasi Otomatis di Strapi Backend (Lifecycles Hook)
- Buat lifecycle hook di `strapi-cms/src/api/event/content-types/event/lifecycles.ts`:
  - Hook `beforeCreate` & `beforeUpdate`:
    1. Jika field `cta_url` diisi URL seperti `https://osissmaitfi.biezz.my.id/events/:eventName`:
       - Ekstrak `:eventName` dan set otomatis ke field `slug`.
    2. Jika `cta_url` kosong atau hanya nama event yang diisi di `slug`:
       - Otomatis format `cta_url = https://osissmaitfi.biezz.my.id/events/${slug}` (kecuali event khusus seperti `edufest-infinity`).
    3. Normalisasi format `cta_url` agar selalu menggunakan domain resmi dan huruf kecil/kebab-case yang valid.

### Fase 3: Peningkatan Resolusi Route di Frontend Next.js
- File: `osis-smait-fi/src/lib/strapi.ts`
  - Perbarui `fetchEventBySlug(slug: string)`:
    Gunakan filter Strapi `$or`:
    - `filters[$or][0][slug][$eq]=${slug}`
    - `filters[$or][1][cta_url][$contains]=/events/${slug}`
- File: `osis-smait-fi/src/components/events/EventCard.tsx`
  - Normalisasi target URL agar jika admin memasukkan full URL `https://osissmaitfi.biezz.my.id/events/...`, komponen me-render link internal Next.js `/events/...` untuk prefetching dan transisi SPA yang mulus.
- File: `osis-smait-fi/src/app/events/[slug]/page.tsx`
  - Periksa kesesuaian relasi "Other Events" agar tetap merujuk ke rute standar.

### Fase 4: Pengujian & Verifikasi End-to-End
- Uji coba akses live:
  - `https://osissmaitfi.biezz.my.id/events`
  - `https://osissmaitfi.biezz.my.id/events/gema-merdeka` (Existing Event)
  - `https://osissmaitfi.biezz.my.id/events/guidelight` (Fix 404)
  - `https://osissmaitfi.biezz.my.id/edufest-infinity` (Special Subsite)
- Uji coba simpan/update event di admin Strapi untuk memastikan lifecycles hook berjalan otomatis.

### Fase 5: Dokumentasi, Commit, & Notifikasi
- Update `CHANGELOG.md` dan `docs/CHANGELOG/CHANGELOG.md`.
- Kirim notifikasi rencana ke Slack `#plan` (`C0BV62M28PP`).
- Catat keputusan ke `mcp__langgraph-memory`.

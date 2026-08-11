# 📑 Laporan Analisis Sistem: Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025)

> **Tanggal Analisis**: 11 Agustus 2026
> **Versi Sistem**: 1.6.0
> **Status**: Produksi — Aktif di [osissmaitfithrahinsani.sch.id](https://osissmaitfithrahinsani.sch.id)

Laporan analisis ini disusun secara komprehensif untuk memberikan pandangan menyeluruh mengenai arsitektur, estetika visual, pengalaman interaksi pengguna, serta kualitas implementasi teknis pada portal web **OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara)**.

---

## 📌 1. Pendahuluan & Ringkasan Eksekutif

Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara) dikembangkan bukan sekadar sebagai situs profil statis sekolah, melainkan sebagai platform digital interaktif bereputasi tinggi.

**Stack Teknologi Utama:**

| Layer | Teknologi | Versi |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router) | 16.2.11 |
| **Backend CMS** | Strapi Headless CMS | 5.51.0 |
| **Runtime** | React | 19.2.4 |
| **Bahasa** | TypeScript | ^5 |
| **Styling** | Tailwind CSS | ^4 |
| **Animasi** | GSAP + Framer Motion | 3.15.0 / 12.43.0 |
| **Scroll** | Lenis (Smooth Scroll) | 1.3.25 |
| **3D/Map** | D3.js + Topojson | 7.9.0 |
| **Server Manager** | PM2 | — |
| **Database CMS** | SQLite (dev) / MySQL & PostgreSQL (prod) | — |

**Domain Produksi:**
- Frontend: `https://osissmaitfithrahinsani.sch.id` (Port 3002)
- Strapi CMS: `https://osisstrapi.biezz.my.id` (Port 1337)

---

## 🗂️ 2. Struktur Halaman (Routes) & Peta Konten

Aplikasi menggunakan **Next.js App Router** dengan struktur rute sebagai berikut:

```text
src/app/
├── page.tsx                        → Beranda (/)
├── layout.tsx                      → Root Layout (metadata, font, context)
├── sitemap.ts                      → Sitemap XML otomatis
├── robots.ts                       → Robots.txt
├── globals.css                     → Global stylesheet (Tailwind)
├── about/                          → Halaman Tentang Kami (/about)
├── anggota/                        → Halaman Anggota OSIS (/anggota)
├── program-kerja/
│   ├── page.tsx                    → Daftar Program Kerja (/program-kerja)
│   └── [slug]/                     → Detail Proker (/program-kerja/[slug])
├── sekbid/
│   ├── [sekbidId]/                 → Detail Sekbid generik
│   ├── sekbid-1/ hingga sekbid-8/  → 8 Rute Seksi Bidang statis
├── galeri/
│   └── galeri-preview-infinity/    → Galeri Foto Infinity 2D (/galeri/galeri-preview-infinity)
├── edufest-infinity/
│   ├── page.tsx                    → Portal Event Edufest (/edufest-infinity)
│   ├── location/                   → Sub-halaman lokasi
│   ├── panitia/                    → Sub-halaman panitia
│   └── timeline/                   → Sub-halaman timeline acara
├── media-sosial/                   → Media Sosial Hub (/media-sosial)
└── api/
    ├── compress-image/             → API Route: kompresi gambar on-the-fly
    ├── preview/                    → API Route: Strapi Draft Preview
    └── exit-preview/               → API Route: keluar dari mode preview
```

---

## 🎨 3. Analisis UI/UX (Estetika & Antarmuka)

Aspek desain visual situs ini mengusung estetika premium yang dirancang untuk memberikan impresi pertama yang kuat kepada pengguna (*wow effect*).

| Parameter UI/UX | Implementasi di Sistem | Dampak & Nilai Estetika |
| :--- | :--- | :--- |
| **Bahasa Desain** | Minimalis, Modern, Elegan | Terlihat profesional, bersih, dan berstandar internasional. |
| **Skema Warna** | *HSL Tailored Blues* (`#185FA5` & `#0F2D4A`) + *Dark Overlays* + *Pure White* + Accent `#AACDDC` | Memberikan kesan formal akademik sekaligus modern, berteknologi tinggi, serta ramah di mata. |
| **Efek Glassmorphism** | Penerapan `backdrop-blur` pada navbar, modal kartu, dan detail program kerja | Memberikan kedalaman visual (*visual depth*) yang modern dan menyatu dengan latar belakang. |
| **Tipografi** | Font: **Geist Sans** (body), **Playfair Display** (display), **Great Vibes** (accent), **Inter** (UI) | Keterbacaan tinggi di semua resolusi, kombinasi elegant serif dan modern sans-serif. |
| **Ikon** | **Lucide React** v1.27.0 | Visual ikon yang konsisten dan minimalis. |
| **Responsivitas** | Grid layout fleksibel Tailwind CSS v4 dengan breakpoint mobile/desktop terstruktur | Pengalaman konsisten dari ultra-wide hingga layar ponsel. |
| **Komponen Gambar** | `next/image` dengan format AVIF & WebP, lazy-loading otomatis | Gambar dioptimasi otomatis, CLS minimal, performa tinggi. |

### Variabel Font yang Didaftarkan (Root Layout):
```ts
--font-geist-sans, --font-geist-mono, --font-playfair, --font-great-vibes, --font-inter
```

---

## ⚡ 4. Analisis Pengalaman Pengguna (UX) & Animasi Imersif

### A. WebGL 3D Globe & Transformasi Proyeksi (`src/components/globe/`)
- **Mekanisme**: Dibuat menggunakan **D3.js** dan **Topojson-client**. Bumi 3D interaktif yang berputar secara otomatis (`requestAnimationFrame`) dapat bertransisi menjadi peta 2D saat difokuskan pada koordinat lokasi SMAIT Fithrah Insani.
- **Analisis UX**: Mengubah penyampaian informasi lokasi sekolah konvensional menjadi pengalaman eksplorasi geografis yang interaktif.

### B. Galeri Foto Fisika 2D Tak Terbatas (`/galeri/galeri-preview-infinity`)
- **Mekanisme**: Kisi foto *infinite masonry* yang didorong oleh *inertial momentum engine* kustom. Pengguna dapat menggeser, menyentuh, dan memperbesar foto dengan kelembaman gesekan menyerupai perilaku native iOS.
- **Caching Dimensi**: Sistem menyimpan aspek rasio gambar di `localStorage` (`gallery_dimensions_cache`) untuk mencegah CLS saat buka ulang.

### C. Smooth Scroll & Orkestrasi Timeline GSAP (`src/lib/lenis.ts`, `src/lib/gsap.ts`)
- **Lenis Scroll**: Memastikan inersia gulir terasa lembut dan seragam di semua browser.
- **GSAP Timeline**: Mengoordinasikan fase pemuatan halaman: *loading screen* $\rightarrow$ *wireframe stage* $\rightarrow$ *reveal stage*.

### D. Fitur Interaksi Mikro
- **Cursor Particle Trail** (`src/components/CursorParticles.tsx`): Partikel cahaya mengikuti kursor menggunakan algoritma **Poisson Disk Sampling** (`src/lib/poisson-disk.ts`) agar sebaran partikel terlihat natural.
- **AudioManager** (`src/components/AudioManager.tsx`): Musik latar (`bg-soundtrack`) dengan slider volume. Tidak berbunyi hingga interaksi klik pertama pengguna (mematuhi kebijakan browser modern).

### E. Image Quality Context (`src/context/ImageQualityContext.tsx`)
- **Kompresi Dinamis**: Setiap gambar dari Strapi dilewatkan melalui API Route `/api/compress-image?url=...&q=[quality]` untuk kompresi on-the-fly.
- **Konfigurasi dari CMS**: Nilai `enable_compression` dan `compression_quality` dibaca langsung dari Strapi `halaman/home`.
- **Dampak**: Admin OSIS dapat mengatur kualitas gambar situs tanpa menyentuh kode.

---

## 🛠️ 5. Analisis Arsitektur Teknis & Integrasi Strapi

### A. Client API Strapi (`src/lib/strapi.ts`)

File ini adalah **central API client** yang berisi seluruh fungsi helper untuk berkomunikasi dengan Strapi:

| Fungsi | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `fetchStrapiAPI<T>()` | Generic | Fetch helper utama dengan dukungan Draft Mode & auto sanitize URL |
| `getStrapiMediaUrl()` | — | Resolver URL media dengan fallback & sanitize http$\rightarrow$https |
| `fetchMediaAssetByKey()` | `/api/media-assets` | Ambil 1 aset media berdasarkan key unik |
| `fetchMediaAssetsByCategory()` | `/api/media-assets` | Ambil semua aset berdasarkan kategori |
| `fetchSekbidFromStrapi()` | `/api/sekbids` | Ambil detail Seksi Bidang + relasi Program Kerja |
| `fetchProgramKerjaFromStrapi()` | `/api/program-kerjas` | Ambil detail Program Kerja by slug (deep populate) |
| `fetchHalamanFromStrapi()` | `/api/halamans` | Ambil metadata halaman dinamis by slug |
| `fetchBPHAnggotaFromStrapi()` | `/api/anggota-oses` | Ambil anggota BPH/Inti saja |
| `fetchEventsFromStrapi()` | `/api/events` | Ambil daftar event terbaru |
| `fetchAllAnggotaFromStrapi()` | `/api/anggota-oses` | Ambil semua anggota aktif (maks. 200) |
| `fetchAllSekbidsFromStrapi()` | `/api/sekbids` | Ambil semua sekbid |
| `formatBPHMembers()` | — | Formatter data BPH ke `TeamMember[]` |
| `formatSekbidList()` | — | Formatter data Sekbid ke `SeksiBidang[]` |

### B. Content Types Strapi yang Terintegrasi

| Content Type | Endpoint Strapi | Data yang Dikelola |
| :--- | :--- | :--- |
| `AnggotaOsis` | `/api/anggota-oses` | Data pengurus: nama, jabatan, divisi (BPH/Sekbid_1-8), foto, urutan |
| `Event` | `/api/events` | Nama event, tema, deskripsi, banner, tanggal, slug, cta_url |
| `ProgramKerja` | `/api/program-kerjas` | Judul, slug, tujuan, dokumentasi, banner, relasi sekbid & PJ |
| `Sekbid` | `/api/sekbids` | Nomor, judul, deskripsi/visi, banner, relasi program kerja |
| `GaleriFoto` | `/api/galeri-fotos` | Koleksi foto kegiatan |
| `MediaAsset` | `/api/media-assets` | Aset media keyed (bg-soundtrack, logo, banner) |
| `Halaman` | `/api/halamans` | Metadata halaman: judul_hero, sub_judul, SEO fields, kompresi gambar |
| `ArtikelMading` | `/api/artikel-madings` | Artikel majalah dinding digital |

### C. Strategi Rendering per Halaman

| Halaman | Strategi Rendering | Revalidasi |
| :--- | :--- | :--- |
| `/` (Beranda) | **ISR** (Incremental Static Regeneration) | 60 detik |
| `/anggota` | **SSR** (force-dynamic) | Per request |
| `/sekbid/[sekbidId]` | **SSR** | Per request |
| `/program-kerja/[slug]` | **SSR** | Per request |
| `/edufest-infinity` | **SSR** | Per request |
| Komponen client-side | **CSR** (useEffect + fetchStrapiAPI) | Real-time |

### D. Security Headers (`next.config.ts`)

Konfigurasi security headers yang diterapkan ke semua rute:
- `Content-Security-Policy` — Membatasi sumber script, style, gambar, font, dan frame.
- `Strict-Transport-Security` — HSTS dengan max-age 1 tahun.
- `X-Content-Type-Options` — nosniff.
- `X-Frame-Options` — SAMEORIGIN (mendukung Strapi live preview).
- `Cross-Origin-Opener-Policy` — same-origin.
- `Referrer-Policy` — strict-origin-when-cross-origin.
- `Permissions-Policy` — Menonaktifkan kamera, mikrofon, geolokasi.

### E. Deployment (PM2 Ecosystem)

```js
// ecosystem.config.js
apps: [
  { name: 'osis-strapi-backend', port: 1337, cwd: './strapi-cms' },
  { name: 'osis-next-frontend', port: 3002, cwd: './osis-smait-fi' },
]
```

---

## 🧩 6. Analisis Komponen Utama

### Halaman Beranda (`/`)
- **Hero** (`src/components/home/Hero.tsx`): Banner utama dengan data dinamis dari `Halaman` CMS.
- **LatestEvent** (`src/components/home/LatestEvent.tsx`): Menampilkan event terbaru dari Strapi secara *client-side* dengan fallback sort (`tanggal_mulai:desc` $\rightarrow$ `createdAt:desc`). Mendukung `cta_url` kustom dari CMS.
- **Introduction** (`src/components/home/Introduction.tsx`): Seksi pengenalan organisasi.

### Halaman Anggota (`/anggota`)
- **AnggotaList** (`src/components/anggota/AnggotaList.tsx`): Komponen besar yang menangani:
  - Ketua OSIS: Featured card dengan foto 4:5.
  - Pengurus Inti (BPH): Grid 3 kolom dengan icon badge warna.
  - Seksi Bidang 1–8: Grid card dengan avatar stack, deskripsi, dan link "View Team".
  - Navigasi sticky sidebar kiri (scroll-to-section).
  - Data dikonfigurasi dari Strapi dengan fallback ke data lokal `divisionMeta`.

### Komponen Global
- **Navbar** (`src/components/Navbar.tsx`): Navigasi utama.
- **Footer** (`src/components/Footer.tsx`): Footer lengkap dengan tautan sosial.
- **LivePreviewListener** (`src/components/LivePreviewListener.tsx`): Listener untuk Strapi Draft Preview Mode.
- **Slider** (`src/components/Slider.tsx`): Komponen slider generik.
- **TickerGallery** (`src/components/TickerGallery.tsx`): Ticker bergulir otomatis.

---

## 🚀 7. Temuan Masalah & Status Rekomendasi Optimasi

| # | Temuan | Rekomendasi | Status |
| :--- | :--- | :--- | :--- |
| 1 | Beberapa komponen masih menggunakan `<img>` HTML standar | Migrasi ke `next/image` (WebP/AVIF otomatis) | ⚠️ Sebagian sudah |
| 2 | D3.js & Topojson dimuat di first page load | Gunakan `next/dynamic` dengan `{ ssr: false }` | ✅ Selesai |
| 3 | Fallback jika Strapi offline masih blank | Tambahkan `error.tsx` + mock data statis | ⚠️ Belum implementasi |
| 4 | Belum ada PWA | Tambahkan `next-pwa` dengan service worker | ✅ Selesai |
| 5 | `sitemap.ts` bersifat statis | Tambahkan rute dinamis sekbid & proker | ⚠️ Belum dinamis |
| 6 | `AnggotaList.tsx` sangat besar | Pecah ke sub-komponen (`KetuaCard`, `BPHGrid`, `SekbidGrid`) | ⚠️ Belum refaktor |
| 7 | `force-dynamic` pada `/anggota` menonaktifkan ISR | Pertimbangkan ISR dengan revalidate 60s | ⚠️ Review diperlukan |

---

## 📊 8. Metrik & Target Performa

| Metrik | Target | Tools |
| :--- | :--- | :--- |
| **Lighthouse Performance** | $\ge$ 90 | Lighthouse CI |
| **Core Web Vitals - LCP** | < 2.5 detik | PageSpeed Insights |
| **Core Web Vitals - CLS** | < 0.1 | WebPageTest |
| **Core Web Vitals - FID/INP** | < 200ms | Chrome UX Report |
| **Accessibility Score** | $\ge$ 85 | axe DevTools |
| **SEO Score** | 100 | Lighthouse |

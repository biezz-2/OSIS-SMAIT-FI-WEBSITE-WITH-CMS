# 📜 Changelog — OSIS SMAIT Fithrah Insani (Agora Acta)

Semua perubahan penting pada proyek **Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara)** didokumentasikan di berkas ini.

Format changelog ini mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.6.0] - 2026-08-11

### 🚀 Ditambahkan
- **Sistem Sinkronisasi MySQL ke SQLite Background Worker**:
  - Script otomatisasi `sync-db.js` disinkronkan secara periodik via background child process pada startup server Strapi.
  - Sinkronisasi tabel `admin_permissions`, `admin_roles`, `anggota_oses`, `program_kerjas`, `files`, dan data Strapi CMS lainnya.
- **Pembaruan & Restrukturisasi Dokumentasi Workspace**:
  - Berkas `README.md` utama dibuat di root workspace untuk memandu pengoperasian multi-paket (`osis-smait-fi`, `strapi-cms`, `other-program/`).
  - Berkas `CHANGELOG.md` utama ditambahkan pada akar direktori proyek.

---

## [1.5.0] - 2026-08-05

### 🚀 Ditambahkan
- **Integrasi Event Infinity Edufest & Strapi CMS v5**:
  - Sinkronisasi penuh portal `/edufest-infinity` dengan Strapi Headless CMS (skema `Event`, `MediaAsset`, data seeding `seed.ts`).
  - Fitur modal pendaftaran kompetisi & event secara dinamis.
- **Analisis Multi-Proyek Workspace**:
  - Dokumentasi resmi dan integrasi 4 proyek: `osis-smait-fi`, `strapi-cms`, `other-program/infinity-edufest`, dan `other-program/edufest-infinity-link-in-bio-boilerplate`.

### 🐛 Diperbaiki
- **Perbaikan Tooltip Clipping (`AnggotaList.tsx`)**:
  - Perbaikan z-index & overflow stacking context pada tooltip media sosial anggota OSIS.
- **Perbaikan Mobile Navbar Scroll Lock**:
  - Mencegah pergeseran horisontal dan layout overflow pada navbar versi mobile.
- **Penyesuaian Warna Dark Mode**:
  - Harmonisasi warna teks, border, dan latar belakang kartu anggota/sekbid pada mode gelap.

---

## [1.4.0] - 2026-08-04

### 🚀 Ditambahkan
- **Dukungan Progressive Web App (PWA)**:
  - Penambahan service worker (`public/sw.js`) dengan strategi caching *stale-while-revalidate* untuk aset statis lokal.
  - Pendaftaran service worker di `RootLayout` (`layout.tsx`) dan konfigurasi berkas `manifest.json`.
- **Pencarian Global & Member-to-Proker Routing** (`src/lib/search.ts`):
  - Pencarian paralel dinamis untuk data Program Kerja, Seksi Bidang, dan Anggota OSIS dari database Strapi CMS.
  - Implementasi *intelligent routing* untuk penanggung jawab (PJ) program kerja: jika hasil pencarian anggota yang diklik adalah PJ dari proker tertentu, navigasi otomatis mengarah ke halaman detail program kerja tersebut.
- **Konfigurasi Background Texture Dinamis**:
  - Penambahan helper `fetchBgTextureConfig()` di `src/lib/strapi.ts` untuk mengambil konfigurasi dari backend Strapi.
  - Penambahan komponen `GlobalBgTexture` di `RootLayout` untuk merender background texture secara dinamis.
- **Strapi CMS Core Bootstrap & DB Sync**:
  - Konfigurasi otomatis RBAC untuk peran *Chief Editor* dan *Content Contributor* saat inisialisasi server di `strapi-cms/src/index.ts`.
  - Penjadwalan sinkronisasi database MySQL secara periodik via background worker `child_process.fork()`.

### 🔄 Diubah
- **Tata Letak & Scrolling Mobile**:
  - Penyesuaian `Navbar.tsx` untuk mencegah scrolling body utama saat drawer navigasi mobile terbuka (`overflow: hidden`).
- **Konsistensi Tema & Estetika**:
  - Pembaruan `globals.css` dengan penataan ulang variabel HSL dan rules `html.dark` untuk memastikan kontras tinggi yang konsisten pada semua komponen.

---

## [1.3.0] - 2026-08-04

### 🚀 Ditambahkan
- **Halaman Anggota OSIS Premium (`/anggota`)** (`AnggotaList.tsx`):
  - Featured card Ketua OSIS dengan foto 4:5 dan dekorasi rotated box.
  - Grid Pengurus Inti (BPH) 3 kolom dengan icon badge warna dinamis.
  - Grid Seksi Bidang 1–8 dengan avatar stack, deskripsi CMS, dan link "View Team".
  - Sticky sidebar kiri (desktop) dengan navigasi scroll-to-section per divisi.
- **Dynamic Image Compression API** (`/api/compress-image`):
  - Kompresi gambar on-the-fly melalui Next.js API Route.
  - Kualitas dapat dikonfigurasi langsung dari Strapi CMS (`halaman/home`).
- **ImageQualityContext** (`src/context/ImageQualityContext.tsx`):
  - Provider React context global untuk manajemen kualitas kompresi gambar.
  - Fungsi `getOptimizedImageUrl()` digunakan oleh semua komponen gambar Strapi.
- **Strapi Draft Preview Mode**:
  - API routes `/api/preview` dan `/api/exit-preview`.
  - `LivePreviewListener.tsx` untuk auto-refresh saat konten Strapi diubah.
  - `fetchStrapiAPI()` otomatis menambahkan `?status=draft` saat cookie preview aktif.
- **Security Headers Komprehensif** (`next.config.ts`):
  - Implementasi CSP, HSTS, X-Frame-Options, Referrer-Policy, dan Permissions-Policy.
- **Optimasi SEO**:
  - `generateMetadata()` dinamis pada `/anggota` dan halaman lainnya.
  - JSON-LD Schema.org `EducationalOrganization` di Beranda.
  - Generator otomatis `sitemap.ts` dan `robots.ts`.
  - Preconnect dan DNS prefetch ke domain Strapi di Root Layout.
- **Komponen LatestEvent** dengan CTA URL kustom dari Strapi dan dual-sort fallback.

### 🔄 Diubah
- **Strategi Rendering Beranda (`/`)**: Diubah dari `force-dynamic` ke **ISR revalidate 60 detik** untuk optimasi performa.
- **Komponen `LatestEvent`**: Migrasi ke `next/image` dengan lazy-loading dan `sizes` responsif.
- **`fetchStrapiAPI()`**: Refaktorisasi dengan auto-sanitize URL (http$\rightarrow$https) dan kompatibilitas format Strapi v4/v5.
- **Dokumentasi (`docs/`)**: Pembaruan menyeluruh pada ARCHITECTURE.md, SYSTEM_ANALYSIS.md, dan CHANGELOG.md.

### 🐛 Diperbaiki
- Perbaikan sorting event yang gagal jika field `tanggal_mulai` tidak terekspos (fallback ke `createdAt`).
- Perbaikan null-safety pada komponen AnggotaList saat data Strapi CMS kosong.

---

## [1.2.0] - 2026-07-29

### 🚀 Ditambahkan
- **Integrasi Strapi v5 Headless CMS**:
  - Koneksi API client Next.js (`/lib/strapi.ts`) untuk data dinamis Seksi Bidang, Program Kerja, Anggota Pengurus, dan Event Utama.
  - Skema Tipe Data TypeScript lengkap untuk entitas CMS.
- **Manajemen Logo & Media Strapi**:
  - Dukungan upload & konfigurasi Logo OSIS, Logo Sekolah, dan Ikon Sekbid melalui Strapi Media Library.
  - Penanganan komponen display video dan fleksibilitas format media (MP4/WebM/Images).
- **Sistem Caching Galeri Infinity 2D**:
  - Implementasi caching dimensi & aspek rasio gambar di `localStorage['gallery_dimensions_cache']` untuk optimasi momentum panning/zooming physics.

### 🔄 Diubah
- **Refaktorisasi Halaman & Navigasi**:
  - Integrasi bagian media sosial agar menyatu harmonis dengan Footer dan Social Media Hub.
  - Optimasi responsivitas mobile navbar dan transisi glassmorphism.
- **Restrukturisasi Dokumentasi**:
  - Pemisahan riwayat rilis ke `docs/CHANGELOG/` dan catatan pembaruan fitur ke `docs/UPDATE/`.

### 🐛 Diperbaiki
- Perbaikan isu tampilan overlay video pada kartu event Strapi.
- Perbaikan penanganan fallback saat data gambar dari Strapi CMS tidak tersedia.

---

## [1.1.0] - 2026-07-26

### 🚀 Ditambahkan
- **Halaman Galeri Interaktif (`/galeri/galeri-preview-infinity`)**:
  - Tampilan foto berbasis kisi tak terbatas (infinite grid) dengan efek gesture touch/pan/zoom ala iOS.
  - Modal Lightbox untuk pratinjau foto resolusi tinggi.
- **Halaman Detail Seksi Bidang (`/sekbid/[id]`) & Program Kerja (`/sekbid/.../[slug]`)**:
  - Rute dinamis untuk mengulas visi, daftar proker, target pencapaian, dan tautan evaluasi presensi.

---

## [1.0.0] - 2026-07-25

### 🚀 Ditambahkan
- Rilis perdana **Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara)**.
- Halaman Beranda (`/`), Tentang Kami (`/about`), Program Kerja (`/program-kerja`), Anggota (`/anggota`), dan Media Sosial (`/media-sosial`).
- Modern UI Design System dengan Tailwind CSS v4, Google Fonts, dan mikro-animasi fluid.
- Halaman Portal Edufest Infinity (`/edufest-infinity`) dengan WebGL 3D Globe, GSAP timeline, Lenis smooth scroll, dan AudioManager.
- Komponen CursorParticles dengan algoritma Poisson Disk Sampling.
- Konfigurasi PM2 ecosystem untuk dual-server deployment (Next.js + Strapi).

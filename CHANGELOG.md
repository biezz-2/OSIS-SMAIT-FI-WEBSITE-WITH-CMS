# 📜 Changelog — OSIS SMAIT Fithrah Insani (Agora Acta)

Semua perubahan penting pada proyek **Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara)** didokumentasikan di berkas ini.

Format changelog ini mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.7.0] - 2026-08-12

### 🚀 Ditambahkan
- **Analisis Komprehensif Ekosistem**:
  - Pembuatan dokumen `docs/analisis_akhir_agora_acta.md` yang merangkum arsitektur sistem, analisis komponen teknis (Frontend & Backend), serta rekomendasi pengembangan.
- **Audit Struktur Proyek**:
  - Verifikasi menyeluruh terhadap integrasi Next.js 16, Strapi v5, dan mekanisme deployment PM2.

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

---

## [1.3.0] - 2026-08-04

### 🚀 Ditambahkan
- **Halaman Anggota OSIS Premium (`/anggota`)**:
  - Featured card Ketua OSIS dengan foto 4:5 dan dekorasi rotated box.
  - Grid Pengurus Inti (BPH) 3 kolom dengan icon badge warna dinamis.
  - Grid Seksi Bidang 1–8 dengan avatar stack, deskripsi CMS, dan link "View Team".
- **Dynamic Image Compression API** (`/api/compress-image`):
  - Kompresi gambar on-the-fly melalui Next.js API Route.
- **ImageQualityContext**:
  - Provider React context global untuk manajemen kualitas kompresi gambar.
- **Strapi Draft Preview Mode**:
  - API routes `/api/preview` dan `/api/exit-preview`.

---

## [1.0.0] - 2026-07-25

### 🚀 Ditambahkan
- Rilis perdana **Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara)**.

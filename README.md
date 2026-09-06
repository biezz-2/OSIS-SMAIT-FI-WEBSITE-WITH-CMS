# 🎓 OSIS SMAIT Fithrah Insani — Agora Acta 2025

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Strapi](https://img.shields.io/badge/Strapi-v5.x-purple?style=for-the-badge&logo=strapi)](https://strapi.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **Satu platform sentral untuk seluruh informasi, agenda, transparansi kepengurusan, dan dokumen sidang OSIS SMAIT Fithrah Insani periode Agora Acta.**

Portal ini menyelesaikan masalah klasik organisasi siswa: informasi kegiatan tercecer di grup chat, dokumentasi LPJ hilang saat pergantian periode, dan proses musyawarah besar yang sulit diakses secara transparan. Dibangun dengan Next.js 16 (App Router), Strapi v5 Headless CMS, dan PostgreSQL 16.

---

## ⚡ Nilai Utama Platform

| Masalah Organisasi | Solusi di Agora Acta | Manfaat Nyata |
|---|---|---|
| **LPJ & Anggaran Tertutup / Rentan Bocor** | **Dual-Layer MUBES System**: Data publik dapat diakses siapa saja, data sensitif (nota, sisa anggaran, evaluasi) diamankan dengan Clerk Auth + Strapi RBAC. | Transparansi akuntabel tanpa risiko kebocoran data internal ke publik. |
| **Pembaruan Berita & Event Butuh Deploy Kode** | **Strapi v5 Headless CMS**: Pengurus memperbarui artikel, poster event, dan info divisi via dashboard visual. | Publikasi konten dalam 2 menit tanpa menyentuh terminal atau source code. |
| **Tampilan Website Kaku & Membosankan** | **Immersive UI & WebGL Experience**: Animasi fluid GSAP, smooth scroll Lenis, 3D Globe Edufest, dan galeri foto infinite canvas. | Representasi branding modern yang mencerminkan kualitas siswa SMAIT FI. |
| **Kehilangan Riwayat Perubahan Anggaran** | **Global Audit Trail Middleware**: Setiap perubahan, publikasi, dan penghapusan data di CMS tercatat otomatis. | Rekam jejak kepengurusan lengkap dan dapat diaudit kapan saja. |

---

## 🧭 Navigasi Cepat

- [✨ Modul & Fitur](#-modul--fitur)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
- [🚀 Panduan Memulai (Quick Start)](#-panduan-memulai-quick-start)
- [🔐 Sistem Keamanan & MUBES](#-sistem-keamanan--mubes)
- [📦 Struktur Direktori](#-struktur-direktori)
- [📚 Indeks Dokumentasi](#-indeks-dokumentasi)
- [🤝 Berkontribusi](#-berkontribusi)

---

## ✨ Modul & Fitur

### 1. 🏠 Publik & Interaksi Siswa
- **Beranda (`/`)**: Hero banner dinamis, sorotan kegiatan terdekat (`LatestEvent`), pengenalan kepengurusan, dan footer navigasi cepat.
- **Profil Agora Acta (`/about`)**: Filosofi nama kepengurusan, arti lambang, dan jajaran pengurus Badan Pengurus Harian (BPH).
- **Struktur Anggota (`/anggota`)**: Direktori 65 anggota OSIS dengan filter 8 Seksi Bidang, kartu profil interaktif, dan sticky drawer navigasi divisi.
- **Program Kerja (`/program-kerja`)**: Kalender kerja rutinan dan insidental per divisi dengan status progres real-time.
- **Eksplorasi Event (`/events` & `/events/[slug]`)**: Halaman arsip dan detail kegiatan lengkap dengan rundown, dokumentasi visual, dan registrasi.
- **Galeri Foto Infinity (`/galeri` & `/galeri/galeri-preview-infinity`)**: Galeri foto berbasis 2D canvas dengan panning physics dan client-side dimension caching.
- **Pusat Media Sosial (`/media-sosial`)**: Integrasi terpadu Instagram, TikTok, YouTube, dan pemutar podcast Spotify via parser RSS kustom.
- **Kemitraan & Sponsor (`/partners`)**: Portal etalase kolaborasi, profil mitra, dan formulir pengajuan sponsorship.

### 2. 🌌 Portal Edufest Infinity (`/edufest-infinity`)
- **Interactive 3D WebGL Globe**: Peta bola dunia interaktif menggunakan Three.js, D3.js, dan TopoJSON untuk menampilkan lokasi acara.
- **Scene Naratif Multi-Tahap**: Transisi timeline horizontal bertenaga GSAP dan background audio controller.

### 3. 🏛️ Portal Musyawarah Besar (MUBES) Dual-Layer (`/portal-mubes`)
- **Akses Publik**: Ringkasan umum sidang, jadwal pleno, dan resume capaian program kerja.
- **In-Place Secure Expansion (`Ctrl+Shift+M`)**: Modal otentikasi Clerk langsung membuka dokumen LPJ tertutup, laporan anggaran, dan nota pertanggungjawaban tanpa redirect halaman (Zero Cumulative Layout Shift / CLS = 0).

---

## 🏗️ Arsitektur Sistem

```text
[ Browser / Klien ]
       │
       ▼
[ Next.js 16 App Router (BFF Layer) ]
   ├── Rute Publik (ISR / SSR Cache 60s)
   ├── Rute Tertutup (/api/mubes/lpj/[slug] + Clerk Session Token)
   └── Webhook Listener (/api/webhooks/clerk + Svix Signature Verification)
       │
       ▼ (Privat: HTTP Token Bearer)
[ Strapi v5 Headless CMS ]
   ├── Document Service Middleware (Audit Trail CUD Logging)
   └── RBAC (Public: 403 untuk dokumen rahasia, Authenticated: Restricted)
       │
       ▼
[ PostgreSQL 16 Database ] (Port 5433: 44 skema, 1.248 entitas, 1.218 media assets)
```

---

## 🚀 Panduan Memulai (Quick Start)

Jalankan proyek di mesin lokal Anda dalam 4 langkah:

### 1. Prasyarat Sistem
- **Node.js**: `v20.x` atau `v22.x` (LTS direkomendasikan)
- **Package Manager**: `npm` versi 10+
- **Database**: PostgreSQL 16 (atau Docker Desktop jika menggunakan container)

### 2. Kloning Repositori
```bash
git clone https://github.com/biezz-2/OSIS-SMAIT-FI-WEBSITE-WITH-CMS.git
cd OSIS-SMAIT-FI-WEBSITE-WITH-CMS
```

### 3. Setup Lingkungan & Database
Siapkan database PostgreSQL lokal atau jalankan container:
```bash
# Contoh menggunakan Docker:
docker run --name mubes-postgres -e POSTGRES_DB=strapi_osis -e POSTGRES_USER=strapi -e POSTGRES_PASSWORD=strapipassword -p 5433:5432 -d postgres:16-alpine
```

Salin file environment untuk masing-masing layanan:
```bash
# Frontend
cp osis-smait-fi/.env.example osis-smait-fi/.env.local

# Backend CMS
cp strapi-cms/.env.example strapi-cms/.env
```

Sesuaikan variabel penting di `osis-smait-fi/.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### 4. Instalasi Dependensi & Jalankan Server
Buka dua sesi terminal terpisah:

**Terminal 1 — Backend Strapi CMS:**
```bash
cd strapi-cms
npm install
npm run build
npm run develop
# CMS berjalan di http://localhost:1337
# Admin panel di http://localhost:1337/admin
```

**Terminal 2 — Frontend Next.js:**
```bash
cd osis-smait-fi
npm install
npm run dev
# Portal web berjalan di http://localhost:3000
```

---

## 🔐 Sistem Keamanan & MUBES

Sistem Musyawarah Besar (MUBES) menerapkan prinsip keamanan berlapis:
1. **Backend-For-Frontend (BFF)**: Klien tidak pernah menyimpan atau memanggil token admin Strapi secara langsung. Semua pertukaran token sensitif ditangani server Next.js di `/api/mubes/`.
2. **Otentikasi Terverifikasi (Clerk + Svix)**: Pendaftaran pengguna diverifikasi melalui webhook Svix yang mencocokkan identitas pendaftar secara ketat dengan daftar 65 anggota OSIS terdaftar.
3. **Kunci Akses Publik**: Rute Strapi untuk `mubes-lpj`, `mubes-sidang`, `akses-user`, dan `audit-log` dikunci dengan status `403 Forbidden` untuk role Public.
4. **Proteksi Cache**: Header `cache-control: no-store, no-cache, must-revalidate` diterapkan pada seluruh respons endpoint sensitif.

---

## 📦 Struktur Direktori

```text
OSIS-SMAIT-FI-WEBSITE-WITH-CMS/
├── CODEMAPS.md                  # Peta navigasi cepat arsitektur & dependensi
├── CHANGELOG.md                 # Catatan rilis versi terpusat (v2.0.0 MUBES update)
├── docs/                        # Dokumentasi teknis & pedoman arsitektur
│   ├── ARCHITECTURE.md          # Spesifikasi teknis sistem menyeluruh
│   ├── PRD_MUBES_DUAL_LAYER.md  # PRD sistem otentikasi dan dokumen sidang
│   ├── codemaps/                # Rincian kode per layer (frontend, backend, devops)
│   └── CHANGELOG/               # Arsip changelog berkala
├── osis-smait-fi/               # [FRONTEND] Next.js 16 Web Portal
│   ├── public/                  # Ikon, logo resmi, file gambar, audio latar
│   └── src/
│       ├── app/                 # App Router (pages, layout, API route BFF)
│       │   ├── api/             # BFF endpoints: /mubes, /webhooks, /spotify-rss
│       │   ├── edufest-infinity # Modul 3D WebGL event portal
│       │   ├── events/          # Modul arsip & detail agenda kegiatan
│       │   └── portal-mubes/    # Modul transparansi sidang & LPJ
│       ├── components/          # Komponen UI modular (Navbar, Footer, LPJ modal)
│       └── lib/                 # Strapi client, helper otentikasi, scroll engine
└── strapi-cms/                  # [BACKEND] Strapi v5 Headless CMS
    ├── config/                  # Konfigurasi database PostgreSQL, server, & middleware
    ├── scripts/                 # Skrip migrasi data & automasi seeding
    └── src/
        ├── api/                 # Content-Types (mubes, anggota, event, partner, dll.)
        └── index.ts             # Global audit trail Document Service middleware
```

---

## 📚 Indeks Dokumentasi

Pelajari komponen teknis secara mendalam melalui dokumen berikut:

- 🏛️ [Arsitektur Sistem (ARCHITECTURE.md)](docs/ARCHITECTURE.md) — Diagram alur kerja data, pola BFF, dan integrasi Next.js-Strapi.
- 🗺️ [Peta Navigasi Kode (CODEMAPS.md)](CODEMAPS.md) — Panduan penelusuran modul frontend, backend, dan alur autentikasi.
- 📜 [PRD MUBES Dual-Layer (PRD_MUBES_DUAL_LAYER.md)](docs/PRD_MUBES_DUAL_LAYER.md) — Spesifikasi teknis transparansi dokumen LPJ tertutup.
- 📋 [Catatan Rilis (CHANGELOG.md)](CHANGELOG.md) — Riwayat lengkap pembaruan fitur dari v1.0.0 hingga v2.0.0.
- 🤝 [Panduan Kontribusi (CONTRIBUTING.md)](docs/CONTRIBUTING.md) — Aturan penamaan branch, commit konvensional, dan standar PR.

---

## 🤝 Berkontribusi

Kontribusi dari siswa, alumni, dan pembimbing sangat disambut:

1. Buat branch baru untuk fitur Anda: `git checkout -b feature/nama-fitur`.
2. Pastikan kode lulus build dan type check:
   ```bash
   cd osis-smait-fi && npm run build
   cd ../strapi-cms && npm run build
   ```
3. Lakukan commit dengan pesan konvensional: `git commit -m "feat: tambah komponen X"`.
4. Ajukan Pull Request ke branch `main`.

---

## 📄 Lisensi

Hak Cipta © 2025–2026 **OSIS SMAIT Fithrah Insani (Agora Acta)**.  
Dilisensikan di bawah [MIT License](LICENSE).

# 🎓 OSIS SMAIT Fithrah Insani — Agora Acta 2025

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Strapi](https://img.shields.io/badge/Strapi-v5.x-purple?style=for-the-badge&logo=strapi)](https://strapi.io/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

Portal Web Resmi **OSIS SMAIT Fithrah Insani** dengan tema kepengurusan **Agora Acta 2025 (Bhaskara)**. Platform ini dirancang sebagai pusat informasi, dokumentasi kegiatan, dan media interaksi antara pengurus OSIS dengan seluruh civitas akademika SMAIT Fithrah Insani serta masyarakat umum yang terintegrasi dengan **Strapi v5 Headless CMS**.

---

## 📖 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Panduan Memulai (Quick Start)](#-panduan-memulai-quick-start)
  - [Prasyarat](#prasyarat)
  - [Langkah Instalasi](#langkah-instalasi)
  - [Perintah NPM yang Tersedia](#perintah-npm-yang-tersedia)
- [Integrasi Strapi CMS](#-integrasi-strapi-cms)
- [Dokumentasi & Catatan Perubahan](#-dokumentasi--catatan-perubahan)
- [Panduan Arsitektur & Desain](#-panduan-arsitektur--desain)
- [PRD & Roadmap Pengembangan](#-prd--roadmap-pengembangan)
- [Alur Kontribusi](#-alur-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

Aplikasi ini dibagi menjadi beberapa modul halaman dan backend CMS:

### 🏠 1. Halaman Beranda (Home Page - `/`)
- **Navigasi Interaktif (`Navbar`)**: Menu navigasi responsif dengan transisi glassmorphic yang nyaman di perangkat mobile maupun desktop.
- **Hero Section (`Hero`)**: Tampilan visual pembuka dinamis bertemakan **Agora Acta 2025** dengan gambar & video banner terintegrasi dari Strapi CMS.
- **Event Terakhir (`LatestEvent`)**: Bagian khusus yang mendokumentasikan kegiatan terbaru (seperti **EDUFEST - INFINITY**) langsung disinkronkan dari Strapi CMS.
- **Galeri Pengenalan (`Introduction`)**: Tata letak kolase foto yang elegan yang memperlihatkan kebersamaan dan ruang kolaborasi siswa.
- **Footer Informasi (`Footer`)**: Menyediakan akses cepat, detail sekolah, dan tautan langsung ke platform sosial media OSIS.

### ℹ️ 2. Halaman Tentang Kami (About Page - `/about`)
- **Tentang Agora Acta (`AboutUs`)**: Penjelasan komprehensif mengenai filosofi nama **Agora Acta** (Agora: Ruang bersama, Acta: Tindakan nyata).
- **Makna Simbol (`SymbolMeaning`)**: Rincian interaktif mengenai arti logo OSIS SMAIT Fithrah Insani.
- **Pengurus Inti (`MeetTeam`)**: Tampilan galeri foto pengurus inti OSIS (BPH) yang bersumber dinamis dari Strapi CMS.

### 📋 3. Halaman Program Kerja (Program Kerja Page - `/program-kerja`)
- **Header Program Kerja (`ProgramKerja`)**: Banner visual khusus halaman program kerja dengan ilustrasi interaktif.
- **Kisi Seksi Bidang (`SeksiBidangGrid`)**: Panel layout grid interaktif untuk menampilkan 8 Seksi Bidang OSIS beserta tipe proker rutinan & insidental.

### 👥 4. Halaman Anggota (Members Page - `/anggota`)
- **Daftar Anggota OSIS (`AnggotaList`)**: Galeri komprehensif pengurus OSIS periode 2025-2026 (BPH, Ketua Sekbid, dan Anggota Sekbid 1-8) dengan data dinamis Strapi.

### 📱 5. Halaman Media Sosial Hub (Social Media Page - `/media-sosial`)
- **Social Media Hub (`SosmedHub`)**: Pusat interaksi digital OSIS yang mengintegrasikan media sosial resmi (Instagram, TikTok, YouTube, Spotify).

### 📂 6. Halaman Detail Seksi Bidang & Program Kerja (`/sekbid/...`)
- **Detail Seksi Bidang (`SekbidDetail`)**: Halaman detail untuk masing-masing dari 8 Seksi Bidang OSIS.
- **Detail Program Kerja (`ProgramKerjaDetailPage`)**: Halaman khusus mengulas latar belakang, tujuan, target capaian, dan dokumentasi proker.

### 🖼️ 7. Halaman Galeri Foto Interaktif (`/galeri/galeri-preview-infinity`)
- **Interactive Infinite Photo Gallery**: Galeri dokumentasi visual berbasis kisi tak terbatas (infinite grid) dengan momentum panning physics dan sistem *dimension caching* di sisi klien.

### 🌌 8. Portal Edufest Infinity (`/edufest-infinity`)
- **Immersive 3D Experience**: Portal khusus event tahunan Edufest yang menyajikan WebGL/Three.js interactive scene transitions, mouse cursor trail particles, background audio player, dan 3D WebGL Globe interaktif yang memetakan lokasi sekolah.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: [Next.js 16 (App Router v16.2.11)](https://nextjs.org/)
- **Backend CMS**: [Strapi v5 Headless CMS](https://strapi.io/)
- **Database**: PostgreSQL 16 (`mubes-postgres` Docker container)
- **Autentikasi & Keamanan**: [Clerk Auth](https://clerk.com/) & [Svix](https://svix.com/) Webhook Verification
- **UI & Animation Libraries**:
  - [React 19](https://react.dev/)
  - [GSAP](https://gsap.com/) & [Framer Motion](https://motion.dev/) (Animasi interaktif premium)
  - [Lenis](https://lenis.darkroom.engineering/) (Smooth scroll engine)
  - [Three.js](https://threejs.org/) (WebGL 3D Rendering)
  - [D3.js](https://d3js.org/) & [Topojson](https://github.com/topojson/topojson) (Globe mapping)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS

---

## 📂 Struktur Proyek

```text
osis-smait-fi-workspace/
├── osis-smait-fi/           # [FRONTEND] Aplikasi Next.js 16 Portal Web
│   ├── docs/                # Dokumentasi Proyek (ARCHITECTURE, CONTRIBUTING, PRD)
│   ├── public/              # Aset statis (ikon, favicon, audio, media)
│   ├── src/
│   │   ├── app/             # Next.js App Router (Rute, BFF /api/mubes, Webhook Clerk)
│   │   │   ├── edufest-infinity/ # Portal Event Edufest (WebGL Scenes & Globe)
│   │   │   └── ...          # Halaman Umum (About, Anggota, Program Kerja, dll.)
│   │   ├── components/      # Komponen UI (MubesLpjSection, scenes, globe, ui, dll.)
│   │   └── lib/             # Utility (mubes-access, lenis, strapi fetcher, dll.)
├── strapi-cms/              # [BACKEND] Headless CMS Strapi v5
│   ├── config/              # Konfigurasi Server, Database (PostgreSQL 16), & Plugins
│   ├── public/uploads/      # Media Assets (1.218 files, 364 MB)
│   ├── src/api/             # Content-Types (mubes-lpj, mubes-sidang, akses-user, audit-log, dll.)
│   └── src/index.ts         # Document Service Middleware (Global Audit Trail)
```

---

## 🔄 Integrasi Strapi CMS & PostgreSQL

Frontend terhubung dengan backend Strapi melalui module helper `src/lib/strapi.ts` dan BFF route handlers. Backend menggunakan PostgreSQL 16 container (`127.0.0.1:5433`). Pengurus OSIS dapat mengedit konten melalui Strapi Admin Panel di `https://osisstrapi.biezz.my.id/admin`.

---

## 📚 Dokumentasi & Catatan Perubahan

- 📜 [Riwayat Perubahan (CHANGELOG.md)](file:///d:/Project/CODING/AGORAACTA_WEBSITE/osis-smait-fi/docs/CHANGELOG/CHANGELOG.md)
- 📢 [Pembaruan Terkini (LATEST_UPDATES.md)](file:///d:/Project/CODING/AGORAACTA_WEBSITE/osis-smait-fi/docs/UPDATE/LATEST_UPDATES.md)
- 🏛️ [Arsitektur Sistem (ARCHITECTURE.md)](file:///d:/Project/CODING/AGORAACTA_WEBSITE/osis-smait-fi/docs/ARCHITECTURE.md)
- 📜 [PRD & Roadmap (PRD.md)](file:///d:/Project/CODING/AGORAACTA_WEBSITE/osis-smait-fi/docs/PRD.md)
- 🤝 [Panduan Kontribusi (CONTRIBUTING.md)](file:///d:/Project/CODING/AGORAACTA_WEBSITE/osis-smait-fi/docs/CONTRIBUTING.md)

---

## 📄 Lisensi

Hak Cipta © 2025-2026 **OSIS SMAIT Fithrah Insani (Agora Acta)**. Dilindungi oleh Undang-Undang.

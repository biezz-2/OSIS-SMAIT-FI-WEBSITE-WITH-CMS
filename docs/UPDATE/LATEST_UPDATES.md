# 📢 Pembaruan Terkini (Latest Updates)

> **Versi**: 1.6.0
> **Tanggal Pembaruan**: 11 Agustus 2026

Dokumen ini berisi rincian lengkap mengenai pembaruan teknis dan fungsionalitas terbaru pada proyek **OSIS SMAIT Fithrah Insani (Agora Acta 2025)** serta sub-proyek terkait.

---

## 📌 Ringkasan Pembaruan (Agustus 2026 — v1.6.0)

### 1. Sinkronisasi Database MySQL ke SQLite Automation
- **Background Worker & Script `sync-db.js`**: Penambahan sistem sinkronisasi otomatis dari basis data MySQL utama ke SQLite lokal (`database/data.db`) yang dieksekusi secara teratur.
- **Handling Perubahan Skema & Error Tolerance**: Pembaruan log sinkronisasi tabel (`admin_permissions`, `anggota_oses`, `program_kerjas`, `files`, dll.) dan peningkatan error boundary untuk kolom atau tabel yang tidak cocok.

### 2. Restrukturisasi Workspace & Dokumentasi Root
- **Pembaruan `README.md` Root**: Dokumentasi komprehensif untuk struktur workspace multi-paket (`osis-smait-fi`, `strapi-cms`, `other-program/`).
- **Standardisasi Link Dokumentasi**: Penyesuaian tautan referensi antar berkas `README.md`, `ARCHITECTURE.md`, `SYSTEM_ANALYSIS.md`, `CATATAN.md`, dan `CHANGELOG.md`.

---

## 📌 Ringkasan Pembaruan (Agustus 2026 — v1.5.0)

### 1. Integrasi Infinity Edufest & Strapi v5 Event CMS
- **Sinkronisasi Event EduFest (`/edufest-infinity`)**: Modul event EduFest 2025 kini terintegrasi penuh dengan **Strapi v5 Headless CMS** melalui skema `Event`, `MediaAsset`, dan pemicu data seeding (`scripts/seed.ts`).
- **Timeline & Sekuens Stage Dinamis**: Menampilkan alur timeline kompetisi, lokasi sekolah, dan panitia pelaksana secara dinamis.
- **Modal Pendaftaran & Tautan**: Menyediakan modal pendaftaran interaktif dan tautan cepat ke formulir pendaftaran peserta.

### 2. Optimasi UI/UX Mobile & Perbaikan Stacking Context
- **Penguncian Navbar Mobile**: Memperbaiki tata letak navbar mobile agar tidak bergeser secara horisontal atau menimbulkan *horizontal scrolling* pada peramban seluler.
- **Perbaikan Tooltip Clipping (`AnggotaList.tsx`)**: Menyesuaikan `overflow` container dan `z-index` pada tooltip media sosial anggota untuk mencegah tooltip terpotong oleh frame kartu.
- **Konsistensi Warna Tema**: Menyelaraskan kontras mode gelap dan mode terang pada seluruh kartu Sekbid, BPH, dan pengurus inti.

### 3. Inventaris & Struktur Multi-Proyek Workspace
Repository ini mencakup 4 modul proyek utama yang terkoordinasi:
1. **`osis-smait-fi`**: Aplikasi web utama (Next.js 16 App Router + React 19).
2. **`strapi-cms`**: Backend CMS headless (Strapi v5 + SQLite/MySQL Sync).
3. **`other-program/infinity-edufest`**: Aplikasi web portal spesifik event tahunan Edufest 2025.
4. **`other-program/edufest-infinity-link-in-bio-boilerplate`**: Aplikasi boilerplate *link-in-bio* untuk media sosial resmi Edufest & OSIS.

---

## 📌 Ringkasan Pembaruan (Agustus 2026 — v1.4.0)

### 1. Dukungan Progressive Web App (PWA)
- **Service Worker (`public/sw.js`)**: Implementasi strategi *stale-while-revalidate* untuk mempercepat pemuatan halaman dan aset lokal, serta menyediakan ketahanan offline dasar.
- **Web App Manifest (`manifest.json`)**: Konfigurasi lengkap untuk instalasi aplikasi di layar beranda ponsel dengan ikon kustom dan opsi tampilan *standalone*.
- **Pendaftaran Otomatis**: Layanan PWA didaftarkan secara asinkron dalam `RootLayout` (`layout.tsx`) setelah halaman sepenuhnya dimuat.

### 2. Pencarian Global & Routing Cerdas PJ-ke-Proker
- **Mesin Pencari Terpusat (`src/lib/search.ts`)**: Fungsi `searchGlobalContent` mencari secara paralel di seluruh navigasi statis, Sekbid, Program Kerja, dan daftar Anggota.
- **Pengalihan PJ Proker**: Menghubungkan anggota yang bertindak sebagai Penanggung Jawab (PJ) dengan program kerja terkait. Jika pengguna mengeklik nama anggota yang merupakan PJ, sistem otomatis mengarahkan ke halaman detail Program Kerja tersebut.

### 3. Konfigurasi Tekstur Latar Belakang Dinamis
- **Integrasi Strapi**: Penambahan modul fetcher `fetchBgTextureConfig()` di `src/lib/strapi.ts` untuk mengambil status, variasi gambar, dan opacity tekstur latar belakang secara real-time.
- **Komponen GlobalBgTexture**: Dirender secara global di `RootLayout` untuk menampilkan pola background secara dinamis sesuai filter CMS.

### 4. Perbaikan Adaptasi & Konsistensi Mode Gelap
- **Override globals.css**: Penambahan selector `html.dark` dengan variabel HSL untuk memperbaiki anomali warna teks dan latar belakang pada kartu anggota, form input, dan navbar.
- **Transisi Halus**: Koordinasi interaksi dark/light mode agar transisi tetap elegan dan nyaman di mata.

### 5. Bootstrap Strapi Core & Penjadwal Sinkronisasi
- **Setup RBAC Otomatis**: Konfigurasi otomatis hak akses publik (read-only) serta peran editor (Chief Editor & Content Contributor) saat inisialisasi server Strapi (`index.ts`).
- **Sinkronisasi Database MySQL**: Menjalankan skrip sinkronisasi database MySQL secara berkala menggunakan proses terpisah (`child_process.fork()`) untuk menjaga integritas data antar-server.

---

## 📌 Ringkasan Pembaruan (Juli 2026 — v1.3.0)

### 1. Redesain Premium Halaman Anggota
Halaman `/anggota` dirancang ulang menggunakan **AnggotaList.tsx** dengan fitur:
- **Featured Card Ketua OSIS**: Foto 4:5 dengan shadow premium, dekorasi *rotated box*, dan badge "KETUA OSIS".
- **Grid Pengurus Inti (BPH)**: 3 kolom kartu dengan icon badge warna dinamis.
- **Grid Seksi Bidang 1–8**: Kartu dengan banner Strapi, avatar stack, jumlah anggota, dan link "View Team".
- **Sidebar Sticky (Desktop)**: Navigasi kiri untuk akses cepat ke setiap divisi.
- **Hybrid SSR + ISR**: Data pre-fetched dari Strapi di server dan dikirim sebagai `initialProps`.

### 2. Sistem Kompresi Gambar Dinamis
- **API Route `/api/compress-image`**: Proxy route yang mengambil gambar dari Strapi, mengompres, dan mengirimkannya ke klien.
- **ImageQualityContext**: React Context global yang menyediakan `getOptimizedImageUrl()` ke seluruh komponen.
- **Kontrol via Strapi**: Admin OSIS dapat mengatur `enable_compression` dan `compression_quality` (20–100) langsung dari Dashboard Strapi.

### 3. Mode Preview Draft Strapi
- **Akses Konten Draft**: Pengurus OSIS dapat melihat konten yang belum dipublikasikan melalui cookie `__prerender_bypass`.
- **Auto-refresh**: `LivePreviewListener.tsx` mendengarkan pesan dari Strapi iframe untuk memperbarui halaman secara otomatis.
- **Keluar Preview**: Menggunakan rute `/api/exit-preview` untuk kembali ke mode produksi.

### 4. Optimasi ISR Beranda
Halaman beranda (`/`) diubah dari `force-dynamic` menjadi **ISR dengan revalidate 60 detik**:
- **Performa**: Halaman disajikan dari cache server/CDN.
- **Aktualitas**: Data diperbarui maksimal setiap 60 detik.
- **Lazy-loading**: Komponen berat (`LatestEvent`, `Introduction`, `Footer`) dimuat menggunakan `next/dynamic`.

### 5. Pembaruan Dokumentasi Menyeluruh
Pembaruan komprehensif pada:
- **SYSTEM_ANALYSIS.md**: Tabel endpoint, strategi rendering, dan metrik performa.
- **ARCHITECTURE.md**: Struktur direktori, diagram Mermaid, dan panduan deployment PM2.
- **CHANGELOG.md**: Dokumentasi riwayat versi v1.3.0.

---

## 📌 Ringkasan Pembaruan (Juli 2026 — v1.2.0)

### 1. Sinkronisasi Data Kepengurusan & Strapi CMS
- **Integrasi Backend Headless**: Data pengurus OSIS, program kerja, dan event sekolah kini diambil secara otomatis dari **Strapi Headless CMS v5**.
- **Manajemen Konten Berbasis Peran**: Pembina dan pengurus dapat memperbarui status proker dan pengumuman event melalui Dashboard Admin.

### 2. Pengaturan Logo & Penanganan Media
- **Fleksibilitas Aset**: Dukungan upload logo organisasi (SVG/PNG) dan aset video melalui Strapi.
- **Fallback & Sanitasi**: Implementasi *null-safety handler* dan gambar default jika media Strapi gagal dimuat.

### 3. Refaktorisasi Layout & Navigasi
- **Pembersihan Media Sosial**: Penataan ulang elemen media sosial pada Social Media Hub (`/media-sosial`) dan Footer.
- **Sentuhan Glassmorphic UI**: Pembaruan efek *backdrop blur* pada header, modal, dan kartu informasi.

### 4. Sistem Caching Galeri Infinity 2D
- **Client-side Dimension Caching**: Penyimpanan metadata ukuran foto di peramban untuk mencegah *layout shift* (CLS) saat zooming/panning.
- **Smooth Physics Engine**: Peningkatan responsivitas *touch gestures* untuk pengalaman setara aplikasi native iOS.

---

## 💡 Panduan Pengujian & Deployment

### Pengembangan Lokal
```bash
# 1. Jalankan Backend Strapi
cd strapi-cms
npm run develop  # http://localhost:1337

# 2. (Opsional) Isi database lokal
npm run seed

# 3. Jalankan Frontend Next.js
cd osis-smait-fi
npm run dev      # http://localhost:3000
```

### Deployment Produksi
```bash
cd osis-smait-fi
npm run build
pm2 restart osis-next-frontend
pm2 status
pm2 logs osis-next-frontend --lines 50
```

### Verifikasi Build
```bash
npm run build   # Pastikan tidak ada TypeScript error
npm run lint    # Cek ESLint
```

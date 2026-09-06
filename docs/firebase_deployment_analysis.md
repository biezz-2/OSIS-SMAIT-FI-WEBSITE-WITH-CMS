# Analisis Firebase Deployment — Website OSIS SMAIT FI

Dokumen ini menganalisis kelayakan pemindahan (migrasi) proyek website OSIS SMAIT FI (terdiri dari Next.js frontend dan Strapi CMS backend) ke platform Google Firebase.

---

## 🏗️ 1. Gambaran Umum Sistem Saat Ini

Proyek berjalan di lingkungan VPS menggunakan PM2 dengan struktur:
1. **Frontend (`osis-smait-fi`)**: Next.js v16 (React 19), menggunakan fitur Dynamic API Routes, Image Compression (`sharp`), Server-Sent Events (SSE) untuk notifikasi realtime, dan ISR (Incremental Static Regeneration).
2. **Backend (`strapi-cms`)**: Strapi v5, menggunakan SQLite lokal (atau MySQL) untuk database, menyimpan media/uploads secara lokal, serta mendukung Webhook dan Telegram integration.

---

## 📊 2. Analisis Kelayakan Komponen

### A. Next.js Frontend (`osis-smait-fi`)
* **Kelayakan**: **Layak (Dengan Catatan)**
* **Platform Target**: Firebase Hosting + Firebase App Hosting (atau Cloud Functions untuk SSR/API).
* **Analisis Detil**:
  * **SSR & API Routes**: Next.js 16 dapat dijalankan di Firebase menggunakan Firebase App Hosting yang baru (berbasis Cloud Run) atau integrasi Firebase Hosting + Cloud Functions lama.
  * **Image Compression proxy (`/api/compress-image`)**: Menggunakan library native `sharp` dan menulis file cache ke `.image-cache` di dalam local disk. Di Firebase Cloud Functions/App Hosting, **sistem file bersifat read-only ( ephemeral)** kecuali folder `/tmp` (yang dibatasi memori RAM). Penggunaan cache berbasis local disk akan gagal/tidak persisten.
  * **Server-Sent Events (SSE) (`/api/sse/notifications`)**: Firebase Cloud Functions memiliki batas durasi timeout (maksimum 60 menit) dan tidak optimal untuk koneksi HTTP persistent (keep-alive) karena model serverless yang melakukan scaling ke 0 (*scale-to-zero*). Koneksi SSE akan sering terputus dan memicu cold start yang mahal jika ada banyak request.

### B. Strapi CMS Backend (`strapi-cms`)
* **Kelayakan**: **Sangat Sulit / Tidak Direkomendasikan di Firebase Murni**
* **Platform Target**: Firebase Hosting tidak mendukung hosting backend dinamis seperti Strapi. Strapi harus dijalankan di Google Cloud Run (melalui docker container) atau App Engine, bukan di Firebase secara langsung.
* **Analisis Detil**:
  * **Database (SQLite)**: SQLite menulis langsung ke file lokal (`strapi_data.db`). Firebase Cloud Run / Cloud Functions bersifat serverless dan stateless. Setiap kontainer dideploy ulang atau dinonaktifkan saat idle, file SQLite lokal akan **terhapus sepenuhnya**. Migrasi wajib dilakukan ke Cloud SQL (PostgreSQL/MySQL) yang berbayar cukup mahal.
  * **Penyimpanan Media (Local Uploads)**: Gambar yang diunggah ke `/uploads/` disimpan lokal. Pada arsitektur serverless Firebase, media ini akan hilang setiap kali kontainer mengalami cold-start atau restart. Diperlukan plugin tambahan seperti `@strapi/provider-upload-google-cloud-storage` untuk memindahkan asset ke Firebase Storage/Google Cloud Storage.
  * **Server Startup Time**: Strapi membutuhkan waktu startup (cold-start) yang cukup lama (>10 detik). Di lingkungan serverless Firebase (Cloud Run), ini akan menyebabkan request pertama mengalami delay tinggi (delay loading).

---

## ⚠️ 3. Tantangan Utama & Solusi

| Fitur Proyek | Kendala di Firebase | Solusi / Penyesuaian |
| :--- | :--- | :--- |
| **Database SQLite** | File SQLite akan terhapus karena serverless stateless. | Migrasi ke Firebase/GCP Cloud SQL (PostgreSQL/MySQL) atau DB eksternal (Supabase, Neon). |
| **Media Uploads Lokal** | File gambar di `/uploads` akan hilang. | Pasang plugin penyimpan eksternal (Firebase Cloud Storage Provider). |
| **SSE (Server-Sent Events)** | Cloud Functions tidak mendukung long-lived connections dengan baik. | Ganti SSE dengan Firebase Realtime Database atau Firestore. |
| **Image Cache (`/api/compress-image`)** | Folder `.image-cache` read-only & ephemeral. | Simpan cache di memory-cache (RAM) atau gunakan Cloudflare Images / Next.js Image Optimization bawaan Firebase Hosting. |
| **Strapi Startup** | Cold start di Cloud Run membuat admin panel lambat diakses pertama kali. | Set minimum instances Cloud Run ke `1` (menghilangkan free-tier). |

---

## 📐 4. Rekomendasi Arsitektur Deployment

Untuk menjaga kompatibilitas aplikasi tanpa merombak ulang kode, berikut adalah perbandingan opsi deployment:

### Opsi A: Vercel + VPS (⭐ Rekomendasi Terbaik — Termurah & Termudah)
* **Frontend Next.js**: Vercel (Gratis, native Next.js support, zero-config).
* **Backend Strapi & Database**: Tetap di VPS saat ini menggunakan PM2.
* **Keuntungan**: Tidak perlu modifikasi kode, gratis untuk frontend, Vercel adalah platform resmi Next.js.
* **Lihat**: [Panduan Setup Vercel](#-6-panduan-deploy-ke-vercel-opsi-a) di bawah.

### Opsi B: Hybrid Firebase + VPS
* **Frontend Next.js**: Firebase App Hosting (mendukung SSR, perlu modifikasi minor).
* **Backend Strapi & Database**: Tetap di VPS saat ini menggunakan PM2.
* **Keuntungan**: Gratis untuk frontend hosting, latensi rendah untuk backend.
* **Kerugian**: Perlu setup `apphosting.yaml`, modifikasi image cache dan SSE.

### Opsi C: Full Serverless Google Cloud (Biaya Tinggi)
* **Frontend**: Firebase App Hosting.
* **Backend**: Google Cloud Run (Docker Container).
* **Database**: Google Cloud SQL (PostgreSQL).
* **Storage**: Google Cloud Storage (menggunakan plugin Strapi).
* **Keuntungan**: Skalabilitas sangat tinggi, tidak perlu mengelola server (VPS).
* **Kerugian**: Biaya bulanan relatif mahal (estimasi >$15/bulan untuk Cloud SQL), memerlukan setup konfigurasi yang kompleks.

---

## 📋 5. Kesimpulan
1. **Next.js Frontend** **bisa** di-upload dan dijalankan di Firebase/Vercel dengan beberapa modifikasi minor pada fitur caching gambar.
2. **Strapi CMS Backend** **tidak bisa** dijalankan langsung di Firebase Hosting tradisional. Harus dideploy menggunakan Google Cloud Run (Docker) dengan mengganti database SQLite ke database eksternal dan memindahkan media uploads ke Cloud Storage.
3. Jika ingin meminimalkan biaya dan waktu migrasi, disarankan menggunakan **Opsi A (Vercel + VPS)**.

---

## 🚀 6. Panduan Deploy ke Vercel (Opsi A)

### Prasyarat
- Akun GitHub/GitLab/Bitbucket (repo harus di-push ke salah satu platform)
- Akun Vercel gratis di [vercel.com](https://vercel.com)

### Langkah 1: Siapkan Repository

Pastikan struktur monorepo sudah di-push ke GitHub. Vercel akan membaca folder `osis-smait-fi/` sebagai root project Next.js.

### Langkah 2: Import Project di Vercel

1. Login ke [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Git Repository"** → pilih repo GitHub
3. Di bagian **"Root Directory"**, set ke: `osis-smait-fi`
4. Framework Preset otomatis terdeteksi sebagai **Next.js**
5. Klik **Deploy**

### Langkah 3: Konfigurasi Environment Variables

Di Vercel Dashboard → Project Settings → Environment Variables, tambahkan:

| Variable | Value | Scope |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_STRAPI_URL` | `https://osisstrapi.biezz.my.id` | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` (atau custom domain) | Production |
| `STRAPI_INTERNAL_URL` | `https://osisstrapi.biezz.my.id` | Production |
| `REVALIDATE_SECRET` | *(secret dari VPS Strapi webhook)* | Production |
| `TELEGRAM_BOT_TOKEN` | *(token bot Telegram)* | Production |
| `TELEGRAM_CHAT_ID` | *(chat ID Telegram)* | Production |
| `TELEGRAM_FEEDBACK_BOT_TOKEN` | *(token feedback bot)* | Production |
| `CF_ZONE_ID` | *(Cloudflare Zone ID, jika pakai)* | Production |
| `CF_API_TOKEN` | *(Cloudflare API Token, jika pakai)* | Production |
| `PREVIEW_SECRET` | `preview_secret_agoraacta_2026` | Production, Preview |

> **Penting**: `STRAPI_INTERNAL_URL` di Vercel harus menggunakan URL publik Strapi (bukan `127.0.0.1:1337`) karena Vercel serverless functions tidak berada di jaringan yang sama dengan VPS.

### Langkah 4: Konfigurasi CORS di Strapi (VPS)

Strapi di VPS perlu mengizinkan request dari domain Vercel. Edit konfigurasi middleware Strapi atau tambahkan domain Vercel ke allowed origins.

### Langkah 5: Update Webhook Strapi

Di Strapi admin panel, update webhook URL revalidasi agar mengarah ke Vercel:

```
https://your-domain.vercel.app/api/strapi-webhook
```

### Langkah 6: Custom Domain (Opsional)

1. Di Vercel Dashboard → Project Settings → Domains
2. Tambahkan domain custom (misal `osissmaitfithrahinsani.sch.id`)
3. Update DNS records sesuai instruksi Vercel (CNAME ke `cname.vercel-dns.com`)
4. Update `NEXT_PUBLIC_SITE_URL` di Environment Variables

### Langkah 7: Update `next.config.ts`

Perubahan yang **mungkin** diperlukan di `osis-smait-fi/next.config.ts`:

```typescript
// Hapus baris ini (tidak diperlukan di Vercel):
// outputFileTracingRoot: path.join(__dirname),

// Tambahkan domain Vercel di CSP frame-ancestors jika perlu
```

> Catatan: `outputFileTracingRoot` dan `import path` bisa tetap ada — Vercel mengabaikannya. Hanya perlu dihapus jika menyebabkan build error.

### Yang TIDAK Perlu Diubah

- ✅ **API Routes** — semua berfungsi (termasuk `compress-image`, `revalidate`, `strapi-webhook`, `inbox`, `preview`)
- ✅ **SSE notifications** — Vercel Serverless Functions mendukung streaming responses (dengan batasan 60 detik pada Hobby plan, 300 detik pada Pro)
- ✅ **Image Optimization** — Vercel memiliki built-in Next.js Image Optimization
- ✅ **ISR / Revalidation** — fully supported oleh Vercel
- ✅ **Dynamic routes** — fully supported

### Catatan Penting

1. **SSE timeout**: Pada Vercel Hobby (gratis), serverless function timeout 60 detik. SSE akan reconnect otomatis. Jika butuh koneksi lebih lama, pertimbangkan upgrade ke Pro atau ganti ke polling.
2. **Image cache** (`/api/compress-image`): Vercel serverless filesystem bersifat read-only kecuali `/tmp`. Jika API ini menulis ke `.image-cache` di disk, cache akan hilang setelah cold start. Alternatif: gunakan Next.js `<Image>` component yang memanfaatkan Vercel Image Optimization secara otomatis.
3. **Build time**: Vercel free tier memiliki limit 100 jam build/bulan. Untuk proyek ini cukup.
4. **Bandwidth**: 100GB/bulan pada free tier. Cukup untuk website sekolah.

---

## 📊 7. Perbandingan Ringkas Opsi Deployment

| Aspek | Opsi A: Vercel + VPS | Opsi B: Firebase + VPS | Opsi C: Full GCP |
| :--- | :--- | :--- | :--- |
| **Biaya Frontend** | Gratis | Gratis (App Hosting) | Gratis (App Hosting) |
| **Biaya Backend** | VPS existing | VPS existing | >$15/bulan |
| **Modifikasi Kode** | Minimal/Tidak ada | Minor (image cache, SSE) | Besar (DB, storage, dll) |
| **Kompleksitas Setup** | Rendah | Sedang | Tinggi |
| **Next.js Support** | Native (Vercel = pembuat Next.js) | Baik (via App Hosting) | Baik (via App Hosting) |
| **Auto Deploy dari Git** | ✅ | ✅ | Manual setup |
| **Preview Deployments** | ✅ Otomatis per PR | ❌ | ❌ |
| **Image Optimization** | ✅ Built-in | Perlu konfigurasi | Perlu konfigurasi |
| **Custom Domain** | ✅ Gratis + SSL | ✅ Gratis + SSL | ✅ |

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

### Opsi A: Hybrid (Rekomendasi Terbaik & Termurah)
* **Frontend Next.js**: Firebase Hosting / Vercel (Gratis/Sangat Murah, mendukung SSR & Image Optimization).
* **Backend Strapi & Database**: Tetap di VPS saat ini menggunakan PM2 (karena SQLite dan local storage aman dan murah di VPS).
* **Keuntungan**: Tidak perlu memodifikasi kode, gratis untuk frontend hosting, latensi rendah untuk backend.

### Opsi B: Full Serverless Google Cloud (Biaya Tinggi)
* **Frontend**: Firebase App Hosting.
* **Backend**: Google Cloud Run (Docker Container).
* **Database**: Google Cloud SQL (PostgreSQL).
* **Storage**: Google Cloud Storage (menggunakan plugin Strapi).
* **Keuntungan**: Skalabilitas sangat tinggi, tidak perlu mengelola server (VPS).
* **Kerugian**: Biaya bulanan relatif mahal (estimasi >$15/bulan untuk Cloud SQL), memerlukan setup konfigurasi yang kompleks.

---

## 📋 5. Kesimpulan
1. **Next.js Frontend** **bisa** di-upload dan dijalankan di Firebase dengan beberapa modifikasi minor pada fitur caching gambar.
2. **Strapi CMS Backend** **tidak bisa** dijalankan langsung di Firebase Hosting tradisional. Harus dideploy menggunakan Google Cloud Run (Docker) dengan mengganti database SQLite ke database eksternal dan memindahkan media uploads ke Cloud Storage.
3. Jika ingin meminimalkan biaya dan waktu migrasi, disarankan menggunakan **Opsi A (Hybrid)**.

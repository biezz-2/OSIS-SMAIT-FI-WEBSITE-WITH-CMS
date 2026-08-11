# Laporan Analisis Sistem & Arsitektur Website OSIS SMAIT FI (Agoraacta)

Laporan ini menyajikan analisis komprehensif mengenai arsitektur sistem, alur kerja, integrasi, otomatisasi, serta rekomendasi optimasi untuk platform website OSIS SMAIT FI (Agoraacta).

---

## 1. Arsitektur Sistem & Alur Kerja

Sistem Agoraacta dirancang menggunakan pendekatan modern dengan arsitektur monorepo yang terintegrasi penuh untuk mempermudah pengembangan, deployment, dan pemeliharaan.

```
                                  +-------------------+
                                  |     PM2 Process   |
                                  |     Manager       |
                                  +---------+---------+
                                            |
                      +---------------------+---------------------+
                      |                                           |
                      v                                           v
            +-------------------+                       +-------------------+
            | Next.js Frontend  |                       |   Strapi CMS v5   |
            |   (Port 3002)     |                       |   (Port 1337)     |
            +---------+---------+                       +---------+---------+
                      ^                                           |
                      | (SSE / API / Webhook)                     | (Webhook Event)
                      |                                           v
                      |                                 +-------------------+
                      +---------------------------------+    n8n Workflow   |
                                                        |      Engine       |
                                                        +---------+---------+
                                                                  |
                                            +---------------------+---------------------+
                                            |                                           |
                                            v                                           v
                                  +-------------------+                       +-------------------+
                                  |    Telegram Bot   |                       |    Gemini AI      |
                                  |   (Notification)  |                       | (Content Analysis)|
                                  +-------------------+                       +-------------------+
```

### Komponen Utama Arsitektur:
*   **Monorepo Structure**: Seluruh kode sumber frontend ([`package.json`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/package.json)) dan backend ([`package.json`](WEBSITE/AGORAACTA_WEBSITE/strapi-cms/package.json)) dikelola dalam satu repositori di bawah direktori `WEBSITE/AGORAACTA_WEBSITE/`. Hal ini memungkinkan orkestrasi tugas build dan start secara paralel menggunakan package `concurrently`.
*   **PM2 Process Manager**: Di lingkungan produksi, aplikasi dijalankan menggunakan PM2 dengan konfigurasi [`ecosystem.config.js`](WEBSITE/AGORAACTA_WEBSITE/ecosystem.config.js). PM2 mengelola dua proses utama:
    1.  `osis-strapi-backend`: Menjalankan Strapi CMS v5 pada port `1337`.
    2.  `osis-next-frontend`: Menjalankan Next.js Frontend pada port `3002`.
*   **Next.js (App Router)**: Bertindak sebagai antarmuka pengguna (UI) berkinerja tinggi dengan kemampuan rendering hibrida (Static Generation, ISR, dan Dynamic SSR).
*   **Strapi v5**: Bertindak sebagai Headless CMS untuk mengelola seluruh konten dinamis secara terpusat.
*   **n8n Workflow Engine**: Mengotomatisasi alur kerja ketika ada data baru masuk ke CMS (misalnya, pesan inbox baru), memprosesnya dengan AI, mengirimkan notifikasi ke Telegram, dan menyiarkannya secara real-time ke frontend.
*   **Server-Sent Events (SSE)**: Digunakan untuk komunikasi satu arah real-time dari server ke klien guna menampilkan notifikasi langsung di website tanpa polling HTTP.

---

## 2. Frontend (Next.js)

Frontend dikembangkan menggunakan framework Next.js versi terbaru dengan fitur-fitur canggih untuk performa dan pengalaman pengguna yang interaktif.

### Spesifikasi Teknologi:
*   **Framework**: Next.js `16.2.11` (menggunakan React `19.2.4` dan compiler Turbopack).
*   **Library Animasi**:
    *   **GSAP (GreenSock Animation Platform) `3.15.0`**: Digunakan untuk animasi timeline yang kompleks, transisi halaman, dan efek visual interaktif tingkat tinggi.
    *   **Lenis Scroll `1.3.25`**: Menyediakan fitur *smooth scrolling* (gulir halus) yang terintegrasi dengan GSAP ScrollTrigger untuk pengalaman navigasi yang mulus.
    *   **Framer Motion `12.43.0`**: Digunakan untuk animasi mikro pada komponen UI seperti tombol, modal, dan transisi layout sederhana.
*   **Visualisasi Data**:
    *   **D3.js `7.9.0`**: Digunakan untuk visualisasi data interaktif, termasuk peta interaktif dan transformasi globe (`GlobeToMapTransform.tsx`).
    *   **TopoJSON Client `3.1.0`**: Digunakan untuk memproses data geografis ringan untuk visualisasi peta.
*   **Progressive Web App (PWA)**: Mendukung fitur PWA dasar untuk instalasi aplikasi di perangkat mobile/desktop serta caching offline.

### API Routes & Optimasi Backend-Frontend:
1.  **Revalidation Route ([`route.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/api/revalidate/route.ts))**:
    *   Menyediakan endpoint `/api/revalidate` untuk melakukan *On-Demand Incremental Static Regeneration (ISR)*.
    *   Mengamankan proses revalidasi menggunakan token rahasia (`REVALIDATE_SECRET`).
2.  **Strapi Webhook Route ([`route.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/api/strapi-webhook/route.ts))**:
    *   Menerima webhook dari Strapi saat konten berubah.
    *   Memetakan model konten (seperti `sekbid`, `anggota-osis`, `program-kerja`) ke path halaman Next.js yang relevan untuk direvalidasi secara otomatis.
    *   Terintegrasi dengan Cloudflare API untuk membersihkan cache CDN (*Cloudflare Cache Purge*) secara real-time untuk jalur yang diperbarui.
3.  **SSE Notifications & Broadcast ([`route.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/api/sse/notifications/route.ts) & [`route.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/api/sse/broadcast/route.ts))**:
    *   `/api/sse/notifications` membuka koneksi persisten `text/event-stream` dengan klien.
    *   Mengirimkan detak jantung (*heartbeat*) setiap 30 detik untuk menjaga koneksi tetap aktif.
    *   `/api/sse/broadcast` menerima payload dari n8n/Strapi dan memancarkannya ke seluruh klien yang terhubung melalui `notificationService`.
4.  **Image Compression Proxy ([`route.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/api/compress-image/route.ts))**:
    *   Menggunakan library `sharp` untuk kompresi gambar dinamis di sisi server.
    *   Dikonfigurasi dengan `sharp.concurrency(1)` untuk membatasi penggunaan CPU dan mencegah lonjakan beban server.
    *   Mengonversi gambar secara otomatis ke format WebP dengan kualitas yang dapat disesuaikan (default `75`).
    *   Dilengkapi dengan perlindungan SSRF (memblokir IP privat) dan mekanisme *graceful fallback* (pengalihan 302 ke URL gambar asli jika terjadi kegagalan pemrosesan).

---

## 3. Backend (Strapi CMS)

Backend menggunakan Strapi v5 sebagai pusat pengelolaan konten dengan arsitektur database hibrida dan skrip kustom untuk sinkronisasi data.

### Spesifikasi Teknologi:
*   **Framework**: Strapi CMS `5.51.0` (Headless CMS berbasis Node.js).
*   **Database Hibrida**:
    *   **MySQL (`mysql2` `^3.23.2`)**: Database utama yang digunakan di lingkungan produksi untuk keandalan dan skalabilitas data.
    *   **SQLite (`better-sqlite3` `12.8.0`)**: Digunakan sebagai database cadangan (*fallback*) lokal.
    *   **Mekanisme Fallback Pintar ([`database.ts`](WEBSITE/AGORAACTA_WEBSITE/strapi-cms/config/database.ts))**: Saat inisialisasi, Strapi memeriksa apakah port MySQL terbuka. Jika MySQL tidak dapat dijangkau di lingkungan non-produksi, Strapi secara otomatis beralih menggunakan SQLite lokal (`strapi_data.db`) agar pengembangan tetap dapat berjalan tanpa hambatan.
*   **Keamanan Upload ([`plugins.ts`](WEBSITE/AGORAACTA_WEBSITE/strapi-cms/config/plugins.ts))**:
    *   Membatasi tipe media yang diizinkan (gambar, video, audio, PDF, dokumen kantor, teks).
    *   Secara eksplisit memblokir file eksekusi berbahaya (seperti `.exe`, `.sh`, `.bin`, dll.) untuk mencegah serangan eksekusi kode jarak jauh (RCE).

### Content Types (Skema API):
Skema konten didefinisikan secara modular di bawah direktori `strapi-cms/src/api/`:
*   `sekbid`: Mengelola informasi 8 Seksi Bidang OSIS.
*   `anggota-osis`: Mengelola daftar pengurus OSIS beserta jabatan, kelas, divisi, dan urutan tampilan.
*   `program-kerja`: Mengelola program kerja OSIS yang terhubung dengan Sekbid terkait.
*   `halaman`: Mengelola konten halaman statis seperti About Us dan Kebijakan Privasi.
*   `galeri-foto` & `media-asset`: Mengelola dokumentasi kegiatan dan aset media sosial.
*   `inbox`: Menampung saran, ide, atau aspirasi dari pengguna yang dikirim melalui website.
*   `notification`: Menyimpan riwayat notifikasi sistem.
*   `edufest-config`, `edufest-division`, `edufest-member`, `edufest-timeline`: Skema khusus untuk sub-event Edufest Infinity.

### Skrip Kustom (Custom Scripts):
*   **`sync-db.js` ([`sync-db.js`](WEBSITE/AGORAACTA_WEBSITE/strapi-cms/scripts/sync-db.js))**: Skrip otomatisasi untuk menyinkronkan seluruh data dari database MySQL produksi ke database SQLite lokal. Skrip ini menonaktifkan batasan kunci asing (*foreign keys*) sementara, menghapus data lama, dan menyalin data baru dalam satu transaksi berkinerja tinggi.
*   **`sync-kepengurusan.ts` ([`sync-kepengurusan.ts`](WEBSITE/AGORAACTA_WEBSITE/strapi-cms/scripts/sync-kepengurusan.ts))**: Skrip TypeScript untuk melakukan seeding data kepengurusan OSIS secara otomatis ke database Strapi berdasarkan data statis terstruktur (60+ pengurus dari BPH hingga Sekbid 1-8).
*   **`sync-data.ts` ([`sync-data.ts`](WEBSITE/AGORAACTA_WEBSITE/strapi-cms/scripts/sync-data.ts))**: Memverifikasi jumlah entri data di Strapi setelah proses sinkronisasi selesai.

---

## 4. Integrasi & Otomatisasi

Alur kerja otomatisasi diatur menggunakan n8n untuk menghubungkan interaksi pengguna di frontend dengan sistem notifikasi internal pengurus OSIS.

### Alur Kerja Otomatisasi n8n ([`n8n-notification-workflow.json`](WEBSITE/AGORAACTA_WEBSITE/n8n-notification-workflow.json)):

```
[Pengguna mengirim Saran/Ide] 
       │
       ▼
[Next.js API /api/inbox] ──> [Simpan di Strapi (Model: Inbox)]
                                       │
                                       ▼ (Webhook Event: entry.create)
                             [n8n Webhook Trigger]
                                       │
                                       ▼
                             [Filter: Model == inbox]
                                       │
                                       ▼
                             [AI Agent (Gemini 3.5 Flash)]
                             - Membuat ringkasan (1-2 kalimat)
                             - Menentukan kategori & urgensi
                             - Memberikan rekomendasi tindak lanjut
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
       [Simpan Notifikasi di Strapi]           [Kirim ke Telegram Bot]
                     │                         - Format Markdown menarik
                     ▼                         - Detail pengirim & pesan
       [Broadcast via Next.js SSE]             - Analisis AI (Urgensi, Kategori)
       - Notifikasi real-time muncul
         di layar admin/pengguna
```

1.  **Pemicu Webhook**: n8n mendengarkan event `entry.create` dari Strapi ketika entri baru ditambahkan ke model `inbox`.
2.  **Penyaringan Data**: Memastikan data yang masuk adalah model `inbox` sebelum melanjutkan alur kerja.
3.  **Analisis AI (Gemini 3.5 Flash)**:
    *   n8n mengirimkan data saran/ide ke model AI `google/gemini-3.5-flash` melalui gateway 9router.
    *   AI menganalisis teks saran dan menghasilkan output JSON terstruktur yang berisi: ringkasan singkat, kategori permintaan, tingkat urgensi (`low`/`medium`/`high`), dan rekomendasi tindak lanjut.
4.  **Penyimpanan Notifikasi**: n8n menyimpan hasil analisis AI kembali ke Strapi di bawah model `notification`.
5.  **Notifikasi Telegram**: Mengirimkan pesan terformat Markdown ke grup/chat Telegram pengurus OSIS (`chatId: 8095634777`) menggunakan bot Telegram OSIS. Pesan mencakup nama pengirim, isi saran, ringkasan AI, kategori, tingkat urgensi, dan rekomendasi tindakan.
6.  **SSE Broadcast**: n8n memanggil API `/api/sse/broadcast` di Next.js untuk menyiarkan notifikasi baru secara real-time ke seluruh klien aktif yang sedang membuka website.

---

## 5. Rekomendasi & Optimasi

Berdasarkan temuan arsitektur dan laporan optimasi PageSpeed sebelumnya ([`pagespeed-optimization-report.md`](WEBSITE/AGORAACTA_WEBSITE/reports/pagespeed-optimization-report.md)), berikut adalah rekomendasi strategis untuk meningkatkan performa, keamanan, dan keandalan sistem Agoraacta:

### A. Optimasi Performa Frontend (PageSpeed Metrics)
*   **Pertahankan ISR (Incremental Static Regeneration)**: Halaman utama (`/`) dan halaman program kerja harus tetap menggunakan `revalidate = 60` (atau lebih tinggi) daripada rendering dinamis penuh (`force-dynamic`). Ini memangkas waktu respon server (TTFB) secara signifikan karena halaman disajikan langsung dari cache statis.
*   **Optimasi Gambar Lanjutan**:
    *   Pastikan seluruh gambar dinamis dari Strapi dimuat melalui proxy kompresi `/api/compress-image?url=...` untuk memastikan konversi otomatis ke format WebP.
    *   Gunakan atribut `priority` pada gambar di atas lipatan (*above-the-fold*) seperti gambar Hero untuk meningkatkan metrik LCP (Largest Contentful Paint).
*   **Pemisahan Kode (Code Splitting) untuk Edufest**:
    *   Halaman Edufest Infinity memuat banyak scene animasi berat. Pastikan komponen scene 3D/interaktif diimpor secara dinamis menggunakan `next/dynamic` dengan opsi `ssr: false` untuk mengurangi ukuran bundel JavaScript utama.

### B. Keamanan & Ketahanan Sistem
*   **SSRF Hardening pada Proxy Gambar**:
    *   Meskipun proxy kompresi gambar telah memblokir skema non-HTTP/HTTPS, disarankan untuk menambahkan daftar putih (*whitelist*) domain yang diizinkan (misalnya hanya mengizinkan domain Strapi internal dan eksternal yang sah) untuk mencegah penyalahgunaan proxy sebagai pemindai port internal.
*   **Keamanan Endpoint SSE**:
    *   Endpoint `/api/sse/broadcast` saat ini menerima permintaan POST tanpa autentikasi. Endpoint ini harus dilindungi menggunakan token rahasia (mirip dengan `REVALIDATE_SECRET`) agar pihak luar tidak dapat mengirimkan notifikasi palsu ke klien.
*   **Penyempurnaan Fallback Database**:
    *   Mekanisme fallback SQLite di `database.ts` sangat baik untuk pengembangan. Namun, pastikan di lingkungan produksi, jika MySQL mati, sistem memberikan peringatan keras (alerting) ke Telegram pengurus daripada sekadar mencatat log, karena SQLite lokal tidak akan sinkron dengan data MySQL utama di server produksi yang berbeda.

### C. Otomatisasi & Skalabilitas n8n
*   **Penanganan Kegagalan (Error Handling) di n8n**:
    *   Tambahkan node penanganan kesalahan di n8n jika API Gemini AI mengalami limitasi kuota (*rate limit*) atau jika bot Telegram gagal mengirim pesan, sehingga pesan inbox dari pengguna tidak hilang tanpa jejak.
*   **Pembersihan Cache Cloudflare**:
    *   Pastikan kredensial Cloudflare (`CF_ZONE_ID` dan `CF_API_TOKEN`) selalu terkonfigurasi dengan benar di environment produksi agar pembersihan cache CDN berjalan mulus setiap kali pengurus memperbarui konten di Strapi.

---

*Laporan ini disusun sebagai panduan arsitektur dan optimasi berkelanjutan untuk tim pengembang Agoraacta.*

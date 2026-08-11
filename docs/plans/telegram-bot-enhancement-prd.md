# PRD: Peningkatan Integrasi Telegram Bot

## 1. Goals & Objectives
Meningkatkan kapabilitas komunikasi antara sistem backend dan administrator melalui Telegram Bot untuk memastikan respon yang lebih cepat terhadap input pengguna dan pemantauan stabilitas infrastruktur secara real-time.

**Tujuan Utama:**
- **Optimasi Notifikasi:** Mengubah notifikasi pasif menjadi interaktif untuk mempercepat manajemen inbox.
- **Visibilitas Sistem:** Memberikan peringatan dini terkait kesehatan server, CMS, dan website untuk meminimalkan downtime.

## 2. User Stories
- **Sebagai Admin,** saya ingin menerima notifikasi yang terformat rapi dengan ringkasan AI agar saya bisa memahami inti pesan tanpa membaca seluruh teks.
- **Sebagai Admin,** saya ingin dapat menandai pesan sebagai "Selesai" atau "Butuh Tindak Lanjut" langsung dari Telegram agar manajemen tugas lebih efisien.
- **Sebagai Developer,** saya ingin menerima peringatan otomatis jika salah satu proses PM2 (Strapi/Next.js) crash agar saya bisa melakukan restart segera.
- **Sebagai Developer,** saya ingin menerima laporan penggunaan CPU dan RAM secara berkala untuk memantau performa server.

## 3. Functional Requirements

### 3.1 Improvement of Notification Flow (Strapi $\rightarrow$ n8n $\rightarrow$ AI $\rightarrow$ Telegram)
- **Rich Formatting:** Menggunakan MarkdownV2 untuk struktur pesan yang lebih jelas (Bold, Italic, Monospace untuk ID).
- **Interactive Buttons:**
    - Tombol `✅ Selesai`: Mengupdate status entry di Strapi menjadi 'resolved'.
    - Tombol `⚠️ Prioritas`: Mengubah urgensi entry menjadi 'high'.
    - Tombol `🔗 Buka Admin`: Link langsung ke entry spesifik di Strapi Dashboard.
- **Error Handling:** Implementasi retry mechanism di n8n jika API Telegram atau Strapi mengalami timeout.
- **AI Refinement:** Penyesuaian prompt AI untuk memberikan rekomendasi tindakan yang lebih spesifik berdasarkan kategori.

### 3.2 System Monitoring Log (Server $\rightarrow$ n8n $\rightarrow$ Telegram)
- **Event-Driven Alerts:**
    - Notifikasi instan saat proses PM2 mengalami `restart` atau `crash`.
    - Alert jika penggunaan RAM melebihi ambang batas (misal: > 80%).
- **Periodic Health Check:**
    - Laporan harian/jam-jaman berisi status `online/offline` dari:
        - Strapi CMS
        - Next.js Website
        - Database (SQLite/PostgreSQL)
- **Metrics Reporting:** Pengiriman data CPU load, Memory usage, dan Disk space.

## 4. Technical Architecture

### 4.1 Notification Flow Enhancement
- **n8n Nodes:**
    - `Webhook Node`: Menerima event dari Strapi.
    - `AI Agent Node`: Analisis konten dan penentuan urgensi.
    - `Telegram Node`: Mengirim pesan dengan `inline_keyboard`.
    - `Webhook Response Node`: Menangani callback dari tombol Telegram untuk update balik ke Strapi.

### 4.2 Monitoring Flow Implementation
- **Data Source:** PM2 API atau Cron Job yang menjalankan `pm2 jlist` dan `top/free -m`.
- **Transport:** 
    - Script Bash/Node.js $\rightarrow$ n8n Webhook $\rightarrow$ Telegram.
- **n8n Nodes:**
    - `Webhook Node`: Endpoint untuk menerima data monitoring.
    - `Filter/Switch Node`: Memisahkan antara log rutin (info) dan alert kritis (error).
    - `Telegram Node`: Mengirim notifikasi dengan emoji indikator (🟢 OK, 🔴 CRITICAL).

## 5. Success Metrics
- **Response Time:** Penurunan waktu rata-rata admin dalam merespon inbox Strapi.
- **Downtime Reduction:** Penurunan waktu deteksi kegagalan sistem (MTTD - Mean Time To Detect).
- **Operational Efficiency:** Pengurangan kebutuhan untuk login manual ke SSH hanya untuk mengecek status server.

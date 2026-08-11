# Panduan Setup n8n di CasaOS (Server Kedua)

Dokumen ini berisi panduan langkah demi langkah untuk mengimpor dan mengonfigurasi workflow integrasi Telegram Bot & Monitoring Sistem pada instance n8n yang berjalan di CasaOS.

---

## 1. Impor Workflow ke n8n
1. Buka dashboard **n8n** di CasaOS Anda.
2. Di menu sebelah kiri, pilih **Workflows** lalu klik **Add Workflow** (atau tombol `+`).
3. Klik ikon tiga titik di pojok kanan atas, lalu pilih **Import from File**.
4. Pilih file [`n8n-notification-workflow.json`](../../n8n-notification-workflow.json) dari repositori ini.
5. Klik **Save** untuk menyimpan workflow.

---

## 2. Konfigurasi Kredensial (Credentials)
Setelah workflow diimpor, Anda perlu mengonfigurasi kredensial untuk layanan eksternal pada node-node yang bersangkutan:

### A. Telegram Bot API
1. Buat bot baru melalui `@BotFather` di Telegram jika belum punya, lalu dapatkan **Bot Token**.
2. Di n8n, buka salah satu node Telegram (misal: `Send to Telegram`).
3. Pada bagian **Credential for Telegram API**, pilih **Create New Credential**.
4. Masukkan **Access Token** bot Anda, lalu simpan dengan nama `Telegram Bot OSIS`.

### B. Gemini AI via 9router (OpenAI API Node)
1. Dapatkan API Key dari akun **9router** Anda.
2. Di n8n, buka node `AI Model (Gemini)`.
3. Pada bagian **Credential for OpenAI API**, pilih **Create New Credential**.
4. Masukkan **API Key** Anda.
5. Pada bagian **Base URL**, masukkan URL endpoint 9router (misal: `https://api.9router.com/v1`).
6. Simpan kredensial dengan nama `9router`.

### C. Strapi API Token
1. Masuk ke Strapi Admin di Server 1 (`https://osisstrapi.biezz.my.id/admin`).
2. Buka **Settings** -> **API Tokens** -> **Create new API Token**.
3. Pilih tipe **Full Access** dan beri nama `n8n Integration Token`. Salin token yang dihasilkan.
4. Di n8n, buka node HTTP Request (misal: `Update Strapi: Selesai`).
5. Pada bagian **Authentication**, pilih **Predefined Credential Type** -> **Header Auth**.
6. Buat kredensial baru dengan nama `Strapi API Token`:
   - **Name:** `Authorization`
   - **Value:** `Bearer <TOKEN_STRAPI_ANDA>`

---

## 3. Konfigurasi Environment Variables di n8n
Pastikan variabel lingkungan berikut dikonfigurasi di n8n (bisa melalui pengaturan kontainer n8n di CasaOS atau langsung menggunakan environment variables):
- `STRAPI_URL`: `https://osisstrapi.biezz.my.id`
- `STRAPI_TOKEN`: Token API Strapi Anda (jika digunakan dalam ekspresi node).
- `NEXTJS_URL`: `https://osissmaitfithrahinsani.sch.id` (atau URL Next.js Anda).

---

## 4. Registrasi Webhook Telegram untuk Callback Buttons
Agar tombol interaktif (✅ Selesai & ⚠️ Prioritas) dapat merespon klik dari admin, Telegram harus mengirimkan event callback ke n8n.
1. Salin **Production URL** dari node `Telegram Callback Webhook` di n8n (misal: `https://n8n.domain.com/webhook/telegram-callback`).
2. Jalankan perintah `curl` berikut di terminal Anda (atau buka di browser) untuk mendaftarkan webhook tersebut ke Telegram:
   ```bash
   curl -X GET "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://n8n.domain.com/webhook/telegram-callback"
   ```
   *(Ganti `<TELEGRAM_BOT_TOKEN>` dengan token bot Anda, dan sesuaikan URL webhook n8n Anda).*

---

## 5. Setup Script Monitoring di Server 1 (App Server)
Agar Server 1 dapat mengirimkan metrik performa ke n8n di Server 2:
1. Salin file script [`monitor.sh`](../scripts/monitor.sh) ke Server 1 pada path `/usr/local/bin/server-monitor.sh`.
2. Edit script tersebut dan ganti `N8N_WEBHOOK_URL` dengan **Production URL** dari node `Server Monitor Webhook` di n8n (misal: `https://n8n.domain.com/webhook/server-monitor`).
3. Berikan izin eksekusi pada script:
   ```bash
   sudo chmod +x /usr/local/bin/server-monitor.sh
   ```
4. Daftarkan script ke cron agar berjalan setiap 5 menit:
   ```bash
   sudo crontab -e
   ```
   Tambahkan baris berikut di bagian paling bawah:
   ```cron
   */5 * * * * /usr/local/bin/server-monitor.sh > /dev/null 2>&1
   ```

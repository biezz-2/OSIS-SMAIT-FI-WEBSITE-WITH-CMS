# Action Plan: Solusi Pencegahan Data Loss Konfigurasi Strapi CMS

## 1. Konteks Masalah
Ketika AI Agent melakukan perbaikan bug atau perubahan fitur pada backend Strapi CMS atau frontend, konfigurasi dinamis yang sudah dimasukkan melalui Strapi Admin (contoh: Link YouTube, Embed Video, Metadata Sosmed) terkadang hilang atau kembali ke nilai hardcoded bawaan.

### Akar Masalah yang Teridentifikasi:
1. **Auto-Override di `strapi-cms/src/index.ts` saat Bootstrap**:
   - `seedHalamanUtama()` memiliki blok kode kondisional yang melakukan `update` ke dokumen `media-sosial` jika `metadata_json` dianggap tidak lengkap, menimpa link YouTube dengan URL bawaan (`dQw4w9WgXcQ`).
   - `publishExistingDrafts()` memaksa mem-publish draf pada saat server menyala, yang dapat mengunci state data yang belum final.
2. **Ambigu/Duplikasi Skema Field (`schema.json`)**:
   - Terdapat field `embed_youtube`, `link_youtube`, dan field di dalam `metadata_json` (`metadata_json.embeds.youtube` dan `metadata_json.social_accounts.youtube.link`).
   - Frontend dan admin terkadang membaca dan menulis ke field yang berbeda sehingga perubahan di satu field tidak merefleksikan nilai yang diharapkan.
3. **Sinkronisasi Database MySQL vs SQLite (`sync-db.js`)**:
   - Terdapat skrip `sync-db.js` yang menyalin data dari MySQL ke SQLite setiap 10 menit dengan pola `DELETE FROM` lalu `INSERT INTO`.
   - Jika ada agent yang bekerja dengan SQLite lokal dan melakukan perubahan atau migrasi sepihak ke MySQL, data di MySQL berisiko tertimpa data lama.

---

## 2. Rencana Tindakan & Mitigasi Teknis

### Fase 1: Hardening Seeder di `strapi-cms/src/index.ts`
- [ ] **Jadikan Seeder Bersifat Idempoten Murni (Insert Only if Empty)**:
  - Hapus logika pemanggilan `.update()` terhadap data yang sudah ada di database.
  - Tambahkan guard clause ketat: seeder hanya berjalan jika koleksi kosong (`count === 0`).
  - Hapus penulisan paksa hardcoded YouTube URL default pada entri yang sudah tersimpan.
- [ ] **Flagging Khusus Seeding**:
  - Bungkus eksekusi fungsi seeder dengan environment variable `ENABLE_DB_SEED=true`. Secara default di production/development aktif, nilai ini `false` agar tidak ada manipulasi data runtime saat Strapi restart.

### Fase 2: Unifikasi & Konsolidasi Field Skema Media Sosial
- [ ] **Pilih Single Source of Truth**:
  - Jadikan `embed_youtube` dan `link_youtube` sebagai kolom utama tingkat atas (first-class attributes) di skema `halaman`.
  - Buat helper/transformasi otomatis di lifecycle hook (`beforeUpdate` / `beforeCreate`) yang menyinkronkan nilai kolom utama ke dalam `metadata_json` atau sebaliknya, sehingga input admin melalui form manapun tetap konsisten.
- [ ] **Pembaruan Konsumsi Data di Frontend**:
  - Pastikan komponen Next.js (`osis-smait-fi/src/components/sosmed/SosmedHub.tsx`, `Footer.tsx`, dll.) membaca fallback berurutan:
    `halaman.embed_youtube || halaman.metadata_json?.embeds?.youtube`.

### Fase 3: Isolasi & Pengamanan Database Workflow
- [ ] **Pemisahan Jelas Environment Agent**:
  - Aturan mutlak untuk AI Agent: dilarang menjalankan `npm run seed` atau script migrasi destruktif saat memperbaiki bug fungsional.
  - Periksa `sync-db.js` agar hanya membaca (*read-only mirror*) dan tidak pernah melakukan *reverse-sync* yang menghapus data MySQL produksi.
- [ ] **Validasi Snapshot Data Sebelum Perbaikan**:
  - Setiap agent sebelum menyentuh file backend wajib memastikan tidak mengubah skema tanpa migrasi terencana dan tidak merestart DB dengan database kosong.

---

## 3. Checklist Verifikasi & Testing
1. Ubah link YouTube di Strapi Admin Panel menjadi link video resmi OSIS.
2. Simpan dan publish di Strapi Admin.
3. Restart Strapi CMS (`npm run build && npm run start`).
4. Pastikan link YouTube yang telah disimpan **tidak berubah** dan tidak tertimpa default.
5. Verifikasi tampilan di frontend (`/sosmed` dan footer) menampilkan data yang benar.

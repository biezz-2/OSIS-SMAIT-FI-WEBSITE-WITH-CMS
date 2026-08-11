# 📓 Catatan Developer — Agora Acta 2025

> Catatan teknis singkat dan penting bagi pengembang yang mengerjakan proyek ini.

---

## 🔑 Perintah Penting

### Deployment & Monitoring
```bash
# Deploy frontend ke produksi
cd osis-smait-fi && npm run build && pm2 restart osis-next-frontend

# Memantau log live
pm2 logs osis-next-frontend --lines 50

# Restart backend Strapi
pm2 restart osis-strapi-backend
```

### Pengembangan Lokal
```bash
# Mengisi database Strapi lokal dengan data contoh
cd strapi-cms && npm run seed
```

---

## ⚠️ Hal Penting yang Harus Diperhatikan

### 1. Sanitasi URL Strapi
Semua URL gambar dari Strapi **wajib** dilewatkan melalui fungsi `getStrapiMediaUrl()` di `lib/strapi.ts`. Jangan gunakan URL mentah karena:
- Lingkungan *Development* menggunakan `http://localhost:1337`.
- Lingkungan *Production* menggunakan `https://osisstrapi.biezz.my.id`.
- Fungsi ini menangani konversi otomatis antara keduanya.

### 2. Format Data Strapi v4 vs v5
Strapi v5 mengirimkan data secara *flat* (tanpa `data.attributes`), namun beberapa field mungkin masih menggunakan format lama. Gunakan akses data secara defensif:
```ts
const attrs = item.attributes || item;
```

### 3. Strategi Rendering (`force-dynamic` vs ISR)
- **Beranda (`/`)**: Menggunakan ISR 60 detik — **DILARANG** mengubah menjadi `force-dynamic`.
- **Anggota (`/anggota`)**: Menggunakan `force-dynamic` agar data pengurus selalu terbaru.

### 4. Domain Gambar `next/image`
Sebelum menambahkan gambar dari host baru, tambahkan domain tersebut di `next.config.ts` pada bagian `images.remotePatterns`.

### 5. Konfigurasi Port PM2
- **Next.js**: Port **3002** (Bukan 3000).
- **Strapi**: Port **1337**.

---

## 🐛 Log Bug & Solusi

| Bug | Penyebab | Solusi |
| :--- | :--- | :--- |
| Event tidak tampil | Field `tanggal_mulai` tidak terekspos di Strapi | Implementasi fallback sort ke `createdAt:desc` |
| Gambar blank setelah deploy | URL masih mengarah ke `http://localhost` | Implementasi auto-sanitize di `getStrapiMediaUrl()` |
| CLS tinggi di galeri | Dimensi gambar belum diketahui saat render | Implementasi caching dimensi di `localStorage` |
| Halaman anggota lambat | Terlalu banyak gambar tanpa kompresi | Implementasi `ImageQualityContext` + `/api/compress-image` |
| Tema tidak konsisten | Overrides CSS kurang spesifik pada rute dinamis | Penggunaan variabel HSL kustom dan selector `html.dark` di `globals.css` |

---

## 📋 Backlog Teknis (TODO)

- [ ] Implementasi `error.tsx` per rute untuk fallback saat Strapi offline.
- [ ] Refaktorisasi `AnggotaList.tsx` menjadi sub-komponen yang lebih kecil.
- [ ] Implementasi `sitemap.ts` dinamis (Sekbid 1-8 & Proker slugs).
- [ ] Migrasi sisa tag `<img>` HTML standar ke `next/image`.
- [x] Implementasi PWA via service worker kustom `/sw.js` & manifest.
- [ ] Review penggunaan `force-dynamic` pada `/anggota` untuk kemungkinan ISR 60s.

---

## 🏢 Sinkronisasi Dokumentasi Confluence

Seluruh dokumentasi di direktori `osis-smait-fi/docs/` disinkronkan dengan **Atlassian Confluence**:
- **Workspace**: `biezzpanel.atlassian.net`
- **Space Wiki**: [biezzpanel.atlassian.net/wiki](https://biezzpanel.atlassian.net/wiki)

**Pemetaan Halaman:**
1. 📘 **Overview & Architecture** $\rightarrow$ [`ARCHITECTURE.md`](osis-smait-fi/docs/ARCHITECTURE.md)
2. 📊 **System Analysis** $\rightarrow$ [`SYSTEM_ANALYSIS.md`](osis-smait-fi/docs/SYSTEM_ANALYSIS.md)
3. 🚀 **Latest Release & Updates** $\rightarrow$ [`UPDATE/LATEST_UPDATES.md`](osis-smait-fi/docs/UPDATE/LATEST_UPDATES.md)
4. 📜 **Changelog** $\rightarrow$ [`CHANGELOG/CHANGELOG.md`](osis-smait-fi/docs/CHANGELOG/CHANGELOG.md)
5. 🛠️ **Developer Notes & Runbook** $\rightarrow$ [`CATATAN.md`](osis-smait-fi/docs/CATATAN.md)

---

## 🔗 Tautan Penting

- **Strapi Admin**: [osisstrapi.biezz.my.id/admin](https://osisstrapi.biezz.my.id/admin)
- **Website Produksi**: [osissmaitfithrahinsani.sch.id](https://osissmaitfithrahinsani.sch.id)
- **Dokumentasi Confluence**: [biezzpanel.atlassian.net/wiki](https://biezzpanel.atlassian.net/wiki)

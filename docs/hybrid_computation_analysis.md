# Analisis Pengurangan Beban Komputasi VPS (Skema Hybrid)

Dokumen ini menjelaskan dampak pemindahan frontend Next.js ke Firebase/Vercel (Skema Hybrid) terhadap efisiensi penggunaan sumber daya (CPU, RAM, Storage, Network) pada VPS Anda.

---

## 📉 1. Estimasi Pengurangan Beban Sumber Daya VPS

Dengan memindahkan Next.js frontend ke Firebase, berikut adalah beban komputasi yang hilang dari VPS Anda:

### A. Penggunaan RAM (Sangat Signifikan)
* **Sebelumnya (VPS)**:
  * Next.js (Node.js runtime) berjalan aktif via PM2: memakan **150MB - 300MB RAM** secara konstan.
  * Image caching/processing runtime: memakan tambahan memori saat ada request kompresi gambar.
* **Setelah Migrasi (Firebase)**:
  * Node.js runtime frontend mati dari PM2.
  * VPS menghemat sekitar **150MB - 300MB RAM** secara instan. Ini sangat berguna jika VPS Anda memiliki RAM kecil (misal 1GB atau 2GB).

### B. Penggunaan CPU (Signifikan pada Traffic Peak)
* **Sebelumnya (VPS)**:
  * **SSR (Server Side Rendering)**: Server memproses Javascript + React component rendering pada setiap hit halaman dinamis.
  * **Image Compression (`sharp`)**: Memproses format `.jpg`/`.png` menjadi `.webp` yang memicu spike CPU hingga 100% pada CPU single-core VPS saat banyak gambar dimuat bersamaan.
* **Setelah Migrasi (Firebase)**:
  * Beban SSR dan Image Compression dipindahkan sepenuhnya ke infrastruktur serverless Firebase/Vercel.
  * CPU VPS hanya bekerja jika ada request data API dari Strapi (ringan karena hanya query JSON/Database).

### C. Bandwidth / Network I/O (Sangat Signifikan)
* **Sebelumnya (VPS)**:
  * VPS melayani pengiriman semua file statis website (HTML, CSS, JS bundles) serta gambar berukuran besar ke browser user.
  * Bandwidth VPS cepat habis jika traffic tinggi.
* **Setelah Migrasi (Firebase)**:
  * Semua aset statis dan bundle Next.js dilayani oleh Firebase CDN secara gratis.
  * Bandwidth VPS hanya digunakan untuk transfer data JSON dari API Strapi (sangat kecil dibanding ukuran bundle JS/CSS/Gambar).

---

## 📊 2. Distribusi Beban Kerja (Hybrid Setup)

Berikut adalah pembagian tugas setelah migrasi Hybrid diimplementasikan:

```
[ User Browser ]
   │
   ├─► (Request Website / Halaman Statis / Asset Gambar) ──► [ Firebase Hosting & CDN ] (Menangani 90% traffic, gratis/cepat)
   │
   └─► (Request Data / Isi Konten Dinamis / Admin Panel) ──► [ VPS Anda (Strapi CMS + SQLite) ] (Hanya menangani query data kecil)
```

| Komponen | Ditangani Oleh | Dampak pada VPS |
| :--- | :--- | :--- |
| **Penyajian Web (HTML/JS/CSS)** | Firebase CDN | **0% beban di VPS** |
| **Optimasi & Kompresi Gambar** | Firebase / Vercel Edge | **0% beban di VPS** |
| **API Backend (Strapi)** | VPS (PM2) | Tetap ada (ringan, hanya melayani query JSON) |
| **Penyimpanan Database** | VPS (SQLite lokal) | Tetap ada (ringan, I/O disk lokal sangat cepat) |
| **Penyimpanan Media asli** | VPS (`/uploads/`) | Tetap ada (hanya diakses saat backend mengirim gambar ke CDN) |

---

## 📋 3. Kesimpulan

Ya, skema Hybrid **memotong beban komputasi di VPS Anda secara sangat signifikan**. 

* **RAM**: Menghemat sekitar **150MB - 300MB**.
* **CPU**: Menghilangkan CPU spike akibat SSR dan konversi gambar (`sharp`).
* **Bandwidth**: Mengurangi penggunaan kuota bandwidth VPS hingga **80-90%** karena seluruh asset statis ditanggung oleh CDN Firebase.

VPS Anda sekarang hanya bertindak sebagai "Headless CMS" murni yang sangat enteng karena hanya memproses data teks (JSON) dari database SQLite lokal.

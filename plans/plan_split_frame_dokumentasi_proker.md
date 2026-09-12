# Action Plan: Split Layout Frame Dokumentasi Program Kerja Sekbid (Landscape Kiri - Portrait Kanan)

## 1. Status Analisis (Kondisi Eksisting)
- **Komponen Target**: `osis-smait-fi/src/components/program-kerja/ProgramKerjaDetailPage.tsx`.
- **Sumber Data**: Strapi v5 Collection `program-kerja` pada field `dokumentasi` (Media Multiple).
- **Temuan Struktur Data**:
  - Media Strapi secara native menyediakan metadata numerik `width`, `height`, `mime`, dan `url`.
  - Berdasarkan audit data riil di Strapi:
    - Sebagian besar proker memiliki campuran foto horizontal/kamera (landscape, misal `4000x3000`, `1600x1200`) dan poster/story/foto ponsel (portrait, misal `3000x4000`, `1080x2340`, `738x1600`).
    - Beberapa proker memiliki video (misal `MVI_5244.MOV`, `VID-xxx.mp4`) di mana `width`/`height` null dari backend.
- **Masalah Layout Saat Ini**:
  - Fungsi `extractMediaList()` mendegradasi metadata dengan hanya mengambil `{ url, isVideo, caption, alt }`, menghilangkan informasi `width` dan `height`.
  - Container dokumentasi mencampur semua foto dalam 1 grid flat (`grid-cols-3` / `masonry`), menyebabkan foto portrait tinggi berdampingan dengan foto landscape lebar sehingga layout timpang (ragged/berantakan).

---

## 2. Rancangan Arsitektur Solusi (To-Be)

### A. Ekstraksi Metadata Rasio Gambar
Perluas tipe `DocItem`:
```ts
export interface DocMediaItem {
  url: string;
  isVideo: boolean;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
  orientation: 'landscape' | 'portrait' | 'square';
}
```
Aturan penentuan orientasi:
1. Jika `width` & `height` ada:
   - `width > height * 1.05` => `landscape`
   - `height > width * 1.05` => `portrait`
   - Selain itu => `square` (default dimasukkan ke kolom landscape atau opsi netral).
2. Video atau media tanpa metadata dimensi: diklasifikasikan berdasarkan deteksi rasio runtime atau default `landscape`.

### B. Split Dual-Pane Layout (Landscape Kiri - Portrait Kanan)
Struktur grid responsif pada breakpoint desktop (`lg:grid-cols-2` atau split grid):
- **Kolom Kiri (Landscape)**:
  - Header: Label visual/badge "Dokumentasi Landscape / Horizontal".
  - Grid: `grid grid-cols-1 sm:grid-cols-2 gap-4`.
  - Frame ratio: `aspect-[16/10]` atau `aspect-[4/3]` dengan `object-cover` / `object-contain` bersih.
- **Kolom Kanan (Portrait)**:
  - Header: Label visual/badge "Dokumentasi Portrait / Vertikal & Poster".
  - Grid: `grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4`.
  - Frame ratio: `aspect-[3/4]` atau `aspect-[9/16]` ramping.

### C. Penanganan Edge Cases
1. **Hanya Landscape**: Jika foto portrait kosong, kolom kiri melebar full-width (`col-span-full` / `grid-cols-3`) agar tidak ada whitespace kosong.
2. **Hanya Portrait**: Jika foto landscape kosong, kolom portrait otomatis span full-width.
3. **Mobile Screen (< 1024px)**:
   - Layout berubah menjadi stacked vertikal yang rapi: Section Landscape terlebih dahulu, diikuti Section Portrait di bawahnya.
4. **Preview Modal**: Tetap mempertahankan modal preview full-resolution saat diklik.

---

## 3. Tahapan Implementasi Teknis
1. **Update `extractMediaList()` di `ProgramKerjaDetailPage.tsx`**:
   - Parsing atribut `width` dan `height` dari objek media Strapi.
   - Kategorikan media menjadi 2 array: `landscapeDocs` dan `portraitDocs`.
2. **Refactor Section Dokumentasi & Hasil**:
   - Buat kontainer split 2 kolom: `flex flex-col lg:flex-row gap-8 items-start`.
   - Kiri: Kolom foto landscape dengan frame horizontal.
   - Kanan: Kolom foto portrait dengan frame vertikal.
   - Sertakan badge indikator orientasi dan fallback full-width jika salah satu kategori bernilai 0.
3. **Pengujian & Verifikasi**:
   - Tes proker dengan foto campuran (contoh: `pendampingan-rohis`, `kultum`, `class-of-discipline`, `ourself-journey`).
   - Tes proker dengan foto landscape murni (contoh: `bakti-sosial`, `healthy-movement`).
   - Tes proker dengan foto portrait murni (contoh: `school-announcement`, `notifikasi-edukasi`).
4. **Build Check & PM2 Reload**:
   - `npm run build` di `osis-smait-fi`.
   - Reload `pm2 reload osis-next-frontend`.

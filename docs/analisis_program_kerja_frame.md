# Analisis Halaman Program Kerja & Frame Gambar Per Sekbid

## 1. Context & Identifikasi Masalah
Pada halaman Program Kerja (`/program-kerja`) dan Halaman Detail Sekbid (`/sekbid/[sekbidId]`), terdapat keluhan gambar yang terpotong (**cropped**) pada frame gambar header/banner maupun grid per sekbid.

### Penyebab Utama Terpotongnya Gambar:
1. **Hero Banner (`ProgramKerja.tsx`)**:
   - Gambar banner menggunakan CSS `object-cover` dalam wadah `h-[350px] lg:h-full` dengan kontainer tinggi fixed `807px`.
   - Mengakibatkan bagian atas/bawah/samping dari gambar banner (misalnya infografis, poster, foto bersama) terpotong secara paksa.
2. **Sekbid Grid Card (`SeksiBidangGrid.tsx`)**:
   - Card sekbid memiliki wadah gambar fixed height `h-[220px]` dengan kelas `object-cover mix-blend-difference`.
   - Orientasi banner sekbid yang beragam (landscape/portrait/poster) terpotong saat dipaksa mengisi `h-[220px]`.
3. **Banner Detail Sekbid (`SekbidDetail.tsx`)**:
   - Banner hero sekbid menggunakan `object-cover absolute inset-0` di dalam wadah `min-h-[350px] md:min-h-full`.
   - Menyebabkan elemen teks atau subject utama pada gambar banner sekbid terpotong pada layar berukuran sedang & mobile.
4. **Dokumentasi & Card Penanggung Jawab (`ProgramKerjaDetailPage.tsx`)**:
   - Dokumentasi pada mode default menggunakan `object-contain`, namun untuk mode `cover` dan `square` berisiko memotong detail penting jika gambar memiliki aspek rasio yang tidak proporsional.

---

## 2. Solusi Teknis (Optimization Strategy)
Untuk memastikan seluruh gambar tampil utuh **tanpa terpotong** (`object-contain` / flexible frame aspect ratio / responsive wrapper):

1. **Aturan CSS `object-contain` & Flex Center**:
   - Ganti `object-cover` dengan `object-contain` pada wadah banner/frame atau berikan opsi background backdrop blur + `object-contain` agar elemen di dalam gambar 100% terlihat.
   - Tambahkan latar belakang yang harmonis (gelap/gradient/blurred background) sehingga ruang kosong di samping/atas-bawah terisi secara estetis tanpa memotong isi gambar.
2. **SeksiBidangGrid Optimization**:
   - Gunakan `object-contain` atau fleksibilitas `aspect-[16/9]` dengan padding dan backdrop subtle agar ilustrasi/logo/foto sekbid terlihat penuh.
3. **SekbidDetail & ProgramKerja Banner**:
   - Terapkan perpaduan `object-contain` dengan canvas container yang responsif dan fleksibel.

---

## 3. Catatan Implementasi
- Komponen `ProgramKerja.tsx`, `SeksiBidangGrid.tsx`, `SekbidDetail.tsx`, dan `ProgramKerjaDetailPage.tsx` diperbarui dengan teknik responsive aspect container & `object-contain` / blur backdrop.

# PRD: Optimisasi Mode Gelap (Dark Mode) & Responsive Tablet/iPad Website OSIS SMAIT FI

## 1. Ringkasan Eksekutif (Overview)
Pengguna melaporkan adanya masalah kontras visual pada mode gelap (teks & elemen UI tidak terlihat jelas) serta perlunya penyesuaian tata letak responsif pada perangkat berukuran tablet / iPad (breakpoint md & lg).

## 2. Masalah Utama (Problem Statement)
1. **Mode Gelap (Dark Mode Kontras)**:
   - Beberapa komponen hardcode warna teks/background tanpa penanganan `dark:` Tailwind CSS atau CSS variable yang konsisten.
   - Elemen kartu, teks sekunder, badge, dan border menjadi kabur atau terlalu redup saat dark mode aktif.
2. **Responsivitas Tablet / iPad**:
   - Layout grid di breakpoint `768px - 1024px` (iPad Mini, iPad Air, Pro) belum optimal, mengakibatkan elemen menumpuk atau terpotong.
   - Spasi (margin/padding) & ukuran font belum beradaptasi pas di layar tablet portret maupun lanskap.

## 3. Ruang Lingkup Perubahan (Scope)
Halaman utama yang dianalisis:
- Beranda (`/`) - Hero, Introduction, Latest Event, Ticker Gallery
- Tentang Kami (`/about`) - AboutUs, SymbolMeaning, MeetTeam, AnggotaSekbid
- Program Kerja (`/program-kerja`, `/program-kerja/[slug]`) - SeksiBidangGrid, SekbidDetail
- Anggota (`/anggota`) - AnggotaList
- Media Sosial (`/media-sosial`) - SosmedHub
- Edufest Infinity (`/edufest-infinity/*`)

## 4. Persyaratan Fungsional & Non-Fungsional (Requirements)
- **Keterbacaan Teks (WCAG AA Compliance)**: Teks di mode gelap harus memiliki kontras minimum 4.5:1 terhadap latar belakang.
- **Dark Mode Styling Rules**: Gunakan kelas standar Tailwind `dark:text-gray-100`, `dark:bg-slate-900`, `dark:border-slate-800` daripada inline style warna hardcoded.
- **Tablet Layout Optimization**:
  - Grid 1 kolom pada Mobile (`grid-cols-1`)
  - Grid 2-3 kolom pada Tablet (`md:grid-cols-2 lg:grid-cols-3`)
  - Menyesuaikan padding kontainer (`px-4 md:px-8 lg:px-12`)
- **Navigasi & Touch Target**: Tombol & link mudah ditekan di layar sentuh tablet (minimal 44x44px).

## 5. Rencana Pelaksanaan (Implementation Plan)
1. Audit komponen utama beranda (`Hero.tsx`, `Introduction.tsx`, `LatestEvent.tsx`).
2. Audit halaman `/about`, `/program-kerja`, `/anggota`, dan `/media-sosial`.
3. Perbaiki CSS global (`globals.css`) dan variabel warna pendukung mode gelap.
4. Sesuaikan breakpoint responsive Tailwind (`md:` dan `lg:`) pada semua card grid & section.
5. Uji keterbacaan kontras dan kerapihan tata letak.

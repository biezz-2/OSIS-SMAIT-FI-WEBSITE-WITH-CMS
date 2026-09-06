# Analisis Website OSIS & Halaman Edufest Infinity

## 1. Analisis Struktur & Arsitektur Utama
 Website OSIS SMA IT Fithrah Insani (Agoraacta) dibangun menggunakan Next.js (App Router), Tailwind CSS v4, Framer Motion, GSAP, dan Strapi CMS v5.

### Halaman Utama OSIS (`/`, `/about`, `/anggota`, `/program-kerja`, `/partners`, `/events`, dll.)
- Menggunakan `Navbar` dan `Footer` global.
- Mendukung toggle dark mode via kelas `dark` pada `document.documentElement` (`html.dark`).
- Gaya global `globals.css` memiliki selektor override untuk `html.dark` pada latar belakang (`#0b0f17`), kartu (`#131b2e`), dan kontras teks (`#f9fafb` / `#d1d5db`).

### Halaman Edufest Infinity (`/edufest-infinity/*`)
- Rute portal event tahunan edufest (`/edufest-infinity`, `/location`, `/panitia`, `/timeline`).
- Layout `edufest-infinity/layout.tsx` menggunakan kelas scoping `.edufest-theme` dan CSS Variables `--background`, `--foreground`, `--background-accent`, dll.
- Komponen navigasi melayang: `LiquidGlassNav` (terdapat di sub-halaman edufest).

---

## 2. Masalah & Temuan pada Halaman Edufest Infinity

1. **Ketidakadaan Toggle Terang/Gelap di Edufest Navigasi**:
   - `LiquidGlassNav` hanya berisi tautan navigasi tanpa tombol pengganti mode terang/gelap (`AnimatedThemeToggler`).
   - Pada halaman utama edufest (`/edufest-infinity`), `LiquidGlassNav` disembunyikan (`showNav = pathname !== "/edufest-infinity"`), sehingga pengunjung tidak memiliki toggle langsung di landing page edufest jika nav disembunyikan, atau toggle perlu dimasukkan ke dalam `LiquidGlassNav` & disajikan secara konsisten.

2. **Hardcoded Color Classes Menyebabkan Isu Visibilitas Mode Terang/Gelap**:
   - **`SceneAbout.tsx`**: Teks judul (`text-black`) dan deskripsi (`text-black`) menggunakan kelas hardcoded `text-black`, sehingga saat dark mode tetap hitam dan tidak terlihat di latar belakang gelap.
   - **`SceneSelayang.tsx`**: Menggunakan `text-black`, `text-black/80`, `text-black/90`, `bg-black/5`, `border-black/10` secara hardcoded. Dalam mode gelap, teks hitam menjadi tidak terbaca (*invisible*).
   - **`SceneOutro.tsx`**: Menggunakan background hardcoded `bg-blue-900` dan `bg-white text-black`.
   - **`location/page.tsx` & `timeline/page.tsx`**: Memaksa `bg-black text-white` hardcoded. Di mode terang, latar belakang hitam keras dan kontras tidak adaptif.
   - **`panitia/page.tsx`**: Menggunakan `bg-[#0a0a0f]` keras dan `text-white`.

---

## 3. Rencana Perbaikan Visibilitas & Toggle Dark/Light Mode

1. **Tambahkan Theme Toggler di Edufest Infinity**:
   - Integrasikan `AnimatedThemeToggler` ke dalam `LiquidGlassNav`.
   - Di `EdufestLayout` (`layout.tsx`), pastikan tombol toggle atau `LiquidGlassNav` selalu tersedia di semua halaman Edufest Infinity (atau tampilkan toggle melayang yang responsif).

2. **Refactor Hardcoded Colors ke Dynamic CSS Variables / Dark Mode Classes**:
   - Ubah `text-black` di `SceneAbout` dan `SceneSelayang` menggunakan `text-[var(--foreground)]` atau `text-gray-900 dark:text-gray-100`.
   - Sesuaikan `bg-black/5` dan `border-black/10` di `SceneSelayang` menjadi `bg-gray-100 dark:bg-white/10` dan `border-gray-200 dark:border-white/10`.
   - Sesuaikan `location/page.tsx`, `timeline/page.tsx`, dan `panitia/page.tsx` agar menggunakan `bg-[var(--background)]` dan `text-[var(--foreground)]` serta varian `dark:` agar transisi terang/gelap berjalan mulus dan semua teks/elemen tetap terlihat jelas di kedua mode.

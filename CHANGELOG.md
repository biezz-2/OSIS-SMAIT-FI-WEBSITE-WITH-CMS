# 📜 Changelog — OSIS SMAIT Fithrah Insani (Agora Acta)

Semua perubahan penting pada proyek **Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025 - Bhaskara)** didokumentasikan di berkas ini.

Format changelog ini mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.9] - 2026-09-10

### 🐛 Diperbaiki

- **Perbaikan Scroll Lock Halaman Edufest (`/edufest-infinity`)**:
  - **Root Cause**: `useSmoothScroll()` (Lenis) diinisialisasi saat `introComplete: false` ketika DOM hanya berisi `IntroOrchestrator` (`h-screen`). Saat intro selesai dan `children` (scene multi-ribu piksel) di-mount, dimensi Lenis basi (`maxScroll = 0`) menyebabkan semua scroll event dikonsumsi dan dibatalkan.
  - Menambahkan `useEffect` di `src/app/edufest-infinity/layout.tsx` yang menyaksikan `introComplete` dan memanggil `lenis.resize()` + `ScrollTrigger.refresh()` setelah delay 150ms (DOM paint) dan 500ms (animasi mount selesai).
  - Mengubah `useSmoothScroll()` di `src/lib/lenis.ts` agar mengembalikan `Lenis instance`, menambahkan `autoRaf: false`, dan listener `window.resize` otomatis untuk `lenis.resize()` + `ScrollTrigger.refresh()`.
  - Menambahkan override CSS `html.lenis { scroll-behavior: auto !important; }` di `src/app/globals.css` untuk menghilangkan konflik antara native `scroll-behavior: smooth` browser dengan virtual smooth scroll Lenis berbasis `requestAnimationFrame`.
  - Menyertakan standard Lenis CSS (`.lenis`, `.lenis.lenis-stopped`, `[data-lenis-prevent]`) secara inline di `globals.css` agar tidak bergantung pada import eksternal yang bisa dilewati bundler.

---

## [2.1.8] - 2026-09-10

### 🎨 Tampilan, Aksesibilitas & UI/UX (Bug Fix)
- **Refactor MUBES Session Banner ke Floating Toast Notification**:
  - Mengubah `MubesSessionBanner` (`src/components/mubes/MubesSessionBanner.tsx`) dari `sticky top-0 w-full` menjadi floating notification card (`fixed bottom-6 left-6 z-50`).
  - Mengatasi masalah tumpang tindih visual antara navbar atas di halaman Edufest (`EdufestBackHomeNav` & `LiquidGlassNav`) dengan status bar sesi MUBES.
  - Menambahkan toggle collapsible/minimize (`ChevronUp`/`ChevronDown`) agar pengguna dapat menciutkan kartu sesi saat menjelajahi halaman tanpa terhalang.

---

## [2.1.7] - 2026-09-09

### 🚀 Ditambahkan & Dioptimasi
- **Sinkronisasi Data Dinamis Halaman Detail Event (`/events/[slug]`)**:
  - Memperbaiki ketidakcocokan nilai slug pada database Strapi (MySQL dan backup SQLite) dari `event` menjadi `gema-merdeka` sehingga data query `/api/events?filters[slug][$eq]=...` berhasil ditemukan dan di-populate.
  - Memperbarui `src/app/events/[slug]/page.tsx` dengan penanganan `notFound()` eksplisit saat event tidak ditemukan di CMS alih-alih me-render mock data statis yang menyesatkan.
  - Menambahkan mapping label dinamis untuk enum kategori (`internal` dan `eksternal`) agar proporsional dengan header banner acara.
  - Mengintegrasikan parser Markdown (`ReactMarkdown`, `remark-gfm`, `remark-breaks`) pada komponen `EventIntroSection` (`src/components/event-detail/event-intro-section.tsx`) agar format teks kaya (RichText) dari Strapi dirender dengan rapi.

---

## [2.1.6] - 2026-09-09

### 🚀 Ditambahkan & Dioptimasi
- **Optimasi Kinerja Scroll & Animasi Edufest (`other-program/infinity-edufest`)**:
  - Menghilangkan microtask dynamic import `import("gsap/ScrollTrigger")` per frame scroll di `lib/lenis.ts` dan menambahkan lifecycle cleanup (`cancelAnimationFrame` & `lenisInstance.destroy()`).
  - Menghapus artificial delay 2500ms pada tombol navigasi di `components/scenes/SceneInteractive.tsx` dan menggantinya dengan semantik `<Link>` Next.js.
  - Memperbaiki event listener audio di `components/AudioManager.tsx` agar tidak mendaftarkan ulang listener pada event scroll atau perubahan volume.
  - Menambahkan tombol interaktif `Skip Intro ✕` di `components/intro/IntroOrchestrator.tsx` serta mengaktifkan `skipOnRevisit={true}` di `app/layout.tsx`.

### 🛡️ Keamanan & Hardening
- **Penerapan HTTP Security Headers & Sandboxing (`next.config.ts`, `app/location/page.tsx`)**:
  - Menambahkan header `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan `Referrer-Policy: strict-origin-when-cross-origin` pada `next.config.ts`.
  - Menambahkan atribut protektif `sandbox="allow-scripts allow-same-origin allow-popups"` pada iframe Google Maps di `app/location/page.tsx`.
  - Menerapkan `target="_blank"` dan `rel="noopener noreferrer"` untuk link eksternal di `components/ui/LiquidGlassNav.tsx`.

### 🎨 Tampilan, Aksesibilitas & UI/UX (Bug Fix)
- **Perbaikan Kontras & Konsistensi Tema Edufest**:
  - Memperbaiki kontras `LiquidGlassNav.tsx` dengan penyesuaian background badge solid transparan gelap (`bg-slate-900/80` & `bg-slate-950/90`) agar terbaca jelas di atas kanvas terang (#f8f9fd).
  - Mengubah teks hardcoded `text-black` di `components/scenes/SceneAbout.tsx` dan `components/scenes/SceneSelayang.tsx` menjadi variabel dinamis `text-[var(--foreground)]`.
  - Memperbaiki tautan aset rusak `hover-3.HEIC` (404) di `components/TickerGallery.tsx`.
  - Membersihkan dead import `Audiowide` di `components/scenes/SceneIntro.tsx` dan memperbarui teks copyright di `components/Footer.tsx`.

---

## [2.1.5] - 2026-09-08

### 🚀 Ditambahkan & Dioptimasi
- **Navigasi Kembali ke Beranda Utama pada Edufest Infinity (`/edufest-infinity`)**:
  - Penambahan komponen `EdufestBackHomeNav` (`src/components/ui/EdufestBackHomeNav.tsx`) berupa floating glass pill di pojok kiri atas yang mengarahkan langsung ke Beranda Utama OSIS (`/`).
  - Penambahan tautan `Beranda OSIS` (`/`) dengan ikon globe ke dalam menu dropdown `LiquidGlassNav` dan penyesuaian label home edufest menjadi `Edufest Home`.
  - Pembersihan duplikasi instansiasi `<LiquidGlassNav />` di subhalaman `panitia` dan `timeline` agar terpusat pada layout portal.

### 🎨 Tampilan & Dark Mode (Bug Fix)
- **Perbaikan Responsivitas Dark/Light Mode pada Halaman Timeline Edufest (`/edufest-infinity/timeline`)**:
  - Mengubah elemen pembungkus dan kartu dari warna statis hardcoded `bg-[#0a0a0a]` menjadi dinamis `bg-[var(--background)] text-[var(--foreground)]` dan `bg-black/5 dark:bg-white/5`.
  - Memperbaiki kontras teks judul, deskripsi, tanggal, dan guest stars agar otomatis adaptif saat beralih antara tema terang dan gelap.
  - Menghilangkan `bg-[#0a0a0a]` pada komponen dasar `Timeline` (`src/components/ui/timeline.tsx`) menjadi `bg-transparent`.

---

## [2.1.4] - 2026-09-08

### 🚀 Ditambahkan & Dioptimasi
- **Integrasi Navbar & Footer Situs Utama pada Detail Event (`/events/[slug]`)**:
  - Menghubungkan komponen global `<Navbar />` dan `<Footer />` ke dalam `EventDetailLayout` (`src/app/events/[slug]/layout.tsx`).
  - Mengembalikan akses navigasi utama situs (Home, About, Events, Anggota, Media Sosial, Partners, MegaMenu Program Kerja, Auth Clerk, dan Dark/Light Toggler) di seluruh subhalaman event seperti `/events/gema-merdeka`.

---

## [2.1.3] - 2026-09-08

### 🚀 Ditambahkan & Dioptimasi
- **Peningkatan Visual Hero Section Event Detail (`/events/[slug]`)**:
  - Penambahan scrim `linear-gradient(to top, #0B0F17 0%, rgba(11, 15, 23, 0.8) 40%, transparent 100%)` pada container hero bawah untuk transisi yang lebih mulus dan soft.
  - Harmonisasi warna background event detail dark mode ke `#0B0F17` untuk menghilangkan color banding.
  - Implementasi **Liquid Glassmorphism** khas iOS pada header badge (`.liquid-glass`) dengan `backdrop-filter: blur(20px) saturate(180%)`, border semi-transparan, dan inner glow.
- **Sistem Sesi MUBES XXI & Telemetri**:
  - Penambahan `MubesSessionBanner` responsif pada root layout untuk menampilkan status sesi dan navigasi LPJ.
  - Integrasi API skema Strapi CMS untuk telemetri kunjungan.

---

## [2.1.2] - 2026-09-08

### 🔒 Keamanan (Security Hardening & Remidiasi Vulnerability)
- **Mitigasi Server-Side Request Forgery (SSRF) & Open Redirect (`/api/compress-image`)**:
  - Validasi ketat allowlist hostname resmi (`osisstrapi.biezz.my.id`, `osissmaitfi.biezz.my.id`, `localhost`, `127.0.0.1`, `100.100.68.83`). Host di luar allowlist ditolak dengan `403 Forbidden`.
  - Penghapusan redirect HTTP 302 ke URL eksternal untuk mencegah open redirect; diganti dengan fallback 1x1 transparent PNG.
- **Pencegahan Privilege Escalation pada Webhook Clerk (`/api/webhooks/clerk`)**:
  - Mengubah fuzzy matching nama anggota menjadi exact match terstandarisasi untuk mencegah bypass verifikasi identitas anggota OSIS.
  - Penegasan default status `pending` bagi pengguna baru tanpa peran terverifikasi.
- **Perlindungan Denial of Service & Spam Sanitasi (`/api/inbox`)**:
  - Penambahan in-memory rate limiting per alamat IP (maksimal 3 request per 10 menit) dengan respons status `429 Too Many Requests`.
  - Validasi panjang payload dan sanitasi karakter MarkdownV2 untuk mencegah injeksi parsing pada notifikasi Telegram feedback bot.
- **Automated Security Pipeline**:
  - Penambahan GitHub Actions workflow `.github/workflows/security-scan.yml` untuk audit dependensi frontend (`npm audit`) dan build verification berkala.

### 🚀 Ditambahkan & Dioptimasi
- **Peningkatan Rendering Detail Event (`/events/[slug]`) & Skema CMS**:
  - Integrasi field `galeri_teks_utama` dan `galeri_deskripsi` pada skema Strapi CMS Event.
  - Peningkatan fallback sumber visual galeri event (`highlights` -> `dokumentasi` -> `galeri`).

---

## [2.1.1] - 2026-09-06

### 🚀 Ditambahkan & Dioptimasi
- **Pembaruan Desain & Layout Halaman Detail Event (`/events/[slug]`)**:
  - **Hero Viewport Penuh & Tipografi Skala Besar**: `EventHeroSection` kini menggunakan `min-h-screen` dengan tipografi judul responsif hingga `96px`, max-width dinaikkan ke `1400px`, serta pembersihan header ganda.
  - **Harmonisasi Spacing & Grid**: `EventDomeSection`, `EventIntroSection`, dan `EventOthersSection` ditingkatkan padding dan fluid constraint (`px-6 md:px-12 lg:px-16`) untuk kenyamanan membaca di layar lebar.
- **Peningkatan Visual Glassmorphism Portal MUBES (`/portal-mubes`)**:
  - Peningkatan efek kartu kaca medieval dengan `backdrop-blur(36px) saturate(190%)`, border keemasan berpendar, dan refleksi ambient cahaya lembut.
- **Ekspansi Peran RBAC MUBES (`mubes-access.ts`)**:
  - Penambahan dukungan peran `admin`, `administrator`, dan `bph` pada validasi hak akses dokumen sidang tertutup.

### 🔒 Keamanan
- **Penguatan Content Security Policy (CSP) untuk Clerk Auth (`next.config.ts`)**:
  - Whitelist domain resmi Clerk (`*.clerk.accounts.dev`, `clerk.accounts.dev`, `api.clerk.com`, `img.clerk.com`) dan Cloudflare Turnstile (`challenges.cloudflare.com`) pada directive `script-src`, `style-src`, `img-src`, `connect-src`, `frame-src`, dan `worker-src`.

---

## [2.1.0] - 2026-09-06

### 🚀 Ditambahkan
- **Redesain Portal Musyawarah Besar (MUBES) XXI — Ancient Medieval Theme (`/portal-mubes`)**:
  - **Hero & Typography**: Tipografi seremonial klasik memadukan Google Fonts `Cinzel` (judul kapital berwibawa & aksen lencana) dan `Cormorant Garamond` (kutipan narasi & deskripsi) dipadukan dengan ornament divider emas dan ornamen eyebrow SVG.
  - **Dual Auth Mode (Login & Registrasi Kustom)**:
    - `MubesLoginForm`: Autentikasi Clerk kustom dengan input styling medieval gold border, toggle visibilitas password, OAuth Google login, serta feedback error interaktif.
    - `MubesSignUpForm`: Alur registrasi mandiri dua langkah (Step 1: Nama lengkap, email @sch.id/pribadi, password; Step 2: Verifikasi kode OTP 6 digit email langsung tanpa keluar dari portal).
  - **Modal Bantuan BPH (`MubesBphHelpModal`)**: Dialog modal bantuan akses darurat dengan kontak WhatsApp langsung ke BPH/Presidium Sidang MUBES untuk verifikasi allowlist anggota.
  - **SSO Callback Handler (`/sso-callback`)**: Rute penanganan redirect OAuth Google Clerk khusus portal MUBES yang mengarahkan kembali ke sesi sidang secara mulus.
  - **Aset Visual & Ikon SVG Kustom**: Penambahan background `bg-medieval.png` (high-resolution hall), divider ornamen emas, serta ikon navigasi & fitur (`feature-program.svg`, `feature-sosial.svg`, `feature-kolaborasi.svg`).

---

## [2.0.0] - 2026-09-06

### 🚀 Ditambahkan
- **Sistem MUBES Dual-Layer (Clerk + PostgreSQL 16)**:
  - **Migrasi Database PostgreSQL 16**: Strapi v5 resmi bermigrasi penuh dari MySQL ke PostgreSQL 16 (`mubes-postgres` pada port `127.0.0.1:5433`). Seluruh 44 skema, 1.248 entitas, 1.218 aset media (364 MB), dan 2.957 link relasi berhasil diimpor tanpa data loss.
  - **Content Types Baru**: Pembuatan skema privat `mubes-lpj`, `mubes-sidang`, `akses-user`, `audit-log`, dan `login-event`.
  - **Zero-Cost Allowlist (Clerk Open Access + Svix Webhook)**: Webhook handler `/api/webhooks/clerk` memverifikasi signature Svix dan mencocokkan nama pendaftar secara otomatis dengan 65 anggota OSIS di database Strapi (`api::anggota-osis.anggota-osis`).
  - **Global Audit Trail Middleware**: Strapi v5 Document Service Middleware mencatat log histori mutasi entitas (CUD + publish/unpublish) secara asinkron tanpa fitur Enterprise berbayar.
  - **Backend-For-Frontend (BFF) Architecture**: Route handler `/api/mubes/lpj/[slug]` di Next.js 16 mengamankan token backend Strapi (`STRAPI_ELEVATED_TOKEN`) dan hanya merespons sesi terverifikasi.
  - **Zero Layout Shift In-Place Expansion (CLS = 0)**: Shortcut `Ctrl+Shift+M` / `Cmd+Shift+M` membuka modal login Clerk; pengguna terotorisasi dapat melihat data LPJ tertutup (anggaran, nota, evaluasi internal, kendala/solusi) langsung di halaman detail program kerja tanpa perpindahan URL.

### 🔒 Keamanan & RBAC
- Akses publik role `Public` di Strapi Users-Permissions dikunci ketat (`403 Forbidden`) untuk endpoint `mubes-lpj`, `mubes-sidang`, `akses-user`, `audit-log`, dan `login-event`.
- Header `cache: no-store` diterapkan pada seluruh respons data sensitif MUBES.

---

## [1.7.1] - 2026-08-27

### 🐛 Diperbaiki
- **Perbaikan Parser RSS Podcast Spotify (`/api/spotify-rss`)**:
  - Penyesuaian regex XML parsing untuk mendukung variasi atribut `url` (petik tunggal/ganda) serta penanganan HTML entity `&amp;`.
- **Optimasi Audio Player (`SosmedHub.tsx`)**:
  - Penambahan atribut `preload="metadata"` pada elemen HTML5 `<audio>` untuk stabilitas pemutaran audio podcast yang melalui redirect CDN Anchor.fm / CloudFront.

## [1.7.0] - 2026-08-12

### 🚀 Ditambahkan
- **Analisis Komprehensif Ekosistem**:
  - Pembuatan dokumen `docs/analisis_akhir_agora_acta.md` yang merangkum arsitektur sistem, analisis komponen teknis (Frontend & Backend), serta rekomendasi pengembangan.
- **Audit Struktur Proyek**:
  - Verifikasi menyeluruh terhadap integrasi Next.js 16, Strapi v5, dan mekanisme deployment PM2.

## [1.6.0] - 2026-08-11

### 🚀 Ditambahkan
- **Sistem Sinkronisasi MySQL ke SQLite Background Worker**:
  - Script otomatisasi `sync-db.js` disinkronkan secara periodik via background child process pada startup server Strapi.
  - Sinkronisasi tabel `admin_permissions`, `admin_roles`, `anggota_oses`, `program_kerjas`, `files`, dan data Strapi CMS lainnya.
- **Pembaruan & Restrukturisasi Dokumentasi Workspace**:
  - Berkas `README.md` utama dibuat di root workspace untuk memandu pengoperasian multi-paket (`osis-smait-fi`, `strapi-cms`, `other-program/`).
  - Berkas `CHANGELOG.md` utama ditambahkan pada akar direktori proyek.

---

## [1.5.0] - 2026-08-05

### 🚀 Ditambahkan
- **Integrasi Event Infinity Edufest & Strapi CMS v5**:
  - Sinkronisasi penuh portal `/edufest-infinity` dengan Strapi Headless CMS (skema `Event`, `MediaAsset`, data seeding `seed.ts`).
  - Fitur modal pendaftaran kompetisi & event secara dinamis.
- **Analisis Multi-Proyek Workspace**:
  - Dokumentasi resmi dan integrasi 4 proyek: `osis-smait-fi`, `strapi-cms`, `other-program/infinity-edufest`, dan `other-program/edufest-infinity-link-in-bio-boilerplate`.

### 🐛 Diperbaiki
- **Perbaikan Tooltip Clipping (`AnggotaList.tsx`)**:
  - Perbaikan z-index & overflow stacking context pada tooltip media sosial anggota OSIS.
- **Perbaikan Mobile Navbar Scroll Lock**:
  - Mencegah pergeseran horisontal dan layout overflow pada navbar versi mobile.
- **Penyesuaian Warna Dark Mode**:
  - Harmonisasi warna teks, border, dan latar belakang kartu anggota/sekbid pada mode gelap.

---

## [1.4.0] - 2026-08-04

### 🚀 Ditambahkan
- **Dukungan Progressive Web App (PWA)**:
  - Penambahan service worker (`public/sw.js`) dengan strategi caching *stale-while-revalidate* untuk aset statis lokal.
  - Pendaftaran service worker di `RootLayout` (`layout.tsx`) dan konfigurasi berkas `manifest.json`.
- **Pencarian Global & Member-to-Proker Routing** (`src/lib/search.ts`):
  - Pencarian paralel dinamis untuk data Program Kerja, Seksi Bidang, dan Anggota OSIS dari database Strapi CMS.
  - Implementasi *intelligent routing* untuk penanggung jawab (PJ) program kerja: jika hasil pencarian anggota yang diklik adalah PJ dari proker tertentu, navigasi otomatis mengarah ke halaman detail program kerja tersebut.
- **Konfigurasi Background Texture Dinamis**:
  - Penambahan helper `fetchBgTextureConfig()` di `src/lib/strapi.ts` untuk mengambil konfigurasi dari backend Strapi.
  - Penambahan komponen `GlobalBgTexture` di `RootLayout` untuk merender background texture secara dinamis.
- **Strapi CMS Core Bootstrap & DB Sync**:
  - Konfigurasi otomatis RBAC untuk peran *Chief Editor* dan *Content Contributor* saat inisialisasi server di `strapi-cms/src/index.ts`.
  - Penjadwalan sinkronisasi database MySQL secara periodik via background worker `child_process.fork()`.

---

## [1.3.0] - 2026-08-04

### 🚀 Ditambahkan
- **Halaman Anggota OSIS Premium (`/anggota`)**:
  - Featured card Ketua OSIS dengan foto 4:5 dan dekorasi rotated box.
  - Grid Pengurus Inti (BPH) 3 kolom dengan icon badge warna dinamis.
  - Grid Seksi Bidang 1–8 dengan avatar stack, deskripsi CMS, dan link "View Team".
- **Dynamic Image Compression API** (`/api/compress-image`):
  - Kompresi gambar on-the-fly melalui Next.js API Route.
- **ImageQualityContext**:
  - Provider React context global untuk manajemen kualitas kompresi gambar.
- **Strapi Draft Preview Mode**:
  - API routes `/api/preview` dan `/api/exit-preview`.

---

## [1.0.0] - 2026-07-25

### 🚀 Ditambahkan
- Rilis perdana **Portal Web OSIS SMAIT Fithrah Insani (Agora Acta 2025)**.

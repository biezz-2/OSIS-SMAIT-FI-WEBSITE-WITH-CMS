# Action Plan: Standardisasi Arsitektur Theme Engine & Perbaikan Dark/Light Mode Event Detail (/events/[slug])

## 1. Identifikasi Masalah & Audit
- **Penyebab Utama**: Halaman detail event (`/events/[slug]`) menggunakan `EventThemeProvider` lokal dengan state terisolasi (`agoraacta-event-theme`) dan inline styling (`eventDetailThemeTokens`), sementara navbar utama (`Navbar.tsx` dengan `AnimatedThemeToggler`) hanya mengubah class `.dark` pada elemen `<html>`.
- **Komponen Terdampak**:
  - `src/components/event-detail/theme-provider.tsx`: Menggunakan state terpisah dan tidak sinkron dengan class `.dark` pada `<html>`.
  - `src/components/event-detail/event-detail-client.tsx`, `event-hero-section.tsx`, `event-intro-section.tsx`, `event-dome-section.tsx`, `event-others-section.tsx`: Menerapkan token warna via inline `style`.
  - `src/components/event-detail/event-navbar.tsx`: Komponen mati/tidak terpakai yang memegang handler `toggleTheme()`.

## 2. Rencana Implementasi Bertahap

### Langkah 1: Sinkronisasi Reaktif di `EventThemeProvider`
- Hubungkan `EventThemeProvider` ke class `.dark` pada `document.documentElement` menggunakan `MutationObserver` dan pengecekan awal saat hidrasi.
- Saat class `.dark` diubah oleh `AnimatedThemeToggler` di `Navbar`, state tema pada context event otomatis tersinkronisasi.
- Pastikan fallback `toggleTheme()` pada context juga memanipulasi `document.documentElement.classList.toggle("dark")` untuk integritas dua arah.

### Langkah 2: Verifikasi & Adaptasi Komponen Event Detail
- Uji adaptasi token tema pada semua sub-komponen event (`EventDetailClient`, `EventHeroSection`, `EventIntroSection`, `EventDomeSection`, `EventOthersSection`).
- Bersihkan referensi kode mati (`event-navbar.tsx`).

### Langkah 3: Pengujian Fungsionalitas & Build
- Jalankan TypeScript check / build Next.js (`npm run build`).
- Pastikan tidak ada error hidrasi atau runtime issue pada saat pergantian tema di desktop maupun mobile.

### Langkah 4: Dokumentasi, Changelog, Git Commit & Slack Broadcast
- Catat pembaruan di `CHANGELOG.md` dan `docs/CHANGELOG/CHANGELOG.md` (SemVer bump: v2.1.22).
- Update memori jangka panjang (`mcp__langgraph-memory`).
- Commit & push perubahan ke git.
- Kirim laporan hasil implementasi ke channel Slack `#changelog` (`C0BVCCDKAD7`).

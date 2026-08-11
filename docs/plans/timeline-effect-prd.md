# PRD: Penerapan Efek Aceternity Scroll Timeline pada Halaman Timeline Edufest

## 1. Analisis Halaman Timeline Saat Ini
- **Komponen Utama:** [`TimelineOrchestrator.tsx`](osis-smait-fi/src/components/timeline/TimelineOrchestrator.tsx:92) & [`TimelineItem.tsx`](osis-smait-fi/src/components/timeline/TimelineItem.tsx:23).
- **Mekanisme Animasi:** Menggunakan `framer-motion` `useScroll` per item individual untuk mendeteksi `scrollYProgress`, memicu fade-in (`opacity`) dan slide-up (`y`) saat item masuk viewport.
- **Gaya Visual:** Garis vertikal statis di tengah desktop (`md:block left-1/2`), titik indikator statis (`sticky top-1/2`), layout Zig-Zag alternating (kiri/kanan).
- **Keterbatasan Saat Ini:** Tidak ada progress fill animasi yang mengikuti scroll pengguna sepanjang jalur timeline, dan tampilan titik indikator bersifat terpisah per-item.

---

## 2. Analisis Referensi Aceternity UI Timeline
- **Mekanisme Utama:**
  - `useScroll` terhubung ke pembungkus utama `containerRef` dengan `offset: ["start 10%", "end 50%"]`.
  - Pengukuran tinggi otomatis `setHeight(rect.height)` via `useRef` pada elemen kontainer data.
  - `useTransform` mengubah `scrollYProgress` [0, 1] menjadi tinggi garis animasi (`heightTransform`) dari 0 ke `height`.
  - Gradient progress line (`motion.div`) mengisi jalur dari atas ke bawah secara kontinu seiring scroll.
  - Layout Sticky: Tahun/Judul menempel di kiri (`sticky top-40`) saat scroll melewati konten detail.

---

## 3. Spesifikasi Teknis & Rencana Implementasi

### A. Prasyarat & Arsitektur
- **Framework:** Next.js App Router (React 19, TypeScript).
- **Library:** `framer-motion` (sudah terpasang versi `^12.43.0` di [`package.json`](osis-smait-fi/package.json:18)), Tailwind CSS v4.
- **Lokasi Komponen:** [`osis-smait-fi/src/components/ui/timeline.tsx`](osis-smait-fi/src/components/ui/timeline.tsx) (UI Reusable) dan integrasi pada [`osis-smait-fi/src/components/timeline/TimelineOrchestrator.tsx`](osis-smait-fi/src/components/timeline/TimelineOrchestrator.tsx:92).

### B. Struktur Data Mappings (Strapi Integration)
Mengadaptasi data dari `getEdufestTimeline()` ke interface Aceternity:
```tsx
interface TimelineEntry {
  title: string; // Tahun (misal: "2025")
  content: React.ReactNode; // Detail acara, tanggal, tema, jumlah peserta & Guest Stars
}
```

### C. Penyesuaian Visual & Fitur
1. **Progress Line Active Fill:** Line gradient `from-purple-500 via-blue-500 to-transparent` bergerak mengisi jalur seiring scroll.
2. **Guest Stars & Content Card:** Mempertahankan badge tanggal, tema, jumlah peserta, serta avatar Guest Stars dari `TimelineItem` ke dalam `content`.
3. **Responsive Sticky Design:** Judul tahun `sticky top-40` pada layar desktop (`md:block`), dan inline header pada layar seluler (`md:hidden`).

---

## 4. Rencana Kerja (Task Breakdown)
1. Buat komponen UI Reusable [`osis-smait-fi/src/components/ui/timeline.tsx`](osis-smait-fi/src/components/ui/timeline.tsx:1) berdasarkan komponen Aceternity dengan penyesuaian styling Tailwind dark mode & Framer Motion.
2. Refactor [`osis-smait-fi/src/components/timeline/TimelineOrchestrator.tsx`](osis-smait-fi/src/components/timeline/TimelineOrchestrator.tsx:92) untuk memetakan data Strapi (`FALLBACK_TIMELINE` / API) ke prop `data` komponen `Timeline`.
3. Validasi perhitungan tinggi dinamis dan smooth scroll tracking pada desktop & mobile.

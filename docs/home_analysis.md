# Dokumen Analisis Mendalam Halaman Home (Beranda)
**Website OSIS SMAIT Fithrah Insani (Agora Acta)**

Dokumen ini menyajikan analisis komprehensif mengenai halaman utama (Home) dari aspek arsitektur kode, integrasi data (Strapi CMS), performa UI/UX, optimasi SEO, serta temuan bug kritis yang mempengaruhi visualisasi konten.

---

## 1. Arsitektur Kode & Alur Data (Data Flow)

Halaman utama didefinisikan pada file [`osis-smait-fi/src/app/page.tsx`](osis-smait-fi/src/app/page.tsx) dengan arsitektur sebagai berikut:

```
[Server Component: page.tsx]
       |
       +--> fetchHalamanFromStrapi('home')
       |
       v
[Render Tree]
       ├── <Navbar /> (Client Component)
       ├── <Hero initialData={homeData} /> (Client Component)
       ├── <Introduction initialData={homeData} /> (Client Component)
       ├── <LatestEvent /> (Dynamic Import - Client Component)
       └── <Footer /> (Dynamic Import - Client Component)
```

### Temuan Kritis: Inkonsistensi Query Strapi (Bug Data Fetching)
Pada [`osis-smait-fi/src/lib/strapi.ts`](osis-smait-fi/src/lib/strapi.ts:275), fungsi `fetchHalamanFromStrapi` didefinisikan:
```typescript
export async function fetchHalamanFromStrapi(slug: string) {
  const json: any = await fetchStrapiAPI(`/api/halamans?filters[slug][$eq]=${slug}&fields[0]=nama_halaman&fields[1]=deskripsi&fields[2]=slug`);
  const items = json?.data || [];
  ...
}
```
Query ini secara eksplisit membatasi field yang diambil hanya `nama_halaman`, `deskripsi`, dan `slug`. Properti penting lainnya tidak di-fetch dari Strapi.

Namun, komponen penerima data di halaman utama bergantung pada properti yang lebih luas:
- **`Hero.tsx`**: Mengakses `judul_hero`, `sub_judul`, dan `banner_image`.
- **`Introduction.tsx`**: Mengakses `judul_hero`, `deskripsi` / `sub_judul`, `overlay_text`, `background_image`, `gambar_list` (Galeri foto), serta parameter style kustom seperti `bg_color`, `dot_color`, `dot_size`, dan `dot_gap`.

**Dampak Masalah:**
Karena server-side mengembalikan object `homeData` (tidak null), component client-side mendeteksi `initialData` bernilai truthy dan memicu bypass `useEffect`:
```typescript
useEffect(() => {
  if (initialData) return; // Memblokir load data lengkap di client!
  ...
}, [initialData]);
```
Akibatnya:
1. **Hero Component**: Judul hero, sub-judul, dan gambar banner latar belakang bernilai `undefined` (hanya menampilkan latar belakang gelap kosong).
2. **Introduction Component**: Galeri foto tidak memuat gambar dari CMS (fallback ke `defaultFallbackImages`), warna latar belakang kembali ke fallback default `#185FA5`, dan teks overlay visual mengalami kehilangan kustomisasi.

---

## 2. Analisis Komponen Utama

### A. Hero (`Hero.tsx`)
- **Fungsi**: Bagian lipatan atas (above-the-fold) yang menampilkan judul utama, sub-judul, dan gambar latar belakang yang dominan.
- **Implementasi**: Menggunakan Next.js `<Image>` dengan atribut `fill`, `priority`, dan `sizes="100vw"` untuk performa LCP (Largest Contentful Paint) yang optimal.
- **Rekomendasi Perbaikan**:
  1. Perbaiki query `fetchHalamanFromStrapi` untuk menyertakan field `judul_hero`, `sub_judul`, dan mempopulate `banner_image`.
  2. Tambahkan skeleton loader jika data masih bernilai kosong.

### B. Introduction (`Introduction.tsx`)
- **Fungsi**: Menampilkan pesan pengenalan OSIS Agora Acta beserta galeri gambar interaktif yang dapat digeser (draggable/swipeable).
- **Implementasi Interaksi**:
  - Drag mouse menggunakan event `onMouseDown`, `onMouseLeave`, `onMouseUp`, dan `onMouseMove` dengan pengali kecepatan `1.35`.
  - Swiping perangkat sentuh menggunakan `onTouchStart`, `onTouchEnd`, dan `onTouchMove`.
  - Penyelarasan visual tengah otomatis (`centerScroll`) saat komponen selesai dimuat.
- **Grid Layout**: Menggunakan flexbox horizontal (`flex-row min-w-max`) dengan kombinasi kartu vertikal tinggi (`680px`) dan kolom bertumpuk (kartu pendek & kartu tinggi) untuk menciptakan tata letak asimetris yang estetis.
- **Rekomendasi Perbaikan**:
  1. Populate `gambar_list` dan `background_image` dari Strapi.
  2. Sempurnakan CSS Dragging: Tambahkan class `user-select-none` secara merata agar saat pengguna melakukan drag pada layar, teks atau gambar di dalamnya tidak terseleksi secara tidak sengaja.

### C. Latest Event (`LatestEvent.tsx`)
- **Fungsi**: Menampilkan event terbaru secara dinamis.
- **Pola Fetching**: Melakukan fetch data langsung di client side (`/api/events?sort[0]=tanggal_mulai:desc&sort[1]=createdAt:desc&populate=*`).
- **Pola Fallback**: Jika query dengan `tanggal_mulai` gagal, sistem akan melakukan fallback secara otomatis ke pengurutan berdasarkan `createdAt`. Jika tidak ada event yang aktif, komponen akan me-return `null` (disembunyikan dengan bersih).
- **Rekomendasi Perbaikan**: Komponen ini di-load secara dinamis (`dynamic import`). Disarankan menambahkan `loading` fallback berupa skeleton loader yang cocok saat transisi visual.

---

## 3. Evaluasi SEO, ISR & Performance

- **ISR (Incremental Static Regeneration)**: Ditetapkan `export const revalidate = 60;` di `page.tsx`. Ini adalah praktik yang baik untuk website berbasis profil sekolah agar konten tetap aktual tanpa membebani database CMS Strapi di setiap request.
- **Metadata JSON-LD**: Ditetapkan secara statis di tingkat halaman (`EducationalOrganization` dengan info OSIS SMAIT Fithrah Insani). Ini sangat baik untuk penayangan rich snippets di Google.
- **Dynamic Imports**: Memuat komponen `LatestEvent`, `Introduction`, dan `Footer` menggunakan `next/dynamic` membantu memisahkan bundle JS awal, mempercepat *Time to Interactive* (TTI) halaman utama.

---

## 4. Rencana Perbaikan (Rekomendasi Solusi)

Untuk menyelesaikan bug data fetching dan meningkatkan kualitas UX halaman Home, direkomendasikan langkah-langkah berikut:

### Solusi 1: Memperluas Query `fetchHalamanFromStrapi`
Ubah query di [`osis-smait-fi/src/lib/strapi.ts`](osis-smait-fi/src/lib/strapi.ts) agar mempopulate seluruh field yang diperlukan:
```typescript
export async function fetchHalamanFromStrapi(slug: string) {
  // Tambahkan populate dan fields yang dibutuhkan halaman home
  const json: any = await fetchStrapiAPI(
    `/api/halamans?filters[slug][$eq]=${slug}` +
    `&populate[banner_image]=true` +
    `&populate[background_image]=true` +
    `&populate[gambar_list]=true` +
    `&populate[metadata_json]=true` +
    `&fields[0]=nama_halaman` +
    `&fields[1]=deskripsi` +
    `&fields[2]=slug` +
    `&fields[3]=judul_hero` +
    `&fields[4]=sub_judul` +
    `&fields[5]=overlay_text` +
    `&fields[6]=bg_color` +
    `&fields[7]=dot_color` +
    `&fields[8]=dot_size` +
    `&fields[9]=dot_gap`
  );
  ...
}
```

### Solusi 2: Memperbaiki Logic Deteksi `initialData` di Client Component
Di `Hero.tsx` dan `Introduction.tsx`, pastikan pengecekan data awal memverifikasi keberadaan field utama, bukan sekadar memeriksa apakah object `initialData` tidak kosong.
Contoh untuk `Hero.tsx`:
```typescript
useEffect(() => {
  // Hanya return jika properti utama memang tersedia dari server-side rendering (SSR)
  if (initialData && (initialAttrs?.judul_hero || initialAttrs?.banner_image)) return;
  
  // Jika tidak lengkap, lakukan client-side fetch data lengkap
  loadHeroData();
}, [initialData]);
```

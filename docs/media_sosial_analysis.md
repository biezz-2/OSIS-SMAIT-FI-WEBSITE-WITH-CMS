# Dokumen Analisis Mendalam & Panduan Embed Halaman Media Sosial (`/media-sosial`)
**Website OSIS SMAIT Fithrah Insani (Agora Acta)**

Dokumen ini menyajikan analisis komprehensif mengenai halaman Media Sosial dari aspek arsitektur kode, integrasi data (Strapi CMS), performa UI/UX, integrasi API Inbox, serta panduan pengisian link embed konten melalui Strapi.

---

## 1. Arsitektur Kode & Alur Data (Data Flow)

Halaman media sosial didefinisikan pada file [`osis-smait-fi/src/app/media-sosial/page.tsx`](osis-smait-fi/src/app/media-sosial/page.tsx:1) dengan arsitektur sebagai berikut:

```
[Server Component: page.tsx]
       |
       +--> fetchHalamanFromStrapi('media-sosial')
       |
       v
[Render Tree]
       ├── <Navbar /> (Client Component)
       ├── <SosmedHub initialData={pageData} /> (Client Component)
       └── <Footer /> (Client Component)
```

### Integrasi Strapi CMS & Mock Fallback
- Page fetching menggunakan `fetchHalamanFromStrapi('media-sosial')` dengan ISR `revalidate = 60`.
- Komponen [`SosmedHub.tsx`](osis-smait-fi/src/components/sosmed/SosmedHub.tsx:56) membaca `attributes` seperti `judul_hero`, `sub_judul`, `banner_image`, dan `metadata_json` (berisi `social_accounts`, `embeds`, `spotify_player`, `feeds`).
- Jika data CMS belum diisi, `SosmedHub` menyiapkan fallback internal (`FEEDS_DATA`) untuk 4 platform (Instagram, YouTube, TikTok, Spotify).

---

## 2. Pengelolaan Embed Konten Media Sosial di Strapi CMS

### Apakah Strapi Sudah Bisa Manage Embed Konten?
**YA.** Pengelolaan display embed dapat disetting langsung dari Strapi Admin Panel melalui Content-Type **Halaman Utama** (`halamans`) pada entry dengan slug `media-sosial` di field **`metadata_json`**.

### Format Pengisian Link Embed di Field `metadata_json`:

Admin dapat memasukkan **Link Biasa** (URL langsung dari browser/aplikasi) ATAU Kode **HTML `<iframe>` / Embed HTML**:

```json
{
  "social_accounts": {
    "instagram": { "name": "Osis SMAIT FI", "handle": "@osissmaitfi", "followers": "1,203", "link": "https://www.instagram.com/osissmaitfi" },
    "tiktok": { "name": "Osis SMAIT FI", "handle": "@osissmaitfi", "followers": "144", "link": "https://www.tiktok.com/@osissmaitfi" },
    "youtube": { "name": "SMAIT Fithrah Insani", "handle": "@osissmaitfithrahinsani9481", "followers": "267", "link": "https://www.youtube.com/@osissmaitfithrahinsani9481" },
    "spotify": { "name": "Agora Talk", "handle": "OSIS Podcast", "followers": "436", "link": "https://spotify.com" }
  },
  "embeds": {
    "youtube": "https://www.youtube.com/watch?v=VIDEO_ID",
    "spotify": "https://open.spotify.com/episode/EPISODE_ID",
    "tiktok": "https://www.tiktok.com/@username/video/VIDEO_ID",
    "instagram": "https://www.instagram.com/p/POST_ID/"
  }
}
```

### Format Link yang Didukung secara Otomatis oleh Frontend:
1. **YouTube**:
   - Link Biasa: `https://www.youtube.com/watch?v=XXXXX`
   - Link Short: `https://youtu.be/XXXXX`
   - Link Shorts: `https://www.youtube.com/shorts/XXXXX`
   - Tag Embed HTML: `<iframe src="..."></iframe>`
2. **Spotify**:
   - Link Episode/Track: `https://open.spotify.com/episode/XXXXX` atau `https://open.spotify.com/track/XXXXX`
   - Tag Embed HTML: `<iframe src="..."></iframe>`
3. **TikTok**:
   - Link Video: `https://www.tiktok.com/@osissmaitfi/video/71234567890`
   - Tag Embed HTML: `<iframe src="..."></iframe>`
4. **Instagram**:
   - Link Post/Reel: `https://www.instagram.com/p/XXXXX/` atau `https://www.instagram.com/reel/XXXXX/`
   - Tag Embed HTML: `<iframe src="..."></iframe>`

---

## 3. Analisis Komponen & Fitur (`SosmedHub.tsx`)

### A. Total Reach & Profiles Grid (Header & Social Cards)
- **Ringkasan Jangkauan**: Widget estimasi jangkauan audiens (2.5K+ reach).
- **4 Kartu Platform Utama**:
  1. **Instagram**: Tampilan statistik follower (`@osissmaitfi`), link ke profil.
  2. **TikTok**: Tampilan statistik follower (`@osissmaitfi`), styling kontras gelap.
  3. **YouTube**: Tampilan subscriber (`SMAIT Fithrah Insani`), link channel.
  4. **Spotify**: Tampilan pendengar (`Agora Talk`), statistik podcast.

### B. Dynamic Feed & Embed Converter Parser
- **Tab Filter**: `Semua`, `Instagram`, `TikTok`, `YouTube`, `Spotify`.
- **Embed Auto Parser**: Disediakan parser `getEmbedHtml` di `SosmedHub.tsx` yang secara otomatis mengonversi link standar platform menjadi iframe interaktif beresolusi pas.

### C. Pemutar Podcast Interaktif (Spotify Mini Player)
- State simulation berbasis Client-side React (`isPlaying`, `playbackSeconds`, `totalDurationSeconds`).
- Visualizer animasi sederhana (pulsing equalizer) saat playback aktif.

### D. Formulir Saran Ide Konten (Inbox API)
- Form interaktif dengan input `Nama`, `Kelas`, `Kategori Media`, dan `Saran Ide`.
- Mengirim request POST ke API Route [`/api/inbox`](osis-smait-fi/src/app/api/inbox/route.ts:4) untuk diteruskan ke Strapi CMS endpoint `/api/inboxes`.

---

## 4. Ringkasan Perubahan Kode
- Update [`osis-smait-fi/src/components/sosmed/SosmedHub.tsx`](osis-smait-fi/src/components/sosmed/SosmedHub.tsx:193): Menambahkan helper `getEmbedHtml` untuk auto parsing link URL YouTube, Spotify, TikTok, dan Instagram.
- Update [`strapi-cms/src/index.ts`](strapi-cms/src/index.ts:627) & [`strapi-cms/scripts/seed.ts`](strapi-cms/scripts/seed.ts:454): Menyediakan struktur `metadata_json` default untuk halaman media sosial.

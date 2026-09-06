<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context: OSIS SMAIT Fithrah Insani Website

## Stack & Services
- **Frontend**: Next.js 16 (App Router, Turbopack) at `/home/attabi/Documents/WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi` (PM2: `osis-next-frontend`, Port: 3002)
- **Backend**: Strapi v5 at `https://osisstrapi.biezz.my.id` (Internal: `http://127.0.0.1:1337`)

## Infinite Gallery (`/galeri/galeri-preview-infinity`) Optimization Summary
- **Seamless Tiling (Frame Menempel)**: `GAP` diatur ke `0px` dan sudut `PhotoCard` menggunakan `rounded-none` sehingga antar frame foto saling menempel tanpa celah.
- **Direct Strapi CDN**: `PhotoCard` memuat gambar langsung dari format Strapi (`formats.medium.url` / `formats.large.url`) tanpa melalui proxy server `/api/compress-image`.
- **Rendering & Infinite Wrap Fix**:
  - Properti `contentVisibility: "auto"` dihapus untuk mencegah tile hilang saat di-drag/scroll di Chromium/WebKit.
  - Min column repeat height dinaikkan ke `3600px`.
  - Grid render range disesuaikan: `GX_RANGE = [-1, 0, 1, 2]` dan `CI_RANGE = [-2, -1, 0, 1, 2]`.

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const EVENTS_SKILL_CONTENT = `---
name: browse-events
description: Retrieve and query upcoming school events, agendas, and competitions at SMAIT Fithrah Insani.
---

# Browse Events Skill

## Overview
Skill ini memungkinkan LLM Agent untuk menemukan, membaca rincian, dan menjelajahi jadwal kegiatan, lomba, serta agenda OSIS SMAIT Fithrah Insani (Agora Acta).

## Data & Endpoints
- **Halaman Web Utama**: \`https://osissmaitfi.biezz.my.id/events\`
- **Detail Kegiatan**: \`https://osissmaitfi.biezz.my.id/events/{slug}\`
- **Strapi CMS Endpoint**: \`https://osisstrapi.biezz.my.id/api/events\`

## Struktur Payload Agenda
- \`title\`: Judul kegiatan/lomba
- \`slug\`: Slug URL kegiatan
- \`date\`: Waktu pelaksanaan agenda
- \`location\`: Lokasi kegiatan (Aula, Lapangan, dsb.)
- \`description\`: Ringkasan kegiatan & panduan peserta
- \`organizer\`: Sekbid/Kepanitiaan penanggung jawab

## Panduan Penggunaan Agent
1. Gunakan endpoint \`/events\` untuk mengambil daftar kalender kegiatan aktif.
2. Filter berdasarkan rentang waktu jika mencari kegiatan yang akan datang (upcoming).
3. Akses detail agenda dengan merujuk slug kegiatan untuk mendapatkan petunjuk teknis atau ketentuan partisipasi.
`;

export async function GET() {
  return new NextResponse(EVENTS_SKILL_CONTENT, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

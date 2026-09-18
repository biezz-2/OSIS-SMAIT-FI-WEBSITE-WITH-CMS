import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const PROKER_SKILL_CONTENT = `---
name: browse-proker
description: Explore work programs (program kerja) and student council department details.
---

# Browse Proker Skill

## Overview
Skill ini memfasilitasi LLM Agent untuk menjelajahi Program Kerja (Proker) dan struktur Sekbid (Seksi Bidang) OSIS SMAIT Fithrah Insani.

## Data & Endpoints
- **Halaman Web Utama**: \`https://osissmaitfi.biezz.my.id/program-kerja\`
- **Detail Sekbid/Departemen**: \`https://osissmaitfi.biezz.my.id/sekbid/{slug}\`
- **Detail Proker**: \`https://osissmaitfi.biezz.my.id/program-kerja/{slug}\`
- **CMS Backend**: \`https://osisstrapi.biezz.my.id/api/program-kerjas\`

## Struktur Sekbid OSIS SMAIT FI
- BPH (Badan Pengurus Harian): Ketua, Wakil, Sekretaris, Bendahara
- Sekbid 1: Pembinaan Keimanan dan Ketaqwaan terhadap Tuhan YME
- Sekbid 2: Pembinaan Budi Pekerti Luhur dan Akhlak Mulia
- Sekbid 3: Kepribadian Unggul, Wawasan Kebangsaan, dan Bela Negara
- Sekbid 4: Prestasi Akademik, Seni, dan Olahraga
- Sekbid 5: Demokrasi, HAM, Pendidikan Politik, Lingkungan Hidup, dan Kepekaan Sosial
- Sekbid 6: Kreativitas, Keterampilan, dan Kewirausahaan
- Sekbid 7: Kualitas Jasmani, Kesehatan, dan Gizi
- Sekbid 8: Sastra dan Budaya
- Sekbid 9: Teknologi Informasi dan Komunikasi (TIK)
- Sekbid 10: Komunikasi dalam Bahasa Asing

## Panduan Penggunaan Agent
1. Query daftar proker di \`/program-kerja\` untuk membaca nama, sasaran, dan deskripsi program tahunan.
2. Hubungkan data proker dengan sekbid terkait via \`/sekbid/{id}\`.
3. Agent dapat meringkas target program kerja per bidang untuk kebutuhan laporan atau transparansi siswa.
`;

export async function GET() {
  return new NextResponse(PROKER_SKILL_CONTENT, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

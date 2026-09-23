# Data sementara — Portal MUBES / LPJ Sidang

## Urutan tampilan halaman penuh (`/portal-mubes/proker/[slug]`)

| # | Bagian | Isi di Strapi |
|---|--------|----------------|
| 1 | **Tujuan** | `mubes-lpj` → **Sections** judul `Tujuan` (atau field Program Kerja `tujuan`) |
| 2 | **Teknis & Waktu** | Sections judul `Teknis & Waktu` (atau Program Kerja `teknis_pelaksanaan`) |
| 3 | **Capaian** | Sections judul `Capaian` |
| 4 | **Evaluasi & Solusi** | Sections judul `Evaluasi & Solusi` (atau `evaluasi_internal` / `evaluasi_deskripsi`) |
| 5 | **Kuisioner** | Program Kerja → **Evaluasi form url** (`evaluasi_form_url`) |
| 6 | **Dokumentasi** | Program Kerja → **Dokumentasi items** (judul, deskripsi, media, order) |

Relasi wajib: **🏛️ [MUBES] LPJ & Anggaran Proker** → field **Program kerja** = proker terkait.

## Seed dummy LPJ sections (48 proker)

```bash
node docs/data-sementara/seed-lpj-sections.mjs docs/data-sementara/lpj-seed-batch-N.json
```

Membuat/mengisi 4 section LPJ (Tujuan, Teknis & Waktu, Capaian, Evaluasi & Solusi) + URL kuisioner dummy.

Hasil: `result-lpj-batch-*.json`

## Edit di Strapi Admin

1. [https://osisstrapi.biezz.my.id/admin](https://osisstrapi.biezz.my.id/admin)
2. **Program Kerja** → dokumentasi items + URL kuisioner
3. **MUBES LPJ** → sections 1–4 + anggaran/nota (opsional)

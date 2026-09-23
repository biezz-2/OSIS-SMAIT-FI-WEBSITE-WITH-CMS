/**
 * Self-check: pickLpjSectionIsi matching (mirrors strapi helper logic).
 * Run: npx tsx src/lib/public-proker-lpj.check.ts
 */
function pickLpjSectionIsi(sections: unknown, ...nameParts: string[]): string | null {
  if (!sections) return null;
  const list = Array.isArray(sections)
    ? sections
    : Array.isArray((sections as { data?: unknown }).data)
      ? ((sections as { data: unknown[] }).data as unknown[])
      : [];
  const needles = nameParts.map((s) => s.toLowerCase());
  for (const item of list) {
    const row = (item as { attributes?: Record<string, unknown> })?.attributes || (item as Record<string, unknown>) || {};
    const judul = String(row.judul ?? row.title ?? '').toLowerCase();
    if (!needles.some((n) => judul.includes(n))) continue;
    const isi = String(row.isi ?? row.deskripsi ?? row.content ?? '').trim();
    if (isi) return isi;
  }
  return null;
}

const sample = [
  { order: 1, judul: 'Tujuan', isi: 'A' },
  { order: 3, judul: 'Capaian', isi: 'Total 162 kali' },
  { order: 4, judul: 'Evaluasi & Solusi', isi: 'EVALUASI\n1. …' },
];

const capaian = pickLpjSectionIsi(sample, 'capaian');
const evaluasi = pickLpjSectionIsi(sample, 'evaluasi');
if (capaian !== 'Total 162 kali') throw new Error(`capaian got ${capaian}`);
if (!evaluasi?.includes('EVALUASI')) throw new Error(`evaluasi got ${evaluasi}`);
console.log('ok: public proker LPJ section pick');

/**
 * Runnable self-check for LPJ section normalization.
 * Run: npx tsx src/components/program-kerja/mubes-lpj-sections.check.ts
 */
import { normalizeLpjSections } from './MubesLpjSection';

const sample = [
  { id: 2, judul: 'Capaian', isi: 'Total 162 kali', order: 3 },
  { id: 1, judul: 'Tujuan', isi: 'Memperluas pengetahuan…', order: 1 },
  { id: 3, judul: 'Teknis & Waktu', isi: 'Offline setelah Dzuhur', order: 2 },
  { id: 4, judul: 'Evaluasi & Solusi', isi: 'EVALUASI\n1. …\nSOLUSI\n1. …', order: 4 },
];

const out = normalizeLpjSections(sample);
const titles = out.map((s) => s.judul).join(' → ');
const expected = 'Tujuan → Teknis & Waktu → Capaian → Evaluasi & Solusi';

if (titles !== expected) {
  console.error('FAIL order:', titles);
  process.exit(1);
}

const nested = normalizeLpjSections({
  data: [{ id: 9, attributes: { judul: 'Tujuan', isi: 'x', order: 0 } }],
});
if (nested.length !== 1 || nested[0].judul !== 'Tujuan') {
  console.error('FAIL nested Strapi shape');
  process.exit(1);
}

console.log('ok:', titles);

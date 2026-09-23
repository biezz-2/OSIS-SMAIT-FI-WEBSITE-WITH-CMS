#!/usr/bin/env node
/**
 * Seed realisasi_anggaran + sumber_dana pada collection mubes-lpj
 * untuk proker yang dokumen LPJ/Proposal-nya mencantumkan pengeluaran uang.
 *
 * Sumber: docs/data-sementara/README.md (pengeluaran realisasi / rancangan bila hanya itu).
 * Usage: node scripts/seed-mubes-anggaran.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}
loadEnv(join(ROOT, 'osis-smait-fi/.env.local'));
loadEnv(join(ROOT, 'strapi-cms/.env'));

const API = (
  process.env.STRAPI_URL ||
  process.env.STRAPI_INTERNAL_URL ||
  'http://127.0.0.1:1337'
).replace(/\/$/, '');
const TOKEN = process.env.STRAPI_ELEVATED_TOKEN;
if (!TOKEN) {
  console.error('Missing STRAPI_ELEVATED_TOKEN');
  process.exit(1);
}

const hdr = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

/** Pengeluaran dari dokumen LPJ/Proposal (bukan pembagian keuntungan). */
const ANGGARAN_BY_SLUG = {
  'ramadhan-ceria': {
    realisasi_anggaran: 434000,
    sumber_dana: 'Kas OSIS / Proposal (rancangan dokumen)',
    note: 'Rancangan anggaran proposal TOTAL Rp434.000',
  },
  phbn: {
    realisasi_anggaran: 318000,
    sumber_dana: 'Swadaya / pemasukan acara Guidelight',
    note: 'LPJ Guidelight: pengeluaran Rp318.000 (pemasukan 370k, sisa 52k)',
  },
  classmeet: {
    realisasi_anggaran: 548000,
    sumber_dana: 'Kas OSIS / Kepanitiaan Classmeet',
    note: 'LPJ sebagian: konsumsi juri+pimpinan total Rp548.000',
  },
  'Direct-Marketing': {
    realisasi_anggaran: 125000,
    sumber_dana: 'Kas OSIS / Kewirausahaan',
    note: 'LPJ: Rp75.000 + sewa lapangan Pakusarakan Rp50.000 = Rp125.000',
  },
};

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: hdr,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
  }
  return json;
}

async function findLpjBySlug(slug) {
  const q = new URLSearchParams();
  q.set('filters[program_kerja][slug][$eq]', slug);
  q.set('populate[program_kerja][fields][0]', 'slug');
  q.set('populate[program_kerja][fields][1]', 'judul');
  q.set('pagination[pageSize]', '5');
  q.set('status', 'draft');
  const res = await api('GET', `/api/mubes-lpjs?${q}`);
  return (res.data || [])[0] || null;
}

async function main() {
  console.log(`API ${API}`);
  console.log(`Seeding ${Object.keys(ANGGARAN_BY_SLUG).length} proker dengan pengeluaran…\n`);

  const results = [];
  for (const [slug, row] of Object.entries(ANGGARAN_BY_SLUG)) {
    const entry = { slug, status: 'fail', note: row.note };
    try {
      const lpj = await findLpjBySlug(slug);
      if (!lpj) throw new Error('mubes-lpj not found for slug');
      entry.lpj_documentId = lpj.documentId;
      entry.judul = lpj.program_kerja?.judul || lpj.attributes?.program_kerja?.data?.attributes?.judul;

      await api('PUT', `/api/mubes-lpjs/${lpj.documentId}`, {
        data: {
          realisasi_anggaran: row.realisasi_anggaran,
          sumber_dana: row.sumber_dana,
        },
      });

      try {
        await api('POST', `/api/mubes-lpjs/${lpj.documentId}/actions/publish`);
        entry.published = true;
      } catch (e) {
        entry.published = false;
        entry.publish_error = String(e.message || e).slice(0, 200);
      }

      entry.status = 'ok';
      entry.realisasi_anggaran = row.realisasi_anggaran;
      entry.sumber_dana = row.sumber_dana;
      console.log(
        `✓ ${slug} → Rp ${row.realisasi_anggaran.toLocaleString('id-ID')} | ${row.sumber_dana}`
      );
    } catch (e) {
      entry.error = String(e.message || e);
      console.error(`✗ ${slug}: ${entry.error}`);
    }
    results.push(entry);
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  const fail = results.length - ok;
  console.log(`\nDone: ${ok} ok, ${fail} fail`);
  if (fail) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Backfill program-kerja.capaian (+ evaluasi_deskripsi if empty) from mubes-lpj.sections.
 * Usage: node scripts/backfill-proker-capaian.mjs [--dry-run]
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');

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

const API = (process.env.STRAPI_URL || process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337').replace(
  /\/$/,
  ''
);
const TOKEN = process.env.STRAPI_ELEVATED_TOKEN;
if (!TOKEN) {
  console.error('Missing STRAPI_ELEVATED_TOKEN');
  process.exit(1);
}

const hdr = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
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
    throw new Error(`${method} ${path} → ${res.status}: ${json?.error?.message || text.slice(0, 200)}`);
  }
  return json;
}

function pickSection(sections, needle) {
  const list = Array.isArray(sections) ? sections : [];
  const n = needle.toLowerCase();
  for (const s of list) {
    const row = s?.attributes || s || {};
    const judul = String(row.judul || '').toLowerCase();
    if (!judul.includes(n)) continue;
    const isi = String(row.isi || '').trim();
    if (isi) return isi;
  }
  return null;
}

async function main() {
  const lpjRes = await api(
    'GET',
    '/api/mubes-lpjs?pagination[limit]=100&populate[sections]=true&populate[program_kerja][fields][0]=slug&populate[program_kerja][fields][1]=documentId&populate[program_kerja][fields][2]=capaian&populate[program_kerja][fields][3]=evaluasi_deskripsi'
  );
  const items = lpjRes?.data || [];
  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    const a = item.attributes || item;
    const pk = a.program_kerja?.data || a.program_kerja;
    if (!pk) {
      skipped++;
      continue;
    }
    const pkAttrs = pk.attributes || pk;
    const docId = pk.documentId || pkAttrs.documentId;
    const slug = pkAttrs.slug || pk.slug;
    if (!docId) {
      console.warn('skip no documentId', slug);
      skipped++;
      continue;
    }

    const capaian = pickSection(a.sections, 'capaian');
    const evaluasi =
      pickSection(a.sections, 'evaluasi') ||
      (typeof a.evaluasi_internal === 'string' ? a.evaluasi_internal.trim() : null);

    const patch = {};
    const existingCap = typeof pkAttrs.capaian === 'string' ? pkAttrs.capaian.trim() : '';
    const existingEv =
      typeof pkAttrs.evaluasi_deskripsi === 'string' ? pkAttrs.evaluasi_deskripsi.trim() : '';

    if (capaian && !existingCap) patch.capaian = capaian;
    if (evaluasi && !existingEv) patch.evaluasi_deskripsi = evaluasi;

    if (Object.keys(patch).length === 0) {
      skipped++;
      continue;
    }

    console.log(`${DRY ? '[dry] ' : ''}${slug}:`, Object.keys(patch).join(', '));
    if (!DRY) {
      await api('PUT', `/api/program-kerjas/${docId}`, { data: patch });
      try {
        await api('POST', `/api/program-kerjas/${docId}/actions/publish`, {});
      } catch {
        /* publish optional */
      }
    }
    updated++;
  }

  console.log(`Done. updated=${updated} skipped=${skipped} dry=${DRY}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

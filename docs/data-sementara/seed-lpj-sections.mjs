#!/usr/bin/env node
/**
 * Seed mubes-lpj sections for a batch file.
 * Usage: node seed-lpj-sections.mjs <batch-json-path>
 * Auth: STRAPI_ELEVATED_TOKEN from osis-smait-fi/.env.local OR first arg token via env
 */
import fs from 'fs';
import path from 'path';

const batchPath = process.argv[2];
if (!batchPath) { console.error('need batch path'); process.exit(1); }
const batch = JSON.parse(fs.readFileSync(batchPath,'utf8'));

function loadEnv() {
  const p = '/home/attabi/Documents/WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/.env.local';
  const t = fs.readFileSync(p,'utf8');
  const m = t.match(/^STRAPI_ELEVATED_TOKEN=(.+)$/m);
  if (!m) throw new Error('no STRAPI_ELEVATED_TOKEN');
  return m[1].trim().replace(/^["']|["']$/g,'');
}
const token = loadEnv();
const base = 'http://127.0.0.1:1337';
const headers = { Authorization: 'Bearer '+token, 'Content-Type': 'application/json' };

function dummySections(judul) {
  return [
    { judul: 'Tujuan', isi: 'Lorem ipsum tujuan kegiatan "'+judul+'". Memperkuat indikator keberhasilan program kerja OSIS SMAIT Fithrah Insani.', order: 1 },
    { judul: 'Teknis & Waktu', isi: 'Lorem ipsum teknis & waktu "'+judul+'".\n1. Pra-acara: koordinasi panitia H-7.\n2. Hari-H: pelaksanaan sesuai jadwal.\n3. Pasca: rekap dan dokumentasi H+1.', order: 2 },
    { judul: 'Capaian', isi: 'Lorem ipsum capaian "'+judul+'". Target kuantitatif/kualitatif terpenuhi sesuai indikator proposal.', order: 3 },
    { judul: 'Evaluasi & Solusi', isi: 'Lorem ipsum evaluasi "'+judul+'".\nKendala: [contoh].\nSolusi: [contoh].\nRekomendasi periode berikutnya.', order: 4 },
  ];
}

async function findLpjByProkerDocId(prokerDocumentId) {
  // Content manager list with filter is tricky; use REST elevated
  const qs = new URLSearchParams();
  qs.set('filters[program_kerja][documentId][$eq]', prokerDocumentId);
  qs.set('populate[sections]', 'true');
  qs.set('populate[program_kerja]', 'true');
  qs.set('pagination[limit]', '5');
  const res = await fetch(base+'/api/mubes-lpjs?'+qs.toString(), { headers });
  const j = await res.json();
  return j.data?.[0] || null;
}

async function findLpjBySlug(slug) {
  const qs = new URLSearchParams();
  qs.set('filters[program_kerja][slug][$eq]', slug);
  qs.set('populate[sections]', 'true');
  qs.set('pagination[limit]', '5');
  const res = await fetch(base+'/api/mubes-lpjs?'+qs.toString(), { headers });
  const j = await res.json();
  return j.data?.[0] || null;
}

async function createLpj(prokerDocumentId, sections) {
  // Prefer content-manager if possible with elevated
  const body = {
    data: {
      program_kerja: prokerDocumentId,
      sections,
      status_pengesahan: 'draft',
      realisasi_anggaran: 0,
      sumber_dana: 'Kas OSIS / Dummy',
      evaluasi_internal: sections.find(s=>s.judul.includes('Evaluasi'))?.isi || '',
    }
  };
  const res = await fetch(base+'/api/mubes-lpjs', { method:'POST', headers, body: JSON.stringify(body) });
  const j = await res.json();
  return { ok: res.ok, status: res.status, j };
}

async function updateLpj(documentId, sections) {
  const body = { data: { sections, status_pengesahan: 'draft' } };
  const res = await fetch(base+'/api/mubes-lpjs/'+documentId, { method:'PUT', headers, body: JSON.stringify(body) });
  const j = await res.json();
  return { ok: res.ok, status: res.status, j };
}

async function publishLpj(documentId) {
  // try document service publish
  const res = await fetch(base+'/api/mubes-lpjs/'+documentId+'/actions/publish', { method:'POST', headers, body:'{}' });
  if (res.ok) return { ok:true, status:res.status };
  // content-manager publish
  const res2 = await fetch(base+'/content-manager/collection-types/api::mubes-lpj.mubes-lpj/'+documentId+'/actions/publish', { method:'POST', headers, body:'{}' });
  return { ok: res2.ok, status: res2.status };
}

async function updateProkerKuisioner(documentId, judul) {
  // keep dokumentasi_items; set evaluasi_form_url dummy if empty via content-manager with mcp token fallback
  const mcp = fs.readFileSync('/home/attabi/.config/agoraacta/strapi-mcp.token','utf8').trim().split('\n')[0];
  const h = { Authorization: 'Bearer '+mcp, 'Content-Type': 'application/json' };
  // get current
  const g = await fetch(base+'/content-manager/collection-types/api::program-kerja.program-kerja/'+documentId, { headers: h });
  const cur = await g.json();
  const data = cur.data || cur;
  const url = data.evaluasi_form_url && data.evaluasi_form_url !== '#' ? data.evaluasi_form_url : 'https://forms.gle/dummy-kuisioner-mubes';
  const res = await fetch(base+'/content-manager/collection-types/api::program-kerja.program-kerja/'+documentId, {
    method:'PUT', headers: h,
    body: JSON.stringify({ evaluasi_form_url: url })
  });
  await fetch(base+'/content-manager/collection-types/api::program-kerja.program-kerja/'+documentId+'/actions/publish', { method:'POST', headers: h });
  return res.ok;
}

const results = [];
for (const p of batch) {
  try {
    let existing = await findLpjBySlug(p.slug);
    if (!existing) existing = await findLpjByProkerDocId(p.documentId);
    const sections = dummySections(p.judul);
    let documentId;
    if (existing) {
      documentId = existing.documentId;
      const u = await updateLpj(documentId, sections);
      if (!u.ok) throw new Error('update '+u.status+' '+JSON.stringify(u.j?.error||'').slice(0,120));
    } else {
      const c = await createLpj(p.documentId, sections);
      if (!c.ok) throw new Error('create '+c.status+' '+JSON.stringify(c.j?.error||c.j).slice(0,200));
      documentId = c.j?.data?.documentId;
    }
    if (documentId) await publishLpj(documentId);
    await updateProkerKuisioner(p.documentId, p.judul);
    results.push({ slug: p.slug, ok: true, lpjDocumentId: documentId });
    process.stdout.write('.');
  } catch (e) {
    results.push({ slug: p.slug, ok: false, error: String(e.message||e) });
    process.stdout.write('x');
  }
}
console.log('');
const outFile = batchPath.replace('lpj-seed-batch','result-lpj-batch');
fs.writeFileSync(outFile, JSON.stringify({ ok: results.filter(r=>r.ok).length, fail: results.filter(r=>!r.ok).length, results }, null, 2));
console.log(JSON.stringify({ ok: results.filter(r=>r.ok).length, fail: results.filter(r=>!r.ok).length }));

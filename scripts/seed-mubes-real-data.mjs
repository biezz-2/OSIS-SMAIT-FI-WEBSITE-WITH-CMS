#!/usr/bin/env node
/**
 * Seed MUBES LPJ + program-kerja with authentic professional copy.
 * Sources: docs/data-sementara/README.md + Laporan_Analisis_Proker_OSIS.md
 *
 * Usage: node scripts/seed-mubes-real-data.mjs
 * Env: STRAPI_URL (default http://127.0.0.1:1337), STRAPI_ELEVATED_TOKEN from osis-smait-fi/.env.local
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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[k] === undefined) process.env[k] = v;
  }
}
loadEnv(join(ROOT, 'osis-smait-fi/.env.local'));
loadEnv(join(ROOT, 'strapi-cms/.env'));

const API = (process.env.STRAPI_URL || process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337').replace(/\/$/, '');
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
    const msg = json?.error?.message || text.slice(0, 200);
    throw new Error(`${method} ${path} → ${res.status}: ${msg}`);
  }
  return json;
}

function sections({ tujuan, teknis, capaian, evaluasi }) {
  return [
    { order: 1, judul: 'Tujuan', isi: tujuan.trim() },
    { order: 2, judul: 'Teknis & Waktu', isi: teknis.trim() },
    { order: 3, judul: 'Capaian', isi: capaian.trim() },
    { order: 4, judul: 'Evaluasi & Solusi', isi: evaluasi.trim() },
  ];
}

/** Professional LPJ body per slug — factual from README, polished with Laporan Analisis tone. */
const DATA = {
  'tilawah-osis': {
    tujuan:
      "Memperbanyak dan memperlancar tilawah Al-Qur'an bagi seluruh pengurus OSIS SMAIT Fithrah Insani, serta memperkuat interaksi harian dengan Al-Qur'an melalui sistem pemantauan yang terukur.",
    teknis:
      'Online: setiap hari pukul 06.00–19.00 WIB melalui daftar hadir Google Form (target tilawah harian tercapai/tidak).\nOffline: rekap dan evaluasi pada rapat umum, menyesuaikan jadwal rapat.\nRekapitulasi periodik mencakup seluruh pengurus (contoh periode 1 Januari–23 Agustus).',
    capaian:
      "Target terpenuhi: pengurus OSIS menambah kuantitas tilawah secara signifikan. Rekapitulasi individual tercatat (contoh: 275–302 halaman pada PJ utama). Program berhasil meningkatkan interaksi harian pengurus dengan Al-Qur'an melalui monitoring online dan offline.",
    evaluasi:
      'Kendala: konsistensi pengisian form dan rekap antar sekbid masih perlu diseragamkan.\nSolusi: standarisasi format rekap triwulanan dan reminder harian ke koordinator sekbid.\nRekomendasi: pertahankan dual-channel (online + offline) dan publikasikan leaderboard internal secara berkala.',
  },
  takhosus: {
    tujuan:
      "Menambah dan menguatkan hafalan Al-Qur'an secara intensif melalui metode terstruktur, hingga siswa mencapai target muraja'ah yang ditetapkan.",
    teknis:
      'Pelaksanaan Selasa–Kamis (dimulai 27 Januari 2026), fokusul 06.30 WIB di masjid sekolah.\nFokus: intensitas hafalan, penguasaan mendalam, dan kedisiplinan kehadiran.\nDaftar hadir dicetak sebelum kegiatan; absensi dan evaluasi diarsipkan per sesi.',
    capaian:
      "Terlaksana 41 kali dalam satu periode. Kuesioner 184 responden: 40,2% setuju dan 28,8% sangat setuju bahwa Takhosus membantu menambah serta muraja'ah hafalan (total respons positif ≈69%). Dampak positif dirasakan mayoritas peserta; area pengembangan utama pada manajemen waktu dan kehadiran.",
    evaluasi:
      'Kendala: (1) daftar hadir belum selalu tercetak; (2) keterlambatan ke masjid; (3) bentrok jadwal dengan proker lain.\nSolusi: (1) cetak daftar hadir sebelum kegiatan; (2) pengingat pukul 06.30 WIB; (3) sinkronisasi master kalender antar sekbid.\nRekomendasi: tetapkan lead time koordinasi H-3 untuk menghindari tabrakan jadwal.',
  },
  'pendampingan-rohis': {
    tujuan:
      'Menumbuhkan semangat religius dan kepedulian sosial siswa melalui kegiatan keagamaan rutin yang aplikatif (Al-Kahfi, IOTM, Keakhwatan, pengelolaan infak).',
    teknis:
      'Al-Kahfi: Jumat pengondisian pagi (contoh: Nov 2025–Ags 2026).\nIOTM (Islamic of the Month): Jumat pekan ke-4.\nKeakhwatan: Jumat setelah Salat Dzuhur (kelas X & XI).\nPengelolaan infak: tiap Jumat pekan ke-4.\nStruktur Rohis lengkap (ketua, wakil, sekretaris, bendahara, PJ IOTM, anggota).',
    capaian:
      'Kuesioner 184 responden: 42,9% setuju dan 11,4% sangat setuju bahwa program Rohis meningkatkan pemahaman, pengamalan, dan kecintaan terhadap nilai Islam (≈54% respons positif). Agenda rutin berhasil menggerakkan religiusitas siswa di lingkungan sekolah.',
    evaluasi:
      'Kendala: proporsi responden netral masih tinggi; konsistensi kehadiran dan dokumentasi perlu diperkuat.\nSolusi: perketat alur dokumentasi ke Sekbid 8; publikasikan ringkasan capaian tiap bulan ke grup kelas.\nRekomendasi: perkuat branding IOTM dan Al-Kahfi agar partisipasi non-pengurus meningkat.',
  },
  kultum: {
    tujuan:
      'Memperluas wawasan keagamaan siswa/i sekaligus melatih kepercayaan diri melalui giliran mengisi kultum harian di lingkungan sekolah.',
    teknis:
      'Jadwal harian (contoh November 2025): tema bergilir (Kematian, Sedekah, Puasa sunah, Haji, Larangan ghibah, Surga, Sabar, Tahajud, dll.).\nPengisi dikonfirmasi H-1; dokumentasi peralatan sholat & handphone disiapkan sekbid 1.\nJika pengisi berhalangan, sekbid 1 menggantikan.',
    capaian:
      'Target tercapai: siswa menambah ilmu agama dan melatih rasa percaya diri, baik sebagai pengisi maupun pendengar. Program dinilai efektif memperluas wawasan agama dengan catatan perbaikan pada konsistensi jadwal dan dokumentasi.',
    evaluasi:
      'Kendala: (1) dokumentasi kurang lengkap; (2) kultum tidak selalu sesuai jadwal; (3) duplikasi tema antar hari/bulan.\nSolusi: (1) inisiatif dokumentasi sekbid 1; (2) konfirmasi pengisi + backup; (3) audit jadwal untuk mencegah tema kembar.\nRekomendasi: bank tema tahunan dan checklist dokumentasi per sesi.',
  },
  'hadist-of-the-week': {
    tujuan:
      'Mengenalkan hadits-hadits pilihan kepada siswa/i SMAIT Fithrah Insani agar diketahui dan diamalkan dalam kehidupan sehari-hari.',
    teknis:
      'Distribusi via radio sekolah dan poster Instagram OSIS.\nContoh tema 2026: Mencintai Saudara; Jangan Marah; Amalan yang Dicintai Allah dan Manusia; Berkata Baik atau Diam; Agama adalah Nasihat; Larangan Bid\'ah.\nProduksi poster diajukan lebih awal agar tidak mepet jadwal unggah.',
    capaian:
      'Terlaksana 7 kali dalam satu periode. Rata-rata 345 viewers/story Instagram OSIS. Kuesioner 184 responden: 12,5% sangat setuju dan 37% setuju bahwa HOTW menambah pengetahuan hadits. Jangkauan media sosial luas; fokus pengembangan pada percepatan produksi konten.',
    evaluasi:
      'Kendala: perubahan teknis/waktu penyampaian; pengerjaan dan pengajuan poster mepet jadwal.\nSolusi: persiapan lebih cepat; lead time internal poster H-5.\nRekomendasi: kalender konten bulanan dan template desain tetap untuk mempercepat produksi.',
  },
  'ramadhan-ceria': {
    tujuan:
      'Meningkatkan pemahaman keislaman serta menumbuhkan kebersamaan dan kepedulian sosial melalui Ramadhan Ceria bertema POHON KURMA (Penguatan Olah Hati, Niti, dan Karakter Mulia Ramadhan), terintegrasi bakti sosial.',
    teknis:
      'Senin–Selasa, 9–10 Maret 2026 (06.45–14.30 & 13.00–17.00 WIB) di SMA IT & SMK Informatika Fithrah Insani.\nRangkaian: lomba islami, mabit, kajian, dan aktivitas edukasi-sosial.\nRancangan anggaran dokumen: Rp434.000,00. Kepanitiaan lengkap (pelindung, SC, PJ).',
    capaian:
      'Kegiatan 2 hari terlaksana dengan muatan perlombaan islami, mabit, dan kajian. Integrasi edukasi agama dan bakti sosial berhasil membangun kepedulian sosial siswa.',
    evaluasi:
      'Kendala: miskomunikasi antar divisi; lomba mulai lebih awal; kedisiplinan panitia; dokumen kurang teliti; isu teknis (sound, soal, juklak).\nSolusi: komunikasi lintas divisi; rundown ketat; instruksi tegas; ketelitian dokumen; kesiapan teknis lebih awal.\nRekomendasi: gladi bersih H-1 dan checklist teknis per divisi.',
  },
  phbi: {
    tujuan:
      'Menumbuhkan pemahaman dan semangat siswa/i dalam memahami makna, sejarah, dan amalan hari besar Islam melalui konten edukatif dan kegiatan positif (Isra Mi\'raj, Idul Fitri, Idul Adha, Muharram, Maulid).',
    teknis:
      'Isra Mi\'raj (16 Jan 2026, online): poster & konten.\nIdul Fitri (21 Mar 2026): poster + Halal Bi Halal.\nIdul Adha (27 Mei 2026): peringatan + sedekah qurban pengurus.\nMuharram (16 Jun 2026) & Maulid (25 Ags 2026): publikasi poster edukatif.\nFokus: produksi dan distribusi konten tepat waktu ke grup OSIS/kelas.',
    capaian:
      'Peringatan hari besar Islam terlaksana dengan penekanan pada publikasi konten edukatif. Capaian mencakup poster per momentum, Halal Bi Halal, dan penggalangan sedekah qurban sesuai proposal masing-masing kegiatan.',
    evaluasi:
      'Kendala: miskomunikasi; pengerjaan konten dadakan/mepet; poster Maulid belum sempat dibagikan ke grup.\nSolusi: komunikasi lebih awal; rencana produksi H-7; distribusi poster segera setelah final.\nRekomendasi: satu kalender PHBI tahunan dengan owner konten yang jelas.',
  },
  'sidak-tata-tertib': {
    tujuan:
      'Menguatkan fondasi karakter anggota OSIS agar disiplin, bertanggung jawab, dan menjunjung etika—menjaga marwah serta citra positif SMA IT Fithrah Insani melalui pengawasan atribut dan tata tertib.',
    teknis:
      'Pengecekan atribut dan peraturan oleh pihak terkait (contoh: 17 Juli 2026).\nPelanggaran ditindak dengan teguran dan pembinaan Pembina OSIS/pihak terkait.\nDokumentasi dan pelaporan setiap sidak untuk memantau persentase pelanggaran.',
    capaian:
      'Pengecekan atribut dan peraturan terhadap siswa/i maupun pengurus OSIS terlaksana. Bersama Kompas OSIS, tercatat penurunan tingkat pelanggaran pengurus pada periode Juni–Agustus.',
    evaluasi:
      'Kendala: pemeriksaan masih berfokus fisik/atribut, belum menyentuh self-awareness; improvisasi siswa belum terdata sempurna.\nSolusi: dokumentasi & pelaporan tiap sidak; form efektivitas razia sebagai data konkret.\nRekomendasi: gabungkan indikator perilaku non-atribut secara bertahap.',
  },
  'kompas-osis': {
    tujuan:
      'Menjadikan seluruh anggota OSIS lebih disiplin mematuhi peraturan sekolah, serta menertibkan kelengkapan atribut ikhwan dan akhwat.',
    teknis:
      'Pemeriksaan kelengkapan atribut: akhwat (manset, ciput, kaos kaki, kerudung); ikhwan (dasi, topi, kaos kaki, sabuk, rambut).\nWaktu fleksibel: sesudah apel dan saat rapat; sanksi sesuai ketentuan sekbid 2.\nPelaksanaan tercatat: 10 April 2026 dan 7 Agustus 2026.',
    capaian:
      'Sebagian besar pengurus mengikuti peraturan sekolah. Diagram pelanggaran pengurus menurun pada Juni dan Agustus (total 12 pelanggaran tercatat). Menjaga marwah sekolah melalui pengawasan atribut yang konsisten.',
    evaluasi:
      'Kendala: kerusakan pin OSIS pada sebagian pengurus; data kuesioner belum tersedia di LPJ.\nSolusi: perbaikan pin melalui Sekbid 2; lengkapi instrumen evaluasi kuantitatif periode berikutnya.\nRekomendasi: stok pin cadangan dan SOP penggantian atribut.',
  },
  'class-of-discipline': {
    tujuan:
      'Mengapresiasi siswa/i yang taat peraturan sekolah agar tumbuh motivasi positif, disiplin, dan tanggung jawab.',
    teknis:
      'Rekap pelanggaran terendah setiap 3 bulan; pemenang diumumkan sebagai Class of Discipline.\nContoh pelaksanaan apresiasi: 18 Agustus 2026 pada acara insidental.',
    capaian:
      'Kuesioner 184 responden: 37% setuju dan 22,8% sangat setuju bahwa COD menumbuhkan disiplin atribut (respons positif mayoritas). Apresiasi mendorong motivasi positif mematuhi aturan.',
    evaluasi:
      'Kendala: kolom evaluasi dokumen LPJ belum terisi lengkap.\nSolusi: lengkapi template evaluasi COD (kriteria, timeline, publikasi pemenang).\nRekomendasi: publikasi pemenang di media OSIS untuk memperkuat efek apresiasi.',
  },
  'piket-kedisiplinan': {
    tujuan:
      'Menertibkan kerapihan, kelengkapan, dan disiplin waktu siswa (salat maupun kedatangan) di area gerbang, parkiran, dan gedung.',
    teknis:
      'Pengurus OSIS hadir pukul 06.05; pos jaga di Gedung Ikhwan, parkiran, gerbang, dan titik lain sesuai roster.\nBriefing petugas dengan PJ proker pagi lain agar tidak bentrok sweeping.',
    capaian:
      'Kuesioner 184 responden: 40,8% setuju dan 23,4% sangat setuju bahwa piket membantu menertibkan kerapian dan kelengkapan. Program membantu penertiban waktu dan kerapihan di area gerbang serta gedung.',
    evaluasi:
      'Kendala: sweeping class sering terhambat proker pagi lain.\nSolusi: briefing terpadu petugas piket dengan PJ proker terkait.\nRekomendasi: master roster pagi lintas sekbid.',
  },
  'bakti-sosial': {
    tujuan:
      'Melatih empati dan kepedulian sosial siswa/i melalui penggalangan serta penyaluran dana kepada yang membutuhkan.',
    teknis:
      'Pengumpulan dana sesuai kebutuhan; penyaluran saat ada penerima yang membutuhkan.\nPelaksanaan tercatat: 11 Maret 2026, 17.00–17.30 WIB di SMAIT Fithrah Insani.',
    capaian:
      'Kuesioner 184 responden: 41,3% setuju dan 25% sangat setuju bahwa Bakti Sosial membangun rasa peduli terhadap sesama. Kegiatan mengasah empati siswa melalui aksi sosial nyata.',
    evaluasi:
      'Kendala: kolom evaluasi/solusi dokumen LPJ belum terisi.\nSolusi: standarisasi laporan keuangan dan dampak penerima manfaat.\nRekomendasi: publikasi ringkas hasil penyaluran untuk transparansi.',
  },
  phbn: {
    tujuan:
      'Menumbuhkan rasa nasionalisme dan cinta tanah air melalui peringatan hari besar nasional (Hari Guru, Kartini, Pancasila, Kemerdekaan), dengan puncak Gema Merdeka yang mengintegrasikan semangat kebangsaan dan kewirausahaan.',
    teknis:
      'Hari Guru "Guidelight" (28 Okt 2025): apresiasi guru.\nHari Kartini (20–21 Apr 2026) & Hari Pancasila (1 Jun 2026): kampanye nasionalisme.\nGema Merdeka (18 Ags 2026, 06.45–12.00): estafet, futsal sarung, hias kelas, Market Day, dll. di SMA IT & SMK Informatika FI.',
    capaian:
      'Kuesioner PHBN (184 responden): 41,8% setuju dan 18,5% sangat setuju bahwa PHBN menumbuhkan nasionalisme. Guidelight: pemasukan Rp370.000 / pengeluaran Rp318.000 (sisa Rp52.000); guru mendapat apresiasi. Puncak Gema Merdeka memadukan nasionalisme dengan Market Day.',
    evaluasi:
      'Kendala Guidelight: informasi kurang terstruktur; kebersihan venue. Gema Merdeka: rundown molor, rangkaian mundur.\nSolusi: info lebih matang; bersih venue sebelum acara; pengawasan waktu ketat; kesiapan panitia & koordinasi divisi.\nRekomendasi: timekeeper khusus dan buffer antar sesi 10 menit.',
  },
  'notifikasi-edukasi': {
    tujuan:
      'Menjadi pusat informasi beasiswa, lomba pendidikan, dan peluang akademik bagi siswa/i SMAIT Fithrah Insani.',
    teknis:
      'Kurasi dan unggah informasi beasiswa/lomba secara berkala di kanal resmi OSIS.\nStandar: konsistensi waktu unggahan dan frekuensi informasi yang memadai.',
    capaian:
      'Kuesioner: 17,8% sangat setuju dan 41,6% setuju bahwa Notifikasi Edukasi membantu memperoleh informasi beasiswa, lomba, dan peluang akademik. Berfungsi sebagai hub informasi akademik sekolah.',
    evaluasi:
      'Kendala: konsistensi waktu unggahan dan volume informasi masih perlu ditingkatkan.\nSolusi: jadwal publikasi tetap (mis. 2×/minggu) dan kalender peluang akademik.\nRekomendasi: distribusi proaktif ke grup kelas, bukan hanya feed pasif.',
  },
  'study-club': {
    tujuan:
      'Meningkatkan pemahaman akademik dan persiapan ujian PTS/PAS melalui pembahasan soal bersama guru mata pelajaran.',
    teknis:
      'Sesi study club terjadwal dengan guru mapel; fokus bedah soal dan penguatan materi ujian.\nKehadiran siswa dipantau; pengingat ke anggota sebelum sesi.',
    capaian:
      'Kuesioner: 52,4% sangat setuju dan 29,7% setuju (≈82% respons positif) bahwa Study Club membantu pemahaman materi dan persiapan PTS/PAS. Dampak signifikan pada kesiapan ujian.',
    evaluasi:
      'Kendala: kehadiran siswa belum konsisten.\nSolusi: koordinasi lebih ketat dan pengingat kedisiplinan anggota.\nRekomendasi: target minimal kehadiran per kelas dan laporan singkat ke wali kelas.',
  },
  'two-minutes-class': {
    tujuan:
      'Meningkatkan pemahaman materi melalui konten singkat (±2 menit) berupa fun fact atau tips pembelajaran yang mudah diakses, menumbuhkan minat belajar intrinsik, dan meratakan sebaran informasi.',
    teknis:
      'Produksi video singkat bersama guru mapel; distribusi Instagram & TikTok OSIS.\nContoh Agustus 2026: tips hafal tabel periodik; cara mengukur bumi 1000 tahun lalu.\nLead time produksi diperpanjang agar tidak mepet deadline.',
    capaian:
      'Inovasi edukasi singkat via konten kreatif terlaksana. Kuesioner 184 responden menunjukkan respons beragam (11,4% sangat setuju; 12,4% setuju; 39,5% netral)—perlu optimalisasi jangkauan dan kualitas produksi.',
    evaluasi:
      'Kendala: deadline video terlalu dekat; pemanfaatan fase awal kurang maksimal; lokasi shooting kelas tidak selalu tersedia.\nSolusi: planning lebih awal; alokasi waktu pra-produksi; booking lokasi alternatif.\nRekomendasi: batch production bulanan (4–6 konten) dalam satu sesi shooting.',
  },
  'hari-pendidikan': {
    tujuan:
      'Memperingati Hari Pendidikan Nasional dan meningkatkan kesadaran pentingnya pendidikan melalui kampanye visual serta konten edukatif.',
    teknis:
      'Sabtu, 2 Mei 2026; peserta kelas 10–11.\nPublikasi poster dan konten edukatif; rencana sesi materi guru (perlu koordinasi matang).',
    capaian:
      'Peringatan Hardiknas dan penyampaian pentingnya pendidikan melalui poster/konten terlaksana. Kuesioner: 22,7% sangat setuju dan 37,8% setuju—respons cenderung positif. Kesadaran pendidikan meningkat lewat kampanye visual.',
    evaluasi:
      'Kendala: sesi materi guru belum terlaksana karena keterbatasan waktu persiapan dan koordinasi.\nSolusi: koordinasi dan persiapan lebih matang agar seluruh rangkaian optimal.\nRekomendasi: konfirmasi narasumber H-14.',
  },
  'university-day': {
    tujuan:
      'Memberikan orientasi perguruan tinggi melalui sharing alumni (Enchanted Path) dan layanan dokumentasi FI Flick (photobooth berbingkai), agar siswa memperoleh wawasan pilihan kuliah secara konkret.',
    teknis:
      'Senin–Selasa, 12–13 Januari, mulai 06.45 WIB di SMA IT Fithrah Insani.\nSharing alumni + photobooth FI Flick.\nPengaturan rundown ketat; keputusan lapangan cepat bila ada deviasi.',
    capaian:
      'Kuesioner: 48,6% sangat setuju dan 32,4% setuju bahwa University Day menambah wawasan pilihan perguruan tinggi—tingkat kepuasan sangat tinggi. Orientasi PT berjalan efektif.',
    evaluasi:
      'Kendala: beberapa kegiatan tidak sesuai rundown; pengaturan waktu perlu diperbaiki.\nSolusi: keputusan lapangan lebih cepat agar alur acara tidak terganggu.\nRekomendasi: timekeeper dan buffer antar sesi alumni.',
  },
  'suara-sastra': {
    tujuan:
      'Menghidupkan literasi sastra dan ekspresi kreatif siswa melalui kegiatan Suara Sastra sebagai wadah apresiasi karya.',
    teknis:
      'Pelaksanaan berbasis sesi/dokumentasi bertanggal (25 Feb, 24 Apr, 17 Jun, 6 Ags 2026).\nCatatan: folder administrasi belum memuat Proposal/LPJ tahunan lengkap—dokumentasi menjadi bukti utama pelaksanaan.',
    capaian:
      'Kegiatan literasi sastra terdokumentasi pada beberapa tanggal sepanjang periode. Program mendukung fokus Sekbid 4 pada literasi dan ekspresi sastra.',
    evaluasi:
      'Kendala: absennya dokumen Proposal/LPJ tahunan di folder administrasi.\nSolusi: lengkapi administrasi formal dan arsipkan template LPJ untuk periode berikutnya.\nRekomendasi: digitalisasi dokumentasi segera setelah tiap sesi (rekomendasi strategis lintas sekbid).',
  },
  'write-your-ideas': {
    tujuan:
      'Mewadahi bakat menulis siswa agar karya sastra tidak hanya tersimpan, melainkan dipublikasikan dan diapresiasi.',
    teknis:
      'Sayembara/kegiatan menulis berkala; promosi aktif ke kelas untuk menaikkan partisipasi.\nEvaluasi partisipasi dan ragam genre karya.',
    capaian:
      'Kuesioner: 38,4% setuju dan 13,5% sangat setuju bahwa program memperkenalkan ragam karya sastra. Wadah menulis tersedia; partisipasi masih perlu ditingkatkan lewat promosi lebih agresif.',
    evaluasi:
      'Kendala: metode promosi kurang menarik minat menulis.\nSolusi: ajakan lebih aktif mengikuti lomba/kegiatan; kampanye kelas.\nRekomendasi: kolaborasi dengan Mading dan medsos OSIS untuk showcase karya pemenang.',
  },
  'enlightment-trip': {
    tujuan:
      'Mendorong keterampilan berliterasi tinggi melalui kegiatan membaca (jurnal/cerpen/buku) dilanjutkan kuis (Quizizz) yang terukur.',
    teknis:
      'Siswa membaca materi literasi lalu mengerjakan kuis OSIS.\nContoh sesi: 20 Jan, 3 Feb, 11 Ags 2026.\nDokumentasi dipindah dan disimpan permanen segera setelah kegiatan.',
    capaian:
      'Terlaksana 13 kali dalam satu periode—meningkatkan minat baca melalui literasi berbasis kuis secara konsisten.',
    evaluasi:
      'Kendala: dokumentasi hilang; PJ lambat mengirim dokumentasi; jadwal sering tidak sesuai.\nSolusi: arsip permanen langsung; reminder PJ; sederhanakan rangkaian literasi.\nRekomendasi: folder Drive per sesi + checklist H+0.',
  },
  'quotes-of-the-month': {
    tujuan:
      'Menyebarkan pesan moral dan motivasi belajar melalui quotes bulanan untuk menumbuhkan karakter, literasi, dan kesadaran diri.',
    teknis:
      'Quotes dari film/lagu bermuatan positif; unggah pekan ke-2 dan ke-4 (contoh: 27 Jan & 11 Feb 2026).\nPengecekan audio/visual sebelum upload; jadwal publikasi konsisten.',
    capaian:
      '8 kali pelaksanaan dalam 8 bulan; total 7.372 viewers. Kuesioner: 14,59% sangat setuju dan 40% setuju bahwa QOTM meningkatkan minat literasi dan motivasi. Jangkauan pesan moral sangat luas.',
    evaluasi:
      'Kendala: kejelasan audio dan keteraturan jadwal publikasi.\nSolusi: lokasi rekaman lebih tenang; QC sebelum upload; jadwal tetap.\nRekomendasi: batch rekaman bulanan di studio OSIS.',
  },
  'hari-buku': {
    tujuan:
      'Meningkatkan partisipasi literasi melalui inovasi Book Swap (pertukaran info buku) dan The Human Blurb (promosi buku berpasangan 3 menit).',
    teknis:
      'Selasa, 28 April 2026, 07.00–07.13 di kelas; peserta kelas 10–11.\nBook Swap + The Human Blurb; alokasi waktu per kelas dijaga agar semua mengikuti.',
    capaian:
      'Siswa aktif bertukar buku; sebagian besar lebih percaya diri mempromosikan karya di The Human Blurb. Kuesioner manfaat minat baca: 21,6% sangat setuju; 42,7% setuju. Inovasi efektif meningkatkan kepercayaan diri literasi.',
    evaluasi:
      'Kendala: keterbatasan waktu membuat sebagian kelas melewatkan Human Blurb; kesiapan siswa bervariasi.\nSolusi: perpanjang slot atau rotasi kelas; briefing H-1.\nRekomendasi: integrasikan ke jam literasi reguler.',
  },
  'ulti-multi-language': {
    tujuan:
      'Mengembangkan kompetensi multibahasa dan ekspresi linguistik siswa melalui kompetisi Multi Language (ULTI) sebagai bagian dari fokus literasi Sekbid 4.',
    teknis:
      'Pelaksanaan kompetisi/kegiatan multibahasa sesuai kalender sekbid; dokumentasi dan publikasi hasil ke kanal OSIS.\nKoordinasi dengan Sekbid 8 untuk branding visual.',
    capaian:
      'Program mendukung penguatan literasi dan ekspresi bahasa di lingkungan sekolah, selaras fokus Sekbid 4 pada literasi & ekspresi sastra.',
    evaluasi:
      'Kendala: pastikan administrasi proposal/LPJ dan dokumentasi lengkap tiap edisi.\nSolusi: template LPJ standar + arsip Drive terstruktur.\nRekomendasi: jadwalkan ULTI beriringan momen literasi (mis. Hari Buku) untuk sinergi audiens.',
  },
  'program-kerja': {
    // slug Raga dan Nada
    tujuan:
      'Mengedukasi olahraga dan seni melalui kanal radio serta TikTok, memperluas apresiasi minat bakat di kalangan siswa.',
    teknis:
      'Produksi konten Raga & Nada (olahraga/seni); distribusi radio sekolah dan TikTok OSIS.\nDisarankan distribusi proaktif ke grup kelas selain feed organik.',
    capaian:
      'Edukasi olahraga dan seni tersampaikan melalui media digital. Menjadi saluran rutin Sekbid 5 untuk konten minat bakat.',
    evaluasi:
      'Kendala: jangkauan pasif "posting dan tunggu" kurang optimal.\nSolusi: distribusi langsung ke grup kelas (strategi proaktif).\nRekomendasi: kalender konten mingguan dan kolaborasi Studio OSIS.',
  },
  'ourself-journey': {
    tujuan:
      'Membantu siswa mengenali potensi diri dan berani keluar dari zona nyaman melalui refleksi dan aktivitas pengembangan diri.',
    teknis:
      'Rangkaian kegiatan refleksi/potensi diri sesuai proposal sekbid 5; dokumentasi partisipasi dan umpan balik peserta.',
    capaian:
      'Program mendukung eksplorasi potensi siswa secara personal, selaras fokus Sekbid 5 pada minat dan bakat.',
    evaluasi:
      'Kendala: ukur dampak dengan instrumen kuesioner yang konsisten tiap gelombang.\nSolusi: pre/post survey singkat.\nRekomendasi: integrasi output OJ ke Talent Showcase.',
  },
  'The-Rising-Talent': {
    tujuan:
      'Menjadi pusat informasi kompetisi non-akademik melalui poster digital agar siswa mudah mengakses peluang bakat.',
    teknis:
      'Kurasi lomba non-akademik; desain poster; unggah dan sebar ke kanal OSIS serta grup kelas.\nLead time poster H-5 sebelum deadline lomba.',
    capaian:
      'Informasi kompetisi non-akademik tersalurkan lewat poster digital, mendukung siswa mengeksplorasi peluang di luar akademik.',
    evaluasi:
      'Kendala: produksi poster mepet mengurangi kualitas dan jangkauan.\nSolusi: pipeline desain dengan Studio OSIS; deadline internal lebih awal.\nRekomendasi: database lomba bulanan yang di-update Sekbid 5.',
  },
  'talent-showcase': {
    tujuan:
      'Menyediakan panggung ekspresi bakat siswa secara offline maupun online.',
    teknis:
      'Showcase berkala (panggung/online); open submission; kurasi penampilan; dokumentasi profesional bersama Sekbid 8.',
    capaian:
      'Panggung ekspresi bakat tersedia dalam format offline dan online, memperluas partisipasi siswa berbakat.',
    evaluasi:
      'Kendala: pastikan slot waktu dan teknis panggung/siaran stabil.\nSolusi: gladi teknis H-1; rundown ketat.\nRekomendasi: arsip highlight untuk medsos dan mading.',
  },
  classmeet: {
    tujuan:
      'Menyelenggarakan Classmeet "DYNAMITE" sebagai event skala besar yang menggabungkan kompetisi olahraga, seni, dan kewirausahaan (sinergi Market Day).',
    teknis:
      'Event multi-divisi: lomba olahraga & seni, booth kewirausahaan, dokumentasi.\nKoordinasi lintas sekbid (5 & 7); master rundown dan keamanan peserta.',
    capaian:
      'Event skala besar terlaksana dengan integrasi olahraga, seni, dan wirausaha—puncak eksplorasi minat bakat periode ini.',
    evaluasi:
      'Kendala tipikal event besar: sinkronisasi jadwal dan beban panitia.\nSolusi: master kalender + komando lapangan tunggal.\nRekomendasi: after-action review tertulis H+3.',
  },
  'cleaning-day': {
    tujuan:
      'Membangun budaya bersih dan tanggung jawab kolektif terhadap lingkungan sekolah.',
    teknis:
      'Jadwal cleaning rutin per area/kelas; briefing singkat SOP kebersihan; dokumentasi before-after.',
    capaian:
      'Budaya bersih dan tanggung jawab kolektif terhadap lingkungan sekolah semakin tertanam melalui kegiatan rutin.',
    evaluasi:
      'Kendala: konsistensi partisipasi antar kelas.\nSolusi: roster jelas + apresiasi kelas terbersih.\nRekomendasi: integrasi indikator kebersihan ke program kedisiplinan.',
  },
  'Breakfast-Time': {
    tujuan:
      'Mengedukasi pentingnya sarapan bagi konsentrasi belajar siswa.',
    teknis:
      'Kampanye edukasi sarapan (konten/aktivitas); kolaborasi dengan Health Report untuk penguatan pesan.',
    capaian:
      'Pesan pentingnya sarapan untuk konsentrasi belajar tersampaikan kepada siswa melalui kanal edukasi kesehatan.',
    evaluasi:
      'Kendala: ukur perubahan perilaku dengan survei singkat.\nSolusi: kuesioner pre/post per triwulan.\nRekomendasi: reminder rutin di pengumuman pagi.',
  },
  'Health-Report': {
    tujuan:
      'Menyampaikan kampanye kesehatan digital yang akurat dan menarik agar siswa lebih sadar pola hidup sehat.',
    teknis:
      'Produksi konten kesehatan digital; unggah berkala di kanal OSIS.\nQC fakta kesehatan; kolaborasi Studio OSIS untuk visual.',
    capaian:
      'Kampanye kesehatan digital berperforma tinggi—beberapa konten mencapai >1.600 viewers. Jangkauan edukasi kesehatan sangat baik.',
    evaluasi:
      'Kendala: jaga konsistensi frekuensi agar tidak turun engagement.\nSolusi: kalender konten bulanan.\nRekomendasi: CTA ke Healthy Movement/Healthy Day.',
  },
  'Healty-Station': {
    tujuan:
      'Menyediakan titik edukasi/fasilitas kesehatan ringan di sekolah (Healthy Station) sebagai bagian dari pola hidup sehat.',
    teknis:
      'Operasional stasiun kesehatan sesuai SOP sekbid 6; monitoring stok dan kebersihan; laporan berkala.',
    capaian:
      'Fasilitas/edukasi Healthy Station mendukung fokus Sekbid 6 pada pola hidup sehat di lingkungan sekolah.',
    evaluasi:
      'Kendala: pastikan stok dan jadwal jaga konsisten.\nSolusi: checklist harian PJ.\nRekomendasi: sinkronkan dengan Healthy Day Dinas Kesehatan.',
  },
  'healthy-station': {
    tujuan:
      'Menyediakan Healthy Station sebagai titik edukasi dan layanan kesehatan ringan untuk warga sekolah.',
    teknis:
      'Jadwal operasional, PJ jaga, dan protokol kebersihan stasiun.\nIntegrasi pesan dengan Health Report dan Healthy Movement.',
    capaian:
      'Healthy Station mendukung kesadaran kesehatan harian siswa di lingkungan sekolah.',
    evaluasi:
      'Kendala: duplikasi entri slug di CMS—satukan narasi operasional.\nSolusi: satu SOP tertulis dan satu PJ utama.\nRekomendasi: audit inventaris bulanan.',
  },
  'healthy-movement': {
    tujuan:
      'Menggalakkan olahraga dan gaya hidup aktif melalui senam pagi bersama serta gerakan kesehatan kolektif.',
    teknis:
      'Senam/olahraga pagi terjadwal; instruktur/PJ sekbid 6; dokumentasi partisipasi.',
    capaian:
      'Olahraga kolektif terlaksana; mendukung budaya gerak dan kesehatan jasmani siswa.',
    evaluasi:
      'Kendala: cuaca/jadwal bentrok dapat mengurangi frekuensi.\nSolusi: opsi indoor dan slot cadangan.\nRekomendasi: target minimal sesi per bulan.',
  },
  'environment-day': {
    tujuan:
      'Meningkatkan kesadaran ekologis siswa melalui peringatan dan aksi Environment Day.',
    teknis:
      'Kampanye dan/atau aksi lingkungan sesuai kalender sekbid 6; kolaborasi Cleaning Day; dokumentasi dampak.',
    capaian:
      'Kesadaran ekologis diperkuat melalui momentum Environment Day, selaras fokus pola hidup sehat & lingkungan.',
    evaluasi:
      'Kendala: pastikan aksi berkelanjutan, bukan seremonial sekali jalan.\nSolusi: follow-up program mingguan pasca event.\nRekomendasi: indikator sampah/area bersih terukur.',
  },
  'Healthy-Day': {
    tujuan:
      'Menyelenggarakan pemeriksaan kesehatan menyeluruh bekerja sama dengan Dinas Kesehatan.',
    teknis:
      'Koordinasi Dinas Kesehatan; rundown pemeriksaan; informed consent; rekap hasil ke pihak sekolah sesuai protokol.',
    capaian:
      'Pemeriksaan kesehatan menyeluruh terlaksana bersama Dinas Kesehatan—layanan preventif nyata bagi siswa.',
    evaluasi:
      'Kendala: antrean dan alur peserta perlu dikendalikan.\nSolusi: slot per kelas + panitia alur.\nRekomendasi: surat hasil ringkas ke orang tua bila diizinkan protokol.',
  },
  'Nutrition-day': {
    tujuan:
      'Mengedukasi gizi seimbang melalui kampanye NUTRIFY "Isi Piringku".',
    teknis:
      'Kampanye visual dan edukasi gizi; aktivitas interaktif "Isi Piringku"; distribusi konten ke medsos dan kelas.',
    capaian:
      'Edukasi gizi seimbang tersampaikan melalui kampanye Nutrition Day (NUTRIFY), memperkuat literasi pangan siswa.',
    evaluasi:
      'Kendala: ukur retensi pesan gizi pasca event.\nSolusi: kuis singkat H+7.\nRekomendasi: kolaborasi Kantin/Breakfast Time.',
  },
  'weekly-market': {
    tujuan:
      'Melatih kemampuan dagang dan pengelolaan anggaran secara rutin bagi siswa.',
    teknis:
      'Pasar mingguan: penjadwalan booth, pengelolaan modal/omzet, laporan sederhana.\nMentoring singkat teknik penjualan.',
    capaian:
      'Kemandirian finansial dan mentalitas bisnis dilatih melalui praktik dagang rutin Weekly Market.',
    evaluasi:
      'Kendala: konsistensi laporan keuangan booth.\nSolusi: template rekap omzet harian.\nRekomendasi: showcase booth terbaik bulanan.',
  },
  'ngobrol-bisnis': {
    tujuan:
      'Mentransfer pengetahuan kewirausahaan melalui wawancara/ngobrol dengan praktisi bisnis (NGOBISS).',
    teknis:
      'Undangan narasumber; format wawancara/talkshow; dokumentasi dan kliping konten untuk medsos.',
    capaian:
      'Transfer pengetahuan dari praktisi wirausaha tersampaikan; memperkaya wawasan bisnis siswa.',
    evaluasi:
      'Kendala: jadwal narasumber dan produksi konten pasca acara.\nSolusi: booking H-21; tim dokumentasi dedicated.\nRekomendasi: seri bulanan dengan tema industri berbeda.',
  },
  'Direct-Marketing': {
    tujuan:
      'Mengimplementasikan bisnis sosial melalui penjualan pakaian layak pakai (direct marketing).',
    teknis:
      'Pengumpulan, kurasi, pricing, dan penjualan pakaian layak pakai; laporan hasil penjualan ke kas/organisasi sesuai ketentuan.',
    capaian:
      'Praktik bisnis sosial terlaksana; siswa mengalami siklus pemasaran langsung dari barang ke pembeli.',
    evaluasi:
      'Kendala: stok, pricing, dan channel penjualan perlu direncanakan matang.\nSolusi: SOP kurasi barang + kanal penjualan jelas.\nRekomendasi: padukan dengan Market Day untuk traffic.',
  },
  'Market-Day': {
    tujuan:
      'Memberikan pengalaman wirausaha nyata melalui Market Day, sering bersinergi Classmeet/Gema Merdeka.',
    teknis:
      'Booth siswa, sistem kasir sederhana, layout area jualan, keamanan dan kebersihan pasca acara.',
    capaian:
      'Pengalaman berdagang skala event terfasilitasi; memperkuat mentalitas bisnis dan kolaborasi lintas sekbid.',
    evaluasi:
      'Kendala: crowding dan manage antrian booth.\nSolusi: denah booth + stewards.\nRekomendasi: rekap omzet terpusat H+1.',
  },
  'FI-Flick': {
    tujuan:
      'Menyediakan layanan dokumentasi momen sekolah (photobooth/cetak) yang sekaligus menghasilkan nilai finansial bagi organisasi.',
    teknis:
      'Setup photobooth, harga paket, alur cetak, dan rekap pendapatan.\nSinergi University Day / event besar untuk traffic maksimal.',
    capaian:
      'Layanan dokumentasi momen sekolah berjalan dan berkontribusi finansial bagi organisasi—model unit usaha kreatif OSIS.',
    evaluasi:
      'Kendala: antrean dan stok frame/cetak.\nSolusi: pre-order slot; buffer bahan.\nRekomendasi: paket bundling dengan event sekbid lain.',
  },
  'school-announcement': {
    tujuan:
      'Menjadi pusat informasi kegiatan sekolah melalui konten kreatif di media sosial agar komunikasi publik cepat dan menarik.',
    teknis:
      'Kurasi pengumuman; produksi konten; penjadwalan unggah; monitoring engagement.\nKoordinasi dengan seluruh sekbid untuk bahan akurat.',
    capaian:
      'Informasi kegiatan sekolah tersalurkan lewat konten kreatif medsos—wajah komunikasi publik OSIS yang aktif.',
    evaluasi:
      'Kendala: keterlambatan bahan dari PJ proker.\nSolusi: deadline bahan H-2 ke Sekbid 8.\nRekomendasi: form request pengumuman standar.',
  },
  'studio-osis': {
    tujuan:
      'Menyediakan infrastruktur produksi visual bagi seluruh sekbid agar branding OSIS konsisten dan berkualitas.',
    teknis:
      'Manajemen aset studio, booking shooting, standar visual, dan dukungan desain lintas sekbid.\nAntrian request diprioritaskan berdasar deadline event.',
    capaian:
      'Infrastruktur pendukung produksi visual tersedia untuk seluruh sekbid—menjaga konsistensi branding digital OSIS.',
    evaluasi:
      'Kendala: bottleneck request menjelang event besar.\nSolusi: kalender booking studio; batch desain.\nRekomendasi: template brand kit yang bisa dipakai mandiri sekbid.',
  },
  'sites-stream': {
    tujuan:
      'Mengembangkan website resmi sebagai wajah digital OSIS (SiteStream) agar informasi dan citra organisasi tersaji profesional.',
    teknis:
      'Pengembangan dan pemeliharaan situs; update konten; kolaborasi teknis dengan pengurus medinfo.\nPrioritas stabilitas, aksesibilitas, dan akurasi data.',
    capaian:
      'Website resmi berkembang sebagai wajah digital OSIS—mendukung transparansi program dan portal layanan (termasuk MUBES).',
    evaluasi:
      'Kendala: ketergantungan update konten dari sekbid lain.\nSolusi: SLA update konten dan owner per halaman.\nRekomendasi: changelog publik untuk rilis fitur penting.',
  },
  mading: {
    tujuan:
      'Menghidupkan literasi offline melalui majalah dinding tematik antar kelas.',
    teknis:
      'Tema periodik; kurasi karya kelas; layout fisik mading; dokumentasi foto untuk arsip digital.',
    capaian:
      'Literasi offline hidup melalui konten tematik antar kelas—melengkapi kanal digital Sekbid 8.',
    evaluasi:
      'Kendala: perawatan fisik mading dan rotasi tema.\nSolusi: jadwal ganti tema + PJ kelas.\nRekomendasi: foto HD tiap edisi ke galeri situs.',
  },
  'social-media': {
    tujuan:
      'Mengelola distribusi informasi OSIS secara cepat, menarik, dan terukur di seluruh kanal media sosial resmi.',
    teknis:
      'Content calendar; role admin; moderasi; laporan insight bulanan.\nPergeseran strategi dari pasif ke distribusi proaktif ke grup kelas.',
    capaian:
      'Manajemen distribusi informasi berjalan cepat dan menarik; mendukung seluruh proker dalam publikasi capaian dan agenda.',
    evaluasi:
      'Kendala: silo konten antar sekbid.\nSolusi: desk editor harian Sekbid 8.\nRekomendasi: playbook tone & visual OSIS + KPI engagement bulanan.',
  },
};

async function main() {
  console.log(`API ${API}`);
  const prokerRes = await api(
    'GET',
    '/api/program-kerjas?pagination[limit]=100&fields[0]=judul&fields[1]=slug&fields[2]=documentId'
  );
  const lpjRes = await api(
    'GET',
    '/api/mubes-lpjs?pagination[limit]=100&populate[program_kerja][fields][0]=slug&populate[program_kerja][fields][1]=documentId'
  );

  const prokerBySlug = new Map();
  for (const p of prokerRes.data || []) {
    prokerBySlug.set(p.slug, p);
  }
  const lpjBySlug = new Map();
  for (const l of lpjRes.data || []) {
    const pk = l.program_kerja || {};
    const slug = pk.slug;
    if (slug) lpjBySlug.set(slug, l);
  }

  const slugs = [...new Set([...prokerBySlug.keys(), ...Object.keys(DATA)])];
  let ok = 0;
  let skip = 0;
  const missing = [];

  for (const slug of slugs) {
    const body = DATA[slug];
    if (!body) {
      missing.push(slug);
      skip++;
      continue;
    }
    const proker = prokerBySlug.get(slug);
    const lpj = lpjBySlug.get(slug);
    if (!proker || !lpj) {
      console.warn(`SKIP ${slug}: proker=${!!proker} lpj=${!!lpj}`);
      skip++;
      continue;
    }

    const secs = sections(body);
    // program-kerja.evaluasi_deskripsi max 255
    const evaluasiShort = body.evaluasi.replace(/\s+/g, ' ').trim().slice(0, 250);

    await api('PUT', `/api/mubes-lpjs/${lpj.documentId}`, {
      data: {
        sections: secs,
        evaluasi_internal: body.evaluasi,
        teknis_pelaksanaan: body.teknis,
        status_pengesahan: 'ditinjau',
        sumber_dana: lpj.sumber_dana?.includes('Dummy')
          ? 'Kas OSIS / sesuai LPJ'
          : lpj.sumber_dana || 'Kas OSIS / sesuai LPJ',
      },
    });

    // publish LPJ (Strapi v5)
    try {
      await api('POST', `/api/mubes-lpjs/${lpj.documentId}/actions/publish`);
    } catch {
      /* already published or endpoint variant */
    }

    const prokerPayload = {
      tujuan: body.tujuan.slice(0, 1000),
      teknis_pelaksanaan: body.teknis,
      evaluasi_deskripsi: evaluasiShort,
    };
    await api('PUT', `/api/program-kerjas/${proker.documentId}`, {
      data: prokerPayload,
    });
    try {
      await api('POST', `/api/program-kerjas/${proker.documentId}/actions/publish`);
    } catch {
      /* ignore */
    }

    ok++;
    console.log(`OK ${ok} ${slug}`);
  }

  console.log(`\nDone. updated=${ok} skip=${skip}`);
  if (missing.length) console.log('No DATA map for:', missing.join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

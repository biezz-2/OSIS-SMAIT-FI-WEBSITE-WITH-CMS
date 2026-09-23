#!/usr/bin/env node
/**
 * Seed MUBES LPJ + program-kerja with VERBATIM text from
 * docs/data-sementara/README.md (authentic rekap — no polish).
 *
 * Usage: node scripts/seed-mubes-verbatim-lpj.mjs
 * Env: STRAPI_ELEVATED_TOKEN from osis-smait-fi/.env.local
 * API: http://127.0.0.1:1337
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
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

const API = (process.env.STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '');
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
    const msg = json?.error?.message || text.slice(0, 300);
    throw new Error(`${method} ${path} → ${res.status}: ${msg}`);
  }
  return json;
}

function sections({ tujuan, teknis, capaian, evaluasi }) {
  return [
    { order: 1, judul: 'Tujuan', isi: (tujuan || '').trim() },
    { order: 2, judul: 'Teknis & Waktu', isi: (teknis || '').trim() },
    { order: 3, judul: 'Capaian', isi: (capaian || '').trim() },
    { order: 4, judul: 'Evaluasi & Solusi', isi: (evaluasi || '').trim() },
  ];
}

/**
 * VERBATIM DATA — strings copied from docs/data-sementara/README.md
 * (decode &amp; → &). Do not polish.
 */
const DATA = {
  'tilawah-osis': {
    tujuan:
      "Bertujuan memperbanyak dan memperlancar tilawah Al-Qur'an OSIS SMA IT Fithrah Insani. Target (LPJ): Membuat OSIS SMA IT Fithrah Insani menjadi lebih meningkatkan interaksi dengan Al-Qur'an",
    teknis:
      'Online: Setiap hari, 06.00–19.00; Offline: Rapat umum, menyesuaikan jadwal rapat umum. Proposal (T1): Setiap anggota OSIS mengisi daftar hadir melalui Google Form serta mencatat tercapai/tidaknya target tilawah per hari; diwajibkan tilawah sejak pagi (Senin–Jumat, 17–21 November 2025).',
    capaian:
      'Memenuhi target karena membuat pengurus OSIS dapat menambah tilawah bacaan. Rekapitulasi 1 Januari – 23 Agustus mencakup seluruh pengurus (contoh: Rizqy Muhammad Zarkasy 275 hal, Zalfa Nur Afifa Zakauha 302 hal, Adhiena Zahra Rizkya 78 hal, dst.)',
    evaluasi:
      'Sumber: LPJ TILSIS 1 Tahun; Proposal TILSIS Triwulan 1 (proposal tahunan tidak tersedia di folder). Penanggung Jawab (LPJ): Rizqy Muhammad Zarkasy Purwanto, Zalfa Nur Afifa Zakauha',
  },
  takhosus: {
    tujuan: "Menambah dan menguatkan hafalan Al-Qur'an secara intensif hingga mencapai target yang diinginkan",
    teknis:
      "Fokus pada intensitas hafalan dan penguasaan mendalam terhadap Al-Qur'an melalui metode yang terstruktur dan terarah; pelaksanaan Selasa–Kamis (27 Januari 2026 dst.)",
    capaian:
      "Kegiatan terlaksana sebanyak 41 kali. Berdasarkan kuesioner dari 184 responden: 40,2% setuju, 28,8% sangat setuju, 22,3% netral/ragu-ragu, 6% tidak setuju, 2,7% sangat tidak setuju bahwa program Takhosus dapat membantu siswa-siswi menambah dan muraja'ah hafalan Al-Qur'an.",
    evaluasi:
      'Evaluasi (LPJ): (1) Daftar hadir belum di print saat Takhosus; (2) Banyak siswa/i masih terlambat datang ke masjid; (3) Waktu takhosus bertabrakan dengan proker/kegiatan lain.\nSolusi (LPJ): (1) Print daftar hadir sebelum kegiatan; (2) Mengingatkan kembali bahwa takhosus dilaksanakan pukul 06.30 WIB; (3) Menyesuaikan lagi waktu takhosus dengan kegiatan lain.',
  },
  'pendampingan-rohis': {
    tujuan:
      'Dengan adanya proker ini siswa/i menumbuhkan semangat religius dan kepedulian sosial siswa melalui kegiatan keagamaan yang rutin dan aplikatif. Target: Meningkatkan pemahaman dan wawasan keislaman siswa melalui program rohis',
    teknis:
      'Program & waktu (LPJ): AL-KAHFI (Jumat pengondisian pagi, contoh: 21 Nov 2025, 23 & 30 Jan 2026, 3 & 24 Apr 2026, 8 & 22 Mei 2026, 31 Jul 2026, 7 & 14 Ags 2026); ISLAMIC OF THE MONTH (IOTM, Jumat pekan ke-4, 22 Mei & 21 Ags 2026); KEAKHWATAN (Jumat setelah Salat Dzuhur, 22 Mei 2026 (X) & 25 Mei 2026 (XI), 21 Ags 2026); PENGELOLAAN INFAK (tiap Jumat pekan ke-4: 28 Nov, 30 Jan, 27 Feb, 27 Mar, 24 Apr, 29 Mei, 26 Jun, 31 Jul, 28 Ags 2026).\nProposal: Al-Kahfi Jumat 06.45–06.55 WIB; IOTM Jumat 06.45–07.00 WIB; Keakhwatan Jumat 12.00–13.00 WIB; Pengelolaan infaq setiap hari saat Salat Dzuhur.\nStruktur Rohis (LPJ): Ketua: Muhammad Akbar Nurramadhan; Wakil: Salsabila Rahma Putri; Sekretaris: Vino Erlambang (ikhwan), Raiya Teri Supi (akhwat); Bendahara: Danish Naufal Delmora (ikhwan), Naadya Maryam Raihanah (akhwat); PJ IOTM: Muhammad Arvin Arkana (ikhwan), Kiara Dwi Safitri (akhwat); anggota: Khaira Alika Salima, Dimas Agung Mulyono, Feyla Nafisa Raiya Putri, Humaira Zakia, Intan Fauziyyah, Jihan Alshofi Firdaus, Naila Nuramalina',
    capaian:
      'Berdasarkan kuesioner 184 responden: 42,9% setuju, 37% netral/ragu-ragu, 11,4% sangat setuju, 4,9% tidak setuju, 3,8% sangat tidak setuju bahwa program kerja Rohis dapat meningkatkan pemahaman, pengamalan, dan kecintaan siswa-siswi terhadap nilai Islam.',
    evaluasi:
      'Penanggung Jawab: Rizqy Muhammad Zakarsy Purwanto, Afiqoh Dayini Athaullah Purwana. Sumber: LPJ TAHUNAN ROHIS 2025-2026; PROPOSAL TAHUNAN ROHIS 2025-2026',
  },
  kultum: {
    tujuan:
      'Siswa/i SMA IT Fithrah Insani dapat mengetahui dan memperluas pengetahuannya mengenai pengetahuan keagamaan, dan juga melatih rasa percaya diri. Target: Siswa/i dapat menambah ilmu pengetahuan agamanya bagi yang mengisi kultum dan yang mendengarkannya, serta melatih rasa percaya diri',
    teknis:
      'Pelaksanaan (contoh dari dokumen): Senin 10 Nov 2025 (Kematian), Selasa 11 Nov 2025 (Sedekah), Rabu 12 Nov 2025 (Puasa sunah), Kamis 13 Nov 2025 (Haji), Jumat 14 Nov 2025 Akhwat (Larangan ghibah), Senin 17 Nov 2025 (Surga), Selasa 18 Nov 2025 (Sabar), Rabu 19 Nov 2025 (Sholat tahajud), dst.',
    capaian:
      'Target tercapai karena membuat siswa/i menambah dan memperluas ilmu agama, serta melatih rasa percaya diri siswa/i.',
    evaluasi:
      'Evaluasi (LPJ): (1) Kurang lengkapnya dokumentasi saat pelaksanaan kultum; (2) Tidak terlaksananya kultum sesuai jadwal yang dibuat; (3) Terdapat persamaan tema/judul di hari dan bulan yang berbeda.\nSolusi (LPJ): (1) Persiapan peralatan sholat & handphone dokumentasi lebih matang, sekbid 1 lebih inisiatif mendokumentasikan; (2) Mengingatkan & mengonfirmasi pengisi kultum, sekbid 1 menggantikan jika tidak ada pengisi; (3) Mengecek kembali jadwal dan mengubah jika ada kesamaan/keliruan.',
  },
  'hadist-of-the-week': {
    tujuan:
      'Menjadikan siswa/i SMA IT Fithrah Insani mengetahui hadits-hadits. Target: Siswa/i dapat mengetahui hadits dan mengamalkannya dalam kehidupan sehari-hari',
    teknis:
      "Teknis (Proposal): Hadits disampaikan melalui radio sekolah dan poster yang diposting di akun Instagram OSIS SMAIT Fithrah Insani.\nPelaksanaan (LPJ): Jumat 23 Jan 2026 (Mencintai Saudara), Jumat 6 Feb 2026 (Jangan Marah), Jumat 10 Apr 2026 (Amalan yang Dicintai Allah dan Manusia), Jumat 8 Mei 2026 (Orang yang Harus Diperangi), Jumat 31 Jul 2026 (Berkata Baik atau Diam), Jumat 7 Ags 2026 (Agama adalah Nasihat), Jumat 14 Ags 2026 (Larangan Bid'ah Dalam Agama)",
    capaian:
      'Kegiatan terlaksana sebanyak 7 kali selama satu periode. Kuesioner 184 responden: 12,5% sangat setuju, 37% setuju, 38% netral/ragu-ragu, 5,4% tidak setuju, 7,1% sangat tidak setuju bahwa HOTW dapat menambah pengetahuan tentang hadits; rata-rata viewers 345 di story Instagram OSIS.',
    evaluasi:
      'Evaluasi (LPJ): Terdapat perubahan teknis; waktu penyampaian HOTW mengalami perubahan; pengerjaan dan pengajuan poster mepet dengan jadwal.\nSolusi (LPJ): Persiapan lebih ditingkatkan dan lebih cepat dalam membuat serta mengajukan tugas.',
  },
  'ramadhan-ceria': {
    tujuan:
      'Meningkatnya pemahaman keislaman serta tumbuhnya sikap kebersamaan dan kepedulian sosial pada siswa-siswi melalui kegiatan Ramadhan Ceria. Nama Kegiatan: Ramadhan Ceria; Tema: Keagamaan, Edukasi; Judul Acara: POHON KURMA (Penguatan Olah Hati, Niti, dan Karakter Mulia Ramadhan)',
    teknis:
      'Waktu & Tempat: Senin, 09 Maret 2026, 06.45–14.30 WIB dan Selasa, 10 Maret 2026, 13.00–17.00 WIB, di SMA IT & SMK Informatika Fithrah Insani. Peserta: Seluruh siswa/i SMA IT & SMK Informatika Fithrah Insani. Rancangan Anggaran (dokumen): TOTAL Rp434.000,00 (rincian bidang Acara, Lomba, dan Konsumsi tercantum di proposal). Kepanitiaan: Pelindung: Khaerul Anwar, S.Pd.I.; Waka Kesiswaan/Kurikulum: Eka Prasetio Sapaat, S.Pd. & Imas Raninsih S.Pd.; Penasehat: Nur Laila Jufri, S.Pd.; Penanggung jawab: Surya Sigit, Aisha Ghassani Shaliha, Rizka Rasyidah, M. Hammam Jundurrahman; Steering Committee: Novel Windu Fajrian, Adhiena Zahra Rizkya, Qaila Nusyabah Amani, Aisha Ghassani Shaliha, Fatiya Kayisah Az-Zahra, Irsyad Muthi, Faqih Ibrahim, M. Hammam Jundurrahman, Surya Sigit',
    capaian:
      'Hasil/LPJ: Kegiatan berisi kegiatan bermanfaat seperti perlombaan islami, mabit, dan kajian islami yang dilaksanakan selama 2 hari',
    evaluasi:
      'Evaluasi (LPJ): Miskomunikasi antar divisi, lomba dimulai lebih awal dari jadwal, kurangnya kedisiplinan panitia, dokumen kurang teliti, masalah teknis lomba (sound system, kesiapan soal, kejelasan juklak/juknis).\nSolusi (LPJ): Meningkatkan komunikasi antar divisi, mengatur peserta lomba sesuai rancangan acara, instruksi tegas kepada panitia, ketelitian dokumen, kebutuhan teknis dipersiapkan lebih awal.',
  },
  phbi: {
    tujuan:
      "menumbuhkan pemahaman dan semangat siswa/i dalam mengetahui makna, sejarah maupun amalan di hari besar Islam dengan kegiatan positif. (Isra' Mi'raj, Idul Fitri, Idul Adha, Muharram, Maulid Nabi)",
    teknis:
      "a. Isra' Mi'raj — Proposal: Jumat, 16 Januari 2026, Online.\nb. Idul Fitri — Proposal: Jumat, 21 Maret 2026, 07.30–15.15, di Sekolah.\nc. Idul Adha — Proposal: Rabu, 27 Mei 2026, 07.30–15.15, di Sekolah. Tujuan: menumbuhkan pemahaman dan semangat siswa/i, serta mengumpulkan sedekah qurban bagi pengurus OSIS SMA IT Fithrah Insani.\nd. Muharram — Proposal: Selasa, 16 Juni 2026, 07.30–15.15, di Sekolah. Tema: Keagamaan.\ne. Maulid Nabi — Proposal: Selasa, 25 Agustus 2026, Online. Tema: Keagamaan.",
    capaian:
      "Isra' Mi'raj LPJ: Capaian: membuat poster Isra Mi'raj dan konten tentang Isra Mi'raj.\nIdul Fitri LPJ: Capaian: Poster Idul Fitri tersampaikan kepada murid SMA IT Fithrah Insani dan terlaksanakannya kegiatan Halal Bi Halal.\nIdul Adha LPJ: (file LPJ PHBI Idul Adha tidak dapat dibaca/di-extract — hanya tersedia versi docx revisasi di folder)\nMuharram LPJ: Capaian: membuat poster Muharram.\nMaulid Nabi LPJ: Capaian: membuat poster Maulid Nabi.",
    evaluasi:
      "Isra' Mi'raj: Evaluasi: terdapat miskom dan waktu pengerjaan konten dadakan. Solusi: lebih ditingkatkan komunikasinya, lebih sigap dalam membuat rencana.\nIdul Fitri: Evaluasi: pengerjaan poster mepet dengan waktu yang sudah ditentukan. Solusi: lebih sigap mengerjakan tugas.\nMuharram: Evaluasi: kurangnya komunikasi antar PJ. Solusi: lebih ditingkatkan komunikasinya.\nMaulid Nabi: Evaluasi: poster telah dibuat tetapi belum sempat dibagikan ke grup OSIS. Solusi: membagikan poster lebih awal agar tersampaikan ke grup OSIS.",
  },
  'sidak-tata-tertib': {
    tujuan:
      'Menguatkan fondasi karakter anggota OSIS agar senantiasa disiplin, bertanggung jawab, dan menjunjung tinggi etika, baik dalam mengemban amanah organisasi maupun beraktivitas di sekolah, guna menjaga marwah dan citra positif SMA IT Fithrah Insani',
    teknis:
      'Pengecekan oleh pihak terkait; contoh: 17 Juli 2026, Tema/Judul: Sidak Tata Tertib. Jika ditemukan pelanggaran diberikan teguran dan pembinaan langsung oleh Pembina OSIS/pihak terkait (Proposal); waktu ditentukan pihak terkait.',
    capaian:
      'Siswa/i maupun pengurus OSIS sudah terlaksana pengecekan baik atribut maupun terkait peraturan sekolah.',
    evaluasi:
      "Evaluasi (LPJ): Aspek pemeriksaan belum mencakup perilaku; fokus pada fisik/atribut, belum menyentuh kesadaran diri (self awareness); improvisasi yang ditunjukkan siswa/i dan pengurus tidak terdata dengan sempurna.\nSolusi (LPJ): Membuat dokumentasi dan pelaporan setiap sidak untuk memantau persentase pelanggaran dan mengukur kemajuan nyata; membuat form 'efektivitas razia terhadap diri' sebagai data konkret.",
  },
  'kompas-osis': {
    tujuan:
      'Menjadikan seluruh anggota OSIS lebih disiplin dan mengikuti peraturan yang sesuai dengan sekolah; menertibkan siswa/i terkait peraturan',
    teknis:
      'Teknis (Proposal): Memeriksa kelengkapan atribut setiap anggota OSIS — Akhwat (manset, ciput, kaos kaki, kerudung), Ikhwan (dasi, topi, kaos kaki, sabuk, rambut) — dan memberikan sanksi kepada yang melanggar. Waktu fleksibel (ditentukan sekbid 2), sesudah apel, dan ketika rapat.\nPelaksanaan (LPJ): 10 April 2026 dan 07 Agustus 2026',
    capaian:
      'Sebagian besar pengurus OSIS sudah mengikuti peraturan sekolah, dengan turun diagram pelanggaran pengurus OSIS pada bulan Juni dan Agustus, total pelanggaran 12 kali. (catatan di LPJ: "blum ada yg hasil kuisioner")',
    evaluasi:
      'Evaluasi (LPJ): Beberapa pengurus OSIS mengalami kerusakan dalam atribut pin OSIS.\nSolusi (LPJ): Memberitahu Sekbid 2 agar bisa memperbaiki pin OSIS.',
  },
  'class-of-discipline': {
    tujuan:
      'Untuk mengapresiasi dan menghargai siswa/i yang sudah mengikuti peraturan di lingkungan sekolah. Target: Siswa/i menjadi lebih disiplin dan mempunyai sikap tanggung jawab',
    teknis:
      'Teknis (Proposal): Merekap pelanggaran yang paling sedikit untuk dijadikan pemenang Class of Discipline, dilaksanakan setiap 3 bulan sekali. Contoh pelaksanaan: 18 Agustus 2026 (kelas yang disiplin di acara insidental).',
    capaian:
      'Kuesioner 184 responden: 37% setuju, 31,5% netral/ragu-ragu, 22,8% sangat setuju, 7,6% tidak setuju, 1,1% sangat tidak setuju bahwa program COD dapat menumbuhkan siswa/i disiplin dalam atribut.',
    evaluasi: 'Evaluasi (LPJ): -(tidak terisi pada dokumen)',
  },
  'piket-kedisiplinan': {
    tujuan:
      'Mentertibkan siswa/i terkait peraturan di sekolah, baik kerapihan, kelengkapan, dan disiplin waktu (salat maupun kedatangan sekolah). Target: Siswa/i lebih disiplin, bersemangat mengikuti peraturan sekolah, dan bertanggung jawab',
    teknis:
      'Teknis (Proposal): Kedatangan pengurus OSIS pukul 06.05; pelaksanaan di Gedung Ikhwan, parkiran, gerbang, dst.',
    capaian:
      'Kuesioner 184 responden: 40,8% setuju, 28,3% netral, 23,4% sangat setuju, 5,4% tidak setuju, 2,2% sangat tidak setuju bahwa Piket Kedisiplinan sudah membantu menertibkan siswa/i dalam kerapian dan kelengkapan sesuai peraturan sekolah.',
    evaluasi:
      'Evaluasi (LPJ): Seringnya hambatan untuk sweeping class karena ada hambatan dengan program kerja lain di pagi hari.\nSolusi (LPJ): Adanya briefing petugas piket dengan penanggung jawab program kerja lain untuk mengingatkan terkait peraturan sekolah.',
  },
  'bakti-sosial': {
    tujuan: 'Melatih siswa/i untuk berempati dan berbagi dengan sesama',
    teknis:
      'Teknis (Proposal): Mengumpulkan dana untuk diberikan kepada yang membutuhkan; waktu: ketika ada yang membutuhkan dana tersebut.\nLPJ: Pelaksanaan 11 Maret 2026, 17.00–17.30 WIB, di SMAIT Fitrah Insani.',
    capaian:
      'Kuesioner 184 responden: 41,3% setuju, 28,3% netral, 25% sangat setuju, 3,3% tidak setuju, 2,2% sangat tidak setuju bahwa Bakti Sosial sudah membantu membangun rasa saling peduli terhadap orang sekitar.',
    evaluasi: 'Evaluasi & Solusi: -(tidak terisi pada dokumen)',
  },
  phbn: {
    tujuan:
      'a. Hari Guru — Guidelight: menjadikan siswa/i dapat menghormati jasa dan memberikan apresiasi kepada guru dengan memberikan penghargaan.\nb. Hari Kartini: menginspirasi para perempuan, menghargai hak antara perempuan dan laki-laki, serta menghargai perjuangan perempuan.\nc. Hari Pancasila: menumbuhkan rasa nasionalisme siswa/i dalam memperingati Hari Pancasila.\nd. Hari Kemerdekaan — GEMA MERDEKA: menumbuhkan rasa nasionalisme dan cinta tanah air, mempererat kebersamaan antarsiswa, serta meningkatkan sportivitas, kerja sama, dan tanggung jawab.',
    teknis:
      'a. Hari Guru — Proposal: Jumat, 28 Oktober 2025, 07.00–13.30 WIB, di SMA Informatika Fithrah Insani. Tema: Edukasi, Sosial.\nb. Hari Kartini — Proposal: Senin, 20 April 2026, Lapangan Upacara. Tema: Pendidikan Nasionalisme. LPJ: Pelaksanaan 21 April 2026, di rumah masing-masing.\nc. Hari Pancasila — Proposal: Senin, 01 Juni 2026, Lingkungan sekolah. LPJ: Pelaksanaan 01 Juni 2026, di rumah masing-masing.\nd. Hari Kemerdekaan — Proposal: Selasa, 18 Agustus 2026, 06.45–12.00, SMA IT & SMK Informatika Fithrah Insani. Judul acara: GEMA MERDEKA (Satukan langkah, kobarkan semangat juang). Rangkaian: estafet, futsal sarung, hias kelas, market day, dll.',
    capaian:
      'Hari Guru LPJ: Keuangan: Total Pemasukan Rp370.000,00; Total Pengeluaran Rp318.000,00; Sisa Rp52.000,00. Capaian: acara Guidelight berhasil membuat guru mendapatkan apresiasi atas jasa dan kerja keras mereka; siswa/i lebih meningkatkan rasa hormat kepada guru. Kuesioner: 41,8% setuju, 34,8% netral, 18,5% sangat setuju, 3,8% tidak setuju, 1,1% sangat tidak setuju bahwa PHBN menumbuhkan rasa nasionalisme.\nHari Kartini / Pancasila / Kemerdekaan (kuesioner PHBN 184 responden): 41,8% setuju, 34,8% netral/ragu-ragu, 18,5% sangat setuju, 3,8% tidak setuju, 1,1% sangat tidak setuju bahwa PHBN dapat menumbuhkan rasa nasionalisme.',
    evaluasi:
      'Hari Guru: Evaluasi: (1) informasi kurang jelas & terstruktur; (2) belum bersihnya tempat acara. Solusi: (1) informasi lebih dipersiapkan; (2) membersihkan tempat sebelum acara.\nHari Kemerdekaan: Evaluasi: keterlambatan pelaksanaan rundown sehingga beberapa rangkaian acara tidak berjalan sesuai waktu dan waktu pelaksanaan keseluruhan mundur; perlu pengawasan waktu lebih ketat, kesiapan panitia & perlengkapan, pengondisian peserta, dan koordinasi antar divisi.\nUpacara 3 & 31 Agustus: Folder hanya berisi DOKUMENTASI — tidak ada dokumen Proposal/LPJ di dalamnya.',
  },
  'notifikasi-edukasi': {
    tujuan:
      'Menjadi wadah bagi siswa/i SMAIT Fithrah Insani untuk memperoleh informasi seputar beasiswa, lomba-lomba pendidikan, serta peluang akademik lainnya. Target: Membantu siswa/i memperoleh informasi tentang beasiswa, lomba pendidikan, dan peluang akademik lainnya',
    teknis:
      'Sumber: LPJ NOTIFIKASI EDUKASI 1 PERIODE; PROPOSAL NOTIFIKASI EDUKASI 1 PERIODE. Penanggung Jawab: Prananda Ramadhan Ahmad',
    capaian:
      'Kuesioner: 17,8% sangat setuju, 41,6% setuju, 31,9% netral/ragu-ragu, 7,6% tidak setuju, 1,1% sangat tidak setuju bahwa Notifikasi Edukasi membantu siswa/i memperoleh informasi beasiswa, lomba, dan peluang akademik.',
    evaluasi:
      'Evaluasi (LPJ): Penyampaian informasi lomba & beasiswa masih perlu ditingkatkan, terutama konsistensi waktu unggahan dan jumlah informasi yang disampaikan; informasi diharapkan diunggah lebih sering dengan waktu publikasi teratur.',
  },
  'study-club': {
    tujuan:
      'Meningkatkan pemahaman akademik siswa/i serta membantu siswa/i mempersiapkan ujian PTS/PAS melalui pembahasan soal bersama guru mata pelajaran terkait',
    teknis: 'Sumber: LPJ STUDY CLUB 1 PERIODE; PROPOSAL SC 1 PERIODE. Penanggung Jawab: Aliya Marwa Ruwaida',
    capaian:
      'Kuesioner: 52,4% sangat setuju, 29,7% setuju, 14,1% netral, 2,0% tidak setuju, 1,8% sangat tidak setuju bahwa Study Club membantu meningkatkan pemahaman materi pelajaran dan mempersiapkan ujian PTS/PAS melalui pembahasan soal bersama.',
    evaluasi:
      'Evaluasi (LPJ): Kegiatan berjalan dengan baik, namun terdapat hambatan berupa kehadiran siswa yang belum konsisten.\nSolusi (LPJ): Meningkatkan koordinasi dan mengingatkan anggota agar lebih disiplin.',
  },
  'two-minutes-class': {
    tujuan:
      'Meningkatkan pemahaman materi pelajaran siswa/i melalui konten fun fact atau tips & trick pembelajaran yang mudah diakses; menambah wawasan dan menanamkan minat intrinsik siswa, serta mengatasi kurangnya motivasi belajar dan penyebaran informasi yang tidak merata',
    teknis:
      'Teknis (Proposal): Video singkat ±2 menit (fun fact/tips pembelajaran) bekerja sama dengan guru mata pelajaran, dibagikan melalui media sosial resmi OSIS (Instagram, TikTok). Contoh konten (Agustus 2026): "Tips and trick cepat menghafal tabel periodik", "Bagaimana cara orang 1000 tahun lalu mengukur bumi".',
    capaian:
      'Kuesioner 184 responden: 12,4% setuju, 39,5% netral/ragu-ragu, 11,4% sangat setuju, 10,3% tidak setuju, 0 sangat tidak setuju bahwa TMC menumbuhkan minat belajar dengan informasi singkat namun bermakna.',
    evaluasi:
      'Evaluasi (LPJ): (1) Deadline pembuatan video terlalu dekat dengan waktu perencanaan sehingga kurang persiapan; (2) Pemanfaatan waktu di fase awal belum maksimal; (3) Kelas yang direncanakan untuk pengambilan video tidak memungkinkan dipakai.',
  },
  'hari-pendidikan': {
    tujuan:
      'Siswa/i dapat memperingati Hari Pendidikan Nasional serta meningkatkan kesadaran akan pentingnya pendidikan melalui publikasi poster dan konten edukatif. Nama Kegiatan: Hari Pendidikan; Tema: Memperingati Hari Pendidikan Nasional',
    teknis:
      'Waktu & Tempat: Sabtu, 2 Mei 2026, di rumah masing-masing. Peserta: siswa/i kelas 10 dan 11.',
    capaian:
      'Telah terlaksana peringatan Hardiknas serta penyampaian informasi pentingnya pendidikan melalui publikasi poster dan konten edukatif. Kuesioner: 22,7% sangat setuju, 37,8% setuju, 33,5% netral/ragu-ragu, 3,2% tidak setuju, 2,7% sangat tidak setuju — respons cenderung positif.',
    evaluasi:
      'Evaluasi (LPJ): Sesi penyampaian materi oleh guru belum terlaksana karena keterbatasan waktu dalam persiapan dan koordinasi.\nSolusi (LPJ): Melakukan koordinasi dan persiapan kegiatan dengan lebih matang agar setiap rangkaian terlaksana optimal.',
  },
  'university-day': {
    tujuan:
      'Memberikan informasi kepada siswa/i mengenai berbagai pilihan perguruan tinggi (menghadirkan alumni untuk berbagi pengalaman dunia perkuliahan; FI Flick = photobooth foto cetak berbingkai). Nama Kegiatan: University Day x Fi Flick; Tema: Akademik, Edukasi dan Dokumentasi; Tema acara: Enchanted Path',
    teknis:
      'Waktu & Tempat: Senin, 12 Januari & Selasa, 13 Januari, 06.45 WIB s.d. selesai, di SMA IT Fithrah Insani',
    capaian:
      'Kuesioner: 48,6% sangat setuju, 32,4% setuju, 15,1% cukup setuju, 3,2% kurang setuju, 0,5% tidak setuju bahwa University Day membantu mendapatkan informasi dan menambah wawasan tentang pilihan perguruan tinggi — respons cenderung positif.',
    evaluasi:
      'Evaluasi (LPJ): Pengaturan waktu masih perlu diperbaiki karena beberapa kegiatan tidak sesuai rundown.\nSolusi (LPJ): Pengambilan keputusan di lapangan harus lebih cepat agar tidak mengganggu alur acara.',
  },
  'write-your-ideas': {
    tujuan:
      'Program karya sastra — banyak anak usia muda punya kemampuan menulis karya tetapi ragu menunjukkannya',
    teknis:
      'Sumber: LPJ WRITE YOUR IDEAS 1 TAHUN (proposal tahunan tidak ada; hanya proposal triwulan 1–3)',
    capaian:
      '38,4% setuju, 36,2% netral, 13,5% sangat setuju, 9,2% tidak setuju, 2,7% sangat tidak setuju bahwa program ini dapat membuat siswa/i tahu macam-macam karya sastra.',
    evaluasi:
      'Evaluasi (LPJ): Kurangnya metode promosi untuk menarik siswa dalam membuat karya sastra.\nSolusi (LPJ): Lebih diperhatikan dalam mengajak siswa/i untuk mengikuti kegiatan lomba.',
  },
  'suara-sastra': {
    tujuan:
      'Catatan: Folder hanya berisi sub-folder tanggal dokumentasi (25 Feb, 24 Apr, 17 Jun, 6 Ags 2026) — tidak ada dokumen Proposal/LPJ tahunan di folder ADMINISTRASI.',
    teknis: 'Tidak ada dokumen Proposal/LPJ tahunan di folder ADMINISTRASI.',
    capaian: 'Tidak ada dokumen Proposal/LPJ tahunan di folder ADMINISTRASI.',
    evaluasi: 'Tidak ada dokumen Proposal/LPJ tahunan di folder ADMINISTRASI.',
  },
  'enlightment-trip': {
    tujuan:
      'Mendorong siswa/i SMA IT Fithrah Insani memiliki keterampilan berliterasi tinggi saat melakukan kegiatan-kegiatan positif',
    teknis:
      'Teknis: Siswa/i melakukan kegiatan literasi (membaca jurnal/cerpen/buku) lalu mengerjakan quizizz yang dibagikan OSIS (contoh: Selasa 20 Januari 2026, Selasa 3 Februari 2026, Selasa 11 Agustus 2026)',
    capaian:
      'Selama 1 tahun, program terlaksana 13 kali sehingga mendorong minat siswa/i berliterasi untuk menunjang kehidupan sehari-hari.',
    evaluasi:
      'Evaluasi (LPJ): (1) Banyak dokumentasi yang hilang; (2) Banyak PJ yang tidak mengirimkan dokumentasi; (3) Kendala penjadwalan rangkaian kegiatan sehingga sering tidak sesuai jadwal.\nSolusi (LPJ): (1) Langsung memindahkan dokumentasi dan menyimpan permanen; (2) Mengingatkan kembali para PJ; (3) Menyederhanakan rangkaian kegiatan literasi.',
  },
  'quotes-of-the-month': {
    tujuan:
      'Menumbuhkan semangat dan motivasi belajar siswa, menanamkan nilai-nilai positif, membentuk karakter berakhlak dan berintegritas; menumbuhkan budaya literasi, kesadaran diri, dan sarana penyebaran pesan moral',
    teknis:
      'Teknis (Proposal): Dibuat quotes dari film/lagu yang menumbuhkan semangat; di-upload pada pekan ke-2 dan ke-4 (contoh: 27 Januari 2026, 11 Februari 2026)',
    capaian:
      'Dalam 8 bulan, program dilaksanakan 8 kali dengan total 7.372 viewers. Kuesioner: 14,59% sangat setuju, 40,00% setuju, 37,84% netral, 5,95% tidak setuju, 1,62% sangat tidak setuju bahwa QOTM meningkatkan minat literasi dan motivasi siswa.',
    evaluasi:
      'Evaluasi (LPJ): Kejelasan audio dalam penyampaian materi serta konsistensi/keteraturan jadwal publikasi perlu ditingkatkan.\nSolusi (LPJ): Menggunakan tempat lebih tenang, pengecekan sebelum upload, jadwal publikasi lebih teratur dan konsisten.',
  },
  'hari-buku': {
    tujuan:
      'Meningkatkan partisipasi siswa dalam kegiatan literasi sekolah melalui program Book Swap (pertukaran informasi buku bacaan) dan The Human Blurb (siswa berpasangan mempromosikan bukunya 3 menit). Tema: Edukasi dan Literasi',
    teknis:
      'Waktu & Tempat: Selasa, 28 April 2026, 07.00–07.13, di Kelas. Peserta: seluruh siswa/i kelas 10 dan 11.',
    capaian:
      'Siswa/i aktif saling bertukar buku di sesi Book Swap; sebagian besar siswa lebih percaya diri saat mempromosikan buku di sesi The Human Blurb. Kuesioner "Apakah kegiatan Hari Buku bermanfaat untuk meningkatkan minat membaca dan wawasan siswa?": Sangat Setuju 21,6%; Setuju 42,7%; Netral 29,2%; Kurang Setuju 4,3%; Tidak Setuju 2,2%.',
    evaluasi:
      'Evaluasi (LPJ): Karena keterbatasan waktu ada kelas yang tidak mengikuti sesi The Human Blurb; sebagian siswa masih butuh waktu mempersiapkan diri.',
  },
  'ulti-multi-language': {
    tujuan:
      'Catatan: Folder ADMINISTRASI ULTI berisi dokumen berjudul "PROPOSAL/LPJ GEMA MERDEKA (hari kemerdekaan)" — dokumen Proposal/LPJ khusus ULTI tidak tersedia di folder (dokumen yang ada merujuk pada kegiatan Gema Merdeka/Hari Kemerdekaan, sama dengan PHBN Sekbid 2 & FI Flick/Market Day Sekbid 7).',
    teknis:
      'Dokumen Proposal/LPJ khusus ULTI tidak tersedia di folder — merujuk GEMA MERDEKA.',
    capaian:
      'Dokumen Proposal/LPJ khusus ULTI tidak tersedia di folder (dokumen merujuk Gema Merdeka/Hari Kemerdekaan).',
    evaluasi:
      'Folder berisi dokumen Gema Merdeka, bukan dokumen ULTI khusus.',
  },
  'program-kerja': {
    // Raga & Nada — sometimes slug program-kerja is generic; prefer raga if present
    tujuan:
      'Membantu meningkatkan pemahaman siswa/i mengenai materi yang berkaitan dengan bidang olahraga dan seni',
    teknis:
      'Teknis (Proposal): Pekan ke-1: mengunggah video "materi olahraga" di TikTok OSIS; Pekan ke-2: menyiarkan "materi olahraga" melalui Radio. Contoh pelaksanaan: Kamis, 13 Agustus 2026, 12.30 — membuat materi tema olahraga & kesenian.',
    capaian:
      'Kuesioner: 42,2% sangat setuju, 33% setuju, 20,5% netral, 3,8% tidak setuju, 0,5% sangat tidak setuju bahwa Raga & Nada dapat membantu memperluas wawasan bidang seni dan olahraga.',
    evaluasi:
      'Evaluasi (LPJ): Hanya mengandalkan postingan di akun Instagram OSIS sifatnya pasif (hanya menjangkau siswa yang membuka profil OSIS atau yang postingannya lewat di beranda).\nSolusi (LPJ): Mengirimkan poster digital atau ringkasan video langsung ke grup (kelas).',
  },
  'ourself-journey': {
    tujuan:
      'Membantu siswa/i dalam memahami diri, meningkatkan kemampuan diri, minat, serta potensi sehingga lebih percaya diri dalam menentukan minat dan mengasah bakat',
    teknis:
      'Contoh pelaksanaan: Jumat 7 & 14 Agustus 2026 — "3 cara sederhana berani keluar dari zona nyaman".',
    capaian:
      'Kuesioner: 21,1% sangat setuju, 41,6% setuju, 32,4% netral/ragu-ragu, 4,3% tidak setuju, 0,5% sangat tidak setuju bahwa Ourself Journey membantu memahami diri, mengenali minat dan potensi, serta meningkatkan kepercayaan diri.',
    evaluasi:
      'Evaluasi (LPJ): Rangkaian kegiatan belum sepenuhnya sesuai perencanaan karena kendala teknis pada media siaran radio TU, sehingga penyampaian materi dialihkan melalui media lain.\nSolusi (LPJ): Pengecekan media siaran sebelum hari pelaksanaan dan menyiapkan alternatif media penyampaian materi.',
  },
  'The-Rising-Talent': {
    tujuan: 'Memberikan informasi lomba-lomba non akademik untuk siswa/i',
    teknis:
      'Teknis (Proposal): Dua media publikasi: Media Sosial (Instagram, repost informasi lomba non-akademik) dan poster digital/non-digital. Contoh pelaksanaan: Senin, 10 Agustus 2026 — unggah Instagram Story & Mading (poster lomba non-akademik).',
    capaian:
      'Kuesioner: 35,1% sangat setuju, 43,2% setuju, 16,8% netral, 3,2% kurang setuju, 1,6% sangat tidak setuju bahwa TRT membuat siswa/i mengetahui informasi berkompetisi bidang non-akademik melalui poster yang disalurkan.',
    evaluasi:
      'Evaluasi (LPJ): Keterbatasan postingan poster karena sedikitnya informasi dari sumber lomba terpercaya, sehingga kurang beragamnya lomba yang diinformasikan.\nSolusi (LPJ): Mencari lebih banyak sumber lomba terpercaya.',
  },
  'talent-showcase': {
    tujuan:
      'Menyediakan panggung dan fasilitas bagi peserta untuk mengasah dan menampilkan bakat serta meningkatkan kepercayaan diri',
    teknis:
      'Teknis (Proposal): Dua skema pilihan peserta: offline (penampilan langsung) dan online. Contoh pelaksanaan: pukul 12.30 di Lapang Upacara SMAIT — penampilan vokal dan gitar dari Carlissia, Veyla, dan Reina.',
    capaian:
      'Kuesioner: 27,6% sangat setuju, 41,1% setuju, 21,1% netral, 7% kurang setuju, 3,2% sangat tidak setuju bahwa Talent Showcase membantu mengembangkan bakat dan meningkatkan kepercayaan diri.',
    evaluasi:
      'Evaluasi (LPJ): Koordinasi belum optimal terhadap penanggung jawab hari-H pelaksanaan kegiatan.\nSolusi (LPJ): Meningkatkan perencanaan bersama PJ kegiatan agar ke depannya bekerja lebih efektif dan mencapai target.',
  },
  classmeet: {
    tujuan:
      'Memberi ruang bagi siswa berkembang melalui pengalaman langsung — berkompetisi sportif, berkarya, bekerja sama, hingga belajar berwirausaha secara nyata. Nama Kegiatan: Classmeet X Market Day; Tema: Non-Akademik dan Wirausaha; Judul Acara: Dynamite',
    teknis:
      'Waktu (Proposal): Rabu, 10 Desember 2025, 06.45–se. Rangkaian lomba (LPJ): Mobile Legend, Make Up, Voli, Susun Kata, Handball, Masak, Mini Soccer, serta Market Day. Rincian anggaran (LPJ, sebagian): Konsumsi Juri 18 box × Rp8.000 = Rp144.000; Konsumsi Pimpinan & Pembina 5 box × Rp8.000 = Rp40.000; Total Rp548.000',
    capaian:
      '41,1% sangat setuju, 36,2% setuju, 14,5% netral, 2,7% kurang setuju, 0,5% sangat tidak setuju bahwa rangkaian lomba dan kegiatan "Dynamite" sudah memberi ruang bagi siswa/i untuk berkembang, berkreasi, bekerja sama, berkompetisi, dan belajar berwirausaha.',
    evaluasi:
      'Evaluasi (LPJ): Kondisi kegiatan pada beberapa waktu masih kurang kondusif karena sebagian peserta belum sepenuhnya mengikuti arahan sehingga jalan acara kurang efektif. Kelengkapan lain (folder): terdapat Voting Wishlist Classmeet (Google Form) dan form kepuasan "Kepuasan Classmeet Dynamite".',
  },
  'cleaning-day': {
    tujuan:
      'Menumbuhkan kesadaran warga sekolah akan pentingnya menjaga kebersihan lingkungan; menciptakan lingkungan sekolah yang bersih, sehat, dan nyaman untuk belajar; melatih kerja sama, tanggung jawab, dan kepedulian antar siswa. Target: Siswa/i menjadi lebih sadar pentingnya menjaga kebersihan',
    teknis:
      'Teknis (Proposal): Membersihkan lingkungan sekolah di titik-titik yang ditentukan, tiap titik dibersihkan dua kelas; Pekan ke-2 & ke-4, pukul 06.45–07.15 WIB',
    capaian: 'Sumber: LPJ CLEANING DAY TAHUNAN; Proposal cleaning day tahunan. Penanggung Jawab: Syarla Syafana Dewi',
    evaluasi: 'Capaian kuesioner tidak tercantum terpisah pada bagian Cleaning Day di README rekap.',
  },
  'Breakfast-Time': {
    tujuan:
      'Mengedukasi siswa/i bahwa sarapan adalah bagian dari pola hidup sehat; berharap siswa/i tidak lagi meninggalkan sarapan agar lebih fokus mengikuti kegiatan sekolah. Target: Membantu meningkatkan fokus dan konsentrasi siswa/i selama pembelajaran',
    teknis:
      'Teknis (Proposal): Pekan ke-2 & ke-3, Rabu 06.45–07.15 WIB — siswa/i menyantap makanan yang ditentukan sambil mendengarkan materi tentang makanan tersebut',
    capaian:
      'Catatan LPJ: Dokumen LPJ tahunan memuat capaian dengan angka identik dengan kuesioner Ourself Journey (21,1% sangat setuju; 41,6% setuju; 32,4% netral; 4,3% tidak setuju; 0,5% sangat tidak setuju) — tertulis demikian pada dokumen aslinya.',
    evaluasi:
      'Evaluasi (LPJ): Kendala teknis pada media siaran radio TU sehingga penyampaian materi dialihkan melalui media lain.\nSolusi (LPJ): Pengecekan media siaran sebelum hari pelaksanaan dan menyiapkan alternatif media penyampaian materi.',
  },
  'Health-Report': {
    tujuan:
      'Memberikan informasi terkini dan edukatif seputar kesehatan dan lingkungan kepada seluruh warga sekolah',
    teknis:
      'Teknis (Proposal): Pekan ke-2 & ke-4: membuat video edukasi kesehatan dan lingkungan, pukul 16.00–17.00 WIB. Contoh pelaksanaan: Selasa, 11 Agustus 2026.',
    capaian:
      'Konten & poster kesehatan di-post di Instagram dengan viewers: KONTEN 1 Mitos dan Fakta: 1.456; KONTEN 2 Cara Cuci Tangan Yang Benar: 1.090; KONTEN 3 Rahasia Pelajar Sehat: 985; KONTEN 4 Bye-Bye Lambung Perih!: 270; KONTEN 5 ZERO WASTE LIFESTYLE: 268; KONTEN 6 Green or Red (gaya hidup remaja): 1.677; KONTEN 7 POV Mau Buang Sampah Sembarangan: 1.094; KONTEN 8 Tell Me Something I Don\'t Know About Funfact Bergadang: (tercantum di LPJ).',
    evaluasi:
      'Evaluasi (LPJ): Terdapat video yang peng-upload-annya tidak sesuai waktu.\nSolusi (LPJ): Mengingatkan untuk meng-upload saat sudah dekat dengan waktu peng-upload-an.',
  },
  'Healty-Station': {
    tujuan:
      'Meningkatkan pelayanan kesehatan sekolah melalui pengelolaan UKS yang tertata dan siap digunakan, serta meningkatkan kesadaran siswi akan pentingnya menjaga kesehatan reproduksi melalui pendataan kartu haid. Target: Siswa/i mendapatkan pertolongan pertama dengan sigap; siswi mengetahui siklus haidnya lebih teratur',
    teknis:
      'Teknis (Proposal): Pengelolaan UKS (pengecekan kelengkapan, pendataan obat-obatan, pertolongan pertama) dan pembagian kartu haid tiap bulan (diisi & ditandatangani wali kelas saat siswi haid); Pekan 1–4 pukul 09.35–10.05 & 11.15–11.50 WIB',
    capaian: 'Hanya Proposal (tahunan dan triwulan); LPJ tidak tersedia di folder',
    evaluasi:
      'Catatan pada dokumen proposal: Evaluasi — "Kartu haid banyak yang hilang dan belum pada di tanda tangani" (tertulis demikian pada dokumen).',
  },
  'healthy-station': {
    tujuan:
      'Meningkatkan pelayanan kesehatan sekolah melalui pengelolaan UKS yang tertata dan siap digunakan, serta meningkatkan kesadaran siswi akan pentingnya menjaga kesehatan reproduksi melalui pendataan kartu haid. Target: Siswa/i mendapatkan pertolongan pertama dengan sigap; siswi mengetahui siklus haidnya lebih teratur',
    teknis:
      'Teknis (Proposal): Pengelolaan UKS (pengecekan kelengkapan, pendataan obat-obatan, pertolongan pertama) dan pembagian kartu haid tiap bulan (diisi & ditandatangani wali kelas saat siswi haid); Pekan 1–4 pukul 09.35–10.05 & 11.15–11.50 WIB',
    capaian: 'Hanya Proposal (tahunan dan triwulan); LPJ tidak tersedia di folder',
    evaluasi:
      'Catatan pada dokumen proposal: Evaluasi — "Kartu haid banyak yang hilang dan belum pada di tanda tangani" (tertulis demikian pada dokumen).',
  },
  'healthy-movement': {
    tujuan: 'Mengajak pentingnya olahraga untuk kesehatan tubuh (senam pagi bersama)',
    teknis:
      'Pelaksanaan (LPJ): Contoh: Jumat, 5 Juni 2026 dan Rabu, 5 & 12 Agustus 2026 — Senam Pagi Bersama',
    capaian:
      '24,3% sangat setuju, 38,9% setuju, 30,8% netral, 2,2% kurang setuju (dengan adanya program Healthy Movement untuk menyadari pentingnya olahraga bagi kesehatan tubuh).',
    evaluasi:
      'Sumber: LPJ Healthy Movement Tahunan; Proposal Healthy Movement Tahunan (catatan: file proposal tahunan HM berisi materi Healthy Station)',
  },
  'environment-day': {
    tujuan:
      'Agar siswa/i mengetahui cara mendaur ulang sampah menjadi barang berguna dan bergerak mendaur ulang dari hal kecil, contoh: plastik tak terpakai didaur ulang menjadi pot tanaman, untuk mengurangi jumlah sampah',
    teknis: 'Waktu: 05 Juni 2026. Peserta: seluruh siswa/i SMA IT Fithrah Insani.',
    capaian: 'LPJ tidak tersedia di folder (hanya proposal)',
    evaluasi: 'LPJ tidak tersedia di folder',
  },
  'Healthy-Day': {
    tujuan: 'Meningkatkan kesadaran siswa tentang pentingnya kesehatan fisik. Tema: Pengecekan kesehatan siswa-siswi dari Dinas Kesehatan',
    teknis:
      'Waktu & Tempat: Kamis, 30 April 2026, 07.30–15.30, di Aula. Peserta: seluruh siswa/i kelas 10 dan 11 SMA IT Fithrah Insani (LPJ juga mencantumkan peserta dari peminatan dan SMK).',
    capaian:
      'Program berhasil terlaksana menghadirkan pemeriksaan kesehatan bekerja sama dengan Dinas Kesehatan; guru menjadi mengetahui kondisi kesehatan siswa/i. 23,8% sangat setuju, 40% setuju, 33% cukup setuju bahwa Healthy Day dapat meningkatkan kesadaran kesehatan siswa/i setelah pengecekan.',
    evaluasi: 'Evaluasi (LPJ): Ada keterlambatan waktu pelaksanaan (tertulis demikian pada dokumen).',
  },
  'Nutrition-day': {
    tujuan:
      'Meningkatkan kesadaran siswa/i terhadap pentingnya asupan gizi yang cukup serta meningkatkan pemahaman tentang gizi. Tema: "Isi piringku" dari Kementerian Kesehatan; Judul Acara: Nutrify (small choices, big impact)',
    teknis:
      'Waktu & Tempat: Rabu, 28 Januari 2026, 06.45–07.00 WIB, kelas masing-masing. Peserta: kelas 10 & 11.',
    capaian:
      'Mengajak siswa/i membawa makanan bergizi agar tubuh selalu sehat. 40,5% sangat setuju, 33,5% setuju, 20% netral, 6% (kurang/tidak setuju — perincian selanjutnya tercantum di LPJ) bahwa program ini membuat siswa/i selalu memakan makanan sehat dan bergizi.',
    evaluasi: 'Evaluasi (LPJ): Terjadi hujan saat pelaksanaan (tertulis demikian pada dokumen).',
  },
  'weekly-market': {
    tujuan:
      'Menambah finansial OSIS untuk berwirausaha, melatih keberanian dalam menjalankan usaha, mendapatkan keuntungan finansial, serta belajar mengelola anggaran dalam berwirausaha',
    teknis:
      'Teknis (Proposal): Menjual makanan/minuman kepada siswa/i setiap dua kali seminggu (Selasa dan Jumat). Penanggung Jawab: Fathurrochman Roziq & Khalisha Kasih Anindya Kirani Putri',
    capaian:
      'LPJ WEEKLY MARKET 1 PERIODE (file LPJ tidak dapat dibaca/di-extract — tidak berisi teks yang bisa diekstrak)',
    evaluasi: 'File LPJ 1 periode tidak dapat dibaca/di-extract',
  },
  'ngobrol-bisnis': {
    tujuan:
      'Mengembangkan pengetahuan kewirausahaan yang dibutuhkan dalam berwirausaha, mendorong inovasi dan kreativitas dalam mengembangkan ide berwirausaha, serta memotivasi siswa/i lewat pengalaman kewirausahaan dari narasumber',
    teknis:
      'Teknis (Proposal): Mewawancarai seorang wirausahawan untuk menceritakan pengalaman sebagai pengusaha sukses. Penanggung Jawab: Radytia Nur Hidayah & Afiyah Fitri Ramadani',
    capaian: 'LPJ NGOBISS 1 PERIODE (file LPJ tidak dapat dibaca/di-extract)',
    evaluasi: 'File LPJ 1 periode tidak dapat dibaca/di-extract',
  },
  'Direct-Marketing': {
    tujuan:
      'Menumbuhkan jiwa kewirausahaan, melatih kemampuan berinteraksi dan berkomunikasi langsung dengan konsumen, serta membangun rasa tanggung jawab dalam mengelola usaha. Tema: "Ketakterbatasan Potensi Bakat Remaja"',
    teknis:
      'Waktu: Minggu, 25 Januari 2026, 06.00–13.00 WIB. Teknis (LPJ): Penjualan pakaian bekas layak pakai sebagai program sosial OSIS — wujud kontribusi nyata dalam kegiatan kemasyarakatan. Anggaran (LPJ): (a.o.) Rp75.000 (1×) + Sewa Lapangan Pakusarakan Rp50.000 — TOTAL Rp125.000',
    capaian:
      'Peningkatan soft skills seluruh anggota tim — inisiatif dan keberanian mempromosikan produk secara aktif serta membangun komunikasi yang baik dengan warga sekitar.',
    evaluasi:
      'Evaluasi (LPJ): Ketidaksengajaan penggunaan lahan milik pihak lain saat berjualan akibat minimnya informasi dan pemetaan lapangan.\nSolusi (LPJ): Mewajibkan tim pelaksana survei lokasi menyeluruh dan memastikan status perizinan lahan kepada pengelola setempat sebelum hari pelaksanaan.',
  },
  'Market-Day': {
    tujuan:
      'Market Day — Dynamite (Classmeet x Market Day): dokumen sama dengan proker Classmeet Dynamite (Sekbid 5). Market Day — Gema Merdeka: dokumen sama dengan PHBN Hari Kemerdekaan (Sekbid 2).',
    teknis:
      'PROPOSAL DYNAMITE (ClassmeetxMarket Day); LPJ DYNAMITE — dokumen sama dengan Classmeet Dynamite. PROPOSAL/LPJ GEMA MERDEKA (FI FlickxMarket DayxHari MerdekaxULTI) — dokumen sama dengan PHBN Hari Kemerdekaan.',
    capaian:
      'Lihat Classmeet Dynamite dan PHBN Hari Kemerdekaan (dokumen bersama).',
    evaluasi: 'Dokumen ditempatkan juga di folder Market Day Sekbid 7 (sama dengan Sekbid 5 / Sekbid 2).',
  },
  'FI-Flick': {
    tujuan:
      'University Day X FI Flick — Enchanted Path: Memberikan informasi kepada siswa/i mengenai berbagai pilihan perguruan tinggi (FI Flick = photobooth foto cetak berbingkai). Data identik dengan proker University Day Sekbid 3.',
    teknis:
      'Waktu & Tempat: Senin, 12 Januari & Selasa, 13 Januari, 06.45 WIB s.d. selesai, di SMA IT Fithrah Insani. Tabel Pembagian Keuntungan — SMK Rp180.000; SMA Rp388.000; Total Rp568.000. Hari Kemerdekaan X FI Flick: dokumen GEMA MERDEKA (sama dengan PHBN Hari Kemerdekaan Sekbid 2).',
    capaian:
      'Capaian kuesioner FI Flick: 18,5% sangat setuju, 37% setuju, 33,7% netral, 9,2% tidak setuju, 1,6% sangat tidak setuju bahwa FI Flick menjadi wadah mengabadikan momen dan menciptakan kenangan berkesan selama di sekolah.',
    evaluasi:
      'Evaluasi: pengaturan waktu perlu diperbaiki (beberapa kegiatan tidak sesuai rundown); Solusi: pengambilan keputusan di lapangan lebih cepat.',
  },
  'school-announcement': {
    tujuan:
      'Mengenalkan siswa/i tentang berbagai aktivitas sehari-hari di lingkungan sekolah serta menyampaikan informasi terbaru mengenai kegiatan yang telah dilaksanakan; media informasi resmi yang mudah diakses seluruh siswa/i (konten diunggah di akun media sosial OSIS)',
    teknis:
      'Pelaksanaan (LPJ, contoh): Jumat, 7 Agustus 2026 — pembuatan poster bertema MPLS; juga konten "Sapa, Salam, Santun", dll.',
    capaian:
      '20% sangat setuju, 38,9% setuju, 34,6% netral bahwa poster dan video School Announcement berhasil menyampaikan informasi dengan cara menarik dan kreatif.',
    evaluasi:
      'Evaluasi (LPJ): (1) Susahnya mendapatkan hasil dokumentasi setelah acara; (2) Membutuhkan Canva Pro untuk edit poster maksimal; (3) Kualitas video kurang HD.\nSolusi (LPJ): (1) Sebelum acara, minta koor divisi pubdok mengirim Google Drive berisi hasil foto; (2) Mendapatkan akun belajar.id untuk Canva Pro gratis; (3) Membutuhkan Capcut Pro.',
  },
  'studio-osis': {
    tujuan:
      'Mendukung setiap seksi bidang dalam pembuatan konten visual (video & poster); meningkatkan efisiensi waktu dan efektivitas kerja editing/desain; menjaga kualitas & konsistensi konten; menumbuhkan kerja sama antar anggota OSIS di bidang kreatif dan publikasi. Target: Sekbid-sekbid terbantu, alur kerja lebih cepat, kualitas meningkat, konsistensi produksi video/poster terjaga',
    teknis: 'Teknis (Proposal): Setiap seksi bidang yang membutuhkan bantuan produksi wajib mengirimkan bahan',
    capaian:
      'Dapat membantu sekbid lain dalam membuat video atau poster sehingga pengerjaan proker semakin mudah dan efisien.',
    evaluasi:
      'Evaluasi (LPJ): Keterbatasan akses dan elemen saat proses mengedit, sehingga hasil desain perlu disesuaikan dengan elemen yang tersedia.\nSolusi (LPJ): Menyediakan perangkat pendukung seperti Capcut Pro dan fitur editing yang lebih lengkap.',
  },
  'sites-stream': {
    tujuan:
      'Menjadi wadah informasi OSIS SMAIT Fithrah Insani melalui Website OSIS, yang dapat diakses warga sekolah dan masyarakat sekitar/luar sekolah; memberikan informasi lengkap mengenai struktur, jabatan, program kerja, dan kegiatan OSIS. Target: Menjadi sarana resmi penyampaian informasi OSIS yang mudah diakses',
    teknis: 'Pelaksanaan (LPJ): Fleksibel, sesuai permintaan sektor bidang bersangkutan atau informasi OSIS terbaru',
    capaian:
      '14,6% sangat setuju, 42,7% setuju, 34,6% netral/ragu-ragu, 7,6% tidak setuju, 0,5% sangat tidak setuju bahwa website SiteStream memberikan informasi yang relevan bagi siswa/i.',
    evaluasi:
      'Evaluasi (LPJ): Terkendala budget untuk membeli domain dan menyewa VPS untuk menjalankan website, serta sulitnya mengintegrasikan prototype ke dalam Framework.\nSolusi (LPJ): Mempercepat proses administrasi agar penyewaan domain dan VPS lebih cepat tersedia, dan mencari terlebih dahulu stack yang akan digunakan.',
  },
  mading: {
    tujuan:
      'Menumbuhkan minat dan kreativitas siswa/i melalui media offline; menjadi sarana informasi edukatif dan inspiratif bagi seluruh warga sekolah; menumbuhkan semangat literasi, karakter positif, kerja sama, dan kepedulian antar siswa/i',
    teknis:
      'Teknis (Proposal): Kelas diwajibkan mengumpulkan informasi sesuai jadwal dengan tema yang ditentukan sekbid 8. Contoh: Senin 19 Jan 2026 (12A & 12D — Pendidikan); Senin 6 Apr 2026 (10B & 10E — Budaya); Senin 20 Apr 2026 (10C & 10F — Literasi); dst.',
    capaian:
      'MADING OSIS — poster dari beberapa sekbid tertempel rutin sesuai jadwal sehingga siswa/i mendapatkan informasi penting seputar sekolah dan organisasi. MADING KELAS — 21,1% sangat setuju dan 41,6% setuju bahwa mading membantu menyampaikan nilai-nilai karakter baik (tanggung jawab, kerja sama, kreativitas, kepedulian, kedisiplinan, sikap positif).',
    evaluasi:
      'Evaluasi (LPJ): (1) Perubahan jadwal mading karena kegiatan lain bersamaan; (2) Beberapa kegiatan mading tidak terlaksana karena keterbatasan waktu pada periode yang ditentukan.\nSolusi (LPJ): (1) Meningkatkan komunikasi dan koordinasi penyusunan jadwal; (2) Pengaturan jadwal dan koordinasi berkala.',
  },
  'social-media': {
    tujuan:
      'Meningkatkan jangkauan dan efektivitas penyebaran informasi melalui media sosial OSIS, sehingga setiap kegiatan sekolah dan prestasi siswa/i diketahui warga sekolah dan masyarakat luas secara cepat, menarik, dan mudah dipahami',
    teknis:
      'Jadwal rutinan (Proposal/LPJ): Selasa — konten Sekbid 6 (Health Report, video di reels IG minggu ke-2); Kamis — konten Sekbid 5 (Raga & Nada, reels IG minggu 1–2); fleksibel — Sekbid 8 (School Announcement, poster/video di Instagram)',
    capaian:
      '21,6% sangat setuju, 40% setuju, 32,4% netral/ragu-ragu, 5,4% tidak setuju, 0,5% sangat tidak setuju bahwa media sosial OSIS sudah efektif menyebarkan informasi kegiatan sekolah dan prestasi siswa/i.',
    evaluasi:
      'Evaluasi (LPJ): Keterlambatan pengunggahan konten; pengunggahan tidak sesuai jam yang ditentukan karena kurang optimalnya pengelolaan waktu.\nSolusi (LPJ): Mengunggah konten 10 menit lebih awal dari jam yang ditentukan.',
  },
};

// Alias keys for slug variants that may exist in Strapi
const ALIASES = {
  'raga-nada': 'program-kerja',
  'raga-and-nada': 'program-kerja',
  sitestream: 'sites-stream',
  'site-stream': 'sites-stream',
  sosmed: 'social-media',
  'pengelolaan-sosial-media': 'social-media',
  breakfast_time: 'Breakfast-Time',
  'breakfast-time': 'Breakfast-Time',
  health_report: 'Health-Report',
  'health-report': 'Health-Report',
  healthy_day: 'Healthy-Day',
  'healthy-day': 'Healthy-Day',
  nutrition_day: 'Nutrition-day',
  'nutrition-day': 'Nutrition-day',
  the_rising_talent: 'The-Rising-Talent',
  'the-rising-talent': 'The-Rising-Talent',
  direct_marketing: 'Direct-Marketing',
  'direct-marketing': 'Direct-Marketing',
  market_day: 'Market-Day',
  'market-day': 'Market-Day',
  fi_flick: 'FI-Flick',
  'fi-flick': 'FI-Flick',
  healty_station: 'Healty-Station',
};

function resolveBody(slug) {
  if (DATA[slug]) return { key: slug, body: DATA[slug] };
  const a = ALIASES[slug];
  if (a && DATA[a]) return { key: a, body: DATA[a] };
  return null;
}

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
    if (p.slug) prokerBySlug.set(p.slug, p);
  }
  const lpjBySlug = new Map();
  for (const l of lpjRes.data || []) {
    const pk = l.program_kerja || {};
    if (pk.slug) lpjBySlug.set(pk.slug, l);
  }

  console.log(`program-kerja=${prokerBySlug.size} mubes-lpj=${lpjBySlug.size} DATA keys=${Object.keys(DATA).length}`);
  console.log('slugs in Strapi:', [...prokerBySlug.keys()].sort().join(', '));

  let updated = 0;
  let skip = 0;
  const results = [];
  const skipReasons = [];

  const targetSlugs = new Set([...prokerBySlug.keys(), ...lpjBySlug.keys()]);

  for (const slug of [...targetSlugs].sort()) {
    const resolved = resolveBody(slug);
    if (!resolved) {
      skip++;
      skipReasons.push({ slug, reason: 'no_verbatim_data' });
      continue;
    }
    const proker = prokerBySlug.get(slug);
    const lpj = lpjBySlug.get(slug);
    if (!proker || !lpj) {
      skip++;
      skipReasons.push({ slug, reason: `proker=${!!proker} lpj=${!!lpj}` });
      console.warn(`SKIP ${slug}: proker=${!!proker} lpj=${!!lpj}`);
      continue;
    }

    const { body } = resolved;
    const secs = sections(body);
    const evaluasiShort = body.evaluasi.replace(/\s+/g, ' ').trim().slice(0, 250);

    await api('PUT', `/api/mubes-lpjs/${lpj.documentId}`, {
      data: {
        sections: secs,
        evaluasi_internal: body.evaluasi,
        teknis_pelaksanaan: body.teknis,
        status_pengesahan: 'ditinjau',
        sumber_dana:
          lpj.sumber_dana && !String(lpj.sumber_dana).includes('Dummy')
            ? lpj.sumber_dana
            : 'Kas OSIS / sesuai LPJ',
      },
    });
    try {
      await api('POST', `/api/mubes-lpjs/${lpj.documentId}/actions/publish`);
    } catch {
      /* ignore */
    }

    await api('PUT', `/api/program-kerjas/${proker.documentId}`, {
      data: {
        tujuan: body.tujuan.slice(0, 2000),
        teknis_pelaksanaan: body.teknis,
        evaluasi_deskripsi: evaluasiShort,
      },
    });
    try {
      await api('POST', `/api/program-kerjas/${proker.documentId}/actions/publish`);
    } catch {
      /* ignore */
    }

    updated++;
    results.push({
      slug,
      dataKey: resolved.key,
      tujuan_preview: body.tujuan.slice(0, 80),
      sections: secs.map((s) => ({ order: s.order, judul: s.judul, len: s.isi.length })),
    });
    console.log(`OK ${updated} ${slug}`);
  }

  // Verify no polished leftovers
  const verifyRes = await api(
    'GET',
    '/api/mubes-lpjs?pagination[limit]=100&populate[sections]=*&populate[program_kerja][fields][0]=slug'
  );
  let lorem = 0;
  let polished = 0;
  const bad = [];
  for (const l of verifyRes.data || []) {
    const blob = JSON.stringify(l.sections || []) + (l.evaluasi_internal || '') + (l.teknis_pelaksanaan || '');
    if (/Lorem ipsum/i.test(blob)) {
      lorem++;
      bad.push({ slug: l.program_kerja?.slug, hit: 'Lorem ipsum' });
    }
    if (/Program berhasil meningkatkan/i.test(blob)) {
      polished++;
      bad.push({ slug: l.program_kerja?.slug, hit: 'Program berhasil meningkatkan' });
    }
  }

  const outDir = join(ROOT, 'docs/data-sementara');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'result-verbatim-all.json');
  const payload = {
    at: new Date().toISOString(),
    api: API,
    updated,
    skip,
    skipReasons,
    results,
    verify: { lorem, polished, bad },
  };
  writeFileSync(outPath, JSON.stringify(payload, null, 2));

  console.log(`\nDone. updated=${updated} skip=${skip}`);
  console.log(`verify lorem=${lorem} polished_phrase=${polished}`);
  console.log(`wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

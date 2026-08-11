/**
 * Seed Script for OSIS Agora Acta CMS
 * 
 * This script populates Strapi with initial data extracted from the 
 * existing hardcoded frontend components.
 * 
 * Usage: 
 *   npm run seed
 *   (or: npx ts-node scripts/seed.ts)
 * 
 * Prerequisites:
 *   - Strapi must be running (npm run develop)
 *   - A Super Admin account must be created first
 *   - Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD environment variables
 *     (or use defaults: admin@agoraacta.com / Admin123!)
 */

const API_URL = process.env.STRAPI_URL || 'https://osisstrapi.biezz.my.id';
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@agoraacta.com';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'Admin123!';

// ============================================
// Data: Sekbid (from SeksiBidangGrid.tsx)
// ============================================
const sekbidData = [
  {
    judul: 'Kerohanian',
    nomor: 1,
    deskripsi: 'Pembinaan keimanan dan ketakwaan melalui kegiatan keagamaan seperti tilawah, kultum, takhosus, dan pendampingan rohis.',
    visi: 'Pembinaan Keimanan dan Ketakwaan terhadap Tuhan Yang Maha Esa.',
    slug: 'sekbid-1',
    highlight_type: 'terpopuler',
    highlight_title: 'Tilawah OSIS (TILSIS)',
    highlight_desc: "Tilawah harian untuk memperlancar bacaan Al-Qur'an.",
  },
  {
    judul: 'Kesiswaan / Ketertiban',
    nomor: 2,
    deskripsi: 'Membangun kedisiplinan dan ketertiban siswa melalui sidak tata tertib, piket kedisiplinan, dan apresiasi kelas disiplin.',
    visi: 'Membangun Kedisiplinan dan Ketertiban Siswa.',
    slug: 'sekbid-2',
    highlight_type: 'showcase',
    highlight_title: 'Class of Discipline (COD)',
    highlight_desc: 'Apresiasi siswa/i yang taat pada peraturan sekolah.',
  },
  {
    judul: 'Edukasi',
    nomor: 3,
    deskripsi: 'Pengembangan potensi akademik melalui study club, notifikasi edukasi, dan konten pembelajaran singkat.',
    visi: 'Pengembangan Potensi Akademik dan Edukasi Siswa.',
    slug: 'sekbid-3',
    highlight_type: 'showcase',
    highlight_title: 'University Day x Fi Flick',
    highlight_desc: 'Sharing alumni dan informasi perguruan tinggi.',
  },
  {
    judul: 'Bahasa',
    nomor: 4,
    deskripsi: 'Pengembangan literasi dan bahasa melalui sayembara menulis, podcast sastra, dan kuis literasi rutin.',
    visi: 'Pengembangan Literasi dan Bahasa Siswa.',
    slug: 'sekbid-4',
    highlight_type: 'showcase',
    highlight_title: 'Write Your Ideas (WYI)',
    highlight_desc: 'Sayembara menulis karya sastra bulanan.',
  },
  {
    judul: 'Minat & Bakat',
    nomor: 5,
    deskripsi: 'Wadah pengembangan minat dan bakat siswa melalui talent showcase, refleksi diri, dan informasi lomba non-akademik.',
    visi: 'Wadah Pengembangan Minat dan Bakat Siswa.',
    slug: 'sekbid-5',
    highlight_type: 'showcase',
    highlight_title: 'Classmeet x Market Day — Dynamite',
    highlight_desc: 'Kompetisi dan pengalaman wirausaha nyata.',
  },
  {
    judul: 'Kesehatan & Lingkungan',
    nomor: 6,
    deskripsi: 'Pengembangan kebersihan, kesehatan, dan lingkungan hidup melalui cleaning day, senam, dan edukasi gizi.',
    visi: 'Pengembangan Kebersihan, Kesehatan, dan Lingkungan Hidup.',
    slug: 'sekbid-6',
    highlight_type: 'showcase',
    highlight_title: 'Healthy Movement',
    highlight_desc: 'Senam bersama untuk hidup sehat setiap Rabu.',
  },
  {
    judul: 'Kewirausahaan',
    nomor: 7,
    deskripsi: 'Pengembangan jiwa kewirausahaan dan ekonomi kreatif melalui weekly market, wawancara pengusaha, dan direct marketing.',
    visi: 'Pengembangan Jiwa Kewirausahaan dan Ekonomi Kreatif.',
    slug: 'sekbid-7',
    highlight_type: 'showcase',
    highlight_title: 'Weekly Market',
    highlight_desc: 'Penjualan rutin oleh pengurus OSIS 2x seminggu.',
  },
  {
    judul: 'Kominfo',
    nomor: 8,
    deskripsi: 'Pengelolaan komunikasi, informasi, dan media digital OSIS melalui sosial media, mading, website, dan studio konten.',
    visi: 'Pengelolaan Komunikasi, Informasi, dan Media Digital OSIS.',
    slug: 'sekbid-8',
    highlight_type: 'terpopuler',
    highlight_title: 'SiteStream',
    highlight_desc: 'Website informasi resmi OSIS Fithrah Insani.',
  },
];

// ============================================
// Data: Program Kerja (from SekbidDetail.tsx + ProgramKerjaDetailPage.tsx)
// ============================================
const programKerjaData: Array<{
  judul: string;
  slug: string;
  kategori: 'rutin' | 'insidental';
  sekbid_nomor: number;
  tujuan: string;
  teknis_pelaksanaan: string;
  evaluasi_deskripsi: string;
  evaluasi_form_url: string;
  bg_color: string;
  icon_color: string;
  tujuan_detail: Array<{ title: string; deskripsi: string }>;
  ketua_nama: string;
  ketua_jabatan: string;
}> = [
    // === SEKBID 1: Kerohanian ===
    { judul: 'Tilawah OSIS (TILSIS)', slug: 'tilawah-osis', kategori: 'rutin', sekbid_nomor: 1, tujuan: "Membantu seluruh pengurus OSIS menambah dan memperlancar bacaan tilawah Al-Qur'an.", teknis_pelaksanaan: 'Tilawah dilakukan setiap hari sejak pagi, kehadiran dicatat via Google Form, direkap tiap sekbid secara berkala (triwulan).', evaluasi_deskripsi: 'Kehadiran dicatat via Google Form dan direkap tiap sekbid secara berkala setiap triwulan.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-[#009689]', tujuan_detail: [{ title: 'Kedisiplinan Ibadah', deskripsi: 'Membiasakan tilawah sebelum rapat umum sebagai bentuk kedisiplinan ibadah.' }, { title: "Konsistensi Al-Qur'an", deskripsi: "Meningkatkan interaksi pengurus dengan Al-Qur'an secara konsisten." }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Hadist of the Week (HOTW)', slug: 'hadist-of-the-week', kategori: 'rutin', sekbid_nomor: 1, tujuan: 'Mengenalkan hadits-hadits pilihan kepada siswa/i agar dapat diamalkan sehari-hari.', teknis_pelaksanaan: 'Hadits disampaikan lewat radio sekolah (± pukul 06.20–06.40) setiap Jumat, kadang disertai broadcast voice note ke grup kelas.', evaluasi_deskripsi: 'Evaluasi dilakukan melalui feedback siswa dan monitoring penyampaian mingguan.', evaluasi_form_url: '#', bg_color: 'bg-orange-50', icon_color: 'text-[#E17100]', tujuan_detail: [{ title: 'Pemahaman Hadits', deskripsi: 'Menyampaikan hadits dari kitab Arbain An-Nawawi secara bertahap.' }, { title: 'Media Aksesibel', deskripsi: 'Memperluas pemahaman keagamaan lewat media yang mudah diakses.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Pendampingan Rohis', slug: 'pendampingan-rohis', kategori: 'rutin', sekbid_nomor: 1, tujuan: 'Menumbuhkan semangat religius dan kepedulian sosial siswa lewat kegiatan keagamaan rutin.', teknis_pelaksanaan: 'Al-Kahfi setiap Jumat pagi saat pengkondisian; infak dikumpulkan tiap hari saat Dzuhur; Islamic of the Month dan sesi keakhwatan tiap pekan ke-4.', evaluasi_deskripsi: 'Evaluasi dilakukan melalui laporan mingguan pengumpulan infak dan kehadiran kegiatan rohis.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-[#155DFC]', tujuan_detail: [{ title: 'Pembinaan Rohis', deskripsi: 'Membina program-program rohis: Al-Kahfi, pengelolaan infak, Islamic of the Month, keakhwatan.' }, { title: 'Wawasan Berkelanjutan', deskripsi: 'Meningkatkan wawasan keislaman siswa secara berkelanjutan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Takhosus', slug: 'takhosus', kategori: 'rutin', sekbid_nomor: 1, tujuan: "Menambah dan menguatkan hafalan Al-Qur'an siswa/i secara intensif.", teknis_pelaksanaan: 'Dilaksanakan Selasa–Kamis pukul 06.30–07.00 di masjid, dengan pendataan kehadiran per sesi.', evaluasi_deskripsi: 'Kehadiran dicatat per sesi dan progres hafalan dipantau secara berkala.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-[#EC003F]', tujuan_detail: [{ title: 'Hafalan Terstruktur', deskripsi: "Memfasilitasi metode hafalan terstruktur (simak, tikrar, muraja'ah)." }, { title: 'Pembinaan Lanjutan', deskripsi: 'Wajib bagi siswa/i yang sudah hafal 30 juz sebagai pembinaan lanjutan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Kultum', slug: 'kultum', kategori: 'rutin', sekbid_nomor: 1, tujuan: 'Menambah wawasan keagamaan siswa/i sekaligus melatih rasa percaya diri.', teknis_pelaksanaan: 'Dilaksanakan setiap hari kerja (Senin–Jumat, Jumat khusus akhwat), masing-masing dengan tema harian berbeda.', evaluasi_deskripsi: 'Siswa/i yang bertugas dicatat dan dievaluasi kualitas penyampaiannya oleh pembina.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-[#4F39F6]', tujuan_detail: [{ title: 'Ceramah Bergilir', deskripsi: 'Siswa/i bergiliran menyampaikan ceramah singkat dengan tema yang sudah ditentukan.' }, { title: 'Tema Berjenjang', deskripsi: 'Topik disusun berjenjang (akhlak, ibadah, adab) agar pembahasan bervariasi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'PHBI (Peringatan Hari Besar Islam)', slug: 'phbi', kategori: 'insidental', sekbid_nomor: 1, tujuan: "Memperingati dan menghayati hari-hari besar Islam (Maulid Nabi, Isra Mi'raj, Idul Fitri, Idul Adha, Muharram) untuk memperkuat keimanan dan ketakwaan siswa/i.", teknis_pelaksanaan: 'Dilaksanakan sesuai kalender hari besar Islam, dengan rangkaian acara ceramah, lomba, dan kegiatan keagamaan lainnya.', evaluasi_deskripsi: 'Proposal per sub-acara belum diunggah di Drive.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-[#009966]', tujuan_detail: [{ title: 'Penguatan Iman', deskripsi: 'Menumbuhkan kesadaran dan penghayatan terhadap peristiwa-peristiwa penting dalam sejarah Islam.' }, { title: 'Ukhuwah Islamiyah', deskripsi: 'Mempererat tali persaudaraan dan kebersamaan seluruh warga sekolah.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'One Day One Juz', slug: 'one-day-one-juz', kategori: 'insidental', sekbid_nomor: 1, tujuan: "Membudayakan khatam Al-Qur'an bersama selama bulan Ramadhan melalui program satu juz per hari.", teknis_pelaksanaan: "Program pembacaan Al-Qur'an satu juz per hari selama bulan Ramadhan secara bersama-sama.", evaluasi_deskripsi: 'Proposal belum diunggah di Drive.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-[#9810FA]', tujuan_detail: [{ title: 'Khatam Bersama', deskripsi: "Memfasilitasi siswa/i untuk khatam Al-Qur'an secara kolektif selama Ramadhan." }, { title: "Cinta Al-Qur'an", deskripsi: "Menumbuhkan kecintaan dan kebiasaan membaca Al-Qur'an setiap hari." }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Ramadhan Ceria — Pohon Kurma', slug: 'ramadhan-ceria', kategori: 'insidental', sekbid_nomor: 1, tujuan: 'Menumbuhkan pemahaman keislaman serta sikap kebersamaan dan kepedulian sosial siswa/i selama bulan Ramadhan.', teknis_pelaksanaan: 'Dilaksanakan 2 hari (Maret 2026), diisi kegiatan bernuansa Ramadhan dan lingkungan, melibatkan kepanitiaan lintas bidang. Gabungan dengan Baksos Sekbid 2.', evaluasi_deskripsi: 'Evaluasi dilaksanakan pasca kegiatan melalui rapat internal dan laporan pertanggungjawaban.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-[#E7000B]', tujuan_detail: [{ title: 'Karakter Islami', deskripsi: 'Penguatan karakter Islami (olah hati dan akhlak) selaras dengan semangat "Pesantren Ekologi".' }, { title: 'Kepedulian Sosial', deskripsi: 'Kepedulian sosial lewat kegiatan bakti sosial yang digabung dalam rangkaian acara.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },

    // === SEKBID 2: Kesiswaan / Ketertiban ===
    { judul: 'Sidak Tata Tertib (STT)', slug: 'sidak-tata-tertib', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Menguatkan karakter disiplin dan tanggung jawab anggota OSIS agar menjadi teladan ketertiban sekolah.', teknis_pelaksanaan: 'Sidak dilakukan Sekbid 2 sebelum rapat OSIS, memeriksa atribut, kerapian, dan kelengkapan kendaraan.', evaluasi_deskripsi: 'Rekap pelanggaran dicatat dan dilaporkan setiap periode sidak.', evaluasi_form_url: '#', bg_color: 'bg-red-50', icon_color: 'text-red-600', tujuan_detail: [{ title: 'Pemeriksaan Atribut', deskripsi: 'Pemeriksaan atribut seragam, kerapian, dan barang bawaan yang melanggar aturan.' }, { title: 'Penegakan Disiplin', deskripsi: 'Penegakan lewat teguran dan pembinaan langsung, bukan sekadar pengawasan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Class of Discipline (COD)', slug: 'class-of-discipline', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Mengapresiasi siswa/i yang taat pada peraturan sekolah.', teknis_pelaksanaan: 'Merekap data pelanggaran bulanan, kelas/siswa dengan pelanggaran tersedikit ditetapkan sebagai pemenang.', evaluasi_deskripsi: 'Data pelanggaran direkap setiap bulan untuk menentukan pemenang.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Perspektif Positif', deskripsi: 'Mengubah cara pandang siswa terhadap aturan dari "beban" menjadi "kebutuhan".' }, { title: 'Penghargaan', deskripsi: 'Memberi penghargaan kepada kelas/siswa dengan pelanggaran paling sedikit.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Kompas OSIS', slug: 'kompas-osis', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Menjadikan seluruh anggota OSIS lebih disiplin dan patuh pada peraturan sekolah.', teknis_pelaksanaan: 'Pemeriksaan atribut pengurus OSIS (dasi, topi, manset, kerudung, dll.) fleksibel — biasanya setelah apel atau saat rapat.', evaluasi_deskripsi: 'Catatan pelanggaran pengurus OSIS direkap dan ditindaklanjuti secara internal.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-indigo-600', tujuan_detail: [{ title: 'Teladan OSIS', deskripsi: 'OSIS sebagai teladan harus lebih dulu menaati aturan sebelum menegakkannya ke siswa lain.' }, { title: 'Sanksi Tegas', deskripsi: 'Sanksi diberlakukan bila melanggar aturan kompas berulang kali.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Piket Kedisiplinan', slug: 'piket-kedisiplinan', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Menertibkan siswa/i terkait kerapian, kelengkapan atribut, dan ketepatan waktu (termasuk sholat).', teknis_pelaksanaan: 'Piket setiap hari (kecuali libur/PTS-PAS) mulai pukul 06.00 di titik-titik gedung ikhwan/akhwat, gerbang, dan parkiran.', evaluasi_deskripsi: 'Laporan piket harian dicatat dan dilaporkan secara berkala.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-purple-600', tujuan_detail: [{ title: 'Piket Pagi', deskripsi: 'Piket pagi memeriksa kelengkapan atribut dan menangani keterlambatan.' }, { title: 'Piket Siang', deskripsi: 'Piket siang mengawal pelaksanaan sholat Dzuhur berjamaah.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'PHBN (Peringatan Hari Besar Nasional)', slug: 'phbn', kategori: 'insidental', sekbid_nomor: 2, tujuan: 'Menjadikan siswa/i lebih menghormati dan mengapresiasi jasa guru serta memperingati hari-hari besar nasional.', teknis_pelaksanaan: 'Acara sehari penuh (07.00–13.30) dengan kepanitiaan lengkap (acara, lomba, sekretariat, pubdok, logistik, keamanan, konsumsi).', evaluasi_deskripsi: 'Evaluasi pasca kegiatan melalui rapat internal dan laporan pertanggungjawaban.', evaluasi_form_url: '#', bg_color: 'bg-red-50', icon_color: 'text-red-600', tujuan_detail: [{ title: 'Cahaya Pembimbing', deskripsi: 'Guru diposisikan sebagai "cahaya pembimbing" lewat acara penghargaan (Hari Guru/Guidelight).' }, { title: 'Kesadaran Nasional', deskripsi: 'Menumbuhkan kesadaran siswa untuk menghargai kerja keras guru dan para pahlawan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Bakti Sosial (Baksos)', slug: 'bakti-sosial', kategori: 'insidental', sekbid_nomor: 2, tujuan: 'Melatih siswa/i untuk berempati dan berbagi dengan sesama.', teknis_pelaksanaan: 'Penggalangan dana insidental ketika ada kebutuhan, dilaksanakan bersamaan Ramadhan Ceria pada periode ini.', evaluasi_deskripsi: 'Laporan penggalangan dan penyaluran dana disusun setelah kegiatan selesai.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Penggalangan Dana', deskripsi: 'Mengumpulkan dana melalui kotak bakti sosial untuk disalurkan kepada yang membutuhkan.' }, { title: 'Gotong Royong', deskripsi: 'Menanamkan nilai kemanusiaan dan gotong royong sesuai Pancasila.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },

    // === SEKBID 3-8 (abbreviated - key programs) ===
    { judul: 'Notifikasi Edukasi', slug: 'notifikasi-edukasi', kategori: 'rutin', sekbid_nomor: 3, tujuan: 'Menjadi wadah bagi siswa/i memperoleh informasi beasiswa, lomba, dan peluang akademik lainnya.', teknis_pelaksanaan: 'Info disebar lewat poster digital (Instagram), poster fisik di mading, dan video pendek; jadwal fleksibel mengikuti info lomba yang ada.', evaluasi_deskripsi: 'Efektivitas diukur dari respons dan partisipasi siswa dalam lomba yang diinformasikan.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Akses Informasi', deskripsi: 'Mengatasi minimnya akses informasi lomba/beasiswa yang menghambat prestasi siswa.' }, { title: 'Kompetisi Akademik', deskripsi: 'Menumbuhkan kesadaran untuk lebih aktif mengikuti kompetisi akademik.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Study Club', slug: 'study-club', kategori: 'rutin', sekbid_nomor: 3, tujuan: 'Meningkatkan pemahaman akademik dan mempersiapkan siswa/i menghadapi PTS/PAS.', teknis_pelaksanaan: 'Dilaksanakan H-1 setiap ujian, dengan konfirmasi kehadiran guru (daring/luring) sehari sebelumnya.', evaluasi_deskripsi: 'Kehadiran guru dan siswa dicatat, serta feedback dikumpulkan setiap sesi.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Kisi-kisi Bersama', deskripsi: 'Pembahasan kisi-kisi/soal bersama guru mata pelajaran terkait.' }, { title: 'Belajar Efektif', deskripsi: 'Membentuk kebiasaan belajar efektif dan kerja sama positif antarsiswa.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Two Minutes Class', slug: 'two-minutes-class', kategori: 'rutin', sekbid_nomor: 3, tujuan: 'Meningkatkan pemahaman materi pelajaran lewat konten singkat yang mudah diakses.', teknis_pelaksanaan: 'Video ± 2 menit disiapkan 2 minggu sebelumnya, diunggah ke Instagram & TikTok OSIS pukul 18.00, sebulan sekali.', evaluasi_deskripsi: 'Engagement konten dipantau melalui analytics media sosial.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Kolaborasi Guru', deskripsi: 'Bekerja sama dengan guru mata pelajaran untuk konten fun fact/tips belajar.' }, { title: 'Media Menarik', deskripsi: 'Mengatasi rendahnya motivasi belajar lewat media yang ringan dan menarik.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Hari Pendidikan', slug: 'hari-pendidikan', kategori: 'insidental', sekbid_nomor: 3, tujuan: 'Memperingati Hari Pendidikan Nasional untuk meningkatkan semangat belajar dan menghargai pendidikan.', teknis_pelaksanaan: 'Dilaksanakan sesuai tanggal Hari Pendidikan Nasional dengan rangkaian kegiatan edukasi.', evaluasi_deskripsi: 'Proposal belum diunggah di Drive.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-teal-600', tujuan_detail: [{ title: 'Semangat Pendidikan', deskripsi: 'Menumbuhkan semangat dan apresiasi terhadap dunia pendidikan.' }, { title: 'Refleksi Belajar', deskripsi: 'Mengajak siswa merefleksikan pentingnya pendidikan bagi masa depan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'University Day x Fi Flick — Enchanted Path', slug: 'university-day', kategori: 'insidental', sekbid_nomor: 3, tujuan: 'Memberikan informasi kepada siswa/i mengenai berbagai pilihan perguruan tinggi lewat sharing alumni.', teknis_pelaksanaan: 'Dilaksanakan 2 hari (Januari 2026) dengan parade kampus, sesi sharing alumni, dan booth foto. Gabungan dengan Fi Flick milik Sekbid 7.', evaluasi_deskripsi: 'Evaluasi dilaksanakan pasca kegiatan melalui feedback peserta dan laporan pertanggungjawaban.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-indigo-600', tujuan_detail: [{ title: 'Sharing Alumni', deskripsi: 'Alumni diundang untuk berbagi pengalaman kuliah dan memotivasi siswa merencanakan pendidikan lanjutan.' }, { title: 'Fi Flick', deskripsi: 'Dipadukan dengan Fi Flick (photobooth) sebagai sarana dokumentasi dan kenangan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    // Sekbid 4
    { judul: 'Write Your Ideas (WYI)', slug: 'write-your-ideas', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Menjadi wadah bagi anak muda untuk memahami dan mengasah keterampilan menulis karya sastra.', teknis_pelaksanaan: 'Siklus 4 tahap per bulan — poster tema, pengumuman sayembara, upload karya, pengumuman pemenang — berulang tiap bulan.', evaluasi_deskripsi: 'Partisipasi dan engagement karya dipantau setiap siklus bulanan.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-rose-600', tujuan_detail: [{ title: 'Ruang Berkarya', deskripsi: 'Memberi ruang bagi siswa yang ragu menampilkan karyanya untuk berani berkarya.' }, { title: 'Apresiasi Publik', deskripsi: 'Pemenang ditentukan lewat jumlah likes di Instagram sebagai bentuk apresiasi publik.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Suara Sastra', slug: 'suara-sastra', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Memperluas wawasan literasi siswa/i lewat media rekaman digital (podcast).', teknis_pelaksanaan: 'Wawancara pemenang WYI, editing 2 minggu, distribusi di YouTube & Spotify OSIS, sebulan sekali.', evaluasi_deskripsi: 'Partisipasi dan engagement konten dipantau melalui analytics platform.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Apresiasi Berkelanjutan', deskripsi: 'Mewawancarai pemenang Write Your Ideas sebagai bentuk apresiasi berkelanjutan.' }, { title: 'Kesadaran Literasi', deskripsi: 'Meningkatkan kesadaran pentingnya literasi bagi pelajar.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Enlightment Trip (ET)', slug: 'enlightment-trip', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Membekali siswa/i dengan keterampilan literasi lewat membaca dan kuis.', teknis_pelaksanaan: 'Membaca dan kuis Quizizz tiap Kamis.', evaluasi_deskripsi: 'Partisipasi siswa dipantau melalui platform Quizizz.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Literasi Aktif', deskripsi: 'Membekali siswa/i dengan keterampilan literasi lewat membaca.' }, { title: 'Kuis Interaktif', deskripsi: 'Menggunakan Quizizz untuk kuis interaktif setiap Kamis.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Quotes of the Month (QOTM)', slug: 'quotes-of-the-month', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Menumbuhkan semangat dan motivasi belajar siswa lewat kutipan inspiratif.', teknis_pelaksanaan: 'Kutipan inspiratif dari film/lagu dipublikasikan setiap bulan.', evaluasi_deskripsi: 'Engagement konten dipantau setiap bulan.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Motivasi Siswa', deskripsi: 'Menumbuhkan semangat dan motivasi belajar siswa.' }, { title: 'Inspirasi Bulanan', deskripsi: 'Kutipan inspiratif dari film/lagu yang dekat dengan kehidupan siswa.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    // Sekbid 5
    { judul: 'Ourself Journey (OJ)', slug: 'ourself-journey', kategori: 'rutin', sekbid_nomor: 5, tujuan: 'Membantu siswa/i memahami diri, minat, dan potensi lewat refleksi diri dan konten digital.', teknis_pelaksanaan: 'Konten digital refleksi diri dipublikasikan secara rutin.', evaluasi_deskripsi: 'Engagement konten dipantau melalui analytics media sosial.', evaluasi_form_url: '#', bg_color: 'bg-pink-50', icon_color: 'text-pink-600', tujuan_detail: [{ title: 'Refleksi Diri', deskripsi: 'Membantu siswa memahami diri dan potensi.' }, { title: 'Konten Digital', deskripsi: 'Lewat konten digital yang menarik dan relatable.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Talent Showcase', slug: 'talent-showcase', kategori: 'rutin', sekbid_nomor: 5, tujuan: 'Menyediakan panggung offline dan online bagi siswa untuk menampilkan bakat.', teknis_pelaksanaan: 'Panggung bakat offline dan online secara rutin.', evaluasi_deskripsi: 'Partisipasi dan feedback audiens dikumpulkan.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-rose-600', tujuan_detail: [{ title: 'Panggung Bakat', deskripsi: 'Menyediakan panggung untuk siswa menampilkan bakat.' }, { title: 'Offline & Online', deskripsi: 'Tersedia dalam format offline maupun online.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Classmeet x Market Day — Dynamite', slug: 'classmeet', kategori: 'insidental', sekbid_nomor: 5, tujuan: 'Kompetisi non-akademik dan pengalaman wirausaha nyata, gabungan dengan Market Day Sekbid 7.', teknis_pelaksanaan: 'Kompetisi dan bazar gabungan Sekbid 5 dan Sekbid 7.', evaluasi_deskripsi: 'Evaluasi pasca kegiatan melalui rapat internal.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-purple-600', tujuan_detail: [{ title: 'Kompetisi Non-Akademik', deskripsi: 'Lomba antar kelas di berbagai bidang non-akademik.' }, { title: 'Pengalaman Wirausaha', deskripsi: 'Market Day memberikan pengalaman wirausaha nyata.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    // Sekbid 6
    { judul: 'Cleaning Day', slug: 'cleaning-day', kategori: 'rutin', sekbid_nomor: 6, tujuan: 'Menumbuhkan kesadaran menjaga kebersihan lewat kerja bakti area sekolah.', teknis_pelaksanaan: 'Kerja bakti area sekolah setiap Jumat pagi.', evaluasi_deskripsi: 'Kehadiran dan area yang dibersihkan dicatat.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-teal-600', tujuan_detail: [{ title: 'Kesadaran Kebersihan', deskripsi: 'Menumbuhkan kesadaran menjaga kebersihan lingkungan.' }, { title: 'Kerja Bakti Rutin', deskripsi: 'Dilaksanakan setiap Jumat pagi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Healthy Movement', slug: 'healthy-movement', kategori: 'rutin', sekbid_nomor: 6, tujuan: 'Menumbuhkan kesadaran pentingnya menjaga kesehatan tubuh lewat senam bersama.', teknis_pelaksanaan: 'Senam bersama setiap Rabu.', evaluasi_deskripsi: 'Kehadiran dan feedback peserta dipantau.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Kesehatan Tubuh', deskripsi: 'Menjaga kesehatan tubuh lewat olahraga.' }, { title: 'Senam Rutin', deskripsi: 'Dilaksanakan setiap Rabu.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    // Sekbid 7
    { judul: 'Weekly Market', slug: 'weekly-market', kategori: 'rutin', sekbid_nomor: 7, tujuan: 'Melatih kemampuan berwirausaha pengurus OSIS sekaligus menambah dana organisasi.', teknis_pelaksanaan: 'Penjualan rutin oleh pengurus OSIS 2x seminggu.', evaluasi_deskripsi: 'Laporan keuangan penjualan direkap setiap minggu.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Kemampuan Wirausaha', deskripsi: 'Melatih kemampuan berwirausaha pengurus OSIS.' }, { title: 'Dana Organisasi', deskripsi: 'Menambah dana operasional organisasi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Ngobrol Bisnis (NGOBISS)', slug: 'ngobrol-bisnis', kategori: 'rutin', sekbid_nomor: 7, tujuan: 'Mengembangkan pengetahuan dan minat wirausaha lewat wawancara pengusaha sukses.', teknis_pelaksanaan: 'Wawancara pengusaha sukses secara rutin.', evaluasi_deskripsi: 'Engagement konten dipantau melalui analytics.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Inspirasi Bisnis', deskripsi: 'Mengembangkan pengetahuan dan minat wirausaha.' }, { title: 'Wawancara Pengusaha', deskripsi: 'Lewat wawancara dengan pengusaha sukses.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    // Sekbid 8
    { judul: 'School Announcement', slug: 'school-announcement', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Menyampaikan informasi kegiatan sekolah terbaru sebagai media resmi.', teknis_pelaksanaan: 'Informasi disebarkan melalui media digital resmi OSIS.', evaluasi_deskripsi: 'Efektivitas penyebaran informasi dipantau melalui feedback.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Media Resmi', deskripsi: 'Menyampaikan informasi kegiatan sekolah terbaru.' }, { title: 'Akses Mudah', deskripsi: 'Sebagai media resmi yang mudah diakses.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'SiteStream', slug: 'sites-stream', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Wadah informasi resmi OSIS lewat Website sekolah.', teknis_pelaksanaan: 'Website sekolah yang bisa diakses publik.', evaluasi_deskripsi: 'Traffic website dipantau melalui analytics.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-teal-600', tujuan_detail: [{ title: 'Website Resmi', deskripsi: 'Wadah informasi resmi OSIS.' }, { title: 'Akses Publik', deskripsi: 'Bisa diakses publik.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Pengelolaan Sosial Media', slug: 'social-media', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Meningkatkan jangkauan dan efektivitas penyebaran informasi lewat media sosial OSIS.', teknis_pelaksanaan: 'Pengelolaan konten media sosial OSIS secara berkala.', evaluasi_deskripsi: 'Engagement dan reach dipantau melalui analytics.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-indigo-600', tujuan_detail: [{ title: 'Jangkauan Luas', deskripsi: 'Meningkatkan jangkauan penyebaran informasi.' }, { title: 'Media Sosial', deskripsi: 'Lewat media sosial OSIS.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Majalah Dinding (Mading)', slug: 'mading', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Menumbuhkan minat dan kreativitas siswa lewat media informasi offline.', teknis_pelaksanaan: 'Pembuatan dan pembaruan mading secara berkala.', evaluasi_deskripsi: 'Kualitas dan frekuensi pembaruan mading dipantau.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Kreativitas', deskripsi: 'Menumbuhkan minat dan kreativitas siswa.' }, { title: 'Media Offline', deskripsi: 'Lewat media informasi offline.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Studio OSIS', slug: 'studio-osis', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Mendukung seluruh sekbid dalam pembuatan konten visual program kerja.', teknis_pelaksanaan: 'Produksi konten visual (video/poster) untuk program kerja seluruh sekbid.', evaluasi_deskripsi: 'Kualitas dan kuantitas konten yang diproduksi dipantau.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-purple-600', tujuan_detail: [{ title: 'Konten Visual', deskripsi: 'Mendukung pembuatan konten visual.' }, { title: 'Lintas Sekbid', deskripsi: 'Mendukung seluruh sekbid.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
  ];

// ============================================
// Data: Anggota OSIS (from AnggotaList.tsx)
// ============================================
const anggotaData = [
  // Pengurus Inti (BPH)
  { nama_lengkap: 'SURYA SIGIT', jabatan: 'Ketua', kelas: 'XI B', divisi: 'BPH', deskripsi: 'Kelas XI B', urutan: 1 },
  { nama_lengkap: 'AISHA GHASSANI SHALIHA', jabatan: 'Wakil Ketua', kelas: 'XI D', divisi: 'BPH', deskripsi: 'Kelas XI D', urutan: 2 },
  { nama_lengkap: 'RIZKA RASYIDAH', jabatan: 'Sekretaris', kelas: 'XI E', divisi: 'BPH', deskripsi: 'Kelas XI E', urutan: 3 },
  { nama_lengkap: 'MUHAMMAD HAMMAM JUNDURRAHMAN', jabatan: 'Bendahara', kelas: 'XI B', divisi: 'BPH', deskripsi: 'Kelas XI B', urutan: 4 },

  // Sekbid 1: Kerohanian
  { nama_lengkap: 'ADHIENA ZAHRA RIZKYA', jabatan: 'Koordinator Sekbid 1', kelas: 'XI D', divisi: 'Sekbid_1', deskripsi: 'Kelas XI D', urutan: 5 },
  { nama_lengkap: 'VANESHA SESILLAWATI', jabatan: 'Sekretaris Sekbid 1', kelas: 'XI D', divisi: 'Sekbid_1', deskripsi: 'Kelas XI D', urutan: 6 },
  { nama_lengkap: 'AQILA AL HUMAIRA', jabatan: 'Anggota Sekbid 1', kelas: 'X F', divisi: 'Sekbid_1', deskripsi: 'Kelas X F', urutan: 7 },
  { nama_lengkap: 'ZALFA NUR AFIFA ZAKAUHA', jabatan: 'Anggota Sekbid 1', kelas: 'X F', divisi: 'Sekbid_1', deskripsi: 'Kelas X F', urutan: 8 },
  { nama_lengkap: 'AFIQOH DAYINI ATHAULLAH PURWANA', jabatan: 'Anggota Sekbid 1', kelas: 'X D', divisi: 'Sekbid_1', deskripsi: 'Kelas X D', urutan: 9 },
  { nama_lengkap: 'MUHAMMAD HAIDAR AL AYYUBI', jabatan: 'Anggota Sekbid 1', kelas: 'X A', divisi: 'Sekbid_1', deskripsi: 'Kelas X A', urutan: 10 },
  { nama_lengkap: 'MUHAMMAD FATHIAN AKBAR', jabatan: 'Anggota Sekbid 1', kelas: 'X A', divisi: 'Sekbid_1', deskripsi: 'Kelas X A', urutan: 11 },

  // Sekbid 2: Kaderisasi
  { nama_lengkap: 'AHWAN M. KA’BAH', jabatan: 'Koordinator Sekbid 2', kelas: 'XI C', divisi: 'Sekbid_2', deskripsi: 'Kelas XI C', urutan: 12 },
  { nama_lengkap: 'BANITA ALIYA ASROFA', jabatan: 'Sekretaris Sekbid 2', kelas: 'XI D', divisi: 'Sekbid_2', deskripsi: 'Kelas XI D', urutan: 13 },
  { nama_lengkap: 'NAFEEZA KEYSYAKURA ALBANNA', jabatan: 'Anggota Sekbid 2', kelas: 'X E', divisi: 'Sekbid_2', deskripsi: 'Kelas X E', urutan: 14 },
  { nama_lengkap: 'YUSSIE YUKENNITA RAMADHANI', jabatan: 'Anggota Sekbid 2', kelas: 'X E', divisi: 'Sekbid_2', deskripsi: 'Kelas X E', urutan: 15 },
  { nama_lengkap: 'RAIHANAH GHINA ELTSURAYYA', jabatan: 'Anggota Sekbid 2', kelas: 'X F', divisi: 'Sekbid_2', deskripsi: 'Kelas X F', urutan: 16 },
  { nama_lengkap: 'RAY ZIBRIL RIDWAN', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', deskripsi: 'Kelas X B', urutan: 17 },
  { nama_lengkap: 'KHAIDAR MIFTAH BADRUZZAMAN', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', deskripsi: 'Kelas X B', urutan: 18 },
  { nama_lengkap: 'ANANDA P. PRATAMA', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', deskripsi: 'Kelas X B', urutan: 19 },

  // Sekbid 3: Edukasi
  { nama_lengkap: 'MUHAMMAD AZZAM FIRDAUS', jabatan: 'Koordinator Sekbid 3', kelas: 'XI B', divisi: 'Sekbid_3', deskripsi: 'Kelas XI B', urutan: 20 },
  { nama_lengkap: 'SHYFA PUTRI AZZAHRA', jabatan: 'Sekretaris Sekbid 3', kelas: 'XI E', divisi: 'Sekbid_3', deskripsi: 'Kelas XI E', urutan: 21 },
  { nama_lengkap: 'ZAKI IBRAHIM AZIS', jabatan: 'Anggota Sekbid 3', kelas: 'X A', divisi: 'Sekbid_3', deskripsi: 'Kelas X A', urutan: 22 },
  { nama_lengkap: 'PRANANDA RAMADHAN AHMAD', jabatan: 'Anggota Sekbid 3', kelas: 'X A', divisi: 'Sekbid_3', deskripsi: 'Kelas X A', urutan: 23 },
  { nama_lengkap: 'SASKIA MEKA TADRIANA', jabatan: 'Anggota Sekbid 3', kelas: 'X E', divisi: 'Sekbid_3', deskripsi: 'Kelas X E', urutan: 24 },
  { nama_lengkap: 'ALIYA MARWA RUWAIDA', jabatan: 'Anggota Sekbid 3', kelas: 'X E', divisi: 'Sekbid_3', deskripsi: 'Kelas X E', urutan: 25 },
  { nama_lengkap: 'FATHIMAH TASLIMAH RAHMA FACHELFI', jabatan: 'Anggota Sekbid 3', kelas: 'X D', divisi: 'Sekbid_3', deskripsi: 'Kelas X D', urutan: 26 },

  // Sekbid 4: Bahasa
  { nama_lengkap: 'MASAGUS HAFIDHUDDIN', jabatan: 'Koordinator Sekbid 4', kelas: 'XI B', divisi: 'Sekbid_4', deskripsi: 'Kelas XI B', urutan: 27 },
  { nama_lengkap: 'MUHAMMAD RIZKY TANTANA', jabatan: 'Sekretaris Sekbid 4', kelas: 'XI A', divisi: 'Sekbid_4', deskripsi: 'Kelas XI A', urutan: 28 },
  { nama_lengkap: 'THIFANI ARIFA KHILFA H.', jabatan: 'Anggota Sekbid 4', kelas: 'X F', divisi: 'Sekbid_4', deskripsi: 'Kelas X F', urutan: 29 },
  { nama_lengkap: 'RAIHAN PUTRA ARIFANDRA', jabatan: 'Anggota Sekbid 4', kelas: 'X A', divisi: 'Sekbid_4', deskripsi: 'Kelas X A', urutan: 30 },
  { nama_lengkap: 'ALUNA ADELIA PUTRI', jabatan: 'Anggota Sekbid 4', kelas: 'X D', divisi: 'Sekbid_4', deskripsi: 'Kelas X D', urutan: 31 },
  { nama_lengkap: 'ACHMAD ANSHOR', jabatan: 'Anggota Sekbid 4', kelas: 'X C', divisi: 'Sekbid_4', deskripsi: 'Kelas X C', urutan: 32 },
  { nama_lengkap: 'RAISSA ZALIKA SADINA', jabatan: 'Anggota Sekbid 4', kelas: 'X E', divisi: 'Sekbid_4', deskripsi: 'Kelas X E', urutan: 33 },

  // Sekbid 5: Minat dan Bakat
  { nama_lengkap: 'JASMINE VANYA ABERKA', jabatan: 'Koordinator Sekbid 5', kelas: 'XI E', divisi: 'Sekbid_5', deskripsi: 'Kelas XI E', urutan: 34 },
  { nama_lengkap: 'IRSYAD ASHAVIN', jabatan: 'Sekretaris Sekbid 5', kelas: 'XI C', divisi: 'Sekbid_5', deskripsi: 'Kelas XI C', urutan: 35 },
  { nama_lengkap: 'AISYAH', jabatan: 'Anggota Sekbid 5', kelas: 'X D', divisi: 'Sekbid_5', deskripsi: 'Kelas X D', urutan: 36 },
  { nama_lengkap: 'WANIA AULIYA RAMADHANI', jabatan: 'Anggota Sekbid 5', kelas: 'X E', divisi: 'Sekbid_5', deskripsi: 'Kelas X E', urutan: 37 },
  { nama_lengkap: 'ADHWA NABILAH PUTRI MARSILAN', jabatan: 'Anggota Sekbid 5', kelas: 'X E', divisi: 'Sekbid_5', deskripsi: 'Kelas X E', urutan: 38 },
  { nama_lengkap: 'KEANU REIVAN AGASHA', jabatan: 'Anggota Sekbid 5', kelas: 'X C', divisi: 'Sekbid_5', deskripsi: 'Kelas X C', urutan: 39 },
  { nama_lengkap: 'ALFIAN PRAMUDYA', jabatan: 'Anggota Sekbid 5', kelas: 'X C', divisi: 'Sekbid_5', deskripsi: 'Kelas X C', urutan: 40 },

  // Sekbid 6: Kesehatan dan Lingkungan
  { nama_lengkap: 'KEZZIA ANNISA SALSABILA', jabatan: 'Koordinator Sekbid 6', kelas: 'XI E', divisi: 'Sekbid_6', deskripsi: 'Kelas XI E', urutan: 41 },
  { nama_lengkap: 'KAYYISA FATHIYYAH', jabatan: 'Sekretaris Sekbid 6', kelas: 'XI D', divisi: 'Sekbid_6', deskripsi: 'Kelas XI D', urutan: 42 },
  { nama_lengkap: 'HANUM SALSABILA', jabatan: 'Anggota Sekbid 6', kelas: 'X E', divisi: 'Sekbid_6', deskripsi: 'Kelas X E', urutan: 43 },
  { nama_lengkap: 'RASHIKA RIZQUENA', jabatan: 'Anggota Sekbid 6', kelas: 'X E', divisi: 'Sekbid_6', deskripsi: 'Kelas X E', urutan: 44 },
  { nama_lengkap: 'REYFA SAFFA MAHESWARA', jabatan: 'Anggota Sekbid 6', kelas: 'X A', divisi: 'Sekbid_6', deskripsi: 'Kelas X A', urutan: 45 },
  { nama_lengkap: 'KEYSHA NAFIDHA ALMIRA GUNAWAN', jabatan: 'Anggota Sekbid 6', kelas: 'XI D', divisi: 'Sekbid_6', deskripsi: 'Kelas XI D', urutan: 46 },
  { nama_lengkap: 'SYARLA SYAFANA DEWI', jabatan: 'Anggota Sekbid 6', kelas: 'X D', divisi: 'Sekbid_6', deskripsi: 'Kelas X D', urutan: 47 },
  { nama_lengkap: 'HADZIQ MAHFUZ MUHAMMAD', jabatan: 'Anggota Sekbid 6', kelas: 'X B', divisi: 'Sekbid_6', deskripsi: 'Kelas X B', urutan: 48 },

  // Sekbid 7: Kewirausahaan
  { nama_lengkap: 'RAKEAN EKA LINGGA WARDANA', jabatan: 'Koordinator Sekbid 7', kelas: 'XI B', divisi: 'Sekbid_7', deskripsi: 'Kelas XI B', urutan: 49 },
  { nama_lengkap: 'AZKARIN FIDELYA KHANSABIRA', jabatan: 'Sekretaris Sekbid 7', kelas: 'XI E', divisi: 'Sekbid_7', deskripsi: 'Kelas XI E', urutan: 50 },
  { nama_lengkap: 'AFIYAH FITRI RAMADANI', jabatan: 'Anggota Sekbid 7', kelas: 'X F', divisi: 'Sekbid_7', deskripsi: 'Kelas X F', urutan: 51 },
  { nama_lengkap: 'ANAKIA MUNGGARANTI YUSAN', jabatan: 'Anggota Sekbid 7', kelas: 'XI E', divisi: 'Sekbid_7', deskripsi: 'Kelas XI E', urutan: 52 },
  { nama_lengkap: 'RADYTIA NUR HIDAYAH', jabatan: 'Anggota Sekbid 7', kelas: 'X A', divisi: 'Sekbid_7', deskripsi: 'Kelas X A', urutan: 53 },
  { nama_lengkap: 'ZULFAN ARIFIN RUSTANDI', jabatan: 'Anggota Sekbid 7', kelas: 'X C', divisi: 'Sekbid_7', deskripsi: 'Kelas X C', urutan: 54 },
  { nama_lengkap: 'KHALISA KASIH ANINDYA KIRANI PUTRI', jabatan: 'Anggota Sekbid 7', kelas: 'X E', divisi: 'Sekbid_7', deskripsi: 'Kelas X E', urutan: 55 },
  { nama_lengkap: 'FATHURROCHMAN ROZIQ', jabatan: 'Anggota Sekbid 7', kelas: 'X A', divisi: 'Sekbid_7', deskripsi: 'Kelas X A', urutan: 56 },
  { nama_lengkap: 'AINA RAHMA AULIA', jabatan: 'Anggota Sekbid 7', kelas: 'XI D', divisi: 'Sekbid_7', deskripsi: 'Kelas XI D', urutan: 57 },

  // Sekbid 8: Komunikasi dan Informasi
  { nama_lengkap: 'MUHAMMAD SYARIF ATTABI', jabatan: 'Koordinator Sekbid 8', kelas: 'XI B', divisi: 'Sekbid_8', deskripsi: 'Kelas XI B', urutan: 58 },
  { nama_lengkap: 'NAMIRA PUTRI FACHRUDDIN', jabatan: 'Sekretaris Sekbid 8', kelas: 'XI D', divisi: 'Sekbid_8', deskripsi: 'Kelas XI D', urutan: 59 },
  { nama_lengkap: 'RHESA ADILFI DARMA S.', jabatan: 'Anggota Sekbid 8', kelas: 'XI C', divisi: 'Sekbid_8', deskripsi: 'Kelas XI C', urutan: 60 },
  { nama_lengkap: 'LAILA KHUSFI ZAHRANI', jabatan: 'Anggota Sekbid 8', kelas: 'X E', divisi: 'Sekbid_8', deskripsi: 'Kelas X E', urutan: 61 },
  { nama_lengkap: 'MUHAMMAD FAHMI RAMADHANI F.', jabatan: 'Anggota Sekbid 8', kelas: 'X A', divisi: 'Sekbid_8', deskripsi: 'Kelas X A', urutan: 62 },
  { nama_lengkap: 'FIRJATULLAH AR-RIZQU SYAKIRA H.', jabatan: 'Anggota Sekbid 8', kelas: 'X A', divisi: 'Sekbid_8', deskripsi: 'Kelas X A', urutan: 63 },
  { nama_lengkap: 'RIZKI NUR MUZAKI PARNO PUTRA', jabatan: 'Anggota Sekbid 8', kelas: 'X B', divisi: 'Sekbid_8', deskripsi: 'Kelas X B', urutan: 64 },
  { nama_lengkap: 'KEISHA CLEO RUSTANDI', jabatan: 'Anggota Sekbid 8', kelas: 'X D', divisi: 'Sekbid_8', deskripsi: 'Kelas X D', urutan: 65 },
];

// ============================================
// Data: Event (from LatestEvent.tsx)
// ============================================
const eventData = [
  {
    nama: 'EDUFEST - INFINITY',
    slug: 'edufest-infinity',
    deskripsi: 'Edufest merupakan event tahunan yang dilaksanakan oleh SMA IT Fithrah Insani dan SMK Informatika Fithrah Insani yang berisi kegiatan perlombaan untuk mewadahi bakat kreatif Siswa/i SMP/MTs sederajat dalam bidang Pendidikan dan Teknologi, serta melatih meningkatkan kepedulian terhadap sesama manusia melalui kegiatan amal.',
    kategori: 'eksternal',
    status: 'published',
    tema: 'Ketakterbatasan Potensi Bakat Remaja',
    tagline: 'Growing Talents Beyond Infinity',
  },
];

// ============================================
// Seed Functions
// ============================================
async function getAdminJWT(): Promise<string> {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Admin login failed: ${response.status} - ${error}`);
  }

  const data: any = await response.json();
  return data.data.token;
}

async function apiCall(jwt: string, endpoint: string, method: string, body?: any): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
  };

  const options: RequestInit = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.text();
    console.error(`API Error [${method} ${endpoint}]: ${response.status} - ${error}`);
    return null;
  }

  return response.json();
}

async function seedSekbid(jwt: string): Promise<Map<number, number>> {
  console.log('\n📁 Seeding Sekbid...');
  const sekbidMap = new Map<number, number>(); // nomor -> strapi id

  for (const sekbid of sekbidData) {
    const result: any = await apiCall(jwt, '/api/sekbids', 'POST', { data: sekbid });
    if (result && result.data) {
      sekbidMap.set(sekbid.nomor, result.data.id);
      console.log(`  ✅ Sekbid ${sekbid.nomor}: ${sekbid.judul} (ID: ${result.data.id})`);
    } else {
      console.log(`  ❌ Failed: ${sekbid.judul}`);
    }
  }

  return sekbidMap;
}

async function seedAnggota(jwt: string): Promise<Map<string, number>> {
  console.log('\n👥 Seeding Anggota OSIS...');
  const anggotaMap = new Map<string, number>(); // nama -> strapi id

  for (const anggota of anggotaData) {
    const result = await apiCall(jwt, '/api/anggota-oses', 'POST', {
      data: {
        ...anggota,
        periode: '2025-2026',
        status_aktif: 'aktif',
      },
    });
    if (result) {
      anggotaMap.set(anggota.nama_lengkap, result.data.id);
      console.log(`  ✅ ${anggota.nama_lengkap} — ${anggota.jabatan}`);
    } else {
      console.log(`  ❌ Failed: ${anggota.nama_lengkap}`);
    }
  }

  return anggotaMap;
}

async function seedProgramKerja(jwt: string, sekbidMap: Map<number, number>): Promise<void> {
  console.log('\n📋 Seeding Program Kerja...');

  for (const pk of programKerjaData) {
    const sekbidId = sekbidMap.get(pk.sekbid_nomor);

    const payload: any = {
      judul: pk.judul,
      slug: pk.slug,
      kategori: pk.kategori,
      tujuan: pk.tujuan,
      teknis_pelaksanaan: pk.teknis_pelaksanaan,
      evaluasi_deskripsi: pk.evaluasi_deskripsi,
      evaluasi_form_url: pk.evaluasi_form_url,
      bg_color: pk.bg_color,
      icon_color: pk.icon_color,
      tujuan_detail: pk.tujuan_detail,
      ketua_nama: pk.ketua_nama,
      ketua_jabatan: pk.ketua_jabatan,
      status: 'published',
    };

    if (sekbidId) {
      payload.sekbid = sekbidId;
    }

    const result = await apiCall(jwt, '/api/program-kerjas', 'POST', { data: payload });
    if (result) {
      console.log(`  ✅ [Sekbid ${pk.sekbid_nomor}] ${pk.judul}`);
    } else {
      console.log(`  ❌ Failed: ${pk.judul}`);
    }
  }
}

async function seedEvents(jwt: string): Promise<void> {
  console.log('\n🎉 Seeding Events...');

  for (const event of eventData) {
    const result = await apiCall(jwt, '/api/events', 'POST', { data: event });
    if (result) {
      console.log(`  ✅ ${event.nama}`);
    } else {
      console.log(`  ❌ Failed: ${event.nama}`);
    }
  }
}

const halamanData = [
  {
    nama_halaman: 'Beranda (Home)',
    slug: 'home',
    judul_hero: 'AGORA ACTA 2025',
    sub_judul: 'Organisasi Siswa Intra Sekolah SMAIT Fithrah Insani.',
    deskripsi: 'Agora Acta bukan sekadar organisasi, melainkan ruang bersama tempat ide bertumbuh, kolaborasi terjadi, dan setiap kegiatan dihadirkan dengan tujuan yang nyata.',
    seo_title: 'Beranda - OSIS SMAIT Fithrah Insani',
    seo_description: 'Official Portal OSIS SMAIT Fithrah Insani - Agora Acta 2025.',
  },
  {
    nama_halaman: 'Tentang Kami (About)',
    slug: 'about',
    judul_hero: 'TENTANG AGORA ACTA',
    sub_judul: 'Ruang Bersama untuk Tindakan Nyata dan Berdampak',
    deskripsi: 'Mengenal filosofi nama Agora Acta, makna simbol logo OSIS, serta pengurus inti BPH yang menggerakkan organisasi.',
    seo_title: 'Tentang Kami - OSIS SMAIT Fithrah Insani',
    seo_description: 'Profil dan filosofi OSIS SMAIT Fithrah Insani.',
  },
  {
    nama_halaman: 'Program Kerja',
    slug: 'program-kerja',
    judul_hero: 'PROGRAM KERJA OSIS',
    sub_judul: 'Inisiatif, Rencana, dan Aksi Nyata 8 Seksi Bidang',
    deskripsi: 'Daftar program kerja rutin dan insidental seluruh seksi bidang OSIS SMAIT Fithrah Insani.',
    seo_title: 'Program Kerja - OSIS SMAIT Fithrah Insani',
    seo_description: 'Program kerja 8 Sekbid OSIS SMAIT Fithrah Insani.',
  },
  {
    nama_halaman: 'Anggota OSIS',
    slug: 'anggota',
    judul_hero: 'Meet The\nAgira Acta\nTeam',
    sub_judul: 'Para pemimpin muda yang berdedikasi, kreatif,\ndan siap membawa perubahan positif untuk\nSMAIT Fithrah Insani.',
    deskripsi: 'Daftar pengurus BPH, kepala departemen, dan Sekbid OSIS SMAIT Fithrah Insani.',
    seo_title: 'Anggota OSIS - OSIS SMAIT Fithrah Insani',
    seo_description: 'Mengenal lebih dekat pengurus inti, kepala departemen, dan seksi bidang OSIS SMAIT Fithrah Insani.',
  },
  {
    nama_halaman: 'Media Sosial',
    slug: 'media-sosial',
    judul_hero: 'MEDIA SOSIAL HUB',
    sub_judul: 'Pusat Informasi dan Konten Digital OSIS',
    deskripsi: 'Kanal media sosial resmi Instagram, TikTok, YouTube, dan Spotify OSIS SMAIT Fithrah Insani.',
    seo_title: 'Media Sosial - OSIS SMAIT Fithrah Insani',
    seo_description: 'Kanal media sosial resmi OSIS SMAIT Fithrah Insani.',
    metadata_json: {
      social_accounts: {
        instagram: { name: 'Osis SMAIT FI', handle: '@osissmaitfi', followers: '1,203', link: 'https://www.instagram.com/osissmaitfi' },
        tiktok: { name: 'Osis SMAIT FI', handle: '@osissmaitfi', followers: '144', link: 'https://www.tiktok.com/@osissmaitfi' },
        youtube: { name: 'SMAIT Fithrah Insani', handle: '@osissmaitfithrahinsani9481', followers: '267', link: 'https://www.youtube.com/@osissmaitfithrahinsani9481' },
        spotify: { name: 'Agora Talk', handle: 'OSIS Podcast', followers: '436', link: 'https://spotify.com' }
      },
      embeds: {
        youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        spotify: 'https://open.spotify.com/episode/3Zg0z8C6f1z',
        tiktok: '',
        instagram: ''
      }
    }
  },
  {
    nama_halaman: 'Galeri Foto',
    slug: 'galeri',
    judul_hero: 'GALERI FOTO DOKUMENTASI',
    sub_judul: 'Merekam Setiap Momen dan Jejak Positif Kegiatan',
    deskripsi: 'Dokumentasi foto kegiatan dan event OSIS SMAIT Fithrah Insani.',
    seo_title: 'Galeri Foto - OSIS SMAIT Fithrah Insani',
    seo_description: 'Galeri foto dokumentasi kegiatan OSIS SMAIT Fithrah Insani.',
  },
];

async function seedHalaman(jwt: string): Promise<void> {
  console.log('\n📄 Seeding 5 Halaman Utama...');

  for (const hal of halamanData) {
    const result = await apiCall(jwt, '/api/halamans', 'POST', { data: hal });
    if (result) {
      console.log(`  ✅ [Halaman] ${hal.nama_halaman} (${hal.slug})`);
    } else {
      console.log(`  ❌ Failed: ${hal.nama_halaman}`);
    }
  }
}

// ============================================
// Main
// ============================================
async function main() {
  console.log('🚀 OSIS Agora Acta CMS — Seed Script');
  console.log('=====================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Admin: ${ADMIN_EMAIL}`);
  console.log('');

  try {
    // 1. Get admin JWT
    console.log('🔑 Logging in as admin...');
    const jwt = await getAdminJWT();
    console.log('  ✅ Admin login successful');

    // 2. Seed Sekbid first (needed for relations)
    const sekbidMap = await seedSekbid(jwt);

    // 3. Seed Anggota OSIS
    const anggotaMap = await seedAnggota(jwt);

    // 4. Seed Program Kerja (with Sekbid relations)
    await seedProgramKerja(jwt, sekbidMap);

    // 5. Seed Events
    await seedEvents(jwt);

    // 6. Seed Halaman Utama
    await seedHalaman(jwt);

    console.log('\n=====================================');
    console.log('🎉 Seeding completed!');
    console.log(`  📁 Sekbid: ${sekbidMap.size} items`);
    console.log(`  👥 Anggota: ${anggotaMap.size} items`);
    console.log(`  📋 Program Kerja: ${programKerjaData.length} items`);
    console.log(`  🎉 Events: ${eventData.length} items`);
    console.log(`  📄 Halaman Utama: ${halamanData.length} items`);
    console.log('=====================================\n');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();

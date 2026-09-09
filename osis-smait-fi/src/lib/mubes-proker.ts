import { fetchStrapiAPI, getStrapiMediaUrl } from './strapi';

export interface MubesLpjData {
  id?: number | string;
  documentId?: string;
  realisasi_anggaran?: number | string;
  sumber_dana?: string;
  evaluasi_internal?: string;
  kendala_solusi?: Array<{ kendala?: string; solusi?: string }> | string | null;
  nota_kwitansi?: any[];
  status_pengesahan?: 'draft' | 'ditinjau' | 'disahkan';
}

export interface MubesPenanggungJawab {
  nama_lengkap?: string;
  jabatan?: string;
}

export interface MubesProgramKerja {
  id: number | string;
  documentId?: string;
  judul: string;
  slug: string;
  kategori: 'rutin' | 'insidental';
  tujuan?: string;
  golongan_target?: string;
  teknis_pelaksanaan?: string;
  evaluasi_form_url?: string;
  evaluasi_deskripsi?: string;
  lokasi?: string;
  status?: string;
  banner_image?: any;
  dokumentasi?: any[];
  sekbid_nomor?: number;
  sekbid_judul?: string;
  sekbid_nama?: string;
  penanggung_jawab?: MubesPenanggungJawab[];
  lpj?: MubesLpjData | null;
}

export interface MubesSekbidGroup {
  nomor: number;
  judul: string;
  deskripsi?: string;
  prokerList: MubesProgramKerja[];
}

export const DEFAULT_SEKBIDS_META: Record<number, { judul: string; deskripsi: string }> = {
  1: { judul: 'Kerohanian', deskripsi: 'Pembinaan keimanan, ketakwaan, dan ibadah.' },
  2: { judul: 'Kaderisasi', deskripsi: 'Kedisiplinan, kepemimpinan, dan tata tertib.' },
  3: { judul: 'Edukasi', deskripsi: 'Pengembangan potensi akademik dan riset ilmiah.' },
  4: { judul: 'Bahasa', deskripsi: 'Pengembangan literasi, bilingual, dan sastra.' },
  5: { judul: 'Minat & Bakat', deskripsi: 'Wadah apresiasi seni, olahraga, dan kreativitas.' },
  6: { judul: 'Kesehatan & Lingkungan', deskripsi: 'Kebersihan, kelestarian alam, dan kesehatan.' },
  7: { judul: 'Kewirausahaan', deskripsi: 'Kemandirian finansial dan ekonomi kreatif.' },
  8: { judul: 'Komunikasi & Informasi', deskripsi: 'Komunikasi media publikasi, dokumentasi, dan teknologi.' },
};

/**
 * Static fallback program kerja data when Strapi is offline or empty.
 */
export const FALLBACK_MUBES_PROKER: MubesProgramKerja[] = [
  // Sekbid 1: Kerohanian
  {
    id: 118515,
    judul: 'Tilawah OSIS (TILSIS)',
    slug: 'tilawah-osis',
    kategori: 'rutin',
    tujuan: "Membantu seluruh pengurus OSIS menambah dan memperlancar bacaan tilawah Al-Qur'an.",
    teknis_pelaksanaan: 'Tilawah dilakukan setiap hari sejak pagi, kehadiran dicatat via Google Form, direkap tiap sekbid secara berkala (triwulan).',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 1,
    sekbid_judul: 'Kerohanian',
  },
  {
    id: 118516,
    judul: 'Hadist of the Week (HOTW)',
    slug: 'hadist-of-the-week',
    kategori: 'rutin',
    tujuan: 'Mengenalkan hadits-hadits pilihan kepada siswa/i agar dapat diamalkan sehari-hari.',
    teknis_pelaksanaan: 'Hadits disampaikan lewat radio sekolah setiap Jumat, kadang disertai broadcast voice note ke grup kelas.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 1,
    sekbid_judul: 'Kerohanian',
  },
  {
    id: 118517,
    judul: 'Pendampingan Rohis',
    slug: 'pendampingan-rohis',
    kategori: 'rutin',
    tujuan: 'Menumbuhkan semangat religius dan kepedulian sosial siswa lewat kegiatan keagamaan rutin.',
    teknis_pelaksanaan: 'Al-Kahfi setiap Jumat pagi saat pengkondisian; infak dikumpulkan tiap hari saat Dzuhur; Islamic of the Month dan sesi keakhwatan tiap pekan ke-4.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 1,
    sekbid_judul: 'Kerohanian',
  },
  {
    id: 118518,
    judul: 'Takhosus',
    slug: 'takhosus',
    kategori: 'rutin',
    tujuan: "Menambah dan menguatkan hafalan Al-Qur'an siswa/i secara intensif.",
    teknis_pelaksanaan: 'Dilaksanakan Selasa–Kamis pukul 06.30–07.00 di masjid, dengan pendataan kehadiran per sesi.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 1,
    sekbid_judul: 'Kerohanian',
  },
  {
    id: 118519,
    judul: 'Kultum',
    slug: 'kultum',
    kategori: 'rutin',
    tujuan: 'Menambah wawasan keagamaan siswa/i sekaligus melatih rasa percaya diri.',
    teknis_pelaksanaan: 'Dilaksanakan setiap hari (Senin–Jumat, Jumat khusus akhwat), masing-masing dengan tema harian berbeda.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 1,
    sekbid_judul: 'Kerohanian',
  },
  {
    id: 118520,
    judul: 'PHBI (Peringatan Hari Besar Islam)',
    slug: 'phbi',
    kategori: 'insidental',
    tujuan: "Memperingati dan menghayati hari-hari besar Islam (Maulid Nabi, Isra Mi'raj, Idul Fitri, Idul Adha, Muharram) untuk memperkuat keimanan dan ketakwaan siswa/i.",
    teknis_pelaksanaan: 'Dilaksanakan sesuai kalender hari besar Islam, dengan rangkaian acara ceramah, lomba, dan kegiatan keagamaan lainnya.',
    lokasi: 'SMAIT FITHRAH INSANI',
    sekbid_nomor: 1,
    sekbid_judul: 'Kerohanian',
  },
  {
    id: 118521,
    judul: 'Ramadhan Ceria',
    slug: 'ramadhan-ceria',
    kategori: 'insidental',
    tujuan: 'Menumbuhkan pemahaman keislaman serta sikap kebersamaan dan kepedulian sosial siswa/i selama bulan Ramadhan.',
    teknis_pelaksanaan: 'Diisi kegiatan bernuansa Ramadhan dan lingkungan.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 1,
    sekbid_judul: 'Kerohanian',
  },

  // Sekbid 2: Kaderisasi
  {
    id: 118522,
    judul: 'Sidak Tata Tertib (STT)',
    slug: 'sidak-tata-tertib',
    kategori: 'rutin',
    tujuan: 'Menguatkan karakter disiplin dan tanggung jawab anggota OSIS.',
    teknis_pelaksanaan: 'Sidak dilakukan Sekbid 2 sebelum rapat OSIS.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 2,
    sekbid_judul: 'Kaderisasi',
  },
  {
    id: 118523,
    judul: 'Class of Discipline (COD)',
    slug: 'class-of-discipline',
    kategori: 'rutin',
    tujuan: 'Mengapresiasi siswa/i yang taat pada peraturan sekolah.',
    teknis_pelaksanaan: 'Merekap data pelanggaran bulanan.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 2,
    sekbid_judul: 'Kaderisasi',
  },
  {
    id: 118524,
    judul: 'Kompas OSIS',
    slug: 'kompas-osis',
    kategori: 'rutin',
    tujuan: 'Menjadikan seluruh anggota OSIS lebih disiplin dan patuh pada peraturan sekolah.',
    teknis_pelaksanaan: 'Pemeriksaan atribut pengurus OSIS.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 2,
    sekbid_judul: 'Kaderisasi',
  },
  {
    id: 118525,
    judul: 'Piket Kedisiplinan',
    slug: 'piket-kedisiplinan',
    kategori: 'rutin',
    tujuan: 'Menertibkan siswa/i terkait kerapian, atribut, dan ketepatan waktu.',
    teknis_pelaksanaan: 'Piket setiap hari di titik-titik gedung.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 2,
    sekbid_judul: 'Kaderisasi',
  },
  {
    id: 118526,
    judul: 'PHBN (Peringatan Hari Besar Nasional)',
    slug: 'phbn',
    kategori: 'insidental',
    tujuan: 'Menjadikan siswa/i lebih menghormati dan mengapresiasi jasa guru.',
    teknis_pelaksanaan: 'Acara sehari penuh dengan kepanitiaan lengkap.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 2,
    sekbid_judul: 'Kaderisasi',
  },
  {
    id: 118527,
    judul: 'Bakti Sosial (Baksos)',
    slug: 'bakti-sosial',
    kategori: 'insidental',
    tujuan: 'Melatih siswa/i untuk berempati dan berbagi dengan sesama.',
    teknis_pelaksanaan: 'Penggalangan dana insidental.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 2,
    sekbid_judul: 'Kaderisasi',
    lpj: {
      id: 2,
      realisasi_anggaran: 1,
      sumber_dana: 'Kas OSIS & Swadaya',
      evaluasi_internal: 'Laporan penyaluran dana telah disusun dan diverifikasi panitia.',
      status_pengesahan: 'draft',
    },
  },

  // Sekbid 3: Edukasi
  {
    id: 118528,
    judul: 'Notifikasi Edukasi',
    slug: 'notifikasi-edukasi',
    kategori: 'rutin',
    tujuan: 'Menjadi wadah bagi siswa/i SMAIT Fithrah Insani untuk memperoleh informasi seputar beasiswa, lomba-lomba Pendidikan, serta berbagai peluang akademik lainnya.',
    teknis_pelaksanaan: 'Info disebar lewat poster digital dan mading.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 3,
    sekbid_judul: 'Edukasi',
  },
  {
    id: 118529,
    judul: 'Study Club',
    slug: 'study-club',
    kategori: 'rutin',
    tujuan: 'Meningkatkan pemahaman akademik siswa/i serta membantu mempersiapkan ujian PTS/PAS melalui pembahasan soal bersama guru mata pelajaran.',
    teknis_pelaksanaan: 'Dilaksanakan H-1 setiap ujian.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 3,
    sekbid_judul: 'Edukasi',
  },
  {
    id: 118530,
    judul: 'Two Minutes Class',
    slug: 'two-minutes-class',
    kategori: 'rutin',
    tujuan: 'Meningkatkan pemahaman materi pelajaran siswa/i melalui konten fun fact atau tips and trick pembelajaran yang mudah diakses.',
    teknis_pelaksanaan: 'Video ± 2 menit diunggah ke Instagram & TikTok OSIS.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 3,
    sekbid_judul: 'Edukasi',
  },
  {
    id: 118531,
    judul: 'Hari Pendidikan',
    slug: 'hari-pendidikan',
    kategori: 'insidental',
    tujuan: 'Memperingati Hari Pendidikan Nasional serta meningkatkan kesadaran akan pentingnya pendidikan melalui publikasi poster dan konten edukatif.',
    teknis_pelaksanaan: 'Rangkaian kegiatan edukasi.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 3,
    sekbid_judul: 'Edukasi',
  },
  {
    id: 118532,
    judul: 'University Day x Fi Flick — Enchanted Path',
    slug: 'university-day',
    kategori: 'insidental',
    tujuan: 'Memberikan informasi kepada siswa/i mengenai berbagai pilihan perguruan tinggi.',
    teknis_pelaksanaan: 'Parade kampus, sharing alumni, dan booth foto.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 3,
    sekbid_judul: 'Edukasi',
  },

  // Sekbid 4: Bahasa
  {
    id: 118533,
    judul: 'Write Your Ideas (WYI)',
    slug: 'write-your-ideas',
    kategori: 'rutin',
    tujuan: 'Wadah mengasah keterampilan menulis karya sastra.',
    teknis_pelaksanaan: 'Sayembara menulis bulanan.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 4,
    sekbid_judul: 'Bahasa',
  },
  {
    id: 118534,
    judul: 'Suara Sastra',
    slug: 'suara-sastra',
    kategori: 'rutin',
    tujuan: 'Memperluas wawasan literasi lewat podcast.',
    teknis_pelaksanaan: 'Podcast bulanan wawancara pemenang WYI.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 4,
    sekbid_judul: 'Bahasa',
  },
  {
    id: 118535,
    judul: 'Enlightment Trip (ET)',
    slug: 'enlightment-trip',
    kategori: 'rutin',
    tujuan: 'Keterampilan literasi lewat membaca dan kuis.',
    teknis_pelaksanaan: 'Kuis Quizizz tiap Kamis.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 4,
    sekbid_judul: 'Bahasa',
  },
  {
    id: 118536,
    judul: 'Quotes of the Month (QOTM)',
    slug: 'quotes-of-the-month',
    kategori: 'rutin',
    tujuan: 'Kutipan inspiratif bulanan.',
    teknis_pelaksanaan: 'Kutipan inspiratif di Instagram.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 4,
    sekbid_judul: 'Bahasa',
  },
  {
    id: 118559,
    judul: 'Hari Buku',
    slug: 'hari-buku',
    kategori: 'insidental',
    tujuan: 'Meningkatkan partisipasi siswa dalam kegiatan literasi sekolah melalui program Book Swap dan The Human Blurb.',
    teknis_pelaksanaan: 'Book Swap dan pameran buku di perpustakaan sekolah.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 4,
    sekbid_judul: 'Bahasa',
  },
  {
    id: 118560,
    judul: 'Multi Language Competition (ULTI)',
    slug: 'ulti-multi-language',
    kategori: 'insidental',
    tujuan: 'Melatih kemampuan multibahasa (Arab, Inggris, Indonesia) siswa/i melalui ajang kompetisi.',
    teknis_pelaksanaan: 'Lomba pidato 3 bahasa, story telling, dan cerdas cermat kebahasaan.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 4,
    sekbid_judul: 'Bahasa',
  },

  // Sekbid 5: Minat & Bakat
  {
    id: 118537,
    judul: 'Ourself Journey (OJ)',
    slug: 'ourself-journey',
    kategori: 'rutin',
    tujuan: 'Memahami diri dan potensi.',
    teknis_pelaksanaan: 'Konten refleksi diri digital.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 5,
    sekbid_judul: 'Minat & Bakat',
  },
  {
    id: 118538,
    judul: 'Talent Showcase',
    slug: 'talent-showcase',
    kategori: 'rutin',
    tujuan: 'Menyediakan panggung dan fasilitas bagi peserta untuk mengasah dan menampilkan bakat serta meningkatkan kepercayaan diri.',
    teknis_pelaksanaan: 'Showcase bakat rutin.',
    lokasi: 'SMAIT Fithrah Insani',
    sekbid_nomor: 5,
    sekbid_judul: 'Minat & Bakat',
  },
  {
    id: 118539,
    judul: 'Classmeet x Market Day — Dynamite',
    slug: 'classmeet',
    kategori: 'insidental',
    tujuan: 'Memberi ruang bagi siswa berkembang melalui kompetisi olahraga, seni, dan pengalaman berwirausaha.',
    teknis_pelaksanaan: 'Lomba olahraga dan pentas seni antar kelas setelah ujian semester.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 5,
    sekbid_judul: 'Minat & Bakat',
  },
  {
    id: 118549,
    judul: 'Raga dan Nada',
    slug: 'program-kerja',
    kategori: 'rutin',
    tujuan: 'Membantu meningkatkan pemahaman siswa/i mengenai materi yang berkaitan dalam bidang olahraga dan seni.',
    teknis_pelaksanaan: 'Menyiarkan materi kesenian melalui radio TU dan juga membuat video edukasi seni/olahraga.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 5,
    sekbid_judul: 'Minat & Bakat',
  },
  {
    id: 118550,
    judul: 'The Rising Talent',
    slug: 'The-Rising-Talent',
    kategori: 'rutin',
    tujuan: 'Memberikan informasi lomba-lomba non akademik untuk para siswa/i.',
    teknis_pelaksanaan: 'Menyebarkan poster informasi lomba non-akademik melalui story Instagram dan mading sekolah.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 5,
    sekbid_judul: 'Minat & Bakat',
  },

  // Sekbid 6: Kesehatan & Lingkungan
  {
    id: 118540,
    judul: 'Cleaning Day',
    slug: 'cleaning-day',
    kategori: 'rutin',
    tujuan: 'Menumbuhkan kesadaran warga sekolah akan pentingnya menjaga kebersihan lingkungan dan melatih kerja sama.',
    teknis_pelaksanaan: 'Pada hari Jumat pagi siswa/i diarahkan untuk membersihkan lingkungan sekolah pada titik yang ditentukan.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },
  {
    id: 118541,
    judul: 'Healthy Movement',
    slug: 'healthy-movement',
    kategori: 'rutin',
    tujuan: 'Menumbuhkan kesadaran pentingnya menjaga kesehatan tubuh melalui olahraga dan senam rutin.',
    teknis_pelaksanaan: 'Siswa/i berkumpul di lapangan untuk mengikuti senam yang dipandu pengurus OSIS di panggung.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },
  {
    id: 118551,
    judul: 'Healthy Day',
    slug: 'Healthy-Day',
    kategori: 'insidental',
    tujuan: 'Meningkatkan kesadaran siswa tentang pentingnya kesehatan fisik dan mental.',
    teknis_pelaksanaan: 'Pemeriksaan kesehatan dasar, seminar pola hidup bersih, dan konsultasi kesehatan berkala.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },
  {
    id: 118552,
    judul: 'Nutrition Day',
    slug: 'Nutrition-day',
    kategori: 'insidental',
    tujuan: 'Meningkatkan kesadaran siswa/i terhadap pentingnya asupan gizi yang seimbang.',
    teknis_pelaksanaan: 'Sosialisasi menu gizi seimbang dan sarapan buah bersama.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },
  {
    id: 118553,
    judul: 'Breakfast Time',
    slug: 'Breakfast-Time',
    kategori: 'rutin',
    tujuan: 'Mengedukasi kepada siswa/i bahwa sarapan adalah bagian dari pola hidup sehat.',
    teknis_pelaksanaan: 'Siswa/i menyantap sarapan bersama yang sudah ditentukan sebelumnya sambil mendengarkan edukasi gizi.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },
  {
    id: 118554,
    judul: 'Health Report',
    slug: 'Health-Report',
    kategori: 'rutin',
    tujuan: 'Memberikan informasi terkini dan relevan seputar kesehatan dan lingkungan kepada warga sekolah.',
    teknis_pelaksanaan: 'Membuat video edukasi mengenai kesehatan dan lingkungan untuk kanal media sosial OSIS.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },
  {
    id: 118555,
    judul: 'Healthy Station',
    slug: 'healthy-station',
    kategori: 'rutin',
    tujuan: 'Meningkatkan pelayanan kesehatan sekolah melalui pengelolaan UKS yang tertata dan siap digunakan, serta pendataan kartu haid.',
    teknis_pelaksanaan: 'Memberi pertolongan pertama kepada siswa/i di UKS dan membagikan kartu haid siswi.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },
  {
    id: 118562,
    judul: 'Environment Day',
    slug: 'environment-day',
    kategori: 'insidental',
    tujuan: 'Mengetahui cara mendaur ulang sampah menjadi barang berguna dan mengurangi volume limbah plastik sekolah.',
    teknis_pelaksanaan: 'Workshop daur ulang sampah plastik menjadi pot tanaman dan bank sampah mandiri.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 6,
    sekbid_judul: 'Kesehatan & Lingkungan',
  },

  // Sekbid 7: Kewirausahaan
  {
    id: 118542,
    judul: 'Weekly Market',
    slug: 'weekly-market',
    kategori: 'rutin',
    tujuan: 'Melatih kemampuan berwirausaha, keberanian berniaga, dan manajemen keuangan mandiri.',
    teknis_pelaksanaan: 'Pengurus OSIS bergantian menjual produk makanan, minuman, dan custom merchandise di lingkungan sekolah.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 7,
    sekbid_judul: 'Kewirausahaan',
  },
  {
    id: 118543,
    judul: 'Ngobrol Bisnis (NGOBISS)',
    slug: 'ngobrol-bisnis',
    kategori: 'rutin',
    tujuan: 'Meningkatkan minat berwirausaha generasi muda langsung dari pengalaman pengusaha sukses.',
    teknis_pelaksanaan: 'Dilaksanakan setiap hari Jumat minggu keempat: video tips sukses wawancara wirausahawan ke Reels, serta sharing alumni.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 7,
    sekbid_judul: 'Kewirausahaan',
  },
  {
    id: 118556,
    judul: 'Direct Marketing',
    slug: 'Direct-Marketing',
    kategori: 'insidental',
    tujuan: 'Menumbuhkan jiwa kewirausahaan dan kemampuan komunikasi langsung dengan konsumen di ruang publik.',
    teknis_pelaksanaan: 'Penjualan produk langsung di area publik (Lapangan Brigif & Lapangan Pakusarakan).',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 7,
    sekbid_judul: 'Kewirausahaan',
  },
  {
    id: 118557,
    judul: 'Fi Flick x University Day',
    slug: 'FI-Flick',
    kategori: 'insidental',
    tujuan: 'Memberikan informasi perguruan tinggi sekaligus peluang stan wirausaha siswa.',
    teknis_pelaksanaan: 'Parade kampus, sharing alumni, dan booth bazar makanan/merchandise.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 7,
    sekbid_judul: 'Kewirausahaan',
  },
  {
    id: 118558,
    judul: 'Market Day x Classmeet',
    slug: 'Market-Day',
    kategori: 'insidental',
    tujuan: 'Melatih siswa berwirausaha secara nyata berbarengan dengan ajang sportivitas classmeet.',
    teknis_pelaksanaan: 'Bazar kewirausahaan stan per kelas saat berlangsungnya perlombaan classmeet.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 7,
    sekbid_judul: 'Kewirausahaan',
  },

  // Sekbid 8: Komunikasi & Informasi
  {
    id: 118544,
    judul: 'School Announcement',
    slug: 'school-announcement',
    kategori: 'rutin',
    tujuan: 'Mengenalkan aktivitas harian serta menyampaikan perkembangan terkini kegiatan sekolah melalui media resmi yang mudah diakses.',
    teknis_pelaksanaan: 'Pembuatan poster dan video konten publikasi kegiatan sekolah.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 8,
    sekbid_judul: 'Komunikasi & Informasi',
  },
  {
    id: 118545,
    judul: 'SiteStream',
    slug: 'sites-stream',
    kategori: 'rutin',
    tujuan: 'Menjadi wadah portal digital OSIS SMAIT Fithrah Insani yang dapat diakses oleh warga sekolah maupun publik.',
    teknis_pelaksanaan: 'Pengembangan, pemeliharaan, dan pembaruan berkala portal website resmi OSIS.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 8,
    sekbid_judul: 'Komunikasi & Informasi',
  },
  {
    id: 118546,
    judul: 'Pengelolaan Sosial Media',
    slug: 'social-media',
    kategori: 'rutin',
    tujuan: 'Meningkatkan jangkauan dan efektivitas publikasi seluruh kegiatan OSIS melalui media sosial Instagram & TikTok.',
    teknis_pelaksanaan: 'Penyusunan jadwal rilis konten mingguan, desain grafis feed/story, dan produksi short video.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 8,
    sekbid_judul: 'Komunikasi & Informasi',
  },
  {
    id: 118547,
    judul: 'Majalah Dinding (Mading)',
    slug: 'mading',
    kategori: 'rutin',
    tujuan: 'Menumbuhkan minat, kreativitas, dan literasi siswa melalui media offline yang edukatif dan inspiratif.',
    teknis_pelaksanaan: 'Pembaruan tema dan karya mading sekolah setiap bulan.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 8,
    sekbid_judul: 'Komunikasi & Informasi',
  },
  {
    id: 118548,
    judul: 'Studio OSIS',
    slug: 'studio-osis',
    kategori: 'rutin',
    tujuan: 'Mendukung kebutuhan visual, foto, dan editing konten seluruh seksi bidang OSIS secara profesional.',
    teknis_pelaksanaan: 'Dokumentasi visual acara, live streaming, dan penyediaan aset kreatif terpusat.',
    lokasi: 'SMA IT FITHRAH INSANI',
    sekbid_nomor: 8,
    sekbid_judul: 'Komunikasi & Informasi',
  },
];

/**
 * Builds groups for Sekbid 1 - 8 from a flat list of MubesProgramKerja.
 */
export function buildSekbidGroups(
  prokerList: MubesProgramKerja[],
  sekbidMetaList: any[] = []
): MubesSekbidGroup[] {
  const groupedMap: Record<number, MubesProgramKerja[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
  };

  prokerList.forEach((proker) => {
    let num = proker.sekbid_nomor || 1;
    if (num < 1 || num > 8) num = 1;
    if (!groupedMap[num]) groupedMap[num] = [];
    groupedMap[num].push(proker);
  });

  const result: MubesSekbidGroup[] = [];
  for (let num = 1; num <= 8; num++) {
    const matchedSekbid = sekbidMetaList.find((s: any) => {
      const sAttr = s.attributes || s;
      return sAttr.nomor === num;
    });
    const sAttr = matchedSekbid?.attributes || matchedSekbid;
    result.push({
      nomor: num,
      judul: sAttr?.judul || DEFAULT_SEKBIDS_META[num]?.judul || `Sekbid ${num}`,
      deskripsi: sAttr?.deskripsi || DEFAULT_SEKBIDS_META[num]?.deskripsi || '',
      prokerList: groupedMap[num] || [],
    });
  }

  return result;
}

/**
 * Normalizes raw Strapi Program Kerja item into typed MubesProgramKerja.
 */
function normalizeProgramKerja(item: any, lpjByProker: Map<string, MubesLpjData>): MubesProgramKerja {
  const attrs = item.attributes || item;

  // Extract Sekbid info
  const sekbidRel = attrs.sekbid?.data || attrs.sekbid;
  let sekbidNum = 1;
  let sekbidJudul = DEFAULT_SEKBIDS_META[1].judul;

  if (Array.isArray(sekbidRel) && sekbidRel.length > 0) {
    const s = sekbidRel[0].attributes || sekbidRel[0];
    sekbidNum = s.nomor || 1;
    sekbidJudul = s.judul || DEFAULT_SEKBIDS_META[sekbidNum]?.judul || '';
  } else if (sekbidRel && typeof sekbidRel === 'object') {
    const s = sekbidRel.attributes || sekbidRel;
    sekbidNum = s.nomor || 1;
    sekbidJudul = s.judul || DEFAULT_SEKBIDS_META[sekbidNum]?.judul || '';
  }

  // Extract Penanggung Jawab
  const pjList: MubesPenanggungJawab[] = [];
  const rawPj = attrs.penanggung_jawab?.data || attrs.penanggung_jawab;
  if (Array.isArray(rawPj)) {
    rawPj.forEach((p: any) => {
      const pAttr = p.attributes || p;
      pjList.push({
        nama_lengkap: pAttr.nama_lengkap || pAttr.nama,
        jabatan: pAttr.jabatan,
      });
    });
  }

  // Match LPJ
  const pId = String(item.id || item.documentId || '');
  const pDocId = item.documentId ? String(item.documentId) : '';
  const pSlug = attrs.slug || '';
  const matchedLpj =
    (pId ? lpjByProker.get(pId) : null) ||
    (pDocId ? lpjByProker.get(pDocId) : null) ||
    (pSlug ? lpjByProker.get(pSlug) : null) ||
    null;

  return {
    id: item.id,
    documentId: item.documentId,
    judul: attrs.judul || 'Program Kerja',
    slug: attrs.slug || `proker-${item.id}`,
    kategori: attrs.kategori === 'insidental' ? 'insidental' : 'rutin',
    tujuan: attrs.tujuan || undefined,
    golongan_target: attrs.golongan_target || undefined,
    teknis_pelaksanaan: attrs.teknis_pelaksanaan || attrs.deskripsi || 'Sesuai dengan SOP dan petunjuk teknis sekbid.',
    evaluasi_form_url: attrs.evaluasi_form_url || undefined,
    evaluasi_deskripsi: attrs.evaluasi_deskripsi || undefined,
    lokasi: attrs.lokasi || 'SMAIT Fithrah Insani',
    status: attrs.status || 'published',
    banner_image: attrs.banner_image,
    dokumentasi: attrs.dokumentasi?.data || attrs.dokumentasi || [],
    sekbid_nomor: sekbidNum,
    sekbid_judul: sekbidJudul,
    penanggung_jawab: pjList,
    lpj: matchedLpj,
  };
}

/**
 * Normalizes raw Strapi LPJ item into typed MubesLpjData.
 */
function normalizeLpj(item: any): { prokerKeys: string[]; lpjData: MubesLpjData } {
  const attrs = item.attributes || item;
  const pkRel = attrs.program_kerja?.data || attrs.program_kerja;
  const prokerKeys: string[] = [];

  if (pkRel) {
    if (pkRel.id) prokerKeys.push(String(pkRel.id));
    if (pkRel.documentId) prokerKeys.push(String(pkRel.documentId));
    const pkAttrs = pkRel.attributes || pkRel;
    if (pkAttrs.slug) prokerKeys.push(String(pkAttrs.slug));
  }

  const lpjData: MubesLpjData = {
    id: item.id,
    documentId: item.documentId,
    realisasi_anggaran: attrs.realisasi_anggaran,
    sumber_dana: attrs.sumber_dana,
    evaluasi_internal: attrs.evaluasi_internal,
    kendala_solusi: attrs.kendala_solusi,
    nota_kwitansi: attrs.nota_kwitansi?.data || attrs.nota_kwitansi || [],
    status_pengesahan: attrs.status_pengesahan || 'draft',
  };

  return { prokerKeys, lpjData };
}

/**
 * Main helper function to fetch complete program-kerja list with relations and LPJ data.
 * Returns grouped Sekbid 1 - 8 with graceful static fallback if Strapi is empty or offline.
 */
export async function fetchMubesProkerList(): Promise<MubesSekbidGroup[]> {
  const elevatedToken = process.env.STRAPI_ELEVATED_TOKEN;
  const authHeaders = elevatedToken ? { Authorization: `Bearer ${elevatedToken}` } : undefined;

  try {
    const [prokerRes, lpjRes, sekbidRes]: [any, any, any] = await Promise.all([
      fetchStrapiAPI('/api/program-kerjas?populate=*&pagination[limit]=100', {
        headers: authHeaders,
      }).catch(() => null),
      fetchStrapiAPI('/api/mubes-lpjs?populate=*&pagination[limit]=100', {
        headers: authHeaders,
      }).catch(() => null),
      fetchStrapiAPI('/api/sekbids?populate=*&sort=nomor:asc', {
        headers: authHeaders,
      }).catch(() => null),
    ]);

    const prokerData = prokerRes?.data || [];
    const lpjList = lpjRes?.data || [];
    const sekbidList = sekbidRes?.data || [];

    // If Strapi returns no proker data (down or unseeded), use static fallback
    if (prokerData.length === 0) {
      console.warn('[MUBES Proker] Strapi returned 0 program kerja. Using static fallback dataset.');
      return buildSekbidGroups(FALLBACK_MUBES_PROKER, sekbidList);
    }

    // Index LPJ data by proker id, documentId, and slug
    const lpjByProker = new Map<string, MubesLpjData>();
    lpjList.forEach((rawLpj: any) => {
      const { prokerKeys, lpjData } = normalizeLpj(rawLpj);
      prokerKeys.forEach((key) => lpjByProker.set(key, lpjData));
    });

    // Normalize all program kerja records
    const normalizedProkers: MubesProgramKerja[] = prokerData.map((rawProker: any) =>
      normalizeProgramKerja(rawProker, lpjByProker)
    );

    // Group by Sekbid 1 - 8
    return buildSekbidGroups(normalizedProkers, sekbidList);
  } catch (err) {
    console.error('[MUBES Proker] Unexpected error fetching proker list:', err);
    return buildSekbidGroups(FALLBACK_MUBES_PROKER);
  }
}

/**
 * Backward compatibility alias for fetchMubesProkerList.
 */
export const fetchMubesProkerData = fetchMubesProkerList;

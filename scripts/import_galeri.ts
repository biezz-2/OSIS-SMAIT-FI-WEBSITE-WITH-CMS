import axios from 'axios';
import fs from 'fs';

const STRAPI_URL = 'https://osisstrapi.biezz.my.id';
const API_TOKEN = 'REPLACE_WITH_ACTUAL_TOKEN'; // User needs to provide or I need to find it

const data = [
  {
    "sekbid": 1,
    "judul": "PHBI (Peringatan Hari Besar Islam)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Payung kegiatan peringatan hari besar Islam: Maulid Nabi, Isra Mi'raj, Idul Fitri, Idul Adha, Muharram. Proposal per sub-acara belum diunggah di Drive — detail perlu dilengkapi manual."
  },
  {
    "sekbid": 1,
    "judul": "One Day One Juz",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Program tilawah harian. Proposal belum diunggah di Drive — detail perlu dilengkapi manual."
  },
  {
    "sekbid": 1,
    "judul": "Ramadhan Ceria - Pohon Kurma",
    "kategori": "kegiatan",
    "tanggal": "2026-03-01",
    "deskripsi": "Gabungan dengan Baksos Sekbid 2. Menumbuhkan pemahaman keislaman serta kebersamaan dan kepedulian sosial selama Ramadhan. Dilaksanakan 2 hari (Maret 2026), mencakup kegiatan bernuansa Ramadhan dan lingkungan (tagline 'Dari Ramadhan, Untuk Bumi'), zakat fitrah, kajian, dan Mabit."
  },
  {
    "sekbid": 1,
    "judul": "Tilawah OSIS (TILSIS)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Program rutin harian membantu pengurus OSIS menambah dan memperlancar bacaan tilawah Al-Qur'an. Kehadiran dicatat via Google Form, direkap tiap sekbid per triwulan."
  },
  {
    "sekbid": 1,
    "judul": "Hadist of the Week (HOTW)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Mengenalkan hadits pilihan dari kitab Arbain An-Nawawi lewat radio sekolah setiap Jumat pagi (±06.20-06.40)."
  },
  {
    "sekbid": 1,
    "judul": "Pendampingan Rohis",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Menumbuhkan semangat religius dan kepedulian sosial lewat Al-Kahfi (Jumat pagi), pengelolaan infak harian, Islamic of the Month, dan sesi keakhwatan tiap pekan ke-4."
  },
  {
    "sekbid": 1,
    "judul": "Takhosus",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Menambah dan menguatkan hafalan Al-Qur'an secara intensif, Selasa-Kamis pukul 06.30-07.00 di masjid."
  },
  {
    "sekbid": 1,
    "judul": "Kultum",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Ceramah singkat bergilir oleh siswa/i setiap hari kerja (Jumat khusus akhwat), tema berjenjang akhlak/ibadah/adab."
  },
  {
    "sekbid": 2,
    "judul": "PHBN - Hari Guru (Guidelight)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Sub-acara payung PHBN untuk menghormati dan mengapresiasi jasa guru. Acara sehari penuh (07.00-13.30) dengan kepanitiaan lengkap."
  },
  {
    "sekbid": 2,
    "judul": "Baksos (Bakti Sosial)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Penggalangan dana lewat kotak bakti sosial untuk disalurkan kepada yang membutuhkan; dilaksanakan bersamaan Ramadhan Ceria."
  },
  {
    "sekbid": 2,
    "judul": "Sidak Tata Tertib (STT)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Pemeriksaan atribut seragam, kerapian, dan barang bawaan yang melanggar aturan, dilakukan berkala sebelum rapat OSIS."
  },
  {
    "sekbid": 2,
    "judul": "Class of Discipline (COD)",
    "kategori": "prestasi",
    "tanggal": null,
    "deskripsi": "Mengapresiasi siswa/i dengan pelanggaran paling sedikit berdasarkan rekap data pelanggaran bulanan."
  },
  {
    "sekbid": 2,
    "judul": "Kompas OSIS",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Pemeriksaan atribut pengurus OSIS sendiri (dasi, topi, manset, kerudung) agar menjadi teladan kedisiplinan, biasanya setelah apel atau saat rapat."
  },
  {
    "sekbid": 2,
    "judul": "Piket Kedisiplinan",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Piket pagi memeriksa atribut dan keterlambatan, piket siang mengawal sholat Dzuhur berjamaah. Setiap hari mulai 06.00 kecuali libur/PTS-PAS."
  },
  {
    "sekbid": 3,
    "judul": "Hari Pendidikan",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Proposal belum diunggah di Drive, baru ada dokumentasi konten media sosial — detail perlu dilengkapi manual."
  },
  {
    "sekbid": 3,
    "judul": "University Day x Fi Flick - Enchanted Path",
    "kategori": "kegiatan",
    "tanggal": "2026-01-01",
    "deskripsi": "Gabungan dengan Fi Flick (Sekbid 7). Sharing pengalaman kuliah dari alumni dipadukan photobooth. Dilaksanakan 2 hari (Januari 2026) dengan parade kampus dan booth foto."
  },
  {
    "sekbid": 3,
    "judul": "Notifikasi Edukasi",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Wadah informasi beasiswa, lomba, dan peluang akademik lewat poster digital (Instagram), poster fisik mading, dan video pendek."
  },
  {
    "sekbid": 3,
    "judul": "Study Club",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Pembahasan kisi-kisi/soal bersama guru mata pelajaran H-1 setiap ujian (PTS/PAS)."
  },
  {
    "sekbid": 3,
    "judul": "Two Minutes Class",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Video singkat ±2 menit berisi fun fact/tips belajar bersama guru mapel, diunggah ke Instagram & TikTok OSIS sebulan sekali pukul 18.00."
  },
  {
    "sekbid": 4,
    "judul": "Hari Buku",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Proposal belum berhasil diakses isinya di Drive — detail perlu dilengkapi manual."
  },
  {
    "sekbid": 4,
    "judul": "Multi Language Competition (ULTI)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Proposal belum berhasil diakses isinya di Drive — detail perlu dilengkapi manual."
  },
  {
    "sekbid": 4,
    "judul": "Write Your Ideas (WYI)",
    "kategori": "kegiatan",
    "tanggal": "2026-04-03",
    "deskripsi": "Wadah anak muda menampilkan karya sastra. Siklus 4 tahap per bulan: poster tema, pengumuman sayembara, upload karya ke Instagram, pengumuman pemenang (dinilai dari likes)."
  },
  {
    "sekbid": 4,
    "judul": "Suara Sastra",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Podcast wawancara pemenang Write Your Ideas untuk memperluas wawasan literasi, dipublikasikan tiap 1-2 minggu."
  },
  {
    "sekbid": 4,
    "judul": "Enlightment Trip (ET)",
    "kategori": "kegiatan",
    "tanggal": "2026-04-07",
    "deskripsi": "Siswa/i membaca jurnal/cerpen lalu mengerjakan Quizizz yang dibagikan OSIS untuk membekali keterampilan literasi. Dilaksanakan tiap Selasa."
  },
  {
    "sekbid": 4,
    "judul": "Quotes of the Month (QOTM)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Kutipan inspiratif dari film/lagu diunggah 2x sebulan (minggu ke-2 dan ke-4) di Instagram/TikTok OSIS."
  },
  {
    "sekbid": 5,
    "judul": "Classmeet x Market Day - Dynamite",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Gabungan dengan Market Day (Sekbid 7). Classmeet: kompetisi non-akademik (olahraga, e-sport). Market Day: pengenalan kewirausahaan. Dilaksanakan 2 hari, kepanitiaan lintas bidang."
  },
  {
    "sekbid": 5,
    "judul": "Ourself Journey (OJ)",
    "kategori": "kegiatan",
    "tanggal": "2025-12-05",
    "deskripsi": "Membantu siswa/i memahami diri, minat, dan potensi. Rotasi mingguan: konten TikTok, sticky note board, siaran radio, dan kuesioner dengan tema berbeda tiap pekan."
  },
  {
    "sekbid": 5,
    "judul": "Talent Showcase",
    "kategori": "prestasi",
    "tanggal": null,
    "deskripsi": "Panggung/fasilitas bagi siswa mengasah dan menampilkan bakat, jalur offline (panggung lapangan) dan online (reels Instagram), bergiliran tiap pekan."
  },
  {
    "sekbid": 5,
    "judul": "Raga & Nada",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Materi olahraga (radio TU) dan seni (reels Instagram) bergantian tiap minggu, disiarkan setiap Kamis."
  },
  {
    "sekbid": 5,
    "judul": "The Rising Talent",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Informasi lomba non-akademik lewat poster, disebar via story Instagram, mading, dan pengumuman radio begitu ada info lomba baru."
  },
  {
    "sekbid": 6,
    "judul": "Environment Day",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Edukasi daur ulang sampah (mis. pot dari plastik bekas) untuk meningkatkan kepedulian lingkungan sekolah. Kegiatan sehari."
  },
  {
    "sekbid": 6,
    "judul": "Healthy Day",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Meningkatkan kesadaran kesehatan fisik dan mental siswa sebagai dasar produktivitas dan kualitas belajar. Dilaksanakan sehari."
  },
  {
    "sekbid": 6,
    "judul": "Nutrition Day - Nutrify",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Mengacu panduan 'Isi Piringku' Kemenkes, menyasar kelas 10-11 di kelas masing-masing, pagi hari 06.45-07.00."
  },
  {
    "sekbid": 6,
    "judul": "Cleaning Day",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Pembersihan area sekolah bersama, tiap titik ditangani dua kelas bergantian, setiap Jumat pagi."
  },
  {
    "sekbid": 6,
    "judul": "Health Report",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Video/poster edukasi kesehatan (mitos-fakta, cara cuci tangan, dll.) diunggah ke Instagram kurang lebih 2 minggu sekali."
  },
  {
    "sekbid": 6,
    "judul": "Breakfast Time",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Mengedukasi pentingnya sarapan sebagai pola hidup sehat, diselipkan materi edukasi saat siswa menyantap makanan di kelas."
  },
  {
    "sekbid": 6,
    "judul": "Healthy Station",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Pengelolaan UKS (obat-obatan, pertolongan pertama) dan program kartu haid untuk kesehatan reproduksi siswi, piket harian."
  },
  {
    "sekbid": 6,
    "judul": "Healthy Movement",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Senam bersama di lapangan dipandu OSIS dari panggung, rutin tiap Rabu."
  },
  {
    "sekbid": 7,
    "judul": "Direct Marketing",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Penjualan takjil langsung ke masyarakat selama Ramadan sebagai praktik nyata kewirausahaan dan komunikasi langsung."
  },
  {
    "sekbid": 7,
    "judul": "Market Day (bagian dari Dynamite)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Bagian dari 'Dynamite' bersama Classmeet Sekbid 5 — pengenalan proses kewirausahaan dari penyiapan produk sampai penjualan."
  },
  {
    "sekbid": 7,
    "judul": "Fi Flick (bagian dari Enchanted Path)",
    "kategori": "dokumentasi",
    "tanggal": null,
    "deskripsi": "Bagian dari 'Enchanted Path' bersama University Day Sekbid 3 — photobooth sebagai sarana dokumentasi dan kenangan."
  },
  {
    "sekbid": 7,
    "judul": "Ngobrol Bisnis (NGOBISS)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Wawancara pengusaha sukses diunggah ke Reels Instagram, diselingi seminar kewirausahaan; sebulan sekali (minggu ke-4)."
  },
  {
    "sekbid": 7,
    "judul": "Weekly Market",
    "kategori": "kegiatan",
    "tanggal": "2025-11-18",
    "deskripsi": "Menjual makanan, minuman, dan merchandise custom kepada warga sekolah untuk melatih wirausaha dan menambah dana OSIS. Dilaksanakan 2x seminggu (Selasa & Jumat)."
  },
  {
    "sekbid": 8,
    "judul": "School Announcement",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Menyampaikan informasi kegiatan sekolah terbaru lewat poster digital dan video konten, jadwal fleksibel."
  },
  {
    "sekbid": 8,
    "judul": "SiteStream",
    "kategori": "dokumentasi",
    "tanggal": null,
    "deskripsi": "Wadah informasi resmi OSIS lewat website sekolah — struktur, jabatan, program kerja, dan kegiatan OSIS secara lengkap."
  },
  {
    "sekbid": 8,
    "judul": "Pengelolaan Sosial Media",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Jadwal unggahan konten tiap sekbid terstruktur (Selasa-Sabtu per sekbid tertentu) agar kegiatan dan prestasi siswa cepat diketahui."
  },
  {
    "sekbid": 8,
    "judul": "Majalah Dinding (Mading)",
    "kategori": "kegiatan",
    "tanggal": null,
    "deskripsi": "Mading kelas (wajib tiap kelas, bergilir 2 minggu) dan mading OSIS berisi info program kerja sekbid lain."
  },
  {
    "sekbid": 8,
    "judul": "Studio OSIS",
    "kategori": "dokumentasi",
    "tanggal": null,
    "deskripsi": "Mendukung seluruh sekbid dalam pembuatan konten visual (video/poster) program kerja; bahan mentah dikirim maks. 3 hari sebelum tenggat."
  }
];

async function createEntries() {
  console.log('Starting entry creation...');
  
  for (const item of data) {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/galeri-fotos`, {
        data: {
          judul: item.judul,
          deskripsi: item.deskripsi,
          tanggal: item.tanggal,
          kategori: item.kategori,
        }
      }, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        }
      });
      console.log(`Successfully created: ${item.judul}`);
    } catch (error) {
      console.error(`Failed to create ${item.judul}:`, error.response?.data || error.message);
    }
  }
  console.log('Finished processing all entries.');
}

createEntries();

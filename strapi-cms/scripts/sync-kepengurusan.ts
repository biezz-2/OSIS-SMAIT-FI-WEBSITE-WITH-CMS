import { createStrapi } from '@strapi/strapi';

interface MemberData {
  nama_lengkap: string;
  jabatan: string;
  kelas: string;
  divisi: 'BPH' | 'Sekbid_1' | 'Sekbid_2' | 'Sekbid_3' | 'Sekbid_4' | 'Sekbid_5' | 'Sekbid_6' | 'Sekbid_7' | 'Sekbid_8';
  sekbid_nomor?: number;
  urutan: number;
}

const sekbidList = [
  { nomor: 1, judul: 'Kerohanian', slug: 'sekbid-1' },
  { nomor: 2, judul: 'Kaderisasi', slug: 'sekbid-2' },
  { nomor: 3, judul: 'Edukasi', slug: 'sekbid-3' },
  { nomor: 4, judul: 'Bahasa', slug: 'sekbid-4' },
  { nomor: 5, judul: 'Minat dan Bakat', slug: 'sekbid-5' },
  { nomor: 6, judul: 'Kesehatan dan Lingkungan', slug: 'sekbid-6' },
  { nomor: 7, judul: 'Kewirausahaan', slug: 'sekbid-7' },
  { nomor: 8, judul: 'Komunikasi dan Informasi', slug: 'sekbid-8' },
];

const anggotaList: MemberData[] = [
  // Pengurus Inti (BPH)
  { nama_lengkap: 'SURYA SIGIT', jabatan: 'Ketua', kelas: 'XI B', divisi: 'BPH', urutan: 1 },
  { nama_lengkap: 'AISHA GHASSANI SHALIHA', jabatan: 'Wakil Ketua', kelas: 'XI D', divisi: 'BPH', urutan: 2 },
  { nama_lengkap: 'RIZKA RASYIDAH', jabatan: 'Sekretaris', kelas: 'XI E', divisi: 'BPH', urutan: 3 },
  { nama_lengkap: 'MUHAMMAD HAMMAM JUNDURRAHMAN', jabatan: 'Bendahara', kelas: 'XI B', divisi: 'BPH', urutan: 4 },

  // Sekbid 1: Kerohanian
  { nama_lengkap: 'ADHIENA ZAHRA RIZKYA', jabatan: 'Koordinator Sekbid 1', kelas: 'XI D', divisi: 'Sekbid_1', sekbid_nomor: 1, urutan: 5 },
  { nama_lengkap: 'VANESHA SESILLAWATI', jabatan: 'Sekretaris Sekbid 1', kelas: 'XI D', divisi: 'Sekbid_1', sekbid_nomor: 1, urutan: 6 },
  { nama_lengkap: 'AQILA AL HUMAIRA', jabatan: 'Anggota Sekbid 1', kelas: 'X F', divisi: 'Sekbid_1', sekbid_nomor: 1, urutan: 7 },
  { nama_lengkap: 'ZALFA NUR AFIFA ZAKAUHA', jabatan: 'Anggota Sekbid 1', kelas: 'X F', divisi: 'Sekbid_1', sekbid_nomor: 1, urutan: 8 },
  { nama_lengkap: 'AFIQOH DAYINI ATHAULLAH PURWANA', jabatan: 'Anggota Sekbid 1', kelas: 'X D', divisi: 'Sekbid_1', sekbid_nomor: 1, urutan: 9 },
  { nama_lengkap: 'MUHAMMAD HAIDAR AL AYYUBI', jabatan: 'Anggota Sekbid 1', kelas: 'X A', divisi: 'Sekbid_1', sekbid_nomor: 1, urutan: 10 },
  { nama_lengkap: 'MUHAMMAD FATHIAN AKBAR', jabatan: 'Anggota Sekbid 1', kelas: 'X A', divisi: 'Sekbid_1', sekbid_nomor: 1, urutan: 11 },

  // Sekbid 2: Kaderisasi
  { nama_lengkap: 'AHWAN M. KA’BAH', jabatan: 'Koordinator Sekbid 2', kelas: 'XI C', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 12 },
  { nama_lengkap: 'BANITA ALIYA ASROFA', jabatan: 'Sekretaris Sekbid 2', kelas: 'XI D', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 13 },
  { nama_lengkap: 'NAFEEZA KEYSYAKURA ALBANNA', jabatan: 'Anggota Sekbid 2', kelas: 'X E', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 14 },
  { nama_lengkap: 'YUSSIE YUKENNITA RAMADHANI', jabatan: 'Anggota Sekbid 2', kelas: 'X E', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 15 },
  { nama_lengkap: 'RAIHANAH GHINA ELTSURAYYA', jabatan: 'Anggota Sekbid 2', kelas: 'X F', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 16 },
  { nama_lengkap: 'RAY ZIBRIL RIDWAN', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 17 },
  { nama_lengkap: 'KHAIDAR MIFTAH BADRUZZAMAN', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 18 },
  { nama_lengkap: 'ANANDA P. PRATAMA', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', sekbid_nomor: 2, urutan: 19 },

  // Sekbid 3: Edukasi
  { nama_lengkap: 'MUHAMMAD AZZAM FIRDAUS', jabatan: 'Koordinator Sekbid 3', kelas: 'XI B', divisi: 'Sekbid_3', sekbid_nomor: 3, urutan: 20 },
  { nama_lengkap: 'SHYFA PUTRI AZZAHRA', jabatan: 'Sekretaris Sekbid 3', kelas: 'XI E', divisi: 'Sekbid_3', sekbid_nomor: 3, urutan: 21 },
  { nama_lengkap: 'ZAKI IBRAHIM AZIS', jabatan: 'Anggota Sekbid 3', kelas: 'X A', divisi: 'Sekbid_3', sekbid_nomor: 3, urutan: 22 },
  { nama_lengkap: 'PRANANDA RAMADHAN AHMAD', jabatan: 'Anggota Sekbid 3', kelas: 'X A', divisi: 'Sekbid_3', sekbid_nomor: 3, urutan: 23 },
  { nama_lengkap: 'SASKIA MEKA TADRIANA', jabatan: 'Anggota Sekbid 3', kelas: 'X E', divisi: 'Sekbid_3', sekbid_nomor: 3, urutan: 24 },
  { nama_lengkap: 'ALIYA MARWA RUWAIDA', jabatan: 'Anggota Sekbid 3', kelas: 'X E', divisi: 'Sekbid_3', sekbid_nomor: 3, urutan: 25 },
  { nama_lengkap: 'FATHIMAH TASLIMAH RAHMA FACHELFI', jabatan: 'Anggota Sekbid 3', kelas: 'X D', divisi: 'Sekbid_3', sekbid_nomor: 3, urutan: 26 },

  // Sekbid 4: Bahasa
  { nama_lengkap: 'MASAGUS HAFIDHUDDIN', jabatan: 'Koordinator Sekbid 4', kelas: 'XI B', divisi: 'Sekbid_4', sekbid_nomor: 4, urutan: 27 },
  { nama_lengkap: 'MUHAMMAD RIZKY TANTANA', jabatan: 'Sekretaris Sekbid 4', kelas: 'XI A', divisi: 'Sekbid_4', sekbid_nomor: 4, urutan: 28 },
  { nama_lengkap: 'THIFANI ARIFA KHILFA H.', jabatan: 'Anggota Sekbid 4', kelas: 'X F', divisi: 'Sekbid_4', sekbid_nomor: 4, urutan: 29 },
  { nama_lengkap: 'RAIHAN PUTRA ARIFANDRA', jabatan: 'Anggota Sekbid 4', kelas: 'X A', divisi: 'Sekbid_4', sekbid_nomor: 4, urutan: 30 },
  { nama_lengkap: 'ALUNA ADELIA PUTRI', jabatan: 'Anggota Sekbid 4', kelas: 'X D', divisi: 'Sekbid_4', sekbid_nomor: 4, urutan: 31 },
  { nama_lengkap: 'ACHMAD ANSHOR', jabatan: 'Anggota Sekbid 4', kelas: 'X C', divisi: 'Sekbid_4', sekbid_nomor: 4, urutan: 32 },
  { nama_lengkap: 'RAISSA ZALIKA SADINA', jabatan: 'Anggota Sekbid 4', kelas: 'X E', divisi: 'Sekbid_4', sekbid_nomor: 4, urutan: 33 },

  // Sekbid 5: Minat dan Bakat
  { nama_lengkap: 'JASMINE VANYA ABERKA', jabatan: 'Koordinator Sekbid 5', kelas: 'XI E', divisi: 'Sekbid_5', sekbid_nomor: 5, urutan: 34 },
  { nama_lengkap: 'IRSYAD ASHAVIN', jabatan: 'Sekretaris Sekbid 5', kelas: 'XI C', divisi: 'Sekbid_5', sekbid_nomor: 5, urutan: 35 },
  { nama_lengkap: 'AISYAH', jabatan: 'Anggota Sekbid 5', kelas: 'X D', divisi: 'Sekbid_5', sekbid_nomor: 5, urutan: 36 },
  { nama_lengkap: 'WANIA AULIYA RAMADHANI', jabatan: 'Anggota Sekbid 5', kelas: 'X E', divisi: 'Sekbid_5', sekbid_nomor: 5, urutan: 37 },
  { nama_lengkap: 'ADHWA NABILAH PUTRI MARSILAN', jabatan: 'Anggota Sekbid 5', kelas: 'X E', divisi: 'Sekbid_5', sekbid_nomor: 5, urutan: 38 },
  { nama_lengkap: 'KEANU REIVAN AGASHA', jabatan: 'Anggota Sekbid 5', kelas: 'X C', divisi: 'Sekbid_5', sekbid_nomor: 5, urutan: 39 },
  { nama_lengkap: 'ALFIAN PRAMUDYA', jabatan: 'Anggota Sekbid 5', kelas: 'X C', divisi: 'Sekbid_5', sekbid_nomor: 5, urutan: 40 },

  // Sekbid 6: Kesehatan dan Lingkungan
  { nama_lengkap: 'KEZZIA ANNISA SALSABILA', jabatan: 'Koordinator Sekbid 6', kelas: 'XI E', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 41 },
  { nama_lengkap: 'KAYYISA FATHIYYAH', jabatan: 'Sekretaris Sekbid 6', kelas: 'XI D', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 42 },
  { nama_lengkap: 'HANUM SALSABILA', jabatan: 'Anggota Sekbid 6', kelas: 'X E', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 43 },
  { nama_lengkap: 'RASHIKA RIZQUENA', jabatan: 'Anggota Sekbid 6', kelas: 'X E', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 44 },
  { nama_lengkap: 'REYFA SAFFA MAHESWARA', jabatan: 'Anggota Sekbid 6', kelas: 'X A', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 45 },
  { nama_lengkap: 'KEYSHA NAFIDHA ALMIRA GUNAWAN', jabatan: 'Anggota Sekbid 6', kelas: 'XI D', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 46 },
  { nama_lengkap: 'SYARLA SYAFANA DEWI', jabatan: 'Anggota Sekbid 6', kelas: 'X D', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 47 },
  { nama_lengkap: 'HADZIQ MAHFUZ MUHAMMAD', jabatan: 'Anggota Sekbid 6', kelas: 'X B', divisi: 'Sekbid_6', sekbid_nomor: 6, urutan: 48 },

  // Sekbid 7: Kewirausahaan
  { nama_lengkap: 'RAKEAN EKA LINGGA WARDANA', jabatan: 'Koordinator Sekbid 7', kelas: 'XI B', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 49 },
  { nama_lengkap: 'AZKARIN FIDELYA KHANSABIRA', jabatan: 'Sekretaris Sekbid 7', kelas: 'XI E', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 50 },
  { nama_lengkap: 'AFIYAH FITRI RAMADANI', jabatan: 'Anggota Sekbid 7', kelas: 'X F', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 51 },
  { nama_lengkap: 'ANAKIA MUNGGARANTI YUSAN', jabatan: 'Anggota Sekbid 7', kelas: 'XI E', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 52 },
  { nama_lengkap: 'RADYTIA NUR HIDAYAH', jabatan: 'Anggota Sekbid 7', kelas: 'X A', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 53 },
  { nama_lengkap: 'ZULFAN ARIFIN RUSTANDI', jabatan: 'Anggota Sekbid 7', kelas: 'X C', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 54 },
  { nama_lengkap: 'KHALISA KASIH ANINDYA KIRANI PUTRI', jabatan: 'Anggota Sekbid 7', kelas: 'X E', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 55 },
  { nama_lengkap: 'FATHURROCHMAN ROZIQ', jabatan: 'Anggota Sekbid 7', kelas: 'X A', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 56 },
  { nama_lengkap: 'AINA RAHMA AULIA', jabatan: 'Anggota Sekbid 7', kelas: 'XI D', divisi: 'Sekbid_7', sekbid_nomor: 7, urutan: 57 },

  // Sekbid 8: Komunikasi dan Informasi
  { nama_lengkap: 'MUHAMMAD SYARIF ATTABI', jabatan: 'Koordinator Sekbid 8', kelas: 'XI B', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 58 },
  { nama_lengkap: 'NAMIRA PUTRI FACHRUDDIN', jabatan: 'Sekretaris Sekbid 8', kelas: 'XI D', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 59 },
  { nama_lengkap: 'RHESA ADILFI DARMA S.', jabatan: 'Anggota Sekbid 8', kelas: 'XI C', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 60 },
  { nama_lengkap: 'LAILA KHUSFI ZAHRANI', jabatan: 'Anggota Sekbid 8', kelas: 'X E', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 61 },
  { nama_lengkap: 'MUHAMMAD FAHMI RAMADHANI F.', jabatan: 'Anggota Sekbid 8', kelas: 'X A', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 62 },
  { nama_lengkap: 'FIRJATULLAH AR-RIZQU SYAKIRA H.', jabatan: 'Anggota Sekbid 8', kelas: 'X A', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 63 },
  { nama_lengkap: 'RIZKI NUR MUZAKI PARNO PUTRA', jabatan: 'Anggota Sekbid 8', kelas: 'X B', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 64 },
  { nama_lengkap: 'KEISHA CLEO RUSTANDI', jabatan: 'Anggota Sekbid 8', kelas: 'X D', divisi: 'Sekbid_8', sekbid_nomor: 8, urutan: 65 },
];

async function main() {
  console.log('🔄 Bootstrapping Strapi CMS to sync kepengurusan data...');

  const app = await createStrapi({ distDir: './dist' }).load();

  try {
    const sekbidDocMap = new Map<number, any>();

    // 1. Sync / Update Sekbid items
    console.log('\n📁 Synchronizing Sekbids...');
    for (const item of sekbidList) {
      const existingSekbids = await app.documents('api::sekbid.sekbid').findMany({
        filters: { nomor: { $eq: item.nomor } },
      });

      let document;
      if (existingSekbids && existingSekbids.length > 0) {
        const target = existingSekbids[0];
        document = await app.documents('api::sekbid.sekbid').update({
          documentId: target.documentId,
          data: {
            judul: item.judul,
            slug: item.slug,
          },
          status: 'published',
        });
        console.log(`  ✏️ Updated Sekbid ${item.nomor}: ${item.judul}`);
      } else {
        document = await app.documents('api::sekbid.sekbid').create({
          data: {
            nomor: item.nomor,
            judul: item.judul,
            slug: item.slug,
            visi: `Visi Sekbid ${item.judul}`,
            deskripsi: `Seksi Bidang ${item.judul}`,
          },
          status: 'published',
        });
        console.log(`  ➕ Created Sekbid ${item.nomor}: ${item.judul}`);
      }
      sekbidDocMap.set(item.nomor, document);
    }

    // 2. Clear existing Anggota OSIS entries
    console.log('\n🗑️ Clearing old Anggota OSIS entries...');
    const oldAnggota = await app.documents('api::anggota-osis.anggota-osis').findMany({ limit: 500 });
    for (const member of oldAnggota) {
      await app.documents('api::anggota-osis.anggota-osis').delete({
        documentId: member.documentId,
      });
    }
    console.log(`  Deleted ${oldAnggota.length} old entries.`);

    // 3. Create new Anggota OSIS entries
    console.log('\n👥 Syncing new 65 Anggota OSIS entries...');
    let successCount = 0;
    for (const member of anggotaList) {
      const sekbidDoc = member.sekbid_nomor ? sekbidDocMap.get(member.sekbid_nomor) : undefined;
      
      const payload: any = {
        nama_lengkap: member.nama_lengkap,
        jabatan: member.jabatan,
        kelas: member.kelas,
        divisi: member.divisi,
        deskripsi: `Kelas ${member.kelas}`,
        periode: '2025-2026',
        status_aktif: 'aktif',
        urutan: member.urutan,
      };

      if (sekbidDoc) {
        payload.sekbid = sekbidDoc.documentId;
      }

      await app.documents('api::anggota-osis.anggota-osis').create({
        data: payload,
        status: 'published',
      });
      successCount++;
      console.log(`  ✅ [${member.urutan}/65] ${member.nama_lengkap} (${member.kelas}) - ${member.jabatan}`);
    }

    console.log(`\n🎉 Sync Completed! ${successCount} Anggota OSIS successfully added & published to Strapi CMS.`);
  } catch (error) {
    console.error('❌ Error during synchronization:', error);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

main();

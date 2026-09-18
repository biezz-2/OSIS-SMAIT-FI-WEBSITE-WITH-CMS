import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProgramKerja from '@/components/program-kerja/ProgramKerja';
import { fetchHalamanFromStrapi, fetchAllSekbidsFromStrapi, formatSekbidList } from '@/lib/strapi';
import { getMubesAccess } from '@/lib/mubes-access';

const SeksiBidangGrid = nextDynamic(() => import('@/components/program-kerja/SeksiBidangGrid'));
const Footer = nextDynamic(() => import('@/components/Footer'));

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Program Kerja & Seksi Bidang | OSIS SMAIT Fithrah Insani (Agora Acta)',
  description: 'Daftar program kerja unggulan, seksi bidang (Sekbid), dan rencana strategis OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.',
  keywords: [
    'program kerja osis smait fi',
    'sekbid osis smait fithrah insani',
    'seksi bidang osis',
    'proker agora acta',
    'kegiatan osis smait fi'
  ],
  alternates: {
    canonical: '/program-kerja',
  },
  openGraph: {
    title: 'Program Kerja & Seksi Bidang | OSIS SMAIT Fithrah Insani (Agora Acta)',
    description: 'Daftar program kerja unggulan, seksi bidang (Sekbid), dan rencana strategis OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.',
    url: '/program-kerja',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Program Kerja & Seksi Bidang | OSIS SMAIT Fithrah Insani (Agora Acta)',
    description: 'Daftar program kerja unggulan, seksi bidang (Sekbid), dan rencana strategis OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.',
  },
};

export default async function ProgramKerjaPage() {
  // Cek otentikasi & status persetujuan MUBES
  // Jika user sudah login, signup, dan disetujui (approved), langsung redirect ke /program-kerja[mubes]
  const access = await getMubesAccess();
  if (access.allowed) {
    redirect('/program-kerja[mubes]');
  }

  const programKerjaData = await fetchHalamanFromStrapi('program-kerja');
  const rawSekbids = await fetchAllSekbidsFromStrapi();
  const sekbidList = formatSekbidList(rawSekbids);
  
  const attrs = programKerjaData?.attributes || programKerjaData;
  const quality = attrs?.compression_quality;
  const compress = attrs?.enable_compression;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ProgramKerja initialData={programKerjaData} />
      <SeksiBidangGrid initialSekbids={sekbidList} quality={quality} compress={compress} />
      <Footer />
    </main>
  );
}

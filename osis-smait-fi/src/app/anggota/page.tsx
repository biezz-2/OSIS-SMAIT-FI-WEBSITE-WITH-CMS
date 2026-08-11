import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { fetchHalamanFromStrapi, fetchAllAnggotaFromStrapi, fetchAllSekbidsFromStrapi } from '@/lib/strapi';

const AnggotaList = dynamic(() => import('@/components/anggota/AnggotaList'));
const Footer = dynamic(() => import('@/components/Footer'));

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchHalamanFromStrapi('anggota');
  const attrs = pageData?.attributes || pageData;

  return {
    title: attrs?.seo_title || 'Anggota OSIS - OSIS SMAIT Fithrah Insani',
    description: attrs?.seo_description || 'Mengenal lebih dekat pengurus inti, kepala departemen, dan seksi bidang OSIS SMAIT Fithrah Insani.',
  };
}

export default async function AnggotaPage() {
  const [halamanData, membersData, sekbidsData] = await Promise.all([
    fetchHalamanFromStrapi('anggota'),
    fetchAllAnggotaFromStrapi(),
    fetchAllSekbidsFromStrapi(),
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b0f17]">
      <Navbar />
      <AnggotaList
        initialHalamanData={halamanData}
        initialMembers={membersData}
        initialSekbids={sekbidsData}
      />
      <Footer />
    </main>
  );
}

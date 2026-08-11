import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ProgramKerja from '@/components/program-kerja/ProgramKerja';
import { fetchHalamanFromStrapi, fetchAllSekbidsFromStrapi, formatSekbidList } from '@/lib/strapi';

const SeksiBidangGrid = dynamic(() => import('@/components/program-kerja/SeksiBidangGrid'));
const Footer = dynamic(() => import('@/components/Footer'));

export const revalidate = 60;

export default async function ProgramKerjaPage() {
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

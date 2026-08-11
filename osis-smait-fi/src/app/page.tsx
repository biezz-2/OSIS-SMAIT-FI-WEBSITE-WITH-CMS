import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import { fetchHalamanFromStrapi } from '@/lib/strapi';

const LatestEvent = dynamic(() => import('@/components/home/LatestEvent'));
const Introduction = dynamic(() => import('@/components/home/Introduction'));
const Footer = dynamic(() => import('@/components/Footer'));

export const revalidate = 60; // ISR: revalidate every 60s instead of force-dynamic

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'OSIS SMAIT Fithrah Insani',
  alternateName: 'Agora Acta',
  url: 'https://osissmaitfithrahinsani.sch.id',
  logo: 'https://osissmaitfithrahinsani.sch.id/icon.png',
  sameAs: [
    'https://www.instagram.com/osissmaitfi',
    'https://www.youtube.com/@osissmaitfithrahinsani9481',
    'https://www.tiktok.com/@osissmaitfi'
  ],
  description: 'Website Resmi OSIS SMAIT Fithrah Insani (Agora Acta)'
};

export default async function Page() {
  const homeData = await fetchHalamanFromStrapi('home');

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero initialData={homeData} />
      <Introduction initialData={homeData} />
      <LatestEvent />
      <Footer />
    </main>
  );
}
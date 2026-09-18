import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import { fetchHalamanFromStrapi } from '@/lib/strapi';

const LatestEvent = dynamic(() => import('@/components/home/LatestEvent'));
const Introduction = dynamic(() => import('@/components/home/Introduction'));
const Footer = dynamic(() => import('@/components/Footer'));

export const revalidate = 10800; // ISR: revalidate setiap 3 jam

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://osissmaitfi.biezz.my.id';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': `${siteUrl}/#organization`,
      name: 'OSIS SMAIT Fithrah Insani',
      alternateName: [
        'OSIS SMA IT FI',
        'OSIS SMAIT FI',
        'Agora Acta',
        'OSIS FI',
        'SMA IT Fithrah Insani',
        'SMAIT Fithrah Insani'
      ],
      url: siteUrl,
      logo: `${siteUrl}/images/logo-osis.jpg`,
      image: `${siteUrl}/images/logo-osis.jpg`,
      telephone: '(022) 87808984',
      email: 'osissmaitfi@gmail.com',
      sameAs: [
        'https://www.instagram.com/osissmaitfi',
        'https://www.youtube.com/@osissmaitfithrahinsani9481',
        'https://www.tiktok.com/@osissmaitfi'
      ],
      description: 'Website Resmi OSIS SMA IT Fithrah Insani (OSIS SMAIT FI / Agora Acta) - Wadah kegiatan, program kerja, dan kepemimpinan siswa.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. H. Gofur No. 10 Tanimulya, Ngamprah',
        addressLocality: 'Bandung Barat',
        addressRegion: 'Jawa Barat',
        postalCode: '40552',
        addressCountry: 'ID'
      },
      parentOrganization: {
        '@type': 'HighSchool',
        name: 'SMAIT Fithrah Insani',
        url: 'https://smait.fithrahinsani.sch.id',
        telephone: '(022) 87808984',
        email: 'osissmaitfi@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jl. H. Gofur No. 10 Tanimulya, Ngamprah',
          addressLocality: 'Bandung Barat',
          addressRegion: 'Jawa Barat',
          postalCode: '40552',
          addressCountry: 'ID'
        }
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'OSIS SMA IT FI',
      alternateName: ['OSIS SMAIT FI', 'Agora Acta SMAIT FI', 'OSIS SMAIT Fithrah Insani'],
      publisher: {
        '@id': `${siteUrl}/#organization`
      },
      inLanguage: 'id-ID'
    }
  ]
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
      <LatestEvent initialHalamanData={homeData} />
      <Footer />
    </main>
  );
}
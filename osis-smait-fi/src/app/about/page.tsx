import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import AboutUs from '@/components/about/AboutUs';
import { fetchHalamanFromStrapi } from '@/lib/strapi';

const SymbolMeaning = dynamic(() => import('@/components/about/SymbolMeaning'));
const Footer = dynamic(() => import('@/components/Footer'));

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tentang Kami | OSIS SMAIT Fithrah Insani (Agora Acta)',
  description: 'Profil, visi misi, sejarah, dan struktur kepengurusan OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.',
  keywords: [
    'osis smait fi',
    'tentang osis smait fithrah insani',
    'visi misi osis smait fi',
    'struktur osis agora acta',
    'kepemimpinan siswa smait'
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Tentang Kami | OSIS SMAIT Fithrah Insani (Agora Acta)',
    description: 'Profil, visi misi, sejarah, dan struktur kepengurusan OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.',
    url: '/about',
    type: 'website',
  },
};

export default async function AboutPage() {
  const aboutData = await fetchHalamanFromStrapi('about');

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <AboutUs initialData={aboutData} />
      <SymbolMeaning initialData={aboutData} />
      <Footer />
    </main>
  );
}

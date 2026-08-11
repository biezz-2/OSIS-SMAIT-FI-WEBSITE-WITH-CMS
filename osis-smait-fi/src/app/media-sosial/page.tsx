import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import SosmedHub from '@/components/sosmed/SosmedHub';
import Footer from '@/components/Footer';
import { fetchHalamanFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Media Sosial - OSIS SMAIT Fithrah Insani',
  description: 'Hub media sosial resmi OSIS SMAIT Fithrah Insani. Ikuti perkembangan, karya, berita, dan momen seru kami di Instagram, TikTok, YouTube, dan Spotify.',
};

export default async function MediaSosialPage() {
  const pageData = await fetchHalamanFromStrapi('media-sosial');

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <SosmedHub initialData={pageData} />
      <Footer />
    </main>
  );
}


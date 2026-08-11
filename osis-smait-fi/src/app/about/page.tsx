import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import AboutUs from '@/components/about/AboutUs';
import { fetchHalamanFromStrapi } from '@/lib/strapi';

const SymbolMeaning = dynamic(() => import('@/components/about/SymbolMeaning'));
const Footer = dynamic(() => import('@/components/Footer'));

export const revalidate = 60;

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

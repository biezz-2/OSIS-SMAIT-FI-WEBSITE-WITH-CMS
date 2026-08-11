import React from 'react';
import SekbidDetail from '@/components/program-kerja/SekbidDetail';
import { fetchSekbidFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function Page() {
  const initialData = await fetchSekbidFromStrapi(8);
  return <SekbidDetail number={8} initialData={initialData} />;
}

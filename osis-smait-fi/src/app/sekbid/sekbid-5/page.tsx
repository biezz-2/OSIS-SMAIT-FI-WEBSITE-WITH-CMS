import React from 'react';
import SekbidDetail from '@/components/program-kerja/SekbidDetail';
import { fetchSekbidFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function Page() {
  const initialData = await fetchSekbidFromStrapi(5);
  return <SekbidDetail number={5} initialData={initialData} />;
}

import React from 'react';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function Page() {
  const initialData = await fetchProgramKerjaFromStrapi('raga-nada');
  return <ProgramKerjaDetailPage slug="raga-nada" initialData={initialData} />;
}

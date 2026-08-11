import React from 'react';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function Page() {
  const initialData = await fetchProgramKerjaFromStrapi('suara-sastra');
  return <ProgramKerjaDetailPage slug="suara-sastra" initialData={initialData} />;
}

import React from 'react';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function Page() {
  const initialData = await fetchProgramKerjaFromStrapi('ourself-journey');
  return <ProgramKerjaDetailPage slug="ourself-journey" initialData={initialData} />;
}

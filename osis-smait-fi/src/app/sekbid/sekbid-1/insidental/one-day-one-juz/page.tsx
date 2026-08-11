import React from 'react';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function Page() {
  const initialData = await fetchProgramKerjaFromStrapi('one-day-one-juz');
  return <ProgramKerjaDetailPage slug="one-day-one-juz" initialData={initialData} />;
}

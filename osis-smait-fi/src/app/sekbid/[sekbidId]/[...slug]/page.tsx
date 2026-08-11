import React from 'react';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function CatchAllProgramPage({
  params,
}: {
  params: Promise<{ sekbidId: string; slug: string[] }>;
}) {
  const { slug } = await params;
  const programSlug = slug && slug.length > 0 ? slug[slug.length - 1] : '';
  const initialData = programSlug ? await fetchProgramKerjaFromStrapi(programSlug) : null;
  return <ProgramKerjaDetailPage slug={programSlug} initialData={initialData} />;
}

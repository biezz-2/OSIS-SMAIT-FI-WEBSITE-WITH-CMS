import React from 'react';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi, fetchPublicProkerLpjHighlights } from '@/lib/strapi';

export const revalidate = 60;

export default async function CatchAllProgramPage({
  params,
}: {
  params: Promise<{ sekbidId: string; slug: string[] }>;
}) {
  const { slug } = await params;
  const programSlug = slug && slug.length > 0 ? slug[slug.length - 1] : '';
  const [initialData, initialLpjHighlights] = programSlug
    ? await Promise.all([
        fetchProgramKerjaFromStrapi(programSlug),
        fetchPublicProkerLpjHighlights(programSlug),
      ])
    : [null, null];
  return (
    <ProgramKerjaDetailPage
      slug={programSlug}
      initialData={initialData}
      initialLpjHighlights={initialLpjHighlights}
    />
  );
}

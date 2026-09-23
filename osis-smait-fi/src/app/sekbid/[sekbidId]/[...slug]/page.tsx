import React from 'react';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi, resolveProkerCapaianEvaluasi } from '@/lib/strapi';

export const revalidate = 60;

export default async function CatchAllProgramPage({
  params,
}: {
  params: Promise<{ sekbidId: string; slug: string[] }>;
}) {
  const { slug } = await params;
  const programSlug = slug && slug.length > 0 ? slug[slug.length - 1] : '';
  const initialData = programSlug ? await fetchProgramKerjaFromStrapi(programSlug) : null;
  const attrs = initialData ? initialData.attributes || initialData : null;
  const initialLpjHighlights = programSlug
    ? await resolveProkerCapaianEvaluasi(programSlug, attrs)
    : null;
  return (
    <ProgramKerjaDetailPage
      slug={programSlug}
      initialData={initialData}
      initialLpjHighlights={initialLpjHighlights}
    />
  );
}

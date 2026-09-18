import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';
import { getMubesAccess } from '@/lib/mubes-access';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchProgramKerjaFromStrapi(slug);
  if (!data) return {};

  const attrs = data.attributes || data;
  const judul = attrs.judul || 'Program Kerja';
  const deskripsi = attrs.deskripsi || attrs.tujuan || 'Detail Program Kerja OSIS SMAIT Fithrah Insani.';

  return {
    title: judul,
    description: deskripsi,
    alternates: {
      canonical: `/program-kerja/${slug}`,
    },
    openGraph: {
      title: `${judul} | OSIS SMAIT Fithrah Insani`,
      description: deskripsi,
      type: 'article',
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Cek otentikasi & status persetujuan MUBES
  // Jika user sudah login, signup, dan disetujui (approved), langsung redirect ke /program-kerja-mubes/[slug]
  const access = await getMubesAccess();
  if (access.allowed) {
    redirect(`/program-kerja-mubes/${slug}`);
  }

  const initialData = await fetchProgramKerjaFromStrapi(slug);
  return <ProgramKerjaDetailPage slug={slug} initialData={initialData} />;
}

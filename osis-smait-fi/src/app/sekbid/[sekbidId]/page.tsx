import React from 'react';
import { Metadata } from 'next';
import SekbidDetail from '@/components/program-kerja/SekbidDetail';
import { fetchSekbidFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sekbidId: string }>;
}): Promise<Metadata> {
  const { sekbidId } = await params;
  const numKey = parseInt(String(sekbidId).replace(/\D/g, ''), 10) || 1;
  const data = await fetchSekbidFromStrapi(numKey);
  if (!data) return {};

  const attrs = data.attributes || data;
  const judul = attrs.judul || `Seksi Bidang ${numKey}`;
  const deskripsi = attrs.deskripsi || attrs.visi || `Informasi dan program kerja Seksi Bidang ${numKey} OSIS SMAIT Fithrah Insani.`;

  return {
    title: judul,
    description: deskripsi,
    openGraph: {
      title: `${judul} | OSIS SMAIT Fithrah Insani`,
      description: deskripsi,
      type: 'profile',
    },
  };
}

export default async function DynamicSekbidPage({
  params,
}: {
  params: Promise<{ sekbidId: string }>;
}) {
  const { sekbidId } = await params;
  const numKey = parseInt(String(sekbidId).replace(/\D/g, ''), 10) || 1;
  const initialData = await fetchSekbidFromStrapi(numKey);
  return <SekbidDetail number={sekbidId} initialData={initialData} />;
}

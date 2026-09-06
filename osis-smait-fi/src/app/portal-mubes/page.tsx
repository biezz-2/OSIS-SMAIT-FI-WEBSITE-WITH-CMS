import { Metadata } from 'next';
import MubesPortalView from '@/components/mubes/MubesPortalView';

export const metadata: Metadata = {
  title: 'Portal Musyawarah Besar XXI | OSIS SMAIT Fithrah Insani',
  description: 'Gerbang resmi pertanggungjawaban kepengurusan OSIS SMAIT Fithrah Insani, evaluasi LPJ sekbid, dan pengesahan ketetapan sidang MUBES.',
};

export default async function PortalMubesPage({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const initialMode = params?.mode === 'signup' ? 'signup' : 'login';

  return <MubesPortalView initialMode={initialMode} />;
}

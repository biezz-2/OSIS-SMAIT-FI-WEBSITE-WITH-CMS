import { auth } from '@clerk/nextjs/server';

export interface MubesAccessResult {
  allowed: boolean;
  userId: string | null;
  role: 'member' | 'operator' | 'admin_pembina' | null;
  status: 'approved' | 'pending' | 'ditolak' | null;
}

export async function getMubesAccess(): Promise<MubesAccessResult> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { allowed: false, userId: null, role: null, status: null };
  }

  const metadata = (sessionClaims?.publicMetadata || {}) as {
    status?: string;
    role?: string;
  };

  const status = (metadata.status as any) || 'pending';
  const role = (metadata.role as any) || null;

  const isApproved = status === 'approved';
  const hasValidRole =
    role === 'admin' ||
    role === 'administrator' ||
    role === 'bph' ||
    role === 'member' ||
    role === 'operator' ||
    role === 'admin_pembina';

  return {
    allowed: isApproved && hasValidRole,
    userId,
    role,
    status,
  };
}

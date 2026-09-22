import { auth, clerkClient } from '@clerk/nextjs/server';

export interface MubesAccessResult {
  allowed: boolean;
  userId: string | null;
  role: string | null;
  status: 'approved' | 'pending' | 'ditolak' | null;
}

type MetaShape = { status?: string; role?: string };

function pickMeta(raw: unknown): MetaShape {
  if (!raw || typeof raw !== 'object') return {};
  return raw as MetaShape;
}

function hasMeta(m: MetaShape): boolean {
  return Boolean(m.status || m.role);
}

/** Baca status/role dari session claims (bentuk JWT bervariasi) atau fallback user API. */
async function resolveUserMeta(
  userId: string,
  sessionClaims: Record<string, unknown> | null
): Promise<MetaShape> {
  const claims = sessionClaims || {};
  const candidates = [
    pickMeta(claims.publicMetadata),
    pickMeta(claims.public_metadata),
    pickMeta(claims.metadata),
  ];

  for (const c of candidates) {
    if (hasMeta(c)) return c;
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return pickMeta(user.publicMetadata);
  } catch {
    return {};
  }
}

export async function getMubesAccess(): Promise<MubesAccessResult> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { allowed: false, userId: null, role: null, status: null };
  }

  const metadata = await resolveUserMeta(
    userId,
    (sessionClaims || null) as Record<string, unknown> | null
  );

  const status = (metadata.status as MubesAccessResult['status']) || 'pending';
  const role = metadata.role || null;

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

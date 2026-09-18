import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { syncUserOnAuth } from './auth-sync';
import { headers } from 'next/headers';

export interface MubesAccessResult {
  allowed: boolean;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  role: 'member' | 'operator' | 'admin_pembina' | 'admin' | 'administrator' | 'bph' | null;
  status: 'approved' | 'pending' | 'ditolak' | null;
}

export async function getMubesAccess(): Promise<MubesAccessResult> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return { allowed: false, userId: null, email: null, fullName: null, role: null, status: null };
    }

    let metadata = (sessionClaims?.publicMetadata || sessionClaims?.public_metadata || {}) as {
      status?: string;
      role?: string;
    };

    // 1. Ambil detail user Clerk untuk identitas & sinkronisasi
    let userDetails: any = null;
    try {
      userDetails = await currentUser();
    } catch (err: any) {
      console.warn('[getMubesAccess] Non-fatal currentUser check:', err?.message);
    }

    // 2. Jika metadata belum ada di session token, ambil dari Clerk API
    if (!metadata.status || !metadata.role) {
      try {
        const client = await clerkClient();
        const user = userDetails || (await client.users.getUser(userId));
        if (user?.publicMetadata) {
          metadata = user.publicMetadata as { status?: string; role?: string };
        }
      } catch (err: any) {
        console.warn('[getMubesAccess] Non-fatal user metadata check:', err?.message);
      }
    }

    const email =
      userDetails?.primaryEmailAddress?.emailAddress ||
      userDetails?.emailAddresses?.[0]?.emailAddress ||
      null;
    const fullName =
      `${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`.trim() ||
      userDetails?.username ||
      null;

    // 3. Otomatis sinkronkan profil user & audit login history ke Strapi
    try {
      const reqHeaders = await headers();
      const ip =
        reqHeaders.get('x-forwarded-for')?.split(',')[0].trim() ||
        reqHeaders.get('x-real-ip') ||
        '127.0.0.1';
      const userAgent = reqHeaders.get('user-agent') || '';
      const roleHint = (userDetails?.unsafeMetadata?.role as any) || (metadata.role as any) || null;

      const syncResult = await syncUserOnAuth({
        clerkUserId: userId,
        email: email || '',
        fullName: fullName || '',
        ipAddress: ip,
        userAgent,
        roleHint,
      });

      if (syncResult.role) {
        metadata.role = syncResult.role;
      }
      if (syncResult.status) {
        metadata.status = syncResult.status;
      }
    } catch (syncErr: any) {
      console.warn('[getMubesAccess] Non-fatal syncUserOnAuth warning:', syncErr?.message);
    }

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
      allowed: Boolean(isApproved && hasValidRole),
      userId,
      email,
      fullName,
      role,
      status,
    };
  } catch (globalErr: any) {
    console.error('[getMubesAccess] Unexpected error caught safely:', globalErr?.message);
    return {
      allowed: false,
      userId: null,
      email: null,
      fullName: null,
      role: null,
      status: null,
    };
  }
}

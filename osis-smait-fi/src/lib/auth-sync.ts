import { createClerkClient } from '@clerk/backend';

interface SyncUserInput {
  clerkUserId: string;
  email: string;
  fullName: string;
  ipAddress?: string;
  userAgent?: string;
  roleHint?: string | null;
}

interface SyncUserResult {
  role: 'member' | 'operator' | 'admin_pembina' | 'developer' | null;
  status: 'approved' | 'pending' | 'ditolak';
  matchedAnggotaId: number | null;
}

function normalizeRole(role: string | null | undefined): 'member' | 'operator' | 'admin_pembina' | 'developer' {
  if (!role) return 'member';
  const r = role.toLowerCase();
  if (r === 'developer' || r === 'dev' || r === 'superadmin') {
    return 'developer';
  }
  if (r === 'admin' || r === 'administrator' || r === 'admin_pembina' || r === 'pembina') {
    return 'admin_pembina';
  }
  if (r === 'operator' || r === 'bph') {
    return 'operator';
  }
  return 'member';
}

function getStrapiBaseUrl() {
  return (process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337').replace(/\/$/, '');
}

function getElevatedToken() {
  return process.env.STRAPI_ELEVATED_TOKEN || '';
}

function getClerkClient() {
  return createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
}

/**
 * Record a login audit event in Strapi (login_events collection).
 */
export async function recordLoginEvent(params: {
  identifier: string;
  clerkUserId?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}) {
  const elevatedToken = getElevatedToken();
  if (!elevatedToken) return;

  const strapiBaseUrl = getStrapiBaseUrl();
  try {
    await fetch(`${strapiBaseUrl}/api/login-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${elevatedToken}`,
      },
      body: JSON.stringify({
        data: {
          identifier: params.identifier || 'unknown',
          clerk_user_id: params.clerkUserId || null,
          ip_address: params.ipAddress || '127.0.0.1',
          success: params.success,
          user_agent: params.userAgent || '',
        },
      }),
    });
  } catch (err: any) {
    console.error('[recordLoginEvent] Error recording login event:', err?.message);
  }
}

/**
 * Sync user profile to Strapi `akses_users` and ensure Clerk publicMetadata aligns.
 * - Checks if user already exists in Strapi by clerk_user_id (or email fallback)
 * - If not, matches with anggota-osis roster and creates record in Strapi
 * - If exists, updates email/name if changed
 * - Logs the login event to Strapi `login_events`
 */
export async function syncUserOnAuth(input: SyncUserInput): Promise<SyncUserResult> {
  const { clerkUserId, email, fullName, ipAddress, userAgent, roleHint } = input;
  const elevatedToken = getElevatedToken();
  const strapiBaseUrl = getStrapiBaseUrl();

  if (!elevatedToken || !clerkUserId) {
    return { role: null, status: 'pending', matchedAnggotaId: null };
  }

  try {
    // 1. Record login event in Strapi
    await recordLoginEvent({
      identifier: email || fullName || clerkUserId,
      clerkUserId,
      ipAddress,
      userAgent,
      success: true,
    });

    // 2. Check if user already exists in Strapi akses_users
    const existingRes = await fetch(
      `${strapiBaseUrl}/api/akses-users?filters[clerk_user_id][$eq]=${encodeURIComponent(clerkUserId)}&populate=*`,
      {
        headers: { Authorization: `Bearer ${elevatedToken}` },
        cache: 'no-store',
      }
    );

    const existingData = existingRes.ok ? await existingRes.json() : null;
    let record = existingData?.data?.[0];

    // Fallback: check by email if clerk_user_id not matched yet
    if (!record && email) {
      const emailRes = await fetch(
        `${strapiBaseUrl}/api/akses-users?filters[email][$eq]=${encodeURIComponent(email)}&populate=*`,
        {
          headers: { Authorization: `Bearer ${elevatedToken}` },
          cache: 'no-store',
        }
      );
      const emailData = emailRes.ok ? await emailRes.json() : null;
      if (emailData?.data?.[0]) {
        record = emailData.data[0];
      }
    }

    if (record) {
      // User exists in Strapi. Check if updates needed
      const currentRole = record.role;
      const currentStatus = record.status_akses || record.status || 'pending';
      const matchedId = record.matched_anggota?.id || null;

      const needsUpdate =
        (!record.clerk_user_id && clerkUserId) ||
        (email && record.email !== email) ||
        (fullName && record.nama_lengkap_input !== fullName);

      if (needsUpdate) {
        await fetch(`${strapiBaseUrl}/api/akses-users/${record.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${elevatedToken}`,
          },
          body: JSON.stringify({
            data: {
              clerk_user_id: clerkUserId,
              email: email || record.email,
              nama_lengkap_input: fullName || record.nama_lengkap_input,
            },
          }),
        });
      }

      // Sync to Clerk publicMetadata if not aligned
      try {
        await getClerkClient().users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            status: currentStatus,
            role: currentRole,
          },
        });
      } catch (e: any) {
        console.error('[syncUserOnAuth] Clerk metadata sync error:', e?.message);
      }

      return {
        role: currentRole,
        status: currentStatus,
        matchedAnggotaId: matchedId,
      };
    }

    // 3. User does not exist yet. Match against anggota-osis roster
    const normalizedName = (fullName || '').trim().toLowerCase().replace(/\s+/g, ' ');
    let matchedMemberId: number | null = null;

    if (normalizedName) {
      const anggotaRes = await fetch(
        `${strapiBaseUrl}/api/anggota-oses?pagination[limit]=150`,
        {
          headers: { Authorization: `Bearer ${elevatedToken}` },
          cache: 'no-store',
        }
      );

      if (anggotaRes.ok) {
        const anggotaData = await anggotaRes.json();
        const members: any[] = anggotaData?.data || [];
        const matched = members.find((m: any) => {
          const target = (m.nama_lengkap || '').trim().toLowerCase().replace(/\s+/g, ' ');
          return target && target === normalizedName;
        });

        if (matched) {
          matchedMemberId = matched.id;
        }
      }
    }

    const defaultRole = normalizeRole(roleHint);
    const defaultStatus = 'pending';

    // 4. Create new akses_user in Strapi
    const createRes = await fetch(`${strapiBaseUrl}/api/akses-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${elevatedToken}`,
      },
      body: JSON.stringify({
        data: {
          clerk_user_id: clerkUserId,
          nama_lengkap_input: fullName || email || 'Pengguna Baru',
          email: email || undefined,
          role: defaultRole,
          status_akses: defaultStatus,
          matched_anggota: matchedMemberId ? { id: matchedMemberId } : undefined,
        },
      }),
    });

    if (!createRes.ok) {
      console.error('[syncUserOnAuth] Gagal membuat akses-user di Strapi:', await createRes.text());
    }

    // 5. Update Clerk publicMetadata
    try {
      await getClerkClient().users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          status: defaultStatus,
          role: defaultRole,
        },
      });
    } catch (e: any) {
      console.error('[syncUserOnAuth] Clerk metadata initial update error:', e?.message);
    }

    return {
      role: defaultRole,
      status: defaultStatus,
      matchedAnggotaId: matchedMemberId,
    };
  } catch (err: any) {
    console.error('[syncUserOnAuth] Error in sync process:', err?.message);
    return { role: null, status: 'pending', matchedAnggotaId: null };
  }
}

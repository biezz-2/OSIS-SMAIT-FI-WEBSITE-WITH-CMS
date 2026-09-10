import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix verification headers', { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not configured');
    return new Response('Server configuration error', { status: 500 });
  }

  const wh = new Webhook(webhookSecret);
  let event: any;

  try {
    event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Invalid webhook signature', { status: 400 });
  }

  const { type, data } = event;

  if (type === 'user.created' || type === 'user.updated') {
    const clerkUserId = data.id;
    const firstName = (data.first_name || '').trim();
    const lastName = (data.last_name || '').trim();
    const inputFullName = `${firstName} ${lastName}`.trim();
    const normalizedInputName = inputFullName.toLowerCase().replace(/\s+/g, ' ');
    const email = data.email_addresses?.[0]?.email_address || '';

    const strapiBaseUrl = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';
    const elevatedToken = process.env.STRAPI_ELEVATED_TOKEN;

    try {
      // 1. Ambil roster anggota-osis dari Strapi
      const anggotaRes = await fetch(
        `${strapiBaseUrl}/api/anggota-oses?pagination[limit]=150`,
        {
          headers: {
            Authorization: `Bearer ${elevatedToken}`,
          },
          cache: 'no-store',
        }
      );

      let matchedMemberId: number | null = null;
      if (anggotaRes.ok) {
        const anggotaData = await anggotaRes.json();
        const members: any[] = anggotaData?.data || [];

        // Strict match: nama lengkap harus cocok persis (exact match), tidak menggunakan substring/includes
        const matched = members.find((m: any) => {
          const target = (m.nama_lengkap || '').trim().toLowerCase().replace(/\s+/g, ' ');
          if (!target || !normalizedInputName) return false;
          return target === normalizedInputName;
        });

        if (matched) {
          matchedMemberId = matched.id;
        }
      }

      // Keamanan MUBES: Untuk mencegah spoofing nama publik, pencocokan nama di roster
      // hanya mencatat matched_anggota namun status akun tetap 'pending'
      // agar diverifikasi manual oleh presidium/BPH MUBES.
      const assignedStatus = 'pending';
      const assignedRole = matchedMemberId ? 'member' : null;

      // 2. Query apakah entri akses-user sudah ada untuk clerkUserId ini
      const existingRes = await fetch(
        `${strapiBaseUrl}/api/akses-users?filters[clerk_user_id][$eq]=${encodeURIComponent(clerkUserId)}`,
        {
          headers: {
            Authorization: `Bearer ${elevatedToken}`,
          },
          cache: 'no-store',
        }
      );

      const existingData = existingRes.ok ? await existingRes.json() : null;
      const existingRecord = existingData?.data?.[0];

      if (existingRecord?.documentId) {
        // Update record
        await fetch(`${strapiBaseUrl}/api/akses-users/${existingRecord.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${elevatedToken}`,
          },
          body: JSON.stringify({
            data: {
              nama_lengkap_input: inputFullName,
              email,
              matched_anggota: matchedMemberId ? { id: matchedMemberId } : undefined,
              status: existingRecord.status === 'approved' ? 'approved' : assignedStatus,
              role: existingRecord.role ? existingRecord.role : assignedRole,
            },
          }),
        });
      } else {
        // Buat record baru
        await fetch(`${strapiBaseUrl}/api/akses-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${elevatedToken}`,
          },
          body: JSON.stringify({
            data: {
              clerk_user_id: clerkUserId,
              nama_lengkap_input: inputFullName,
              email,
              role: assignedRole,
              status: assignedStatus,
              matched_anggota: matchedMemberId ? { id: matchedMemberId } : undefined,
            },
          }),
        });
      }

      // 3. Sinkronkan publicMetadata di Clerk Cloud
      await clerkClient.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          status: existingRecord?.status === 'approved' ? 'approved' : assignedStatus,
          role: existingRecord?.role ? existingRecord.role : assignedRole,
        },
      });
    } catch (err: any) {
      console.error('[Clerk Webhook Handler] Error processing roster match:', err.message);
      return new Response('Error syncing data', { status: 500 });
    }
  }

  return new Response('OK', { status: 200 });
}

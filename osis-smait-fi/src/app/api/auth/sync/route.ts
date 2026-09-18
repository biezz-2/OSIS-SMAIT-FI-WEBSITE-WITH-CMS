import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { syncUserOnAuth } from '@/lib/auth-sync';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User details not found' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || body.userAgent || '';

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      '';
    const fullName =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      user.username ||
      '';
    const roleHint = (user.unsafeMetadata?.role as any) || body.roleHint || null;

    const result = await syncUserOnAuth({
      clerkUserId: userId,
      email,
      fullName,
      ipAddress: ip,
      userAgent,
      roleHint,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('[API auth/sync] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      deviceId,
      pagePath,
      referrer,
      dwellTimeSeconds,
      deviceType,
      browser,
      os,
      screenResolution,
      userAgent: clientUserAgent,
    } = body;

    if (!pagePath) {
      return NextResponse.json({ error: 'pagePath is required' }, { status: 400 });
    }

    const { userId, sessionClaims } = await auth();
    const user = userId ? await currentUser().catch(() => null) : null;
    const metadata = (sessionClaims?.publicMetadata || {}) as { role?: string; status?: string };

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const serverUserAgent = req.headers.get('user-agent') || clientUserAgent || '';

    const strapiBaseUrl = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';
    const elevatedToken = process.env.STRAPI_ELEVATED_TOKEN;

    const payload = {
      data: {
        device_id: deviceId || 'anonymous_device',
        clerk_user_id: userId || null,
        user_email: user?.primaryEmailAddress?.emailAddress || null,
        user_role: metadata.role || (userId ? 'member' : 'guest'),
        is_mubes_session: Boolean(userId),
        page_path: pagePath,
        referrer: referrer || null,
        dwell_time_seconds: Number(dwellTimeSeconds) || 0,
        device_type: deviceType || 'unknown',
        browser: browser || 'unknown',
        os: os || 'unknown',
        screen_resolution: screenResolution || 'unknown',
        ip_address: ip,
        user_agent: serverUserAgent,
      },
    };

    const res = await fetch(`${strapiBaseUrl}/api/telemetri-kunjungans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${elevatedToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[Telemetry API] Strapi error:', res.status, errBody);
      return NextResponse.json({ error: 'Failed to record telemetry' }, { status: 502 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('[Telemetry API] Server error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

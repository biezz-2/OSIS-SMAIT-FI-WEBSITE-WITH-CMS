import { NextResponse } from 'next/server';
import { STRAPI_INTERNAL_URL } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();
  let strapiStatus = 'unknown';

  try {
    const res = await fetch(`${STRAPI_INTERNAL_URL}/api/_health`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });
    strapiStatus = res.ok || res.status < 500 ? 'connected' : 'degraded';
  } catch {
    strapiStatus = 'unreachable';
  }

  const responseBody = {
    status: 'healthy',
    timestamp,
    version: '1.0.0',
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    services: {
      nextServer: 'online',
      strapiCms: strapiStatus,
    },
  };

  return NextResponse.json(responseBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

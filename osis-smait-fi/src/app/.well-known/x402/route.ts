import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const x402Discovery = {
    version: '1.0',
    title: 'OSIS SMAIT Fithrah Insani Free & Non-Profit Discovery API',
    description: 'All public endpoints and agent tools on this portal are free for non-profit student use. Commercial monetization or paywall is not implemented.',
    status: 'non-commerce',
    pricing: {
      default_cost: '0',
      currency: 'IDR',
      paywall_active: false,
    },
    monetization: {
      enabled: false,
      reason: 'Non-profit Indonesian High School Student Council (OSIS SMAIT FI)',
    },
    payment_methods_supported: [],
    fallback_contact: 'https://osissmaitfi.biezz.my.id/about',
  };

  return NextResponse.json(x402Discovery, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

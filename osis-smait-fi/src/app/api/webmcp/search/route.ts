import { NextResponse } from 'next/server';
import { searchGlobalContent } from '@/lib/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchGlobalContent(q);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}

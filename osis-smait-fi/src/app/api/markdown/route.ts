import { NextRequest, NextResponse } from 'next/server';
import { generateMarkdownForPath } from '@/lib/markdown-generator';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const path =
    request.headers.get('x-markdown-path') ||
    request.nextUrl.searchParams.get('path') ||
    new URL(request.url).searchParams.get('path') ||
    '/';

  try {
    const result = await generateMarkdownForPath(path);

    if (!result) {
      return new NextResponse('Markdown representation not found for this route', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    return new NextResponse(result.markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        'Vary': 'Accept',
        'x-markdown-tokens': String(result.tokens),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  } catch (error) {
    console.error('[API Markdown] Failed to generate markdown for path:', path, error);
    return new NextResponse('Internal Server Error while generating markdown', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    },
  });
}

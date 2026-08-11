import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const url = searchParams.get('url');
  const status = searchParams.get('status');

  const previewSecret = process.env.PREVIEW_SECRET || 'preview_secret_agoraacta_2026';

  // Check the secret token
  if (secret !== previewSecret) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable or disable draft mode based on content status
  const draft = await draftMode();
  if (status === 'published') {
    draft.disable();
  } else {
    draft.enable();
  }

  // Redirect to the target URL path
  redirect(url || '/');
}

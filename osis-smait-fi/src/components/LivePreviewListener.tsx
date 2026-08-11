'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LivePreviewListener() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<any>) => {
      const { origin, data } = message;

      const allowedStrapiUrls = [
        process.env.NEXT_PUBLIC_STRAPI_URL,
        'https://osisstrapi.biezz.my.id',
        'http://localhost:1337',
        'https://osis.biezz.my.id',
      ].filter(Boolean);

      if (allowedStrapiUrls.length > 0 && !allowedStrapiUrls.some((url) => url && origin.startsWith(url))) {
        if (!data?.type?.startsWith('strapi')) return;
      }

      if (data?.type === 'strapiUpdate') {
        router.refresh();
      } else if (data?.type === 'strapiScript' || data?.type === 'previewScript') {
        const scriptContent = data.payload?.script || data.payload;
        if (typeof scriptContent === 'string') {
          const script = window.document.createElement('script');
          script.textContent = scriptContent;
          window.document.head.appendChild(script);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'previewReady' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
}

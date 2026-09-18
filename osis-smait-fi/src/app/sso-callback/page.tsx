'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthenticateWithRedirectCallback, useUser } from '@clerk/nextjs';

export default function SSOCallbackPage() {
  const [timedOut, setTimedOut] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleHint: (user.publicMetadata?.role as string) || (user.unsafeMetadata?.role as string) || null,
        }),
      }).catch(() => {});
    }
  }, [isSignedIn, user?.id, user?.publicMetadata?.role, user?.unsafeMetadata?.role]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0d0a08] flex flex-col items-center justify-center p-4">
      <AuthenticateWithRedirectCallback continueSignUpUrl="/portal-mubes?mode=signup" />
      {timedOut && (
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-neutral-400 mb-3">
            Proses autentikasi memakan waktu lebih lama dari biasanya.
          </p>
          <Link
            href="/portal-mubes"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10 inline-block"
          >
            Kembali ke Portal MUBES
          </Link>
        </div>
      )}
    </div>
  );
}

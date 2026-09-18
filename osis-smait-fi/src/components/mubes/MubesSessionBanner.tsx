'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { ShieldCheck, ChevronUp, ChevronDown, LogOut } from 'lucide-react';

export default function MubesSessionBanner() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [minimized, setMinimized] = useState(false);
  const syncedUserIdRef = useRef<string | null>(null);

  // Sinkronisasi otomatis ke Strapi tepat 1 kali saat user login
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    if (syncedUserIdRef.current === user.id) return;

    syncedUserIdRef.current = user.id;

    try {
      const roleHint =
        (user.publicMetadata?.role as string) ||
        (user.unsafeMetadata?.role as string) ||
        null;

      fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleHint }),
      }).catch((err) => {
        console.warn('[MubesSessionBanner] Non-fatal sync warning:', err?.message);
      });
    } catch (e) {
      console.warn('[MubesSessionBanner] Failed to dispatch sync:', e);
    }
  }, [isLoaded, isSignedIn, user?.id, user?.publicMetadata?.role, user?.unsafeMetadata?.role]);

  // Jangan render jika belum login atau data belum siap
  if (!isLoaded || !isSignedIn || !user) return null;

  // Ekstraksi data profil dengan fallback aman
  const publicMeta = (user.publicMetadata || {}) as Record<string, any>;
  const status = typeof publicMeta.status === 'string' ? publicMeta.status : 'pending';
  const isApproved = status === 'approved';
  const role = typeof publicMeta.role === 'string' ? publicMeta.role : 'member';

  const displayName =
    user.fullName ||
    (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) ||
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    'Anggota MUBES';

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: '/' });
    } catch (e) {
      console.error('[MubesSessionBanner] SignOut error:', e);
      window.location.href = '/';
    }
  };

  return (
    <aside
      aria-label="MUBES Mode Active"
      className="fixed bottom-6 left-6 z-50 max-w-sm sm:max-w-md rounded-2xl bg-gradient-to-r from-[#1B150F]/95 via-[#2A2016]/95 to-[#1B150F]/95 border border-[#D8B270]/40 text-[#F9EFDB] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 pointer-events-auto"
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`inline-flex items-center justify-center size-2.5 rounded-full ${
              isApproved
                ? 'bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse'
                : 'bg-amber-400 ring-4 ring-amber-400/20'
            } shrink-0`}
          />
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck size={14} className="text-[#E0BA7A] shrink-0" />
            <span className="font-['Cinzel'] font-bold text-[#E0BA7A] tracking-wider uppercase text-[11px] truncate">
              MUBES XXI
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#E0BA7A]/15 border border-[#E0BA7A]/30 text-[#E0BA7A] text-[10px] font-medium uppercase shrink-0">
              {role}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMinimized((prev) => !prev)}
          aria-label={minimized ? 'Buka detail sesi' : 'Ciutkan detail sesi'}
          className="p-1 rounded-md hover:bg-white/10 text-[#A89C8B] hover:text-[#F9EFDB] transition-colors cursor-pointer"
        >
          {minimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {!minimized && (
        <div className="mt-2.5 pt-2 border-t border-[#D8B270]/20 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#E8DCC8]">
            <span className="truncate max-w-[200px]" title={displayName}>
              {displayName}
            </span>
            {isApproved ? (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px]">
                Verified
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px]">
                Pending
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href={isApproved ? '/program-kerja-mubes' : '/portal-mubes'}
              className="text-[11px] text-[#E0BA7A] hover:text-[#F2D194] underline underline-offset-2 transition-colors"
            >
              {isApproved ? 'LPJ Proker →' : 'Status Akun →'}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-[#D8B270]/30 hover:border-[#D8B270]/60 text-[#D4C5B0] hover:text-white text-[11px] transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              Keluar
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';

export default function MubesSessionBanner() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded || !isSignedIn) return null;

  const metadata = (user?.publicMetadata || {}) as { role?: string; status?: string; is_shared_account?: boolean };
  const isApproved = metadata.status === 'approved';
  const role = metadata.role || 'member';

  return (
    <aside aria-label="MUBES Mode Active" className="sticky top-0 z-[9999] w-full bg-gradient-to-r from-[#1B150F] via-[#2A2016] to-[#1B150F] border-b border-[#D8B270]/40 text-[#F9EFDB] px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center size-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse" />
          <span className="font-['Cinzel'] font-bold text-[#E0BA7A] tracking-wider uppercase text-xs">
            MUBES XXI Mode Aktif
          </span>
          <span className="hidden sm:inline text-[#A89C8B]">|</span>
          <span className="hidden sm:inline text-[#E8DCC8]">
            {user.fullName || user.primaryEmailAddress?.emailAddress}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#E0BA7A]/15 border border-[#E0BA7A]/30 text-[#E0BA7A] text-[11px] font-medium uppercase">
            {role}
          </span>
          {isApproved ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
              Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-medium">
              Pending
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/program-kerja"
            className="text-xs text-[#E0BA7A] hover:text-[#F2D194] underline underline-offset-4 transition-colors"
          >
            Lihat LPJ Program Kerja →
          </Link>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: '/' })}
            className="px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 border border-[#D8B270]/30 hover:border-[#D8B270]/60 text-[#D4C5B0] hover:text-white text-xs transition-colors cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}

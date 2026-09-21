'use client';

import React, { useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  Clock,
  HelpCircle,
  LogOut,
  ArrowLeft,
  ShieldAlert,
  Mail,
  User,
  Shield,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface MubesApprovalStatusCardProps {
  status?: 'pending' | 'ditolak' | string | null;
  role?: string | null;
  email?: string | null;
  fullName?: string | null;
  onOpenHelp: () => void;
}

export default function MubesApprovalStatusCard({
  status = 'pending',
  role = 'member',
  email,
  fullName,
  onOpenHelp,
}: MubesApprovalStatusCardProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isDitolak = status === 'ditolak';

  const userEmail =
    email ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    '-';

  const userName =
    fullName ||
    user?.fullName ||
    (user?.firstName ? `${user?.firstName} ${user?.lastName || ''}`.trim() : null) ||
    'Anggota MUBES';

  const userRole = role || (user?.publicMetadata?.role as string) || 'member';

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: '/' });
    } catch {
      window.location.href = '/';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok && user) {
        await user.reload();
      }
    } catch (e) {
      console.warn('[MubesApprovalStatusCard] Refresh error:', e);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full max-w-[480px] p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1E1711]/95 via-[#15100C]/98 to-[#0E0B08]/98 border border-[#D8B270]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(216,178,112,0.3)] backdrop-blur-xl flex flex-col gap-6 text-[#FAF0DB]">
      {/* Ambient Top Glow */}
      <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 rounded-full blur-2xl pointer-events-none ${
          isDitolak ? 'bg-red-500/20' : 'bg-amber-500/20'
        }`}
      />

      {/* Header Icon & Status Tag */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg ${
            isDitolak
              ? 'bg-red-950/40 border-red-500/40 text-red-400'
              : 'bg-amber-950/40 border-[#D8B270]/40 text-[#E0BA7A]'
          }`}
        >
          {isDitolak ? <ShieldAlert size={32} /> : <Clock size={32} className="animate-pulse" />}
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#D8B270]/30 bg-black/40">
          {isDitolak ? (
            <span className="text-red-300">
              Permintaan Akses Belum Disetujui
            </span>
          ) : (
            <span className="text-amber-300">
              Menunggu Verifikasi Presidium
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] tracking-wide text-[#FAF0DB]">
          {isDitolak ? 'Akses Belum Disetujui' : 'Akun Sedang Ditinjau'}
        </h2>
        <p className="text-xs sm:text-sm text-[#D1BA94]/80 leading-relaxed max-w-sm">
          {isDitolak
            ? 'Pengajuan akses akun Anda belum disetujui oleh Presidium Sidang / BPH MUBES. Silakan hubungi panitia untuk aktivasi akun Anda.'
            : 'Pendaftaran akun Anda berhasil dicatat. Akses sidang dan LPJ MUBES XXI memerlukan verifikasi langsung dari Presidium atau BPH OSIS.'}
        </p>
      </div>

      {/* Account Details Box */}
      <div className="p-4 rounded-xl bg-black/40 border border-[#D8B270]/20 flex flex-col gap-2.5 text-xs">
        <div className="flex items-center justify-between text-[#C2B193] border-b border-[#D8B270]/10 pb-2">
          <span className="flex items-center gap-1.5 text-[#E0BA7A]">
            <User size={13} /> Nama
          </span>
          <span className="font-medium text-[#FAF0DB] truncate max-w-[200px]">{userName}</span>
        </div>

        <div className="flex items-center justify-between text-[#C2B193] border-b border-[#D8B270]/10 pb-2">
          <span className="flex items-center gap-1.5 text-[#E0BA7A]">
            <Mail size={13} /> Email
          </span>
          <span className="font-medium text-[#FAF0DB] truncate max-w-[200px]">{userEmail}</span>
        </div>

        <div className="flex items-center justify-between text-[#C2B193]">
          <span className="flex items-center gap-1.5 text-[#E0BA7A]">
            <Shield size={13} /> Posisi Diajukan
          </span>
          <span className="px-2 py-0.5 rounded bg-[#E0BA7A]/15 border border-[#E0BA7A]/30 text-[#E0BA7A] font-semibold uppercase text-[10px]">
            {userRole}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 pt-1">
        {/* Refresh Check Status */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D8B270] via-[#E5C385] to-[#B89255] hover:from-[#E5C385] hover:to-[#C69F60] text-[#140E08] font-bold text-xs sm:text-sm font-['Cinzel',serif] tracking-wider uppercase shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Memeriksa...' : 'Perbarui Status Akun'}</span>
        </button>

        {/* Contact BPH Help */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-[#D8B270]/30 hover:border-[#D8B270]/60 text-[#FAF0DB] font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <HelpCircle size={14} className="text-[#E0BA7A]" />
          <span>Hubungi BPH / Presidium MUBES</span>
        </button>

        {/* Sign Out / Switch Account & Back to Home */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-2 px-3 rounded-lg bg-black/30 hover:bg-black/50 border border-[#D8B270]/20 text-[#C2B193] hover:text-[#FAF0DB] text-xs transition-colors flex items-center justify-center gap-1.5 text-center"
          >
            <ArrowLeft size={13} />
            <span>Beranda</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex-1 py-2 px-3 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 hover:border-red-500/60 text-red-300 hover:text-white text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={13} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}

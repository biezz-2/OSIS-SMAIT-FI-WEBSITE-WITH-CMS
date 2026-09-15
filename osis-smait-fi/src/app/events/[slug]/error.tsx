"use client";

import React from "react";
import Link from "next/link";

export default function EventDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
        Gagal Memuat Halaman Acara
      </h1>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        Terjadi kendala jaringan saat memuat detail acara OSIS. Silakan muat ulang atau kembali ke daftar acara.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold transition shadow-lg shadow-blue-600/20"
        >
          Coba Lagi
        </button>
        <Link
          href="/events"
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold border border-white/10 transition"
        >
          Daftar Acara
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold border border-white/10 transition"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}

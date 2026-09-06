'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MubesBphHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MubesBphHelpModal({ isOpen, onClose }: MubesBphHelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-[#14100c] border border-[rgba(217,178,112,0.4)] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-[#faf0db]"
          >
            {/* Header */}
            <div className="border-b border-[rgba(217,178,112,0.2)] pb-4 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-['Cinzel',serif] text-[#e0ba70] uppercase tracking-widest block mb-1">
                  Pusat Bantuan Teknis & Sidang
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-[#faf0db]">
                  Bantuan Akses BPH
                </h3>
              </div>
              <button
                onClick={onClose}
                className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-[#b8ab99] hover:text-white flex items-center justify-center transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-sm font-['Inter',sans-serif] text-[#d9cfbd]">
              <div className="p-3.5 rounded-lg bg-[rgba(255,233,207,0.03)] border border-[rgba(217,178,112,0.2)]">
                <p className="font-semibold text-[#faf0db] mb-1">
                  1. Siapa yang berhak mengakses Portal MUBES?
                </p>
                <p className="text-xs text-[#b8ab99] leading-relaxed">
                  Akses portal diberikan khusus bagi Pengurus OSIS SMAIT Fithrah Insani, perwakilan MPK, Presidium Sidang, Pembina OSIS, dan tamu peninjau yang telah terdaftar dalam SK Kepengurusan.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[rgba(255,233,207,0.03)] border border-[rgba(217,178,112,0.2)]">
                <p className="font-semibold text-[#faf0db] mb-1">
                  2. Akun belum diverifikasi / Akses ditolak?
                </p>
                <p className="text-xs text-[#b8ab99] leading-relaxed">
                  Setelah mengajukan form Signup, admin presidium/BPH akan memverifikasi status Anda. Pastikan nama lengkap sesuai data pendaftaran organisasi.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[rgba(255,233,207,0.03)] border border-[rgba(217,178,112,0.2)]">
                <p className="font-semibold text-[#faf0db] mb-1">
                  3. Kontak Presidium & Sekbid Terkait
                </p>
                <p className="text-xs text-[#b8ab99] leading-relaxed">
                  Hubungi operator IT MUBES atau Sekretaris Jenderal OSIS jika Anda mengalami kendala teknis saat proses sidang berlangsung.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e3bd7d] to-[#997038] text-[#1f170d] font-['Cinzel',serif] font-bold text-xs tracking-wider transition-all hover:brightness-110 active:scale-95"
              >
                Tutup Panduan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

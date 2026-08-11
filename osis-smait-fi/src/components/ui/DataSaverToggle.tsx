'use client';

import React, { useState } from 'react';
import { CompressionQuality, useImageQuality } from '@/context/ImageQualityContext';

export default function DataSaverToggle() {
  const { quality, setQuality } = useImageQuality();
  const [isOpen, setIsOpen] = useState(false);

  const options: Array<{ label: string; value: CompressionQuality; desc: string }> = [
    { label: 'Kualitas Asli (100%)', value: 100, desc: 'Tampilan jernih maksimal' },
    { label: 'Seimbang (75%)', value: 75, desc: 'Hemat 25% data selular' },
    { label: 'Hemat Data (50%)', value: 50, desc: 'Hemat 50% data selular' },
    { label: 'Hemat Ekstrem (20%)', value: 20, desc: 'Memuat super cepat' },
  ];

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 text-yellow-400 border border-yellow-500/30 hover:bg-slate-800 transition-all duration-200 shadow-sm"
        title="Pengaturan Mode Hemat Data Selular"
      >
        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Hemat Data: {quality}%</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 flex flex-col gap-1 text-white text-xs">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between font-bold text-slate-300">
              <span>Mode Kompresi Gambar</span>
              <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">Optimasasi</span>
            </div>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setQuality(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col gap-0.5 ${
                  quality === opt.value
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/40'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{opt.label}</span>
                  {quality === opt.value && <span>✓</span>}
                </div>
                <span className="text-[10px] text-slate-400">{opt.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

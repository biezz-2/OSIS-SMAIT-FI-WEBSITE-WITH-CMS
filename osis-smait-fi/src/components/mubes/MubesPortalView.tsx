'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import MubesHero from './MubesHero';
import MubesLoginForm from './MubesLoginForm';
import MubesSignUpForm from './MubesSignUpForm';
import MubesBphHelpModal from './MubesBphHelpModal';

interface MubesPortalViewProps {
  initialMode?: 'login' | 'signup';
}

export default function MubesPortalView({ initialMode = 'login' }: MubesPortalViewProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#0d0a08] overflow-x-hidden flex flex-col justify-between selection:bg-[#e3bd7d]/30 selection:text-[#faf0db]">
      {/* 1. Background Enchanted Castle/Hall Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/mubes/bg-medieval.png"
          alt="Ancient Enchanted Background"
          fill
          priority
          className="object-cover object-center brightness-90 contrast-105"
        />
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-[#0d0a08]/50 backdrop-brightness-75" />

        {/* Desktop Side Vignette Gradient */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#0d0a08]/90 via-[#0d0a08]/30 to-[#0d0a08]/75" />

        {/* Subtle Ambient Radial Glow positioned behind the card */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 size-[650px] bg-[#d9b270]/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* 2. Top Navigation Bar */}
      <header className="relative z-20 w-full px-6 py-4 sm:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-['Cinzel',serif] text-[#d1ba94] hover:text-[#faf0db] transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* 3. Main Content Container (Figma: Left Hero Content at left-[140px] & Card at left-[1220px]) */}
      <main className="relative z-10 flex-1 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-[100px] xl:px-[140px] py-4 lg:py-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-16">
        {/* Left / Top: Mubes Editorial Hero */}
        <MubesHero className="flex-1 max-w-[763px]" />

        {/* Right / Bottom: Auth Card with Smooth Mode Transition */}
        <div className="w-full lg:w-auto flex justify-center items-center shrink-0">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login-card"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full max-w-[480px]"
              >
                <MubesLoginForm
                  onSwitchToSignUp={() => setMode('signup')}
                  onOpenHelp={() => setIsHelpOpen(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup-card"
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full max-w-[480px]"
              >
                <MubesSignUpForm
                  onSwitchToLogin={() => setMode('login')}
                  onOpenHelp={() => setIsHelpOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Footer Note */}
      <footer className="relative z-10 w-full py-6 text-center text-xs font-['Cinzel',serif] text-[#948778] tracking-widest">
        © 2025 AGORA ACTA • OSIS SMAIT FITHRAH INSANI • MUSYAWARAH BESAR XXI
      </footer>

      {/* 5. Help Modal */}
      <MubesBphHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

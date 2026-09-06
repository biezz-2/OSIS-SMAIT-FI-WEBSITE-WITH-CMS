'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface MubesLoginFormProps {
  onSwitchToSignUp: () => void;
  onOpenHelp: () => void;
}

export default function MubesLoginForm({ onSwitchToSignUp, onOpenHelp }: MubesLoginFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    setErrorMessage(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/portal-mubes',
      });
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Gagal menghubungkan ke Google. Silakan coba lagi.';
      setErrorMessage(msg);
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/portal-mubes');
      } else {
        setErrorMessage('Verifikasi lanjutan diperlukan. Silakan cek email Anda.');
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Gagal masuk. Periksa kembali nama/email dan kata sandi Anda.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-[480px] max-w-full px-8 py-10 rounded-3xl flex flex-col justify-start items-start gap-4 overflow-hidden bg-gradient-to-b from-[rgba(255,245,230,0.08)] via-[rgba(255,233,207,0.03)] to-[rgba(18,14,10,0.55)] backdrop-blur-[36px] [-webkit-backdrop-filter:blur(36px)_saturate(190%)] border border-[rgba(242,217,166,0.22)] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.75),inset_0_1px_1px_0_rgba(255,255,255,0.35),inset_0_0_24px_0_rgba(224,186,122,0.06)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/[0.08] before:via-transparent before:to-transparent before:pointer-events-none">
      {/* Decorative Card Header */}
      <div className="relative z-10 self-stretch flex flex-col justify-start items-center gap-2 overflow-hidden">
        <div className="size-6 relative drop-shadow-[0_2px_8px_rgba(224,186,122,0.4)]">
          <Image
            src="/images/mubes/card-header-icon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="justify-start text-[#F9EFDB] text-2xl font-bold font-['Cinzel'] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          Login
        </div>
        <div className="justify-start text-[#B8AB99] text-xs font-normal font-['Inter']">
          Masuk untuk memverifikasi dan mengakses halaman.
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="relative z-10 self-stretch p-3 rounded-lg bg-red-950/70 backdrop-blur-md border border-red-800/60 text-red-200 text-xs text-center font-['Inter'] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          {errorMessage}
        </div>
      )}

      {/* Form Elements */}
      <form onSubmit={handleSubmit} className="relative z-10 self-stretch flex flex-col justify-start items-start gap-4">
        {/* Input Identifier */}
        <div className="self-stretch h-12 px-4 bg-black/25 hover:bg-black/35 focus-within:bg-black/45 rounded-lg border border-[#D8B270]/25 focus-within:border-[#E0BA7A] focus-within:ring-1 focus-within:ring-[#E0BA7A]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 inline-flex justify-start items-center gap-3 overflow-hidden">
          <div className="size-4 relative shrink-0 opacity-75">
            <Image
              src="/images/mubes/icon-user.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email atau Username / Nama Lengkap"
            className="w-full bg-transparent text-[#F9EFDB] placeholder-[#948778] text-sm font-normal font-['Inter'] focus:outline-none"
          />
        </div>

        {/* Input Password */}
        <div className="self-stretch h-12 px-4 bg-black/25 hover:bg-black/35 focus-within:bg-black/45 rounded-lg border border-[#D8B270]/25 focus-within:border-[#E0BA7A] focus-within:ring-1 focus-within:ring-[#E0BA7A]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 inline-flex justify-between items-center overflow-hidden">
          <div className="flex-1 flex justify-start items-center gap-3 overflow-hidden">
            <div className="size-4 relative shrink-0 opacity-75">
              <Image
                src="/images/mubes/icon-lock.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
              className="w-full bg-transparent text-[#F9EFDB] placeholder-[#948778] text-sm font-normal font-['Inter'] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            className="size-4 relative shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Image
              src="/images/mubes/icon-eye.svg"
              alt=""
              fill
              className="object-contain"
            />
          </button>
        </div>

        {/* Remember Me & Help Row */}
        <div className="self-stretch inline-flex justify-between items-center overflow-hidden pt-1">
          <label className="flex justify-start items-center gap-2 overflow-hidden cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 bg-[#282119]/80 rounded border border-[#D8B270]/40 accent-[#E0BA7A] cursor-pointer"
            />
            <span className="justify-start text-[#CCBFAD] group-hover:text-[#F9EFDB] text-xs font-normal font-['Inter'] transition-colors">
              Ingat saya?
            </span>
          </label>
          <button
            type="button"
            onClick={onOpenHelp}
            className="justify-start text-[#E0BA7A] hover:text-[#F2D193] text-xs font-normal font-['Inter'] transition-colors cursor-pointer"
          >
            Bantuan BPH?
          </button>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="self-stretch h-12 bg-gradient-to-r from-[#E3BD7D] via-[#C99E5B] to-[#997038] hover:brightness-110 active:scale-[0.99] rounded-lg border border-[#E3BD7D]/80 shadow-[0_4px_16px_rgba(199,153,84,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] inline-flex justify-center items-center overflow-hidden transition-all duration-200 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-block animate-spin size-4 border-2 border-[#1E160C] border-t-transparent rounded-full" />
          ) : (
            <span className="justify-start text-[#1F170D] text-[15px] font-bold font-['Cinzel'] tracking-wide">
              Masuk ke Website
            </span>
          )}
        </button>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="self-stretch h-12 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] rounded-lg border border-[#D8B270]/25 hover:border-[#D8B270]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.2)] inline-flex justify-center items-center gap-3 transition-all duration-200 disabled:opacity-60 cursor-pointer"
        >
          {isGoogleLoading ? (
            <span className="inline-block animate-spin size-4 border-2 border-[#E0BA7A] border-t-transparent rounded-full" />
          ) : (
            <>
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span className="text-[#F9EFDB] text-xs font-semibold font-['Inter']">
                Masuk dengan Google
              </span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative z-10 self-stretch inline-flex justify-center items-center gap-3 overflow-hidden my-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D8B270]/30 to-transparent" />
        <div className="justify-start text-[#A59989] text-xs font-normal font-['Inter']">
          or
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D8B270]/30 to-transparent" />
      </div>

      {/* Secondary Button */}
      <button
        type="button"
        onClick={onSwitchToSignUp}
        className="relative z-10 self-stretch h-12 bg-white/[0.02] hover:bg-[#E0BA7A]/[0.08] active:scale-[0.99] rounded-lg border border-[#D8B270]/30 hover:border-[#D8B270]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] inline-flex justify-center items-center overflow-hidden transition-all duration-200 cursor-pointer"
      >
        <span className="justify-start text-[#F2D194] text-sm font-bold font-['Cinzel'] tracking-wide">
          Ajukan Akses Halaman →
        </span>
      </button>
    </div>
  );
}

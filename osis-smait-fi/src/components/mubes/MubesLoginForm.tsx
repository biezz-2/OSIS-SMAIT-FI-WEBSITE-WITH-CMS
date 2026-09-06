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
    <div className="w-[480px] max-w-full px-8 py-10 bg-[#1f1a14]/65 backdrop-blur-[32px] rounded-3xl border border-[#D8B270]/30 shadow-[0_16px_36px_rgba(0,0,0,0.55),inset_0_1px_2px_rgba(242,217,166,0.20)] flex flex-col justify-start items-start gap-4">
      {/* Decorative Card Header */}
      <div className="self-stretch flex flex-col justify-start items-center gap-2 overflow-hidden">
        <div className="size-6 relative">
          <Image
            src="/images/mubes/card-header-icon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="justify-start text-[#F9EFDB] text-2xl font-bold font-['Cinzel']">
          Login
        </div>
        <div className="justify-start text-[#A59989] text-xs font-normal font-['Inter']">
          Masuk untuk memverifikasi dan mengakses halaman.
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="self-stretch p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-200 text-xs text-center font-['Inter']">
          {errorMessage}
        </div>
      )}

      {/* Form Elements */}
      <form onSubmit={handleSubmit} className="self-stretch flex flex-col justify-start items-start gap-4">
        {/* Input Identifier */}
        <div className="self-stretch h-12 px-4 bg-black/0 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#D8B270]/25 focus-within:outline-[#E0BA7A] focus-within:bg-black/20 transition-colors inline-flex justify-start items-center gap-3 overflow-hidden">
          <div className="size-4 relative shrink-0">
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
            className="w-full bg-transparent text-[#F9EFDB] placeholder-[#8A7D6B] text-sm font-normal font-['Inter'] focus:outline-none"
          />
        </div>

        {/* Input Password */}
        <div className="self-stretch h-12 px-4 bg-black/0 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#D8B270]/25 focus-within:outline-[#E0BA7A] focus-within:bg-black/20 transition-colors inline-flex justify-between items-center overflow-hidden">
          <div className="flex-1 flex justify-start items-center gap-3 overflow-hidden">
            <div className="size-4 relative shrink-0">
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
              className="w-full bg-transparent text-[#F9EFDB] placeholder-[#8A7D6B] text-sm font-normal font-['Inter'] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            className="size-4 relative shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
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
          <label className="flex justify-start items-center gap-2 overflow-hidden cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 bg-[#282119] rounded-sm border border-[#D8B270]/40 accent-[#E0BA7A] cursor-pointer"
            />
            <span className="justify-start text-[#CCBFAD] text-xs font-normal font-['Inter']">
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
          className="self-stretch h-12 bg-gradient-to-r from-[#E0BA7A] to-[#A77A3D] hover:brightness-105 rounded-lg shadow-[0px_4px_14px_0px_rgba(199,153,84,0.25)] outline outline-1 outline-offset-[-1px] outline-[#E0BA7A] inline-flex justify-center items-center overflow-hidden transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-block animate-spin size-4 border-2 border-[#1E160C] border-t-transparent rounded-full" />
          ) : (
            <span className="justify-start text-[#1E160C] text-base font-bold font-['Cinzel']">
              Masuk ke Website
            </span>
          )}
        </button>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="self-stretch h-12 bg-white/5 hover:bg-white/10 active:scale-[0.99] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#D8B270]/25 hover:outline-[#D8B270]/50 inline-flex justify-center items-center gap-3 transition-all duration-200 disabled:opacity-60 cursor-pointer"
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
      <div className="self-stretch inline-flex justify-center items-center gap-3 overflow-hidden my-1">
        <div className="flex-1 h-px bg-[#D8B270]/25" />
        <div className="justify-start text-[#A59989] text-xs font-normal font-['Inter']">
          or
        </div>
        <div className="flex-1 h-px bg-[#D8B270]/25" />
      </div>

      {/* Secondary Button */}
      <button
        type="button"
        onClick={onSwitchToSignUp}
        className="self-stretch h-12 bg-black/0 hover:bg-[#E0BA7A]/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#D8B270]/30 hover:outline-[#D8B270]/60 inline-flex justify-center items-center overflow-hidden transition-all duration-200 cursor-pointer"
      >
        <span className="justify-start text-[#F2D193] text-sm font-bold font-['Cinzel']">
          Ajukan Akses Halaman →
        </span>
      </button>
    </div>
  );
}

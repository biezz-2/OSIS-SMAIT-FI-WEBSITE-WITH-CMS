'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface MubesSignUpFormProps {
  onSwitchToLogin: () => void;
  onOpenHelp: () => void;
}

export default function MubesSignUpForm({ onSwitchToLogin, onOpenHelp }: MubesSignUpFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('peserta_sidang');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    setErrorMessage(null);

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/portal-mubes',
      });
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Gagal menghubungkan pendaftaran ke Google. Silakan coba lagi.';
      setErrorMessage(msg);
      setIsGoogleLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Kata sandi minimal 8 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      const parts = fullName.trim().split(/\s+/);
      const firstName = parts[0] || fullName;
      const lastName = parts.slice(1).join(' ') || '';

      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          role,
          intendedRole: role,
        },
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Gagal mengajukan pendaftaran. Pastikan data yang dimasukkan valid.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/portal-mubes');
      } else {
        setErrorMessage('Verifikasi belum selesai. Silakan periksa kembali kode Anda.');
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Kode verifikasi salah atau kedaluwarsa.';
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
            src="/images/mubes/card-header-signup.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="justify-start text-[#F9EFDB] text-2xl font-bold font-['Cinzel']">
          {pendingVerification ? 'Verifikasi Akun' : 'Signup'}
        </div>
        <div className="justify-start text-[#A59989] text-xs font-normal font-['Inter'] text-center">
          {pendingVerification
            ? `Masukkan 6-digit kode verifikasi ke ${emailAddress}`
            : 'Masuk untuk memverifikasi dan mengakses halaman.'}
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="self-stretch p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-200 text-xs text-center font-['Inter']">
          {errorMessage}
        </div>
      )}

      {pendingVerification ? (
        /* Verification Form */
        <form onSubmit={handleVerifyCode} className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch h-12 px-4 bg-black/0 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#D8B270]/25 focus-within:outline-[#E0BA7A] focus-within:bg-black/20 transition-colors inline-flex justify-start items-center">
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Masukkan 6 digit kode"
              className="w-full bg-transparent text-[#F9EFDB] placeholder-[#8A7D6B] text-sm font-normal font-mono text-center tracking-widest focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="self-stretch h-12 bg-gradient-to-r from-[#E0BA7A] to-[#A77A3D] hover:brightness-105 rounded-lg shadow-[0px_4px_14px_0px_rgba(199,153,84,0.25)] outline outline-1 outline-offset-[-1px] outline-[#E0BA7A] inline-flex justify-center items-center overflow-hidden transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block animate-spin size-4 border-2 border-[#1E160C] border-t-transparent rounded-full" />
            ) : (
              <span className="justify-start text-[#1E160C] text-base font-bold font-['Cinzel']">
                Verifikasi & Masuk
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setPendingVerification(false)}
            className="w-full text-center text-[#A59989] hover:text-[#F9EFDB] text-xs font-normal font-['Inter'] transition-colors cursor-pointer mt-1"
          >
            ← Ubah email atau data pendaftaran
          </button>
        </form>
      ) : (
        /* Signup Input Fields */
        <form onSubmit={handleSignUpSubmit} className="self-stretch flex flex-col justify-start items-start gap-4">
          {/* Nama Lengkap */}
          <div className="self-stretch h-12 px-4 bg-black/0 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#D8B270]/25 focus-within:outline-[#E0BA7A] focus-within:bg-black/20 transition-colors inline-flex justify-start items-center overflow-hidden">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama Lengkap"
              className="w-full bg-transparent text-[#F9EFDB] placeholder-[#8A7D6B] text-sm font-normal font-['Inter'] focus:outline-none"
            />
          </div>

          {/* Email */}
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
              type="email"
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent text-[#F9EFDB] placeholder-[#8A7D6B] text-sm font-normal font-['Inter'] focus:outline-none"
            />
          </div>

          {/* Kata Sandi */}
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

          {/* Konfirmasi Kata Sandi */}
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
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Kata Sandi"
                className="w-full bg-transparent text-[#F9EFDB] placeholder-[#8A7D6B] text-sm font-normal font-['Inter'] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password visibility"
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

          {/* Role Dropdown */}
          <div className="self-stretch h-12 px-4 bg-black/0 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#D8B270]/25 focus-within:outline-[#E0BA7A] focus-within:bg-black/20 transition-colors inline-flex justify-between items-center relative overflow-hidden">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-transparent text-[#F9EFDB] text-sm font-normal font-['Inter'] focus:outline-none appearance-none cursor-pointer pr-8 [&>option]:bg-[#282119] [&>option]:text-[#F9EFDB]"
            >
              <option value="peserta_sidang">Peserta Sidang Pleno</option>
              <option value="pengurus_osis">Pengurus OSIS / BPH</option>
              <option value="mpk">Majelis Perwakilan Kelas (MPK)</option>
              <option value="peninjau">Peninjau / Tamu Undangan</option>
            </select>
            <div className="size-6 relative shrink-0 pointer-events-none">
              <Image
                src="/images/mubes/arrow-dropdown.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
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
                Ajukan Akses Halaman
              </span>
            )}
          </button>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
                  Daftar dengan Google
                </span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Switch to Login Link */}
      <div className="self-stretch text-center mt-1">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="justify-start text-[#F2D193] hover:text-[#F9EFDB] text-xs font-bold font-['Cinzel'] transition-colors cursor-pointer"
        >
          ← Sudah memiliki akun? Masuk
        </button>
      </div>
    </div>
  );
}

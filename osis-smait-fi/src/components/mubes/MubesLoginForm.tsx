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

  // Form input states
  const [authMethod, setAuthMethod] = useState<'password' | 'email_code'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Verification code state (first factor or second factor)
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [emailAddressId, setEmailAddressId] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /** True when Clerk reports identifier not found → show Sign Up CTA */
  const [needsSignUp, setNeedsSignUp] = useState(false);

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

  // Submit flow for Email + Password OR Email + Code Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setErrorMessage(null);
    setNeedsSignUp(false);

    try {
      if (authMethod === 'email_code') {
        // Alur masuk dengan kode OTP email langsung
        const { supportedFirstFactors } = await signIn.create({
          identifier,
        });

        // Cari faktor verifikasi email_code
        const isEmailCodeFactor = (factor: any) =>
          factor.strategy === 'email_code';
        const emailCodeFactor: any = supportedFirstFactors?.find(isEmailCodeFactor);

        if (emailCodeFactor) {
          setEmailAddressId(emailCodeFactor.emailAddressId);
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setTargetEmail(emailCodeFactor.safeIdentifier || identifier);
          setPendingVerification(true);
        } else {
          setErrorMessage('Metode kode email tidak didukung untuk akun ini. Gunakan kata sandi.');
        }
      } else {
        // Alur masuk dengan Kata Sandi
        const result = await signIn.create({
          identifier,
          password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier }),
          }).catch(() => {});
          router.push('/portal-mubes');
        } else if (result.status === 'needs_first_factor') {
          // Jika akun mewajibkan verifikasi faktor pertama (misal email code)
          const emailFactor: any = result.supportedFirstFactors?.find(
            (f: any) => f.strategy === 'email_code'
          );
          if (emailFactor) {
            setEmailAddressId(emailFactor.emailAddressId);
            await signIn.prepareFirstFactor({
              strategy: 'email_code',
              emailAddressId: emailFactor.emailAddressId,
            });
            setTargetEmail(emailFactor.safeIdentifier || identifier);
            setPendingVerification(true);
          } else {
            setErrorMessage('Verifikasi tambahan diperlukan tetapi faktor email tidak ditemukan.');
          }
        } else if (result.status === 'needs_second_factor') {
          // Jika akun 2FA aktif
          const secondFactor: any = result.supportedSecondFactors?.find(
            (f: any) => f.strategy === 'email_code'
          );
          if (secondFactor) {
            await signIn.prepareSecondFactor({
              strategy: 'email_code',
            });
            setTargetEmail(secondFactor.safeIdentifier || identifier);
            setPendingVerification(true);
          } else {
            setErrorMessage('Verifikasi dua langkah (2FA) diperlukan.');
          }
        } else {
          setErrorMessage('Status autentikasi belum lengkap. Silakan coba kembali.');
        }
      }
    } catch (err: any) {
      const code = err?.errors?.[0]?.code || '';
      const raw =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Gagal masuk. Periksa kembali email/nama pengguna dan kata sandi Anda.';
      const lower = String(raw).toLowerCase();
      // Clerk: identifier belum terdaftar → arahkan ke form Ajukan Akses (Sign Up)
      if (
        code === 'form_identifier_not_found' ||
        lower.includes("couldn't find your account") ||
        lower.includes('could not find') ||
        lower.includes('identifier not found') ||
        lower.includes('no user found')
      ) {
        setNeedsSignUp(true);
        setErrorMessage(
          'Akun belum terdaftar di portal MUBES. Daftar dulu lewat "Ajukan Akses Halaman", lalu tunggu persetujuan Presidium/BPH sebelum login.'
        );
      } else {
        setNeedsSignUp(false);
        setErrorMessage(raw);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Kirim ulang kode OTP login
  const handleResendCode = async () => {
    if (!isLoaded || isResending) return;
    setIsResending(true);
    setErrorMessage(null);
    setResendSuccess(false);

    try {
      if (signIn.status === 'needs_second_factor') {
        await signIn.prepareSecondFactor({
          strategy: 'email_code',
        });
      } else if (emailAddressId) {
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId,
        });
      } else {
        const factor: any = signIn.supportedFirstFactors?.find(
          (f: any) => f.strategy === 'email_code'
        );
        if (factor) {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: factor.emailAddressId,
          });
        }
      }
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Gagal mengirim ulang kode. Silakan coba lagi.';
      setErrorMessage(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Verifikasi kode OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let result;
      if (signIn.status === 'needs_second_factor') {
        result = await signIn.attemptSecondFactor({
          strategy: 'email_code',
          code: verificationCode,
        });
      } else {
        result = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code: verificationCode,
        });
      }

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: targetEmail || identifier }),
        }).catch(() => {});
        router.push('/portal-mubes');
      } else {
        setErrorMessage('Kode belum selesai diverifikasi. Periksa kembali kodenya.');
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'Kode verifikasi salah atau sudah kedaluwarsa.';
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
          {pendingVerification ? 'Verifikasi Kode Email' : 'Login'}
        </div>
        <div className="justify-start text-[#B8AB99] text-xs font-normal font-['Inter'] text-center">
          {pendingVerification
            ? `Masukkan kode verifikasi yang dikirim ke ${targetEmail || identifier}`
            : 'Masuk hanya jika akun sudah pernah diajukan & disetujui Presidium.'}
        </div>
      </div>

      {/* First-time user notice */}
      {!pendingVerification && (
        <div className="relative z-10 self-stretch p-3 rounded-lg bg-amber-950/50 backdrop-blur-md border border-[#D8B270]/35 text-[#F2D194] text-[11px] sm:text-xs leading-relaxed font-['Inter'] shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
          <p className="font-semibold text-[#E0BA7A] mb-1">Belum punya akun?</p>
          <p className="text-[#D1BA94]/95">
            Jangan login dulu. Klik tombol{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="underline underline-offset-2 text-[#F9EFDB] hover:text-white font-semibold cursor-pointer"
            >
              Ajukan Akses Halaman →
            </button>{' '}
            di bawah untuk mendaftar. Setelah Presidium menyetujui, barulah bisa masuk di sini.
          </p>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div
          className={`relative z-10 self-stretch p-3 rounded-lg backdrop-blur-md text-xs text-center font-['Inter'] shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
            needsSignUp
              ? 'bg-amber-950/70 border border-[#D8B270]/50 text-[#F2D194]'
              : 'bg-red-950/70 border border-red-800/60 text-red-200'
          }`}
        >
          <p>{errorMessage}</p>
          {needsSignUp && (
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="mt-2.5 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#E3BD7D] via-[#C99E5B] to-[#997038] text-[#1E160C] text-xs font-bold font-['Cinzel'] tracking-wide hover:brightness-110 active:scale-[0.99] cursor-pointer transition-all"
            >
              Daftar Sekarang →
            </button>
          )}
        </div>
      )}

      {/* Success Feedback */}
      {resendSuccess && (
        <div className="relative z-10 self-stretch p-3 rounded-lg bg-emerald-950/70 backdrop-blur-md border border-emerald-800/60 text-emerald-200 text-xs text-center font-['Inter'] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          Kode verifikasi baru telah dikirimkan ke email Anda!
        </div>
      )}

      {pendingVerification ? (
        /* OTP Verification Form */
        <form onSubmit={handleVerifyCode} className="relative z-10 self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch h-12 px-4 bg-black/25 focus-within:bg-black/45 rounded-lg border border-[#D8B270]/25 focus-within:border-[#E0BA7A] focus-within:ring-1 focus-within:ring-[#E0BA7A]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 inline-flex justify-start items-center">
            <input
              id="login-otp-code"
              name="otp_code"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Masukkan 6 digit kode"
              className="w-full bg-transparent text-[#F9EFDB] placeholder-[#948778] text-sm font-normal font-mono text-center tracking-widest focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="self-stretch h-12 bg-gradient-to-r from-[#E3BD7D] via-[#C99E5B] to-[#997038] hover:brightness-110 active:scale-[0.99] rounded-lg border border-[#E3BD7D]/80 shadow-[0_4px_16px_rgba(199,153,84,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] inline-flex justify-center items-center overflow-hidden transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block animate-spin size-4 border-2 border-[#1E160C] border-t-transparent rounded-full" />
            ) : (
              <span className="justify-start text-[#1E160C] text-[15px] font-bold font-['Cinzel'] tracking-wide">
                Verifikasi & Lanjutkan
              </span>
            )}
          </button>

          <div className="w-full flex items-center justify-between pt-1">
            <button
              type="button"
              disabled={isResending}
              onClick={handleResendCode}
              className="text-[#E0BA7A] hover:text-[#F2D193] disabled:opacity-50 text-xs font-normal font-['Inter'] transition-colors cursor-pointer"
            >
              {isResending ? 'Mengirim...' : 'Kirim ulang kode?'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingVerification(false);
                setVerificationCode('');
              }}
              className="text-[#A59989] hover:text-[#F9EFDB] text-xs font-normal font-['Inter'] transition-colors cursor-pointer"
            >
              ← Kembali
            </button>
          </div>
        </form>
      ) : (
        /* Login Form */
        <form onSubmit={handleSubmit} className="relative z-10 self-stretch flex flex-col justify-start items-start gap-4">
          {/* Toggle Login Method (Password vs Kode Email) */}
          <div className="self-stretch flex items-center p-1 bg-black/30 rounded-lg border border-[#D8B270]/20">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setErrorMessage(null);
                setNeedsSignUp(false);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold font-['Inter'] rounded-md transition-all cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-gradient-to-r from-[#E3BD7D] to-[#C99E5B] text-[#1A1308] shadow-sm'
                  : 'text-[#B8AB99] hover:text-[#F9EFDB]'
              }`}
            >
              Kata Sandi
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email_code');
                setErrorMessage(null);
                setNeedsSignUp(false);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold font-['Inter'] rounded-md transition-all cursor-pointer ${
                authMethod === 'email_code'
                  ? 'bg-gradient-to-r from-[#E3BD7D] to-[#C99E5B] text-[#1A1308] shadow-sm'
                  : 'text-[#B8AB99] hover:text-[#F9EFDB]'
              }`}
            >
              Kode Email (OTP)
            </button>
          </div>

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
              id="login-identifier"
              name="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                authMethod === 'email_code'
                  ? 'Email Akun Anda'
                  : 'Email atau Username / Nama Lengkap'
              }
              className="w-full bg-transparent text-[#F9EFDB] placeholder-[#948778] text-sm font-normal font-['Inter'] focus:outline-none"
            />
          </div>

          {/* Input Password (only when authMethod === 'password') */}
          {authMethod === 'password' && (
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
                  id="login-password"
                  name="password"
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
          )}

          {/* Remember Me & Help Row */}
          <div className="self-stretch inline-flex justify-between items-center overflow-hidden pt-1">
            <label htmlFor="login-remember-me" className="flex justify-start items-center gap-2 overflow-hidden cursor-pointer select-none group">
              <input
                id="login-remember-me"
                name="remember_me"
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
                {authMethod === 'email_code' ? 'Kirim Kode Verifikasi' : 'Masuk ke Website'}
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
      )}

      {/* Divider */}
      <div className="relative z-10 self-stretch inline-flex justify-center items-center gap-3 overflow-hidden my-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D8B270]/30 to-transparent" />
        <div className="justify-start text-[#A59989] text-xs font-normal font-['Inter']">
          or
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D8B270]/30 to-transparent" />
      </div>

      {/* Secondary: first-time registration */}
      <div className="relative z-10 self-stretch flex flex-col gap-1.5">
        <p className="text-center text-[10px] sm:text-[11px] text-[#A59989] font-['Inter']">
          Anggota INTI / OSIS yang belum pernah mendaftar wajib ajukan akses dulu.
        </p>
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="self-stretch h-12 bg-white/[0.02] hover:bg-[#E0BA7A]/[0.08] active:scale-[0.99] rounded-lg border border-[#D8B270]/30 hover:border-[#D8B270]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] inline-flex justify-center items-center overflow-hidden transition-all duration-200 cursor-pointer"
        >
          <span className="justify-start text-[#F2D194] text-sm font-bold font-['Cinzel'] tracking-wide">
            Ajukan Akses Halaman →
          </span>
        </button>
      </div>
    </div>
  );
}

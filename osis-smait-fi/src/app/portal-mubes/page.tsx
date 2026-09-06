import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export const metadata = {
  title: 'Portal Musyawarah Besar | OSIS SMAIT Fithrah Insani',
  description: 'Akses terbatas untuk peserta sidang, pengurus OSIS, MPK, dan presidium MUBES.',
};

export default function PortalMubesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto z-10 flex flex-col items-center">
        <div className="mb-6 text-center">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800/50">
            Internal Governance
          </span>
          <h1 className="text-2xl font-bold mt-3 tracking-tight text-white">
            Portal Musyawarah Besar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Masuk dengan akun yang terdaftar untuk mengakses dokumen LPJ dan sidang.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <SignIn
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-slate-900 border border-slate-800 shadow-2xl text-slate-100",
              },
            }}
          />
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            ← Kembali ke Beranda Utama
          </Link>
        </div>
      </div>
    </main>
  );
}

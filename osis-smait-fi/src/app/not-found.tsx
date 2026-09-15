import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
        <span className="text-blue-400 font-mono text-xl font-bold">404</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold transition shadow-lg shadow-blue-600/20"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

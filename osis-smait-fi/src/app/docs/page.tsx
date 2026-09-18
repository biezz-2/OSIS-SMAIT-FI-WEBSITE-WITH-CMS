import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'API Documentation & Discovery | OSIS SMAIT Fithrah Insani',
  description: 'Dokumentasi dan spesifikasi resmi API Publik OSIS SMAIT Fithrah Insani (Agora Acta).',
  alternates: {
    canonical: '/docs',
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-24">
        <header className="border-b border-slate-800 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-4">
            OpenAPI 3.1.0 & RFC 9727
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            OSIS SMAIT Fithrah Insani API Catalog
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Spesifikasi dan discovery API publik untuk mengakses agenda sekolah, program kerja kepengurusan Agora Acta, dan saluran aspirasi siswa.
          </p>
        </header>

        <section className="space-y-12">
          {/* Discovery Endpoints */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Discovery Endpoints</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    RFC 9727
                  </span>
                  <span className="text-xs text-slate-500">application/linkset+json</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">API Catalog</h3>
                <p className="text-sm text-slate-400 mb-3">Endpoint catalog linkset discovery otomatis untuk agent dan crawler.</p>
                <Link
                  href="/.well-known/api-catalog"
                  className="text-xs text-blue-400 hover:text-blue-300 font-mono break-all"
                  target="_blank"
                >
                  /.well-known/api-catalog &rarr;
                </Link>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    OpenAPI 3.1.0
                  </span>
                  <span className="text-xs text-slate-500">application/openapi+json</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">OpenAPI Specification</h3>
                <p className="text-sm text-slate-400 mb-3">Definisi skema OpenAPI lengkap beserta metadata organisasi non-profit.</p>
                <Link
                  href="/openapi.json"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-mono break-all"
                  target="_blank"
                >
                  /openapi.json &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Public APIs */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Public Service Endpoints</h2>
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold">GET</span>
                  <code className="text-sm text-slate-200">/api/health</code>
                </div>
                <p className="text-sm text-slate-400">Pemeriksaan status kesehatan sistem, uptime, dan ketersediaan layanan CMS Strapi.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold">GET</span>
                  <code className="text-sm text-slate-200">/api/events</code>
                </div>
                <p className="text-sm text-slate-400">Daftar agenda kegiatan, festival, dan acara umum OSIS SMAIT Fithrah Insani.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold">GET</span>
                  <code className="text-sm text-slate-200">/api/program-kerja</code>
                </div>
                <p className="text-sm text-slate-400">Daftar program kerja kepengurusan OSIS per Sekbid dan status pelaksanaannya.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono text-xs font-semibold">POST</span>
                  <code className="text-sm text-slate-200">/api/inbox</code>
                </div>
                <p className="text-sm text-slate-400">Form pengiriman aspirasi, kritik, dan saran siswa langsung ke notifikasi pengurus OSIS.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

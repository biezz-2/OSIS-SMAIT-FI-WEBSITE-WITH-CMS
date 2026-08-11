import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchHalamanFromStrapi } from '@/lib/strapi';

export const revalidate = 60;

export default async function PrivacyPolicyPage() {
  const pageData = await fetchHalamanFromStrapi('privacy-policy');

  const judulHero = pageData?.judul_hero || pageData?.attributes?.judul_hero || 'Kebijakan Privasi';
  const subJudul = pageData?.sub_judul || pageData?.attributes?.sub_judul || 'Perlindungan Data & Ketentuan Privasi Pengguna';
  const deskripsi = pageData?.deskripsi || pageData?.attributes?.deskripsi;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#185FA5] to-[#114173] text-white py-20 px-6 sm:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-roboto">
            {judulHero}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 font-medium max-w-2xl mx-auto font-roboto">
            {subJudul}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 py-16 px-6 sm:px-12 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-100 space-y-8 font-roboto leading-relaxed text-slate-700">
          {deskripsi ? (
            typeof deskripsi === 'string' ? (
              <div className="prose prose-blue max-w-none whitespace-pre-line">
                {deskripsi}
              </div>
            ) : (
              <div className="prose prose-blue max-w-none">
                {/* Fallback rendering for rich text if array format */}
                {JSON.stringify(deskripsi)}
              </div>
            )
          ) : (
            <div className="space-y-6 text-sm sm:text-base">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">1. Pendahuluan</h2>
                <p>
                  Selamat datang di situs web resmi OSIS SMAIT Fithrah Insani ("kami"). Kami berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat mengunjungi situs ini.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. Pengumpulan Data</h2>
                <p>
                  Situs web ini terutama berfungsi sebagai media publikasi informasi, agenda kegiatan, dan galeri dokumen OSIS SMAIT Fithrah Insani. Kami tidak mengumpulkan data pribadi yang sensitif tanpa persetujuan eksplisit Anda. Data teknis standar seperti alamat IP atau jenis perangkat dapat dicatat secara otomatis oleh server demi performa dan keamanan situs.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">3. Penggunaan Informasi</h2>
                <p>
                  Setiap informasi yang dikumpulkan hanya digunakan untuk meningkatkan kualitas layanan situs web, menganalisis statistik kunjungan anonim, serta memastikan kelancaran akses informasi bagi seluruh siswa dan masyarakat umum.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">4. Hak Cipta & Kekayaan Intelektual</h2>
                <p>
                  Seluruh foto, karya mading, serta dokumen program kerja yang dipublikasikan di situs ini merupakan hak cipta OSIS SMAIT Fithrah Insani kecuali dinyatakan lain.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">5. Kontak Kami</h2>
                <p>
                  Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami melalui email di{' '}
                  <a href="mailto:osissmaitfi@gmail.com" className="text-[#185FA5] dark:text-sky-400 font-semibold underline">
                    osissmaitfi@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

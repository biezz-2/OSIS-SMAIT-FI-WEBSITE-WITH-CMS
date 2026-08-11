import React from 'react';
import Image from 'next/image';

export default function AnggotaSekbid() {
  const sekbidData = [
    { title: 'SEKBID 1', name: 'Kerohanian', desc: 'Mengkoordinir kegiatan keagamaan di sekolah untuk meningkatkan iman & taqwa.' },
    { title: 'SEKBID 2', name: 'Bela Negara', desc: 'Meningkatkan rasa cinta tanah air dan kesadaran bela negara.' },
    { title: 'SEKBID 3', name: 'Wawasan Keilmuan', desc: 'Meningkatkan wawasan keilmuan dan keterampilan siswa.' },
    { title: 'SEKBID 4', name: 'Pembinaan Prestasi', desc: 'Membina dan mengembangkan potensi prestasi siswa dalam berbagai bidang.' },
    { title: 'SEKBID 5', name: 'Demokrasi & HAM', desc: 'Memupuk nilai-nilai demokrasi dan hak asasi manusia di lingkungan sekolah.' },
    { title: 'SEKBID 6', name: 'Kreativitas & Seni', desc: 'Menyalurkan bakat dan minat siswa di bidang seni dan kreativitas.' },
    { title: 'SEKBID 7', name: 'Kesehatan Jasmani', desc: 'Meningkatkan kesehatan jasmani dan rohani melalui olahraga.' },
    { title: 'SEKBID 8', name: 'Sastra & Budaya', desc: 'Mengembangkan apresiasi terhadap sastra dan pelestarian budaya bangsa.' },
  ];

  return (
    <div style={{ width: '100%', padding: '64px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64 }}>
      <div style={{ width: '100%', maxWidth: 1200, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center', color: 'var(--color-azure-11, #101828)', fontSize: 30, fontFamily: 'Inter, sans-serif', fontWeight: '700', lineHeight: '36px' }}>
          Anggota Seksi Bidang
        </div>
        <div style={{ textAlign: 'center', maxWidth: 672, color: 'var(--color-azure-46, #6A7282)', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: '400', lineHeight: '20px' }}>
          Para anggota yang bertanggung jawab dalam berbagai bidang kegiatan spesifik.
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 1200, padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {sekbidData.map((sekbid, index) => (
          <div key={index} style={{ width: '100%', height: 451, position: 'relative', background: 'white', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)', overflow: 'hidden', borderRadius: 24, outline: '1px #F3F4F6 solid' }}>
            <div style={{ width: '100%', height: 270, position: 'absolute', top: 0, left: 0, background: '#F3F4F6' }}>
              <div style={{ position: 'absolute', bottom: 16, left: 0, padding: '6px 16px', background: '#AACDDC' }}>
                <span style={{ color: '#1E293B', fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>{sekbid.title}</span>
              </div>
            </div>

            <div style={{ width: '100%', position: 'absolute', top: 271, left: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ color: '#101828', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', lineHeight: '28px' }}>
                {sekbid.name}
              </div>
              <div style={{ color: '#6A7282', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: '400', lineHeight: '19.5px', minHeight: 40 }}>
                {sekbid.desc}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex' }}>
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} style={{ width: 32, height: 32, marginLeft: i > 0 ? -8 : 0, borderRadius: '50%', background: '#E5E7EB', outline: '2px solid white', overflow: 'hidden', position: 'relative' }}>
                      <img src="https://placehold.co/28x28" alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                  <div style={{ width: 32, height: 32, marginLeft: -8, borderRadius: '50%', background: '#F3F4F6', outline: '2px solid white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ color: '#6A7282', fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: '700' }}>+2</span>
                  </div>
                </div>
                <div style={{ color: '#AACDDC', fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer' }}>
                  View Team
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

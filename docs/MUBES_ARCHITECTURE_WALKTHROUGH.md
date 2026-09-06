# 🏛️ Analisis & Dokumentasi Lengkap FigJam Board: Arsitektur & Walkthrough Mode Musyawarah Besar (Mubes) UI Identik

> **FigJam Board URL**: [https://www.figma.com/board/lI5VCa2KxhRirwI64LH1DO](https://www.figma.com/board/lI5VCa2KxhRirwI64LH1DO)  
> **Target Sistem**: Next.js 16 App Router (`osis-smait-fi`) & Strapi v5 CMS (`strapi-cms`)  
> **Status Dokumen**: Disinkronkan dengan Canvas Node FigJam `0:1`

---

## 📌 Daftar Isi
1. [Struktur Canvas FigJam](#1-struktur-canvas-figjam)
2. [Analisis Diagram 1: Alur Isolasi Data Mubes (Isolated Portal vs Public)](#2-analisis-diagram-1-alur-isolasi-data-mubes-isolated-portal-vs-public)
3. [Analisis Diagram 2: Arsitektur UI 100% Identik & Dual-Layer Access](#3-analisis-diagram-2-arsitektur-ui-100-identik--dual-layer-access)
4. [Analisis Diagram 3: Technical Implementation Plan (4 Fase)](#4-analisis-diagram-3-technical-implementation-plan-4-fase)
5. [Analisis Diagram 4: Walkthrough Langkah-demi-Langkah](#5-analisis-diagram-4-walkthrough-langkah-demi-langkah)
6. [Matriks Keamanan & Hak Akses (RBAC Strapi v5)](#6-matriks-keamanan--hak-akses-rbac-strapi-v5)
7. [Detail Teknis Berkas & Kode Solusi](#7-detail-teknis-berkas--kode-solusi)

---

## 1. Struktur Canvas FigJam

Canvas FigJam (`0:1`) memuat 4 kelompok diagram besar yang dipetakan dalam 14 section terkoordinasi:

```
FigJam Canvas (0:1)
├── [Kelompok 1: Alur Awal Isolasi Portal]
│   ├── Section 1:15  - 🌐 WEBSITE INFORMASI PUBLIK
│   ├── Section 1:47  - ⚙️ SINGLE STRAPI v5 CMS (osisstrapi.biezz.my.id)
│   └── Section 1:75  - 🔒 PORTAL MUSYAWARAH BESAR (ISOLATED MODE)
│
├── [Kelompok 2: Konsep UI 100% Identik & Dual-Layer Data
│   ├── Section 3:129 - 🎨 NEXT.JS FRONTEND (100% IDENTICAL UI & VISUAL LAYOUT)
│   ├── Section 3:166 - ⚙️ SINGLE STRAPI v5 CMS (PERMISSIONS & DATA ISOLATION)
│   └── Section 3:182 - 🔐 AUTHENTICATION & LOGIN FLOW
│
├── [Kelompok 3: Technical Implementation Plan (4 Fase)]
│   ├── Section 5:225 - Phase 1: Backend Strapi v5 Setup & Schema Design
│   ├── Section 5:238 - Phase 2: Next.js Authentication & Security Layer
│   ├── Section 5:251 - Phase 3: UI Component Dual-Layer Integration (Identical Layout)
│   └── Section 5:261 - Phase 4: Testing, Audit Security & Verification
│
└── [Kelompok 4: Implementation Walkthrough (4 Langkah)]
    ├── Section 8:297 - Langkah 1: Setup Backend & RBAC Strapi v5
    ├── Section 8:310 - Langkah 2: Integrasi Sesi Auth JWT di Next.js
    ├── Section 8:323 - Langkah 3: Inject In-Place Dual Data Rendering pada UI
    └── Section 8:333 - Langkah 4: End-To-End Security & Quality Audit
```

---

## 2. Analisis Diagram 1: Alur Isolasi Data Mubes (Isolated Portal vs Public)

### A. Alur Informasi Publik
- **Aktor**: Pengunjung Umum / Siswa / Tamu.
- **Rute Frontend**: `/`, `/sekbid`, `/program-kerja`, `/galeri`.
- **Mekanisme Fetch**: REST Fetch tanpa header Authorization (`Role = Public`).
- **Respon Strapi**: Hanya mengembalikan entitas publik (`event`, `sekbid`, `program-kerja`, `galeri-foto`).
- **Respon Terhadap Data Privat**: Jika publik mencoba fetch endpoint `/api/mubes-*`, Strapi me-reject dengan status `403 Forbidden`.

### B. Alur Portal Mubes Terisolasi
- **Aktor**: Operator Presentasi Mubes / BPH OSIS.
- **Rute Auth**: `/mubes/login`.
- **Autentikasi**: Endpoint Strapi `POST /api/auth/local` memverifikasi identitas dan mengembalikan JWT Token.
- **Manajemen Sesi**: JWT disimpan dalam `HTTP-Only Secure Cookie` (`mubes_session`).
- **Middleware Guard**: Next.js Server Middleware mencegat akses `/mubes/*`. Jika cookie valid tidak ditemukan, pengguna langsung di-redirect ke `/mubes/login`.

---

## 3. Analisis Diagram 2: Arsitektur UI 100% Identik & Dual-Layer Access

Diagram ini merepresentasikan kebutuhan khusus pengguna: **Tampilan antarmuka tidak boleh berbeda antara pengunjung biasa dan operator**, namun data sensitif disuntikkan secara dinamis saat mode Mubes aktif.

```mermaid
flowchart TD
    UserVisit[Akses Halaman Website OSIS] --> DetectAuth{Deteksi Sesi Autentikasi / JWT Cookie}

    DetectAuth -->|Guest / Publik| PublicView[Mode Publik: Tampilan Identik - Data Ter-sanitasi]
    DetectAuth -->|Operator Authenticated| MubesView[Mode Mubes: Tampilan Identik + In-Place Sensitive Overlay]

    PublicView --> RenderUI[Render Komponen: Navbar, Hero, Sekbid, Proker]
    MubesView --> RenderUIIdentik[Render Komponen Identik + Data Privat: LPJ Detail, Anggaran, Evaluasi]

    RenderUI --> FetchPublic[REST API (Role: Public)]
    RenderUIIdentik --> FetchPrivate[REST API + Bearer JWT (Role: Mubes Operator)]

    FetchPublic --> RBACPublic{Strapi RBAC Public}
    RBACPublic -->|Allowed| PublicDB[(Data Publik)]
    RBACPublic -.->|403 Forbidden| PrivateDB[(🔒 Data Privat Terkunci)]

    FetchPrivate --> RBACPrivate{Strapi RBAC Authenticated}
    RBACPrivate -->|JWT Valid| FullDB[(Data Publik + Data Privat Mubes)]
```

### Karakteristik Desain:
1. **Zero Layout Shift**: Tidak ada perpindahan rute URL atau perubahan tata letak warna/layout.
2. **In-Place Injection**: Data sensitif (misal: rincian keuangan real per proker) disuntikkan langsung di dalam kartu komponen `ProgramKerjaDetailPage.tsx` yang sama.
3. **Secret Activation**: Operator mengaktifkan sesi login menggunakan shortcut rahasia `Ctrl + Shift + M` atau trigger tersembunyi pada footer.

---

## 4. Analisis Diagram 3: Technical Implementation Plan (4 Fase)

### Phase 1: Backend Strapi v5 Setup & Schema Design
1. **Schema `mubes-lpj`**: Relasi One-to-One dengan `program-kerja`. Menyimpan:
   - `realisasi_anggaran` (Decimal / BigInt)
   - `sumber_dana` (String / Enum)
   - `nota_kwitansi` (Media Asset multiple files / PDF)
   - `evaluasi_internal` (Rich Text / Markdown)
   - `kendala_solusi` (Component / Repeater)
2. **Schema `mubes-sidang`**: Menyimpan:
   - `tata_tertib` (Rich Text)
   - `daftar_komisi` (Component / JSON)
   - `draft_konsideran` (Rich Text)
3. **RBAC Hardening**: Role `Public` diatur **unchecked** (403 Forbidden). Role `Mubes Operator` diberikan izin `find` dan `findOne`.

### Phase 2: Next.js Authentication & Security Layer
1. **Perluasan API Client (`src/lib/strapi.ts`)**:
   - Menambahkan parsing token dari parameter atau cookie.
   - Menyertakan header `Authorization: Bearer <token>` saat mode Mubes aktif.
2. **State Management (`src/context/MubesAuthContext.tsx`)**:
   - Menyimpan status boolean `isMubesMode` dan user info.
3. **Komponen Auth Modal (`src/components/mubes/MubesLoginModal.tsx`)**:
   - Floating dialog yang muncul saat shortcut ditekan.
4. **Cookie Security**: Token disimpan dengan opsi `httpOnly: true`, `secure: true`, `sameSite: 'strict'`.

### Phase 3: UI Component Dual-Layer Integration
1. **Root Layout Provider**: Membungkus aplikasi dengan `<MubesAuthProvider>`.
2. **In-Place Dynamic Component**:
   - `ProgramKerjaDetailPage.tsx`: Merender accordion/tab "Laporan Pertanggungjawaban (LPJ)" hanya jika `isMubesMode === true`.
   - `SekbidDetail.tsx`: Menampilkan badge evaluasi performa bidang internal.
   - `EventCard.tsx`: Menampilkan status realisasi biaya kegiatan.

### Phase 4: Testing, Audit Security & Verification
1. **Audit Penetrasi Publik**: Menembak endpoint API Mubes dari curl/Postman tanpa token -> pastikan respon `403 Forbidden`.
2. **Audit Sesi Operator**: Login operator -> pastikan cookie terpasang dan re-fetch data berhasil.
3. **Audit Konsistensi UI**: Perbandingan visual layout mode publik vs Mubes (layout 100% konsisten).

---

## 5. Analisis Diagram 4: Walkthrough Langkah-demi-Langkah

| Langkah | Aksi Konkret | File Target |
| :--- | :--- | :--- |
| **Langkah 1** | Buat Content-Type `mubes-lpj` dan `mubes-sidang` di Strapi CMS, lalu kunci role `Public`. | `strapi-cms/src/api/mubes-lpj/`<br>`strapi-cms/src/api/mubes-sidang/` |
| **Langkah 2** | Perbarui `fetchStrapiAPI` dan buat `MubesAuthContext` serta handler login operator. | `osis-smait-fi/src/lib/strapi.ts`<br>`osis-smait-fi/src/context/MubesAuthContext.tsx`<br>`osis-smait-fi/src/app/api/mubes/login/route.ts` |
| **Langkah 3** | Bungkus layout dengan context provider, buat shortcut `Ctrl+Shift+M`, dan inject overlay LPJ. | `osis-smait-fi/src/app/layout.tsx`<br>`osis-smait-fi/src/components/mubes/MubesLoginModal.tsx`<br>`osis-smait-fi/src/components/program-kerja/ProgramKerjaDetailPage.tsx` |
| **Langkah 4** | Uji sanitasi data publik dan pastikan data privat tidak bocor pada response cache Next.js / ISR. | Manual verification / Vitest smoke test |

---

## 6. Matriks Keamanan & Hak Akses (RBAC Strapi v5)

| Content-Type / Endpoint | Role Public (Guest) | Role Mubes Operator | Role Admin OSIS / Pembina |
| :--- | :---: | :---: | :---: |
| `/api/events` | Read (`find`, `findOne`) | Read (`find`, `findOne`) | Full Access (CRUD) |
| `/api/sekbids` | Read (`find`, `findOne`) | Read (`find`, `findOne`) | Full Access (CRUD) |
| `/api/program-kerjas` | Read (Field Publik Saja) | Read (Field Publik Saja) | Full Access (CRUD) |
| `/api/galeri-fotos` | Read (`find`, `findOne`) | Read (`find`, `findOne`) | Full Access (CRUD) |
| **`/api/mubes-lpjs`** | **❌ 403 Forbidden** | **✅ Read (`find`, `findOne`)** | Full Access (CRUD) |
| **`/api/mubes-sidangs`** | **❌ 403 Forbidden** | **✅ Read (`find`, `findOne`)** | Full Access (CRUD) |
| **`/admin` Dashboard** | **❌ 403 Forbidden** | **❌ 403 Forbidden** | **✅ Admin Access** |

---

## 7. Detail Teknis Berkas & Kode Solusi

### 1. Handler Route Login & Set Cookie (`src/app/api/mubes/login/route.ts`)
```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { identifier, password } = await req.json();
  const strapiUrl = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';

  const res = await fetch(`${strapiUrl}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data?.error?.message || 'Login gagal' }, { status: 401 });
  }

  // Set HTTP-Only Cookie
  const cookieStore = await cookies();
  cookieStore.set('mubes_session', data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 jam
  });

  return NextResponse.json({ success: true, user: data.user });
}
```

### 2. In-Place Dual-Layer Rendering (`ProgramKerjaDetailPage.tsx`)
```tsx
'use client';

import { useMubesAuth } from '@/context/MubesAuthContext';

export default function ProgramKerjaDetailPage({ proker, mubesData }: Props) {
  const { isMubesMode } = useMubesAuth();

  return (
    <div className="proker-container">
      {/* Tampilan 100% Identik untuk Publik dan Operator */}
      <ProkerHeader proker={proker} />
      <ProkerDescription proker={proker} />
      <ProkerDocumentation proker={proker} />

      {/* In-Place Overlay Khusus Mubes (Hanya Muncul Jika Terotentikasi) */}
      {isMubesMode && mubesData && (
        <section className="mubes-lpj-overlay mt-8 p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <h3 className="text-xl font-bold text-amber-500 mb-4">
            📊 Laporan Pertanggungjawaban (Mubes Mode)
          </h3>
          <p>Realisasi Anggaran: Rp {mubesData.realisasi_anggaran.toLocaleString('id-ID')}</p>
          <p>Evaluasi Internal: {mubesData.evaluasi_internal}</p>
        </section>
      )}
    </div>
  );
}
```

---
*Dokumentasi ini mencerminkan seluruh node dan konektor yang ada di FigJam Board `lI5VCa2KxhRirwI64LH1DO`.*

# 🏛️ Agora Acta: Digital Ecosystem OSIS SMAIT Fithrah Insani

**Menjembatani Aspirasi, Mengakselerasi Aksi.**

Agora Acta bukan sekadar website organisasi; ia adalah infrastruktur digital yang dirancang untuk mentransformasi tata kelola OSIS SMAIT Fithrah Insani. Dengan mengintegrasikan transparansi informasi, efisiensi administrasi, dan digitalisasi musyawarah (MUBES), Agora Acta memastikan setiap aspirasi terdokumentasi dan setiap program kerja terukur.

---

## 🚀 Value Proposition

| Dari Tradisional... | Menjadi Digital dengan Agora Acta | Manfaat Utama |
| :--- | :--- | :--- |
| Administrasi kertas & manual | Workflow digital terpusat | **Efisiensi Waktu** |
| Informasi tersebar & tidak update | Single Source of Truth (CMS) | **Transparansi Total** |
| Musyawarah fisik yang kompleks | Portal MUBES Terintegrasi | **Aksesibilitas Inklusif** |
| Pelaporan LPJ yang tidak terstruktur | Dokumentasi Digital Dinamis | **Akuntabilitas Tinggi** |

---

## 🛠️ Tech Stack

Kami menggunakan kombinasi teknologi modern untuk memastikan performa tinggi, skalabilitas, dan kemudahan pemeliharaan.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Strapi](https://img.shields.io/badge/Strapi-CMS-blueviolet?style=for-the-badge&logo=strapi)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Clerk](https://img.shields.io/badge/Clerk-Auth-blue?style=for-the-badge)

---

## 📐 Arsitektur Sistem

### High-Level Architecture
Sistem ini mengadopsi pola *Decoupled Architecture* di mana Frontend dan Backend berkomunikasi via REST API, memungkinkan update konten secara real-time tanpa perlu deploy ulang aplikasi.

```mermaid
graph TD
    User((User/Siswa)) --> Frontend[Next.js Frontend]
    Frontend --> Auth{Clerk Auth}
    Auth -->|Authenticated| Frontend
    Frontend --> API[Strapi CMS API]
    API --> DB[(SQLite/PostgreSQL)]
    Admin((Admin OSIS)) --> CMS[Strapi Dashboard]
    CMS --> API
```

### Module Dependency Map
Struktur modul dirancang secara modular untuk memudahkan pengembangan fitur baru tanpa mengganggu fungsi utama.

```mermaid
graph LR
    Core[Core UI/Lib] --> Portal[Portal MUBES]
    Core --> Landing[Landing Page]
    Core --> LPJ[Digital LPJ]
    
    Portal --> Auth[Auth Service]
    Portal --> Voting[Voting System]
    LPJ --> CMS[Content Manager]
```

### MUBES Data Flow
Alur data khusus untuk modul Musyawarah Besar (MUBES), memastikan proses registrasi hingga persetujuan berjalan aman dan valid.

```mermaid
sequenceDiagram
    participant User as Siswa/Peserta
    participant Clerk as Auth System
    participant Portal as MUBES Portal
    participant DB as Database/CMS

    User->>Clerk: Login / Sign Up
    Clerk-->>User: JWT Token
    User->>Portal: Submit Pendaftaran MUBES
    Portal->>DB: Simpan Data Pendaftar (Status: Pending)
    DB-->>Portal: Confirmed
    Portal-->>User: Notifikasi "Menunggu Persetujuan"
    Note over DB,Portal: Admin memverifikasi data
    DB->>Portal: Status Updated (Approved)
    Portal-->>User: Akses Fitur MUBES Terbuka
```

---

## ⚡ Quick Start

Dapatkan lingkungan pengembangan berjalan dalam kurang dari 5 menit.

### 1. Clone Repositori
```bash
git clone https://github.com/your-repo/agora-acta.git
cd agora-acta
```

### 2. Setup Frontend
```bash
cd osis-smait-fi
npm install
cp .env.example .env.local # Isi API Key Clerk & Strapi
npm run dev
```

### 3. Setup Backend (Strapi)
```bash
cd strapi-cms
npm install
npm run develop
```

Aplikasi kini berjalan di `http://localhost:3000` (Frontend) dan `http://localhost:1337` (Backend).

---

## 🤝 Contribution Guide

Kami terbuka bagi kontributor yang ingin meningkatkan ekosistem digital OSIS.

**Aturan Main:**
1. **Fork & Branch**: Lakukan fork repo dan buat branch baru (`feat/nama-fitur` atau `fix/nama-bug`).
2. **Atomic Commits**: Lakukan commit kecil dan deskriptif.
3. **Documentation**: Setiap fitur baru wajib disertai pembaruan pada `docs/`.
4. **Pull Request**: Sertakan screenshot/video demo dan jelaskan perubahan yang dilakukan.

---

## 🗺️ Roadmap

- [ ] **Phase 1**: Stabilisasi Portal MUBES & Auth (Current)
- [ ] **Phase 2**: Implementasi Digital Voting & E-Voting Real-time
- [ ] **Phase 3**: Integrasi Notifikasi WhatsApp/Email untuk Update Agenda
- [ ] **Phase 4**: Pengembangan Dashboard Analitik Program Kerja (KPI Tracker)

---

<p align="center">
  Built with ❤️ by <b>OSIS SMAIT Fithrah Insani</b>
</p>

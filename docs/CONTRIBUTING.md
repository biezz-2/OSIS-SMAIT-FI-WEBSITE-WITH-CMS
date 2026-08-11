# 🤝 Panduan Kontribusi (Contributing Guidelines)

Terima kasih telah meluangkan waktu untuk berkontribusi pada proyek portal web **OSIS SMAIT Fithrah Insani**! Dokumen ini berisi panduan dan standar yang harus diikuti oleh semua kontributor agar kolaborasi berjalan tertib, konsisten, dan efisien.

---

## 📌 Daftar Isi
- [Konvensi Git Branch](#-konvensi-git-branch)
- [Konvensi Pesan Commit](#-konvensi-pesan-commit)
- [Alur Sinkronisasi Schema Strapi CMS](#-alur-sinkronisasi-schema-strapi-cms)
- [Cara Menjalankan Dual-Server](#-cara-menjalankan-dual-server)
- [Pembaruan Dokumentasi](#-pembaruan-dokumentasi)

---

## 🌿 Konvensi Git Branch

Untuk menjaga kerapian riwayat pengembangan, gunakan format penamaan branch berikut:

| Tipe Branch | Format Nama | Contoh | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Feature** | `feature/nama-fitur` | `feature/galeri-anggota` | Penambahan fitur baru ke sistem. |
| **Bugfix** | `bugfix/deskripsi-bug` | `bugfix/navbar-mobile-overlap` | Perbaikan masalah/bug pada kode. |
| **Docs** | `docs/nama-dokumen` | `docs/update-architecture` | Pembuatan atau pembaruan berkas dokumentasi. |
| **Refactor** | `refactor/deskripsi-refactor`| `refactor/clean-hero-component`| Perubahan kode tanpa mengubah fungsi utama. |

---

## 🔄 Alur Sinkronisasi Schema Strapi CMS

Jika Anda menambahkan *Content Type* atau memperbarui skema atribut di Strapi CMS, ikuti langkah berikut:

1. **Commit Skema**: Pastikan berkas skema di `strapi-cms/src/api/.../schema.json` telah di-commit ke Git.
2. **Update Interface**: Perbarui interface TypeScript di `osis-smait-fi/src/lib/strapi.ts` agar frontend selaras dengan atribut CMS yang baru.

---

## 🔌 Cara Menjalankan Dual-Server (Next.js + Strapi)

Proyek ini menggunakan arsitektur *dual-folder* yang saling terintegrasi. Anda harus menjalankan kedua server secara bersamaan.

### 1. Menjalankan Backend (Strapi CMS)
```bash
cd strapi-cms
npm install
npm run develop   # Memulai server Strapi di http://localhost:1337
```
*(Opsional)* Jalankan `npm run seed` untuk mengisi database SQLite lokal dengan data contoh pengurus OSIS & program kerja.

### 2. Menjalankan Frontend (Next.js)
```bash
cd osis-smait-fi
npm install
npm run dev       # Memulai server Next.js di http://localhost:3000
```

---

## 📝 Pembaruan Dokumentasi

Setiap kali menyelesaikan fitur utama atau perbaikan penting, wajib melakukan hal berikut:
1. **Changelog**: Catat perubahan ringkas pada `docs/CHANGELOG/CHANGELOG.md` mengikuti konvensi *Keep a Changelog*.
2. **Update**: Tambahkan rincian teknis pada `docs/UPDATE/LATEST_UPDATES.md`.

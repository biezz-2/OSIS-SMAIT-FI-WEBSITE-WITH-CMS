# Project Rules: OSIS SMAIT Fithrah Insani (Agora Acta)

## Workflow & Backup Policy (Wajib)
1. **Commit & Push GitHub**:
   - Setiap selesai mengerjakan tugas/fitur/perbaikan, selalu update `CHANGELOG.md` dan `docs/CHANGELOG/CHANGELOG.md` (Keep a Changelog & SemVer).
   - Lakukan commit dan push ke remote git (`git commit -m "..." && git push origin <branch>`).

2. **Notifikasi Otomatis Slack (Routing Spesifik per Kategori)**:
   Kirim informasi hanya ke channel yang sesuai dengan konteks pekerjaan selesai:
   - **`#changelog` (`C0BVCCDKAD7`)**:
     - *Kriteria*: Rilis versi baru, perubahan styling/UI, optimasi performa, penambahan fitur pengguna.
     - *Format*: Versi SemVer, commit hash, ringkasan bullet point per komponen/halaman.
   - **`#plan` (`C0BV62M28PP`)**:
     - *Kriteria*: Perancangan arsitektur, master plan, roadmap, rancangan skema DB, atau Action Plan implementasi teknis sebelum/saat fase koding besar.
     - *Format*: Judul perencanaan, status audit/analisis, dan langkah-langkah terstruktur.
   - **`#vurn-fixed` (`C0BV8LVC04E`)**:
     - *Kriteria*: Perbaikan celah keamanan, mitigasi SSRF/XSS/DoS/Privilege Escalation, sanitasi input, CSP hardening, dan patch audit dependensi (`npm audit`).
     - *Format*: Kategori kerentanan, file yang diperbaiki, metode mitigasi, dan hasil pengujian keamanan.
   - **`#documentation` (`C0C0R1H7NV6`)**:
     - *Kriteria*: Penambahan atau pembaruan panduan pengguna, manual SOP, dokumentasi API, panduan akses MUBES/Portal, dan panduan arsitektur sistem (`docs/`, `CODEMAPS.md`, `README.md`).
     - *Format*: Panduan ringkas, URL/rute terkait, instruksi langkah demi langkah, dan catatan otorisasi/role.

3. **Memori Jangka Panjang (LangGraph MCP)**:
   - Catat arsitektur, keputusan penting, dan koreksi ke `mcp__langgraph-memory` via `memory_store`.


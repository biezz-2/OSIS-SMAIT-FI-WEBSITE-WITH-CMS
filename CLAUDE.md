# Project Rules: OSIS SMAIT Fithrah Insani (Agora Acta)

## Workflow & Backup Policy (Wajib)
1. **Commit & Push GitHub**:
   - Setiap selesai mengerjakan tugas/fitur/perbaikan, selalu update `CHANGELOG.md` dan `docs/CHANGELOG/CHANGELOG.md` (Keep a Changelog & SemVer).
   - Lakukan commit dan push ke remote git (`git commit -m "..." && git push origin <branch>`).
2. **Notifikasi Slack Otomatis**:
   - Kirimkan informasi pembaruan/perbaikan ke Slack workspace OSISSMAITFI via Composio:
     - Rilis/Update/Changelog: `#changelog` (`C0BVCCDKAD7`)
     - Rencana/Arsitektur: `#plan` (`C0BV62M28PP`)
     - Keamanan/Vulnerability Fix: `#vurn-fixed` (`C0BV8LVC04E`)
     - Dokumentasi: `#documentation` (`C0C0R1H7NV6`)
3. **Memori Jangka Panjang (LangGraph MCP)**:
   - Catat arsitektur dan keputusan penting ke `mcp__langgraph-memory` via `memory_store`.

# Panduan Aktivasi GitHub Pages - Satelit Portal OSIS SMAIT Fithrah Insani (Agora Acta)

Repositori ini memuat berkas portal satelit dokumentasi publik resmi OSIS SMAIT Fithrah Insani (Agora Acta). Berkas ini dapat langsung dipublikasikan melalui fitur **GitHub Pages** untuk mendapatkan authority domain dari GitHub (`github.io`) tanpa penalti mesin pencari.

---

## Opsi 1: Aktivasi via GitHub Action (Otomatis & Fleksibel)

Jika direktori ini berada di dalam subfolder `/docs-public-satellite` pada repository utama:

1. Buat berkas workflow GitHub Actions di `.github/workflows/deploy-satellite.yml`:
   ```yaml
   name: Deploy Public Satellite Portal

   on:
     push:
       branches:
         - main
       paths:
         - 'docs-public-satellite/**'
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout Code
           uses: actions/checkout@v4

         - name: Setup Pages
           uses: actions/configure-pages@v4

         - name: Upload Artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: 'docs-public-satellite'

         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

2. Buka repository di GitHub: **Settings** > **Pages**.
3. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
4. Workflow akan otomatis berjalan setiap kali ada pembaruan di folder `docs-public-satellite/`.

---

## Opsi 2: Menggunakan Branch Khusus (`gh-pages`)

Jika ingin memisahkan konten statis ke branch mandiri:

1. Buat branch baru dari folder `docs-public-satellite`:
   ```bash
   git subtree push --prefix docs-public-satellite origin gh-pages
   ```
2. Masuk ke GitHub Repository: **Settings** > **Pages**.
3. Pada **Build and deployment** > **Source**, pilih **Deploy from a branch**.
4. Pilih Branch `gh-pages` dan folder `/ (root)`, lalu klik **Save**.
5. Situs akan aktif dalam beberapa menit di URL `https://<organization-atau-username>.github.io/<repo-name>/`.

---

## Spesifikasi Berkas Portal

- **`index.html`**: Halaman profil dokumentasi, visi-misi, proker, dan direktori link resmi.
- **Styling**: Pure CSS inline (tanpa dependensi eksternal berat, performa instan 100/100 PageSpeed).
- **Palet Warna**: Navy Agora Acta (`#070e1b`, `#0b192c`, `#112240`) & Gold Emas (`#d4af37`, `#f59e0b`).
- **SEO & Otoritas**:
  - Tag Canonical mengarah ke domain utama: `https://osissmaitfi.biezz.my.id`
  - OpenGraph & Twitter Cards lengkap
  - Schema.org Structured Data (`EducationalOrganization` & `WebSite`)
  - Backlink anchor CTA utama dengan atribut `rel="dofollow"` ke `https://osissmaitfi.biezz.my.id`.

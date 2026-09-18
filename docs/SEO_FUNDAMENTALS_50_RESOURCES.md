# Panduan Komprehensif Fundamental SEO & Matriks 50 Sumber Otoritatif

Dokumen ini menyajikan panduan teknis implementasi Search Engine Optimization (SEO) modern berstandar Google Search Central, Schema.org, W3C, Web.dev, MDN, Next.js, dan industri search marketing global. Disertai analisis arsitektur satelit GitHub Pages versus direct 301 redirect untuk mitigasi risiko penalti search engine.

---

## 1. Empat Pilar Fundamental SEO Modern

### A. Technical SEO (Infrastruktur, Crawling, & Indexing)
Technical SEO memastikan bot perayap (*crawlers/spiders*) dapat menemukan, merayapi, dan mengindeks halaman web tanpa hambatan arsitektural.

1. **Crawlability & Directives**:
   - `robots.txt`: File kontrol akses untuk perayap. Berada di *root domain* (`/robots.txt`). Tidak digunakan untuk menyembunyikan halaman dari indeks Google (gunakan `noindex` untuk itu).
   - HTTP Status Codes:
     - `200 OK`: Halaman valid dan dapat diindeks.
     - `301 Moved Permanently`: Pemindahan permanen. Mentransfer ~95-99% *link equity* (PageRank).
     - `302 Found` / `307 Temporary Redirect`: Pemindahan sementara. Tidak mengalihkan kanonikalitas dalam jangka pendek.
     - `404 Not Found` / `410 Gone`: Halaman tidak ada. `410` memberi sinyal de-indeksasi lebih cepat ke Googlebot.
     - `500 / 503 Service Unavailable`: Kesalahan server. Jika berkepanjangan, frekuensi *crawling* diturunkan.
2. **Kanonikalitas (`rel="canonical"`)**:
   - Menentukan URL sumber utama (*master copy*) dari konten yang duplikat atau mirip guna menghindari fragmentasi metrik ranking.
   - Berlaku *self-referential* pada halaman kanonikal dan *cross-domain* antar domain berbeda.
3. **Peta Situs (XML Sitemaps)**:
   - Protokol XML standar (`sitemap.xml`) untuk mendaftarkan URL yang dapat diakses, tanggal modifikasi terakhir (`<lastmod>`), frekuensi perubahan, dan prioritas.
   - Maksimum 50.000 URL atau 50MB per file sitemap sebelum dipecah menjadi *sitemap index*.
4. **Arsitektur URL**:
   - Struktur hirarkis, deskriptif, berbasis huruf kecil (*lowercase*), menggunakan tanda hubung (*hyphen* `-`) sebagai pemisah kata, serta menghindari parameter sesi dinamis yang berlebihan.

---

### B. On-Page SEO & Kualitas Konten Semantik
Fokus pada relevansi informasi, struktur semantik dokumen, dan pemenuhan intensi pencarian pengguna (*Search Intent*).

1. **Title Link & Meta Description**:
   - `<title>`: Panjang ideal 50–60 karakter (atau maksimal ~600 piksel). Wajib unik untuk setiap halaman, mencantumkan kata kunci target di awal, dan menyertakan nama jenama (*brand*).
   - `<meta name="description">`: Panjang 120–160 karakter. Berfungsi sebagai *click-through rate (CTR) optimizer* pada SERP snippet.
2. **Hierarki Heading Semantik**:
   - Penggunaan tepat elemen HTML5: satu tag `<h1>` per halaman yang mendefinisikan topik utama, diikuti `<h2>` untuk sub-topik, dan `<h3>` untuk rincian topik.
   - Hindari melompati tingkat heading (misal dari `<h1>` langsung ke `<h4>`).
3. **Eksplisit Anchor Text**:
   - Teks tautan internal dan eksternal harus deskriptif terhadap halaman target. Hindari kata generik seperti "klik di sini", "baca selengkapnya", atau URL mentah.
4. **Optimasi Aset Media**:
   - Atribut `alt` deskriptif dan fungsional pada elemen `<img>` untuk aksesibilitas dan Google Image Search.
   - Format gambar modern: WebP atau AVIF dengan kompresi teroptimasi.
   - Dimensi eksplisit (`width` dan `height`) untuk mencegah *layout shift*.

---

### C. Structured Data & Semantic Web (Schema.org)
Penyediaan metadata terstruktur berbasis format JSON-LD yang disematkan pada tag `<script type="application/ld+json">`.

1. **Format Standar**:
   - Google merekomendasikan format **JSON-LD** dibandingkan Microdata atau RDFa karena pemisahan data dari struktur presentasi HTML.
2. **Entitas Utama Web & Organisasi**:
   - `Organization`: Nama resmi, logo, URL resmi, kontak, dan tautan media sosial (`sameAs`).
   - `WebSite`: Termasuk penanda `SearchAction` untuk *Sitelinks Searchbox*.
   - `BreadcrumbList`: Menghasilkan jalur navigasi remah roti pada SERP.
   - `Article` / `BlogPosting`: Tanggal publikasi (`datePublished`), tanggal pembaruan (`dateModified`), penulis (`author`), dan penerbit (`publisher`).
   - `Event` / `EducationalOrganization`: Sangat relevan untuk institusi sekolah, seminar, dan kegiatan organisasi.
3. **Validasi Skema**:
   - Uji kode secara rutin melalui *Rich Results Test* dan *Schema Markup Validator*.

---

### D. Performance & Core Web Vitals (CWV)
Core Web Vitals adalah indikator performa pengalaman pengguna (*Page Experience*) yang menjadi faktor sinyal perankingan teknis Google.

1. **Largest Contentful Paint (LCP)**:
   - Mengukur kecepatan pemuatan elemen konten visual terbesar pada *viewport*.
   - **Target**: `<= 2.5 detik` (Baik), `2.5 - 4.0 detik` (Perlu Peningkatan), `> 4.0 detik` (Buruk).
   - Optimasi: Preload hero image (`<link rel="preload">`), CDN caching, kompresi Brotli, optimasi server response time (TTFB).
2. **Interaction to Next Paint (INP)**:
   - Menggantikan First Input Delay (FID) sejak Maret 2024. Mengukur responsivitas interaksi pengguna di seluruh siklus hidup halaman.
   - **Target**: `<= 200 milidetik` (Baik), `200 - 500 milidetik` (Perlu Peningkatan), `> 500 milidetik` (Buruk).
   - Optimasi: Minimalkan *Long Tasks* pada main thread JavaScript, gunakan `requestIdleCallback` / `Web Workers`, pecah bundel skrip (*code-splitting*).
3. **Cumulative Layout Shift (CLS)**:
   - Mengukur stabilitas visual halaman dan mencegah elemen bergeser mendadak saat proses pemuatan.
   - **Target**: `<= 0.1` (Baik), `0.1 - 0.25` (Perlu Peningkatan), `> 0.25` (Buruk).
   - Optimasi: Selalu tentukan rasio aspek gambar/video (`aspect-ratio` atau `width`/`height`), alokasikan ruang statis untuk iklan/iframe dinamis, hindari penyisipan konten di atas elemen yang sudah ter-render tanpa aksi pengguna.

---

## 2. Matriks 50 Sumber Otoritatif Fundamental SEO

| No | Sumber / Organisasi | Kategori / Pilar | Dokumentasi Otoritatif | Intisari Teknis & Key Takeaways | Penerapan Praktis |
|---|---|---|---|---|---|
| 1 | **Google Search Central** | Official Guidelines | [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=id) | Google merayapi dan mengindeks halaman secara mandiri. Kunci utama adalah aksesibilitas file CSS/JS, konten unik, judul jelas, dan arsitektur logis. Meta keywords tidak digunakan. | Pastikan file CSS/JS tidak diblokir di robots.txt; hindari manipulasi URL berbasis kata kunci berlebih. |
| 2 | **Google Search Central** | Policy & Compliance | [Google Search Essentials](https://developers.google.com/search/docs/essentials) | Standar wajib mencakup kualifikasi teknis perayapan, kebijakan spam, dan panduan kualitas konten bernilai tinggi. | Verifikasi halaman tidak melanggar pedoman teknis perayapan dasar Googlebot. |
| 3 | **Google Search Central** | Crawling & Indexing | [How Google Search Works](https://developers.google.com/search/docs/fundamentals/how-search-works) | Tiga tahap sistem: Perayapan (Crawling), Pengindeksan (Indexing), dan Penayangan Hasil (Serving Results). | Pantau log server untuk memastikan siklus penemuan URL berjalan efektif. |
| 4 | **Google Search Central** | Technical SEO | [Robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro) | Standar parsing robots.txt Google, aturan Allow/Disallow, User-agent, dan penempatan URL Sitemap. | Buat `/robots.txt` yang bersih dan letakkan direktif `Sitemap: https://domain.com/sitemap.xml`. |
| 5 | **Google Search Central** | Indexing Architecture | [Consolidated Sitemaps Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) | Format peta situs XML, batasan ukuran 50MB / 50.000 URL per file, dan sitemap index untuk segmentasi skala besar. | Hasilkan `sitemap.xml` dinamis berbasis CMS atau framework aplikasi web. |
| 6 | **Google Search Central** | Duplicate Content | [Consolidate Duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | Mekanisme kanonikalisasi via tag `<link rel="canonical">`, HTTP header Link, redirect 301, dan sitemap clustering. | Terapkan tag kanonikal mandiri (*self-referential*) pada setiap halaman unik. |
| 7 | **Google Search Central** | Server Response | [HTTP Status Codes for Search](https://developers.google.com/search/docs/crawling-indexing/http-network-errors) | Penanganan status 200, 301, 302, 404, 410, dan 503 oleh Googlebot serta dampaknya pada umur indeks halaman. | Pastikan URL yang dipensiunkan mengirim kode 301 (jika ada pengganti) atau 410 (jika dihapus total). |
| 8 | **Google Search Central** | Semantic / Rich Data | [Intro to Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | Penggunaan format JSON-LD untuk membantu bot memahami konteks entitas dan memicu fitur *Rich Results*. | Sematkan blok JSON-LD pada komponen header atau layout dokumen. |
| 9 | **Google Search Central** | Mobile Infrastructure | [Mobile-First Indexing](https://developers.google.com/search/docs/crawling-indexing/mobile-first-indexing) | Google mengevaluasi konten, meta data, dan struktur situs utamanya dari agen seluler (*mobile bot*). | Pastikan konten desktop dan seluler setara (parity), termasuk data terstruktur. |
| 10 | **Google Search Central** | Anti-Spam Policy | [Spam Policies for Google Search](https://developers.google.com/search/docs/essentials/spam-policies) | Larangan terhadap *doorway pages*, *cloaking*, manipulasi tautan eksternal (*link schemes*), dan *scraped content*. | Hindari pembuatan domain satelit tipis yang hanya berfungsi memotong lalu lintas ke domain utama. |
| 11 | **Google Search Central** | Page Experience | [Core Web Vitals & Page Experience](https://developers.google.com/search/docs/appearance/page-experience) | Kriteria pengalaman pengguna: metrik Core Web Vitals, keamanan HTTPS, dan ketiadaan pop-up/interstisial yang mengganggu. | Implementasikan HTTPS di seluruh domain dan optimalkan metrik CWV ke status "Good". |
| 12 | **Google Search Central** | Internationalization | [Managing Multilingual Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) | Standar tag `hreflang` via tag HTML, header HTTP, atau sitemap untuk mengarahkan bahasa dan wilayah regional. | Konfigurasikan rel="alternate" hreflang="id" dan hreflang="en" jika situs multi-bahasa. |
| 13 | **Google Search Central** | JavaScript & Frameworks | [JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Perilaku proses rendering JavaScript Googlebot (WRS - Web Rendering Service) dua tahap: perayapan HTML awal dan antrean render. | Gunakan Server-Side Rendering (SSR) atau Static Site Generation (SSG) untuk konten kritis. |
| 14 | **Google Search Central** | SERP Presentation | [Controlling Title Links](https://developers.google.com/search/docs/appearance/title-link) | Pembentukan judul otomatis oleh Google jika tag `<title>` dinilai tidak akurat, terlalu panjang, atau berulang (*boilerplate*). | Buat judul ringkas, informatif, mencerminkan isi halaman, dan mencantumkan brand secara konsisten. |
| 15 | **Google Search Central** | Media Optimization | [Google Images Best Practices](https://developers.google.com/search/docs/appearance/google-images) | Penempatan gambar relevan dekat teks pendukung, penamaan file deskriptif, format modern, dan atribut `alt` kontekstual. | Berikan nama file `kegiatan-osis-agora-acta.webp` alih-alih `IMG_1023.jpg`. |
| 16 | **Schema.org** | Data Standard | [Schema.org Core Documentation](https://schema.org/docs/documents.html) | Hirarki tipe entitas dan properti data terstruktur terbuka yang diinisiasi Google, Microsoft, Yahoo, dan Yandex. | Pelajari hierarki Thing > Intangible / CreativeWork / Organization. |
| 17 | **Schema.org** | Entity Schema | [Organization Type Specification](https://schema.org/Organization) | Skema pendefinisian institusi, entitas resmi, tautan asosiasi (`sameAs`), logo, dan narahubung institusional. | Terapkan pada homepage organisasi sekolah untuk pembentukan Google Knowledge Panel. |
| 18 | **Schema.org** | Navigation Schema | [BreadcrumbList Specification](https://schema.org/BreadcrumbList) | Struktur pelaporan urutan hierarki laman web kepada search engine untuk visualisasi navigasi di SERP. | Pasang JSON-LD BreadcrumbList pada seluruh halaman bersarang (*nested routes*). |
| 19 | **Schema.org** | Content Schema | [Article & NewsArticle Schema](https://schema.org/Article) | Properti formal publikasi artikel: tanggal tayang, modifikasi, nama jurnalis/penulis, dan penerbit berlisensi. | Sematkan pada artikel warta sekolah, dokumentasi kegiatan, dan rilis pers. |
| 20 | **W3C (World Wide Web Consortium)** | Semantic Standards | [HTML5 Living Standard Semantics](https://html.spec.whatwg.org/multipage/semantics.html) | Definisi elemen semantik modern (`<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`). | Hindari struktur "div-soup"; gunakan elemen semantik asli HTML5 untuk hierarki halaman yang jelas. |
| 21 | **W3C** | Accessibility & SEO | [WAI WCAG 2.2 Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) | Standar aksesibilitas web; kontras warna, pembaca layar (*screen reader*), dan navigasi keyboard yang beririsan erat dengan SEO teknis. | Tambahkan label `aria-*`, atribut `alt`, dan struktur navigasi hierarkis bebas jebakan fokus. |
| 22 | **W3C** | Data Formats | [JSON-LD 1.1 Specification](https://www.w3.org/TR/json-ld11/) | Rekomendasi W3C untuk format transfer Linked Data berbasis JSON yang menjadi fondasi data terstruktur modern. | Gunakan sintaks `@context: "https://schema.org"` dan `@type` yang terformat valid tanpa galat sintaks. |
| 23 | **Mozilla MDN Web Docs** | Document Metadata | [The External Resource Link Element (`<link>`)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) | Spesifikasi relasi dokumen: `rel="canonical"`, `rel="alternate"`, `rel="preload"`, `rel="icon"`, dan `rel="author"`. | Gunakan preload untuk font utama dan kanonikal untuk penentuan URL master. |
| 24 | **Mozilla MDN Web Docs** | Search Directives | [Meta Name Robots Directives](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) | Nilai direktif: `noindex`, `nofollow`, `noarchive`, `nosnippet`, `max-snippet`, `max-image-preview`. | Pasang `<meta name="robots" content="noindex, follow">` untuk arsip paginasi atau portal privat. |
| 25 | **Mozilla MDN Web Docs** | Social Protocols | [Open Graph & Twitter Meta Tags Guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Add_metadata#open_graph_data) | Standar Open Graph (`og:title`, `og:image`, `og:url`, `og:description`) untuk visualisasi pratinjau media sosial. | Sertakan gambar beresolusi 1200x630 piksel pada tag `og:image`. |
| 26 | **Mozilla MDN Web Docs** | Network Architecture | [HTTP Caching & Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) | Pengaturan `Cache-Control`, `ETag`, `Last-Modified`, serta kompresi transmisi untuk efisiensi perayapan bot. | Terapkan caching panjang (`max-age=31536000, immutable`) pada aset statis bertanda hash. |
| 27 | **Web.dev (Google)** | Core Web Vitals | [Overview of Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) | Metrik acuan standar kualitas interaksi halaman web di browser: LCP, INP, dan CLS. | Lakukan audit berkala menggunakan Lighthouse dan Chrome UX Report (CrUX). |
| 28 | **Web.dev (Google)** | Loading Performance | [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp) | Panduan eliminasi render-blocking resources, optimasi kompresi gambar, dan prioritisasi *fetchpriority="high"*. | Beri atribut `fetchpriority="high"` pada elemen gambar hero di halaman depan. |
| 29 | **Web.dev (Google)** | Interactivity Metrics | [Optimize Interaction to Next Paint](https://web.dev/articles/optimize-inp) | Metode pemecahan tugas panjang (*long tasks* >50ms), debounce event listener, dan pelepasan thread utama JavaScript. | Hindari eksekusi loop JavaScript berat saat event klik atau input sedang diproses. |
| 30 | **Web.dev (Google)** | Visual Stability | [Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls) | Teknik menjaga stabilitas tata letak melalui reservasi area dimensi, aspek rasio CSS, dan penanganan font web FOIT/FOUT. | Gunakan `font-display: swap` dan tentukan rasio aspek kontainer sebelum aset selesai dimuat. |
| 31 | **Web.dev (Google)** | Network & Transfer | [Modern Image Formats (AVIF & WebP)](https://web.dev/articles/serve-images-webp) | Komparasi efisiensi transfer data AVIF dan WebP terhadap format lawas JPEG/PNG, memotong bobot aset hingga 50-80%. | Konversikan seluruh aset statis situs menjadi WebP dengan fallback otomatis. |
| 32 | **Next.js Documentation** | SEO Implementation | [Metadata API Reference](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) | Konfigurasi metadata statis dan dinamis pada Next.js App Router melalui fungsi `generateMetadata()`. | Definisikan `title`, `description`, `alternates.canonical`, dan `openGraph` pada setiap file `page.tsx` atau `layout.tsx`. |
| 33 | **Next.js Documentation** | Performance & Assets | [Next.js Image Component](https://nextjs.org/docs/app/building-your-application/optimizing/images) | Komponen `<Image>` bawaan dengan konversi otomatis WebP/AVIF, lazy loading, layout shift prevention, dan responsive sizing. | Gantikan tag `<img>` murni dengan `next/image` untuk seluruh ilustrasi konten. |
| 34 | **Next.js Documentation** | Search Utilities | [Generating Sitemaps and Robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) | Konvensi pembuatan file `sitemap.ts` dan `robots.ts` secara terprogram untuk penanganan ratusan rute dinamis. | Buat rute `app/sitemap.ts` yang menarik data entitas secara asinkron dari backend/database. |
| 35 | **Next.js Documentation** | Rendering Architecture | [Rendering Strategies & SEO](https://nextjs.org/docs/app/building-your-application/rendering) | Pemilihan strategi rendering: SSG untuk kecepatan instan dan SEO maksimal, SSR untuk data realtime, ISR untuk konten semi-statis. | Prioritaskan SSG/ISR pada halaman publik profil, struktur organisasi, dan artikel. |
| 36 | **Moz** | Industry Education | [The Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo) | Kerangka konseptual komprehensif: piramida kebutuhan SEO (Crawlability > Content > Keywords > User Experience > Links). | Jadikan checklist dasar untuk proses audit pra-rilis situs baru. |
| 37 | **Moz** | On-Page Analysis | [On-Page SEO Best Practices](https://moz.com/learn/seo/on-page-seo) | Strategi penempatan kata kunci dalam URL, judul, heading, kepadatan konten alami (*natural writing*), dan pemenuhan search intent. | Buat konten mendalam yang menjawab pertanyaan inti pengguna secara langsung di paragraf awal. |
| 38 | **Moz** | Link Architecture | [Internal Linking Strategies](https://moz.com/learn/seo/internal-link) | Distribusi ekuitas tautan (*PageRank distribution*), siloing topik, dan eliminasi halaman yatim (*orphan pages*). | Susun kluster topik dengan menghubungkan artikel turunan kembali ke halaman pilar utama (*pillar page*). |
| 39 | **Ahrefs** | Technical SEO | [Technical SEO Audit Checklist](https://ahrefs.com/blog/technical-seo/) | Prosedur audit sistematis: status indeks, rantai redirect (*redirect chains*), kanonikal yang rusak, dan kebocoran crawl budget. | Lakukan crawling berkala untuk mendeteksi status 404, loop redirect, atau halaman yatim piatu. |
| 40 | **Ahrefs** | Search Intent | [Search Intent Identification](https://ahrefs.com/blog/search-intent/) | Klasifikasi 4 pilar intensi pencarian: Informational, Navigational, Commercial Investigation, dan Transactional. | Sesuaikan format halaman: artikel panduan untuk intensi informasional, landing page untuk transaksional. |
| 41 | **Ahrefs** | Data-driven Insights | [Google Ranking Factors Study](https://ahrefs.com/blog/google-ranking-factors/) | Analisis korelasi metrik domain rating, relevansi teks jangkar, volume kata, dan kecepatan muat terhadap posisi SERP. | Fokus pada akuisisi tautan bereputasi dan relevansi kontekstual jangka panjang. |
| 42 | **Semrush** | Search Architecture | [Crawl Budget Management Guide](https://semrush.com/blog/crawl-budget/) | Alokasi sumber daya bot perayap pada domain besar: eliminasi parameter URL tak berguna dan pengurangan waktu respons server. | Blokir perayapan filter pencarian internal dinamis melalui robots.txt. |
| 43 | **Semrush** | Semantic Search | [Entity-Based SEO](https://semrush.com/blog/entity-based-seo/) | Transisi search engine dari pencocokan string kata kunci (*strings*) menuju pemahaman hubungan entitas dunia nyata (*things*). | Bangun asosiasi entitas merek yang konsisten di seluruh platform digital dan Schema markup. |
| 44 | **Semrush** | Analytics & Auditing | [Technical Site Health Benchmarks](https://semrush.com/blog/site-audit/) | Standar rasio kesehatan teknis situs, penanganan masalah duplikasi title/description, serta keamanan sertifikat SSL. | Pertahankan skor kesehatan situs di atas 90% melalui perbaikan berkala. |
| 45 | **Search Engine Journal (SEJ)** | Industry News & Analysis | [Complete Guide to SEO](https://www.searchenginejournal.com/seo-guide/) | Rangkuman regulasi, perubahan algoritma Google (Core Updates, Helpful Content), dan adaptasi search marketing. | Terapkan prinsip "Helpful Content" yang ditulis untuk manusia, bukan murni manipulasi bot. |
| 46 | **Search Engine Journal (SEJ)** | Rich Snippets | [Advanced Schema Markup Guide](https://www.searchenginejournal.com/schema-markup-rich-snippets/) | Implementasi skema bersarang (*nested schema*), properti ID unik `@id`, dan integrasi Knowledge Graph eksternal (Wikidata). | Tautkan entitas lokal atau organisasi ke data Wikidata melalui properti `sameAs`. |
| 47 | **Yoast SEO** | Content Readability | [Content SEO & Readability Framework](https://yoast.com/what-is-content-seo/) | Prinsip keterbacaan: panjang kalimat moderat, variasi kata penghubung, pemecahan paragraf pendek, dan kalimat aktif. | Tulis artikel dengan format ringkas yang mudah dipindai (*skimmable*) oleh pengguna seluler. |
| 48 | **Yoast SEO** | Canonicalization | [rel=canonical: The Ultimate Guide](https://yoast.com/rel-canonical/) | Pedoman implementasi kanonikal pada paginasi, variasi tracking UTM, dan sindikasi konten lintas domain. | Tambahkan parameter canonical absolut tanpa query string UTM ke dalam head dokumen. |
| 49 | **Cloudflare Learning Center** | Edge Performance | [HTTP/3, Caching, & Edge Redirects](https://www.cloudflare.com/learning/cdn/what-is-caching/) | Keunggulan protokol HTTP/3 (QUIC), kompresi Brotli di edge server, dan eksekusi redirect 301 instan di level DNS/CDN. | Konfigurasikan redirect permanen di level Edge Rules untuk memotong latensi hingga 0 milidetik ke origin. |
| 50 | **Bing Webmaster Tools** | Search Alternative | [Bing Webmaster Guidelines & IndexNow](https://www.bing.com/webmasters/help/webmasters-guidelines) | Protokol IndexNow untuk pengiriman URL instan saat konten diperbarui, serta pedoman perayapan Bingbot. | Implementasikan endpoint IndexNow untuk memberi notifikasi instan kepada search engine (Bing & Yandex). |

---

## 3. Panduan Arsitektur: Halaman Satelit GitHub Pages vs Direct Redirect

Ketika sebuah organisasi memiliki beberapa domain, repositori dokumentasi, atau *landing page* sekunder di GitHub Pages (misalnya `username.github.io/repo` atau domain kustom terpisah), arsitektur distribusi lalu lintas dan *link equity* harus ditentukan secara cermat.

```
PILIHAN ARSITEKTUR DOMAIN / HALAMAN SEKUNDER:

                 ┌────────────────────────┐
                 │  Domain / URL Sekunder │
                 │  (GitHub Pages / Repo) │
                 └───────────┬────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ Opsi A: Direct 301 ]            [ Opsi B: Halaman Satelit ]
  Redirect di Level DNS/Edge         Mikrosit Berdiri Sendiri
  (Cloudflare / Nginx / Vercel)     (Konten Unik + Cross Canonical)
            │                                 │
            ├─ Latensi: ~0ms                  ├─ Risiko Doorway Page: TINGGI jika tipis
            ├─ Transfer Authority: 95-99%     ├─ Terbagi Crawl Budget
            ├─ Maintenance: Nol               ├─ Butuh Konten Orisinil & Distinct
            └─ Konsolidasi SERP: Penuh        └─ Link Equity: Tidak terkonsolidasi
```

---

### A. Perbandingan Teknis Tiga Metode Arsitektur

| Parameter Evaluasi | 1. Direct 301 Permanent Redirect (DNS/Edge) | 2. Subdomain Resmi (`docs.domain.com` ke GH Pages) | 3. Domain Satelit Terpisah (`domain-satelit.com` / `gh.io`) |
|---|---|---|---|
| **Metode Kerja** | Edge Rule / CDN langsung membalas header `301 Moved Permanently` ke URL target utama. Pengguna dan bot tidak membuka halaman antara. | Domain kustom CNAME diarahkan ke GitHub Pages, tetap berada di bawah payung domain induk organisasi. | Halaman web independen di-hosting di GitHub Pages dengan nama domain berbeda atau URL GitHub standar. |
| **Transfer Link Equity (PageRank)** | **Maksimal (~95 - 99%)**. Google mengonsolidasikan seluruh metrik tautan masuk ke URL tujuan. | **Tinggi**. Menikmati sebagian besar reputasi domain induk (*root domain brand association*). | **Nol / Mandiri**. Harus membangun otoritas dari nol; tidak mentransfer nilai domain induk. |
| **Risiko Google Spam / Doorway Pages** | **Nol (0%)**. Google secara resmi menyarankan 301 redirect untuk penggabungan atau restrukturisasi domain. | **Sangat Rendah**, asalkan konten berbobot (dokumentasi resmi, modul aplikasi). | **TINGGI**. Sangat rentan penalti manual/algoritma jika kontennya hanya ringkasan tipis yang mengarahkan tombol ke situs utama. |
| **Konsolidasi Indeks SERP** | **Sempurna**. URL lama perlahan hilang dari indeks, digantikan oleh URL tujuan baru tanpa kanonikal ganda. | Terindeks sebagai entitas turunan; dapat memicu *site links* pada pencarian brand. | Terfragmentasi. Bersaing langsung di SERP dengan domain utama (*keyword cannibalization*). |
| **Crawl Budget & Server Overhead** | **Paling Efisien**. Bot hanya perlu 1 roundtrip header; tidak memproses rendering DOM atau download aset. | Mengonsumsi crawl budget normal pada infrastruktur GitHub. | Mengonsumsi crawl budget ganda untuk aset dan konten yang berpotensi serupa. |
| **Beban Pemeliharaan** | **Sangat Ringan**. Sekali konfigurasi di Cloudflare/Vercel/DNS, berjalan otomatis tanpa update kode. | Sedang. Harus memelihara pipeline CI/CD GitHub Actions dan tema dokumentasi. | Berat. Harus memelihara dua situs, dua sitemap, dua Search Console, dan konten ganda. |

---

### B. Analisis Risiko SEO Halaman Satelit

1. **Penalti Doorway Pages (Google Search Essentials Violation)**:
   - *Definisi*: Google mendefinisikan *doorway pages* sebagai situs atau halaman yang dibuat semata-mata untuk mengarahkan pengguna ke halaman lain, atau halaman yang mengagregasi lalu lintas pencarian tanpa memberikan nilai unik mandiri.
   - *Dampak*: Tindakan manual (*Manual Action*) berupa pencabutan seluruh domain dari indeks Google (*de-indexing*).
2. **Duplicate Content & Canonical Dilution**:
   - Jika teks profil, visi-misi, atau pengumuman di GitHub Pages sama persis dengan yang ada di situs web utama, algoritma Google akan memicu *duplicate filter*. 
   - Mesin pencari akan memilih salah satu secara sewenang-wenang sebagai kanonikal, yang sering kali justru merusak peringkat halaman utama jika halaman satelit terindeks lebih dulu.
3. **Keyword Cannibalization**:
   - Kedua halaman saling bersaing memperebutkan peringkat untuk kata kunci pencarian yang sama (misal: "OSIS SMAIT Fithrah Insani"), membagi klik dan mengurangi posisi puncak (*rank dilution*).

---

### C. Kapan Menggunakan Masing-Masing Pendekatan?

#### Kapan HARUS Menggunakan Direct 301 Redirect:
1. Domain sekunder dibeli atau dibuat hanya sebagai variasi salah ketik (*typo domain*), ekstensi lain (`.org` ke `.sch.id`), atau domain lama yang sudah bermigrasi.
2. Repositori GitHub Pages lama yang fungsinya sudah diserap sepenuhnya ke dalam aplikasi utama.
3. Target utama adalah mengarahkan 100% pengguna dan mesin pencari ke *single source of truth*.

#### Kapan BOLEH Menggunakan GitHub Pages sebagai Satelit / Mikrosit:
1. **Pemisahan Konteks Nyata**: Halaman tersebut berfungsi sebagai **Dokumentasi Teknis Pengembang / Repositori Sumber Terbuka** (misal: `agoraacta.github.io` berisi dokumentasi API internal, skema database, atau panduan kontribusi kode) yang pembacanya adalah pengembang, bukan audiens umum.
2. **Interactive Demo / Standalone Tool**: Halaman menyajikan aplikasi mandiri client-side (misal: *Tool Simulator Perhitungan Kuorum Mubes* atau *Kalkulator Bobot Suara*).
3. **Arsitektur Subdomain Resmi**: Menggunakan CNAME subdomain kustom (misal: `docs.agoraacta.sch.id`) yang terhubung langsung ke GitHub Pages, bukan domain acak terpisah.

---

### D. Best Practices Implementasi Jika Mempertahankan Halaman GitHub Pages

Bila repositori GitHub Pages tetap harus aktif untuk publikasi mandiri, terapkan aturan teknis berikut untuk mencegah penalti search engine:

#### 1. Pasang Cross-Domain Canonical Tag
Jika konten di GitHub Pages memiliki padanan atau sumber utama di situs utama, sematkan tag kanonikal lintas domain pada `<head>` dokumen GitHub Pages:
```html
<!-- Pada file index.html di GitHub Pages -->
<head>
  <meta charset="UTF-8" />
  <title>Dokumentasi Pengembang Sistem OSIS Agora Acta</title>
  <!-- Menegaskan bahwa master source berada di domain utama -->
  <link rel="canonical" href="https://agoraacta.sch.id/docs" />
</head>
```

#### 2. Berikan Nilai Tambah Unik (Distinct Value Proposition)
- Jangan pernah menduplikasi kata demi kata (*copy-paste*) artikel warta atau profil organisasi dari situs utama.
- Sajikan konten spesifik: diagram arsitektur teknis, catatan rilis (*changelog*), panduan instalasi lokal, atau tautan repositori Git.

#### 3. Kontrol Indeksasi Mesin Pencari
Jika halaman GitHub Pages murni berfungsi untuk hosting internal atau demonstrasi prototipe yang tidak ditargetkan bersaing di SERP publik, blokir indeksasi dengan meta robot:
```html
<meta name="robots" content="noindex, follow" />
```
*Catatan*: Direktif `noindex, follow` mencegah halaman bersaing di SERP namun tetap mengizinkan Googlebot merayapi dan meneruskan nilai tautan (*PageRank link juice*) ke domain utama melalui tautan kontekstual yang terpasang di halaman tersebut.

#### 4. Hubungkan Melalui Schema.org `sameAs`
Tautkan profil organisasi di situs utama dengan repositori atau akun GitHub resmi menggunakan properti `sameAs`:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OSIS SMAIT Fithrah Insani",
  "url": "https://agoraacta.sch.id",
  "sameAs": [
    "https://github.com/agoraacta",
    "https://instagram.com/agoraacta"
  ]
}
```

---

## 4. Rangkuman & Rekomendasi Tindakan untuk Agora Acta

1. **Aplikasi Web Utama (`agoraacta.sch.id`)**:
   - Terapkan metadata terstruktur (JSON-LD) untuk entitas `EducationalOrganization` dan `BreadcrumbList`.
   - Pastikan konfigurasi `sitemap.xml` dan `robots.txt` aktif dan didaftarkan di Google Search Console.
   - Optimalkan gambar hero menggunakan format WebP serta pertahankan skor Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1).

2. **Pengelolaan Aset GitHub Pages**:
   - Jika repositori GitHub Pages hanya digunakan untuk landing page duplikat atau pengalihan rute sementara: **Segera alihkan menggunakan 301 Permanent Redirect (Cloudflare Edge / DNS CNAME) langsung ke domain utama**.
   - Jika repositori GitHub Pages digunakan untuk dokumentasi teknis kode sumber: **Gunakan subdomain resmi `docs.agoraacta.sch.id`, sematkan konten teknis orisinil, dan pasang `rel="canonical"` silang atau `noindex` pada halaman yang bersifat non-publik**.

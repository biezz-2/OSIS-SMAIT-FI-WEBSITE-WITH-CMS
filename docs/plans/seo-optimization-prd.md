# PRD: SEO Optimization for OSIS SMAIT Fithrah Insani (Agora Acta)

## 1. Overview
Optimization of the website to improve visibility, indexability, and ranking on search engines (primarily Google) based on Google Search Central guidelines.

## 2. Current State Analysis
- **Metadata**: Basic metadata implemented in [`layout.tsx`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/layout.tsx).
- **Indexing**: [`robots.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/robots.ts) allows all crawlers.
- **Sitemap**: Static [`sitemap.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/sitemap.ts) exists but only covers top-level pages.
- **Language**: Correctly set to `id`.

## 3. Optimization Goals
- Increase organic traffic from local searches (Kab. Bandung Barat).
- Ensure all dynamic content (Program Kerja, Sekbid) is indexed.
- Improve Click-Through Rate (CTR) via optimized title tags and meta descriptions.
- Enhance accessibility and user experience (Core Web Vitals).

## 4. Technical Requirements

### 4.1 Dynamic Metadata
- **Action**: Implement `generateMetadata` in dynamic routes.
- **Target Files**: 
  - [`src/app/program-kerja/[slug]/page.tsx`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/program-kerja/[slug]/page.tsx)
  - [`src/app/sekbid/[sekbidId]/page.tsx`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/sekbid/[sekbidId]/page.tsx)
- **Reason**: Static metadata in layout is too generic for deep pages.

### 4.2 Dynamic Sitemap
- **Action**: Update [`sitemap.ts`](WEBSITE/AGORAACTA_WEBSITE/osis-smait-fi/src/app/sitemap.ts) to fetch and list all dynamic URLs from Strapi.
- **Reason**: Google needs to know about all program and sekbid pages to index them.

### 4.3 Content & HTML Structure
- **Action**: Audit heading hierarchy (`h1` -> `h2` -> `h3`).
- **Action**: Ensure all `<img>` tags have descriptive `alt` attributes.
- **Reason**: Helps crawlers understand content structure and improves accessibility.

### 4.4 Performance (Core Web Vitals)
- **Action**: Optimize image loading (Next.js `next/image` usage).
- **Action**: Review LCP (Largest Contentful Paint) on the home page.
- **Reason**: Page speed is a direct ranking factor.

## 5. Implementation Roadmap
1. **Phase 1 (Quick Wins)**: Dynamic Metadata for dynamic routes.
2. **Phase 2 (Indexability)**: Dynamic Sitemap implementation.
3. **Phase 3 (Content)**: Alt text audit and Heading structure cleanup.
4. **Phase 4 (Performance)**: Image optimization and PageSpeed audit.

## 6. Success Metrics
- Increase in "Indexed Pages" count in Google Search Console.
- Higher average position for keywords: "OSIS SMAIT Fithrah Insani", "Agora Acta".
- Improved PageSpeed Insights score.

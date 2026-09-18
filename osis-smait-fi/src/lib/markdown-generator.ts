import {
  fetchHalamanFromStrapi,
  fetchAllEventsForPage,
  fetchEventBySlug,
  fetchAllSekbidsFromStrapi,
  formatSekbidList,
  fetchAllAnggotaFromStrapi,
  fetchProgramKerjaFromStrapi,
} from '@/lib/strapi';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://osissmaitfi.biezz.my.id';

function estimateTokens(text: string): number {
  if (!text) return 0;
  // Standard heuristic: ~4 chars per token for Latin/Indonesian texts
  return Math.max(1, Math.ceil(text.length / 4));
}

function createFrontmatter(meta: { title: string; description: string; url: string; image?: string }): string {
  const lines = ['---'];
  lines.push(`title: "${meta.title.replace(/"/g, '\\"')}"`);
  lines.push(`description: "${meta.description.replace(/"/g, '\\"')}"`);
  lines.push(`url: "${meta.url}"`);
  if (meta.image) {
    lines.push(`image: "${meta.image}"`);
  }
  lines.push('---');
  return lines.join('\n');
}

export async function generateMarkdownForPath(pathname: string): Promise<{ markdown: string; tokens: number } | null> {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // 1. Root / Homepage
  if (cleanPath === '/') {
    const pageData = await fetchHalamanFromStrapi('home');
    const attrs = pageData?.attributes || pageData || {};
    const events = await fetchAllEventsForPage();

    const title = attrs.seo_title || attrs.judul_hero || 'OSIS SMAIT Fithrah Insani (Agora Acta)';
    const description =
      attrs.seo_description ||
      attrs.sub_judul ||
      'Website Resmi OSIS SMAIT Fithrah Insani (Agora Acta) - Dari Gagasan Menuju Aksi, dari Partisipasi Menuju Kontribusi.';

    const frontmatter = createFrontmatter({
      title,
      description: description.replace(/\n/g, ' '),
      url: SITE_URL,
      image: `${SITE_URL}/images/logo-osis.jpg`,
    });

    const activeEvents = (events || []).slice(0, 5).map((e: any) => {
      const item = e.attributes || e;
      const slug = item.slug || item.id;
      return `- [${item.nama || item.judul}](${SITE_URL}/events/${slug}): ${item.deskripsi ? item.deskripsi.slice(0, 150) + '...' : 'Kegiatan OSIS SMAIT FI'}`;
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.judul_hero || 'OSIS SMAIT Fithrah Insani (Agora Acta)'}`,
      '',
      `> ${attrs.sub_judul || 'Dari Gagasan Menuju Aksi, dari Partisipasi Menuju Kontribusi'}`,
      '',
      '## Profil Singkat',
      attrs.deskripsi ||
        'Agora Acta adalah ruang bersama tempat ide bertumbuh, kolaborasi terjadi, dan setiap kegiatan dihadirkan dengan tujuan nyata di lingkungan SMAIT Fithrah Insani.',
      '',
      '## Navigasi & Sumber Daya Publik',
      `- [Tentang Kami / Profil OSIS](${SITE_URL}/about)`,
      `- [Events & Agenda Kegiatan](${SITE_URL}/events)`,
      `- [Program Kerja & Seksi Bidang](${SITE_URL}/program-kerja)`,
      `- [Daftar Pengurus / Anggota](${SITE_URL}/anggota)`,
      `- [Galeri Dokumentasi Kegiatan](${SITE_URL}/galeri/galeri-preview-infinity)`,
      `- [Media Sosial & Podcast](${SITE_URL}/media-sosial)`,
      `- [Partners & Kontributor](${SITE_URL}/partners)`,
      '',
      '## Agenda Kegiatan Terbaru',
      activeEvents.length > 0 ? activeEvents.join('\n') : '- Belum ada agenda terbaru.',
      '',
      '## AI & Agent Access Points',
      `- MCP Server Card: [${SITE_URL}/.well-known/mcp/server-card.json](${SITE_URL}/.well-known/mcp/server-card.json)`,
      `- Agent Card (A2A): [${SITE_URL}/.well-known/agent-card.json](${SITE_URL}/.well-known/agent-card.json)`,
      `- API Catalog: [${SITE_URL}/.well-known/api-catalog](${SITE_URL}/.well-known/api-catalog)`,
      `- OpenAPI Spec: [${SITE_URL}/openapi.json](${SITE_URL}/openapi.json)`,
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 2. About page
  if (cleanPath === '/about') {
    const pageData = await fetchHalamanFromStrapi('about');
    const attrs = pageData?.attributes || pageData || {};

    const title = attrs.seo_title || 'Tentang Kami | OSIS SMAIT Fithrah Insani (Agora Acta)';
    const description =
      attrs.seo_description ||
      'Profil, visi misi, filosofi logo, sejarah, dan struktur kepengurusan OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.';

    const frontmatter = createFrontmatter({
      title,
      description,
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}/images/logo-osis.jpg`,
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.judul_hero || 'Tentang OSIS SMAIT Fithrah Insani'}`,
      '',
      `> ${attrs.sub_judul || 'Kepemimpinan berlandaskan nilai Qurani, integritas, dan kontribusi nyata.'}`,
      '',
      '## Visi & Misi',
      attrs.deskripsi ||
        'Mewujudkan wadah kepemimpinan siswa SMAIT Fithrah Insani yang aktif, berintegritas, dan inovatif dalam memberikan kontribusi berkelanjutan bagi sekolah dan masyarakat.',
      '',
      '## Filosofi Nama "Agora Acta"',
      '- **Agora**: Ruang pertemuan, ruang publik tempat pertukaran gagasan dan musyawarah.',
      '- **Acta**: Aksi, tindakan nyata, dan perwujudan dari setiap ide menuju karya nyata.',
      '',
      '## Tautan Terkait',
      `- [Struktur Anggota Pengurus](${SITE_URL}/anggota)`,
      `- [Program Kerja & Sekbid](${SITE_URL}/program-kerja)`,
      `- [Kembali ke Beranda](${SITE_URL})`,
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 3. Events List page
  if (cleanPath === '/events') {
    const events = await fetchAllEventsForPage();
    const pageData = await fetchHalamanFromStrapi('events');
    const attrs = pageData?.attributes || pageData || {};

    const title = attrs.seo_title || 'Events & Agenda Kegiatan | OSIS SMAIT Fithrah Insani';
    const description =
      attrs.seo_description ||
      'Daftar acara, event, kompetisi, dan agenda kegiatan OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.';

    const frontmatter = createFrontmatter({
      title,
      description,
      url: `${SITE_URL}/events`,
    });

    const eventList = (events || []).map((e: any) => {
      const item = e.attributes || e;
      const slug = item.slug || item.id;
      const date = item.tanggal_mulai ? ` (${new Date(item.tanggal_mulai).toLocaleDateString('id-ID')})` : '';
      const desc = item.deskripsi ? `\n  ${item.deskripsi.trim()}` : '';
      return `- **[${item.nama || item.judul}](${SITE_URL}/events/${slug})**${date}${desc}`;
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.judul_hero || 'Events & Agenda Kegiatan'}`,
      '',
      `> ${attrs.sub_judul || 'Saksikan dan ikuti berbagai event serta ajang pengembangan bakat OSIS SMAIT Fithrah Insani.'}`,
      '',
      '## Daftar Event',
      eventList.length > 0 ? eventList.join('\n\n') : 'Tidak ada agenda event saat ini.',
      '',
      '## API Endpoint Terkait',
      `- Public Events JSON API: \`GET ${SITE_URL}/api/events\``,
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 4. Single Event Detail: /events/[slug]
  if (cleanPath.startsWith('/events/')) {
    const slug = decodeURIComponent(cleanPath.replace('/events/', ''));
    const eventData = await fetchEventBySlug(slug);
    if (!eventData) return null;

    const attrs = eventData.attributes || eventData;
    const title = `${attrs.nama || attrs.judul} | Event OSIS SMAIT Fithrah Insani`;
    const description = attrs.ringkasan || (attrs.deskripsi ? attrs.deskripsi.slice(0, 160) : 'Detail agenda event OSIS SMAIT FI');

    const frontmatter = createFrontmatter({
      title,
      description,
      url: `${SITE_URL}/events/${slug}`,
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.nama || attrs.judul}`,
      attrs.tema ? `\n**Tema**: ${attrs.tema}\n` : '',
      attrs.tanggal_mulai ? `**Tanggal**: ${new Date(attrs.tanggal_mulai).toLocaleDateString('id-ID')}` : '',
      attrs.lokasi ? `**Lokasi**: ${attrs.lokasi}` : '',
      '',
      '## Deskripsi Kegiatan',
      attrs.deskripsi || 'Belum ada rincian deskripsi untuk event ini.',
      '',
      attrs.cta_url ? `## Tautan Pendaftaran / Info Lanjutan\n- [Kunjungi Halaman Pendaftaran](${attrs.cta_url})` : '',
      '',
      '## Navigasi',
      `- [Kembali ke Daftar Events](${SITE_URL}/events)`,
    ].filter(Boolean).join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 5. Program Kerja page
  if (cleanPath === '/program-kerja') {
    const [pageData, rawSekbids] = await Promise.all([
      fetchHalamanFromStrapi('program-kerja'),
      fetchAllSekbidsFromStrapi(),
    ]);
    const attrs = pageData?.attributes || pageData || {};
    const sekbidList = formatSekbidList(rawSekbids);

    const title = attrs.seo_title || 'Program Kerja & Seksi Bidang | OSIS SMAIT Fithrah Insani';
    const description =
      attrs.seo_description ||
      'Daftar program kerja unggulan, seksi bidang (Sekbid), dan rencana aksi OSIS SMAIT Fithrah Insani (Agora Acta).';

    const frontmatter = createFrontmatter({
      title,
      description,
      url: `${SITE_URL}/program-kerja`,
    });

    const sekbidItems = (sekbidList || []).map((s) => {
      return `### Sekbid ${s.number}: ${s.title || s.name}\n- **Deskripsi**: ${s.description || '-'}\n- [Lihat Rincian Sekbid ${s.number}](${SITE_URL}${s.link})`;
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.judul_hero || 'Program Kerja & Seksi Bidang'}`,
      '',
      `> ${attrs.sub_judul || 'Rencana aksi, program unggulan, dan pembinaan karakter melalui 8 Seksi Bidang OSIS SMAIT FI.'}`,
      '',
      '## Seksi Bidang (Sekbid)',
      sekbidItems.join('\n\n'),
      '',
      '## Catatan Akses AI',
      'Untuk rincian proker tingkat sidang legislatif (Musyawarah Besar), sesi bersifat internal dan dilindungi otentikasi murid/sekolah.',
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 6. Single Program Kerja Detail: /program-kerja/[slug]
  if (cleanPath.startsWith('/program-kerja/')) {
    const slug = decodeURIComponent(cleanPath.replace('/program-kerja/', ''));
    const prokerData = await fetchProgramKerjaFromStrapi(slug);
    if (!prokerData) return null;

    const attrs = prokerData.attributes || prokerData;
    const title = `${attrs.judul} | Program Kerja OSIS SMAIT Fithrah Insani`;
    const description = attrs.deskripsi ? attrs.deskripsi.slice(0, 160) : 'Detail program kerja OSIS SMAIT FI';

    const frontmatter = createFrontmatter({
      title,
      description,
      url: `${SITE_URL}/program-kerja/${slug}`,
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.judul}`,
      '',
      '## Deskripsi Program Kerja',
      attrs.deskripsi || '-',
      '',
      attrs.tujuan ? `## Tujuan\n${attrs.tujuan}\n` : '',
      attrs.target_sasaran ? `## Target Sasaran\n${attrs.target_sasaran}\n` : '',
      '## Navigasi',
      `- [Kembali ke Daftar Program Kerja](${SITE_URL}/program-kerja)`,
    ].filter(Boolean).join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 7. Anggota / Pengurus OSIS
  if (cleanPath === '/anggota') {
    const [pageData, members] = await Promise.all([
      fetchHalamanFromStrapi('anggota'),
      fetchAllAnggotaFromStrapi(),
    ]);
    const attrs = pageData?.attributes || pageData || {};

    const title = attrs.seo_title || 'Anggota & Pengurus | OSIS SMAIT Fithrah Insani (Agora Acta)';
    const description =
      attrs.seo_description ||
      'Susunan pengurus inti, Badan Pengurus Harian (BPH), dan seksi bidang OSIS SMAIT Fithrah Insani.';

    const frontmatter = createFrontmatter({
      title,
      description,
      url: `${SITE_URL}/anggota`,
    });

    const memberList = (members || []).map((m: any) => {
      const item = m.attributes || m;
      return `- **${item.nama_lengkap}** (${item.jabatan || 'Pengurus'}) - Divisi: ${item.divisi || '-'}`;
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.judul_hero || 'Struktur Pengurus OSIS SMAIT Fithrah Insani'}`,
      '',
      `> ${attrs.sub_judul || 'Mengenal para pemimpin muda di balik dedikasi Agora Acta.'}`,
      '',
      '## Daftar Pengurus Aktif',
      memberList.length > 0 ? memberList.join('\n') : 'Data pengurus belum tersedia.',
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 8. Media Sosial
  if (cleanPath === '/media-sosial') {
    const pageData = await fetchHalamanFromStrapi('media-sosial');
    const attrs = pageData?.attributes || pageData || {};

    const title = attrs.seo_title || 'Media Sosial | OSIS SMAIT Fithrah Insani';
    const description =
      attrs.seo_description ||
      'Kanal komunikasi dan media sosial resmi OSIS SMAIT Fithrah Insani (Instagram, TikTok, YouTube, Podcast).';

    const frontmatter = createFrontmatter({
      title,
      description,
      url: `${SITE_URL}/media-sosial`,
    });

    const content = [
      frontmatter,
      '',
      `# ${attrs.judul_hero || 'Media Sosial & Kanal Komunikasi'}`,
      '',
      'Kunjungi dan ikuti kanal resmi OSIS SMAIT Fithrah Insani (Agora Acta):',
      '- **Instagram**: [@osissmaitfi](https://www.instagram.com/osissmaitfi)',
      '- **YouTube**: [@osissmaitfithrahinsani9481](https://www.youtube.com/@osissmaitfithrahinsani9481)',
      '- **TikTok**: [@osissmaitfi](https://www.tiktok.com/@osissmaitfi)',
      `- **Podcast Spotify RSS**: [Spotify Feed](${SITE_URL}/api/spotify-rss)`,
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 9. Partners & Kontributor
  if (cleanPath === '/partners') {
    const frontmatter = createFrontmatter({
      title: 'Partners & Kontributor | OSIS SMAIT Fithrah Insani',
      description: 'Daftar mitra, sponsor, dan pendukung kegiatan OSIS SMAIT Fithrah Insani.',
      url: `${SITE_URL}/partners`,
    });

    const content = [
      frontmatter,
      '',
      '# Partners & Kontributor',
      '',
      'Terima kasih kepada seluruh mitra, civitas akademika SMAIT Fithrah Insani, komite sekolah, dan donatur yang senantiasa mendukung kesuksesan seluruh agenda dan program kerja Agora Acta.',
      '',
      `- [Hubungi Kerjasama / Kontak](${SITE_URL}/about)`,
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 10. Privacy Policy
  if (cleanPath === '/privacy-policy') {
    const frontmatter = createFrontmatter({
      title: 'Kebijakan Privasi | OSIS SMAIT Fithrah Insani',
      description: 'Kebijakan privasi pengunjung dan perlindungan data pribadi website OSIS SMAIT FI.',
      url: `${SITE_URL}/privacy-policy`,
    });

    const content = [
      frontmatter,
      '',
      '# Kebijakan Privasi',
      '',
      'Website OSIS SMAIT Fithrah Insani menghormati dan melindungi privasi setiap pengunjung. Kami hanya mengumpulkan data teknis telemetri dasar (seperti resolusi dan browser) secara anonim untuk peningkatan performa tampilan.',
      '',
      'Data otentikasi siswa untuk Musyawarah Besar (MUBES) dikelola secara aman menggunakan Clerk SSO dan diverifikasi oleh admin sekolah.',
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 11. Edufest Infinity
  if (cleanPath === '/edufest-infinity') {
    const frontmatter = createFrontmatter({
      title: 'EDUFEST - INFINITY | OSIS SMAIT Fithrah Insani',
      description: 'Event tahunan edukasi, teknologi, dan amal yang diselenggarakan oleh SMAIT & SMK Informatika Fithrah Insani.',
      url: `${SITE_URL}/edufest-infinity`,
    });

    const content = [
      frontmatter,
      '',
      '# EDUFEST - INFINITY',
      '',
      '> Event Tahunan Edukasi, Teknologi & Amal SMAIT Fithrah Insani.',
      '',
      'Edufest merupakan event tahunan yang dilaksanakan oleh SMA IT Fithrah Insani dan SMK Informatika Fithrah Insani yang berisi kegiatan perlombaan untuk mewadahi bakat kreatif Siswa/i SMP/MTs sederajat dalam bidang Pendidikan dan Teknologi, serta melatih meningkatkan kepedulian terhadap sesama manusia melalui kegiatan amal.',
      '',
      '## Navigasi Edufest',
      `- [Jadwal & Timeline](${SITE_URL}/edufest-infinity/timeline)`,
      `- [Lokasi Kegiatan](${SITE_URL}/edufest-infinity/location)`,
      `- [Struktur Panitia](${SITE_URL}/edufest-infinity/panitia)`,
    ].join('\n');

    return { markdown: content, tokens: estimateTokens(content) };
  }

  // 12. Sekbid Detail: /sekbid/[sekbidId]
  if (cleanPath.startsWith('/sekbid/')) {
    const sekbidMatch = cleanPath.match(/\/sekbid\/(sekbid-\d+)/);
    if (sekbidMatch) {
      const rawSekbids = await fetchAllSekbidsFromStrapi();
      const sekbidList = formatSekbidList(rawSekbids);
      const target = (sekbidList || []).find(
        (s) => s.link.includes(sekbidMatch[1]) || `sekbid-${s.number}` === sekbidMatch[1]
      );

      if (target) {
        const title = `Sekbid ${target.number}: ${target.title || target.name} | OSIS SMAIT FI`;
        const description = target.description || `Rincian program kerja dan kegiatan Seksi Bidang ${target.number}.`;

        const frontmatter = createFrontmatter({
          title,
          description,
          url: `${SITE_URL}${cleanPath}`,
        });

        const content = [
          frontmatter,
          '',
          `# Seksi Bidang ${target.number}: ${target.title || target.name}`,
          '',
          '## Gambaran Umum',
          target.description || 'Seksi bidang aktif kepengurusan OSIS SMAIT Fithrah Insani.',
          '',
          '## Navigasi',
          `- [Semua Program Kerja](${SITE_URL}/program-kerja)`,
          `- [Beranda](${SITE_URL})`,
        ].filter(Boolean).join('\n');

        return { markdown: content, tokens: estimateTokens(content) };
      }
    }
  }

  // Default fallback for any public page
  return null;
}

"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchMediaAssetByKey, getStrapiMediaUrl } from '@/lib/strapi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';

// ponytail: minimal safe iframe wrapper. Upgrade to oEmbed API calls if richer previews needed.
function EmbedIframe({ src, platform, fallbackLink, aspectRatio = '16/9' }: {
  src: string;
  platform: string;
  fallbackLink?: string;
  aspectRatio?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const platformColors: Record<string, string> = {
      youtube: '#FF0000', instagram: '#E1306C', tiktok: '#000000', spotify: '#1DB954',
    };
    const color = platformColors[platform] || '#7A9EAD';
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-12 px-6 bg-gray-50 rounded-2xl border border-gray-200">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        <p className="text-sm text-gray-500 font-inter text-center">Embed tidak dapat dimuat</p>
        {fallbackLink && (
          <a
            href={fallbackLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-white text-xs font-bold rounded-full font-inter transition-colors"
            style={{ backgroundColor: color }}
          >
            Buka di {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl" style={{ aspectRatio }}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        className="w-full h-full border-0"
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}


interface SosmedHubProps {
  initialData?: any;
}

export default function SosmedHub({ initialData }: SosmedHubProps) {
  const attrs = initialData ? (initialData.attributes || initialData) : null;

  // Custom titles & details
  const displayTitle = attrs?.judul_hero || 'Hub Media Sosial';
  const displaySubtitle = attrs?.sub_judul || 'Koneksi dan Terhubung dengan Kami';
  const displayDescription = attrs?.deskripsi || 'Tetap terhubung dengan aktivitas, berita, dan karya terbaru dari OSIS SMAIT Fithrah Insani melalui seluruh platform digital kami.';

  const metadata = attrs?.metadata_json || {};
  const socialAccounts = metadata.social_accounts || {};
  const embeds = {
    youtube: attrs?.embed_youtube || metadata.embeds?.youtube || '',
    spotify: attrs?.embed_spotify || metadata.embeds?.spotify || '',
    tiktok: attrs?.embed_tiktok || metadata.embeds?.tiktok || '',
    instagram: attrs?.embed_instagram || metadata.embeds?.instagram || '',
  };

  const instagramLink = attrs?.link_instagram || socialAccounts.instagram?.link || 'https://www.instagram.com/osissmaitfi?igsh=MTRyMW43d2psd3gwaQ==';
  const tiktokLink = attrs?.link_tiktok || socialAccounts.tiktok?.link || 'https://www.tiktok.com/@osissmaitfi?_r=1&_t=ZS-98SucgDTG2Z';
  const youtubeLink = attrs?.link_youtube || socialAccounts.youtube?.link || 'https://www.youtube.com/@osissmaitfithrahinsani9481';
  const spotifyLink = attrs?.link_spotify || socialAccounts.spotify?.link || 'https://spotify.com';

  const ctaTexts = metadata.cta_texts || {};
  const instagramCtaText = attrs?.cta_instagram || ctaTexts.instagram || socialAccounts.instagram?.cta_text || 'Kunjungi';
  const tiktokCtaText = attrs?.cta_tiktok || ctaTexts.tiktok || socialAccounts.tiktok?.cta_text || 'Kunjungi';
  const youtubeCtaText = attrs?.cta_youtube || ctaTexts.youtube || socialAccounts.youtube?.cta_text || 'Kunjungi';
  const spotifyCtaText = attrs?.cta_spotify || ctaTexts.spotify || socialAccounts.spotify?.cta_text || 'Kunjungi';

  // RSS Spotify State
  const [rssEpisodes, setRssEpisodes] = useState<any[]>([]);
  const [rssLoading, setRssLoading] = useState(false);

  const rssUrl = attrs?.rss_spotify || metadata.rss_spotify || 'https://anchor.fm/s/1eccd468/podcast/rss';
  const maxEpisodes = attrs?.max_rss_episodes || metadata.max_rss_episodes || 5;

  useEffect(() => {
    async function fetchRss() {
      if (!rssUrl) return;
      setRssLoading(true);
      try {
        const res = await fetch(`/api/spotify-rss?url=${encodeURIComponent(rssUrl)}&limit=${maxEpisodes}`);
        const data = await res.json();
        if (data.items) {
          setRssEpisodes(data.items);
        }
      } catch (err) {
        console.error('Failed to fetch Spotify RSS:', err);
      } finally {
        setRssLoading(false);
      }
    }
    fetchRss();
  }, [rssUrl, maxEpisodes]);

  const [activeTab, setActiveTab] = useState('all');
  const [animating, setAnimating] = useState(false);

  const [bgBanner, setBgBanner] = useState(() => {
    if (attrs?.banner_image) {
      return getStrapiMediaUrl(attrs.banner_image, '/media/sosmed/sosmed_bg.jpg');
    }
    return '/media/sosmed/sosmed_bg.jpg';
  });

  useEffect(() => {
    if (attrs?.banner_image) return;
    async function loadBanner() {
      const asset = await fetchMediaAssetByKey('sosmed-bg', '/media/sosmed/sosmed_bg.jpg');
      if (asset?.src) setBgBanner(asset.src);
    }
    loadBanner();
  }, [attrs?.banner_image]);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    kelas: '',
    category: 'instagram',
    suggestion: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Filter animation state update
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    } else if (typeof document !== "undefined") {
      const existingScript = document.getElementById("instagram-embed-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "instagram-embed-script";
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [activeTab, embeds]);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.suggestion) return;

    setFormStatus('submitting');
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          kelas: formData.kelas,
          category: formData.category,
          suggestion: formData.suggestion,
        }),
      });

      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', kelas: '', category: 'instagram', suggestion: '' });
        setTimeout(() => {
          setFormStatus('idle');
        }, 4000);
      } else {
        console.error('Failed to send suggestion to inbox API');
        setFormStatus('idle');
      }
    } catch (err) {
      console.error('Error submitting suggestion to inbox API:', err);
      setFormStatus('idle');
    }
  };

  // Embed Helper: Transform raw link (YouTube/Spotify/TikTok/Instagram) or HTML iframe string into renderable embed HTML
  const getEmbedHtml = (val: string | undefined): string | null => {
    if (!val || typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (!trimmed) return null;

    // If it's already an iframe or html tag, return directly
    if (trimmed.startsWith('<')) return trimmed;

    // 1. YouTube URL parsing
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      let videoId = '';
      if (trimmed.includes('youtu.be/')) {
        videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
      } else if (trimmed.includes('watch?v=')) {
        videoId = trimmed.split('watch?v=')[1]?.split('&')[0];
      } else if (trimmed.includes('embed/')) {
        videoId = trimmed.split('embed/')[1]?.split('?')[0];
      } else if (trimmed.includes('shorts/')) {
        videoId = trimmed.split('shorts/')[1]?.split('?')[0];
      }
      if (videoId) {
        return `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="w-full rounded-2xl"></iframe>`;
      }
    }

    // 2. Spotify URL parsing (playlist, track, episode, show, album)
    if (trimmed.includes('spotify.com')) {
      let embedUrl = trimmed;
      if (!trimmed.includes('/embed/')) {
        embedUrl = trimmed.replace('open.spotify.com/', 'open.spotify.com/embed/');
      }
      return `<iframe style="border-radius:12px" src="${embedUrl}" width="100%" height="380" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="w-full"></iframe>`;
    }

    // 3. TikTok Video URL parsing
    if (trimmed.includes('tiktok.com')) {
      const match = trimmed.match(/\/video\/(\d+)/);
      const videoId = match ? match[1] : '';
      if (videoId) {
        return `<iframe src="https://www.tiktok.com/embed/v2/${videoId}" width="100%" height="580" frameborder="0" allow="fullscreen; autoplay; encrypted-media" allowfullscreen class="w-full rounded-2xl"></iframe>`;
      }
    }

    // 4. Instagram URL parsing (p, reel)
    if (trimmed.includes('instagram.com')) {
      let cleanUrl = trimmed.split('?')[0];
      if (!cleanUrl.endsWith('/')) cleanUrl += '/';
      return `<blockquote class="instagram-media w-full" data-instgrm-permalink="${cleanUrl}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:16px; margin:0 auto; max-width:540px; min-width:326px; padding:0; width:100%;"></blockquote>`;
    }

    return null;
  };

  // Embeds available for "all" tab
  const allEmbedCodes = useMemo(() => {
    const list: { platform: string; html: string }[] = [];
    ['youtube', 'instagram', 'tiktok', 'spotify'].forEach(platform => {
      const html = getEmbedHtml((embeds as Record<string, string>)[platform]);
      if (html) list.push({ platform, html });
    });
    return list;
  }, [embeds]);

  const activeEmbedCode = activeTab === 'all' ? null : getEmbedHtml((embeds as Record<string, string>)[activeTab]);

  return (
    <section className="w-full bg-[#FAFBFC] min-h-screen py-16 px-4 md:px-8 lg:px-16 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Breadcrumb & Subtitle */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A9EAD] tracking-wider uppercase font-inter">
            <span>Beranda</span>
            <span>/</span>
            <span className="text-[#101828]">Media Sosial</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200/60 pb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair tracking-tight text-[#101828]">
                {displayTitle}
              </h1>
              <p className="text-[#6A7282] text-sm md:text-base max-w-[580px] mt-3 leading-relaxed font-inter">
                {displaySubtitle && <span className="block font-bold text-[#101828] mb-1">{displaySubtitle}</span>}
                {displayDescription}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Split Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">

          {/* LEFT: Feed Section with Tab Filters (Takes 8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6 w-full">

            {/* Filter Navigation */}
            <div className="bg-white p-1.5 rounded-2xl border border-gray-200/50 shadow-sm flex flex-wrap gap-1 md:gap-2">
              {[
                { id: 'all', label: 'Semua', icon: null },
                { id: 'instagram', label: 'Instagram', color: '#FD1D1D' },
                { id: 'tiktok', label: 'TikTok', color: '#000000' },
                { id: 'youtube', label: 'YouTube', color: '#FF0000' },
                { id: 'spotify', label: 'Spotify', color: '#1DB954' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold font-inter transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-[#101828] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                >
                  {tab.id !== 'all' && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tab.color }}
                    />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Feeds Grid Container */}
            <div className={`w-full transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                {/* Render Spotify Podcast RSS feed when activeTab is 'all' or 'spotify' */}
                {(activeTab === 'all' || activeTab === 'spotify') && rssEpisodes.length > 0 && (
                  <div className="flex flex-col gap-4 w-full mb-8">
                    <h3 className="text-lg font-bold text-[#101828] font-inter mb-1 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
                      Episode Podcast Terbaru (Spotify)
                    </h3>
                    <div className="flex flex-col gap-3">
                      {rssEpisodes.map((ep, idx) => (
                        <div key={idx} className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                          {ep.imageUrl && (
                            <img src={ep.imageUrl} alt={ep.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                          )}
                          <div className="flex-1 flex flex-col gap-1 w-full">
                            <h4 className="text-base font-bold text-[#101828] font-inter">{ep.title}</h4>
                            <p className="text-xs text-gray-500 font-inter line-clamp-2">{ep.description}</p>
                            {ep.audioUrl && (
                              <audio controls preload="metadata" className="w-full mt-2 h-8" src={`/api/audio-proxy?url=${encodeURIComponent(ep.audioUrl)}`}>
                                Browser Anda tidak mendukung elemen audio.
                              </audio>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'all' && allEmbedCodes.length > 0 ? (
                  <div className="flex flex-col gap-6 mb-8 w-full">
                    {allEmbedCodes.map((item, index) => (
                      <div
                        key={index}
                        className="w-full rounded-3xl overflow-hidden border border-gray-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: item.html }}
                      />
                    ))}
                  </div>
                ) : activeEmbedCode ? (
                  <div
                    className="w-full rounded-3xl overflow-hidden border border-gray-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-h-[500px] flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: activeEmbedCode }}
                  />
                ) : activeTab !== 'all' && activeTab !== 'spotify' ? (
                  <div className="w-full flex flex-col items-center justify-center gap-3 py-16 px-6 bg-white rounded-3xl border border-gray-200">
                    <p className="text-sm text-gray-500 font-inter text-center">
                      {rssLoading ? 'Memuat RSS podcast Spotify...' : 'Belum ada embed live yang diatur untuk platform ini.'}
                    </p>
                  </div>
                ) : null}
              </div>

          </div>

          {/* RIGHT: Saran Konten Form (Takes 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-8 w-full">

            {/* Widget: Saran Konten Form (Glass Card Login Style) */}
            <GlassCard glowColor="rgba(122, 158, 173, 0.3)" className="relative flex flex-col gap-5">
              {formStatus === 'submitting' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-20 rounded-3xl">
                  <div className="w-8 h-8 border-4 border-[#7A9EAD] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-[#101828] font-inter">Mengirim ide kreatif...</span>
                </div>
              )}

              {formStatus === 'success' && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 gap-3 z-20 rounded-3xl animate-fade-in">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                    <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-[#101828] font-inter">Terima Kasih!</h4>
                  <p className="text-xs text-[#6A7282] max-w-[220px] font-inter leading-relaxed">
                    Saran ide konten kamu berhasil terkirim. Tim kreatif OSIS akan segera mengulasnya!
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1.5 border-b border-gray-200/50 pb-4">
                <h3 className="text-[#101828] text-xl font-extrabold font-inter flex items-center gap-2.5">
                  <span className="p-2 bg-[#7A9EAD]/15 text-[#7A9EAD] rounded-2xl backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008Zm.37 0h.008v.008h-.008v-.008Zm.37 0h.008v.008h-.008v-.008Zm2 .478v-.007a1.002 1.002 0 0 1-1.002-1.002v-3.75a1.002 1.002 0 0 1 1.002-1.002h2.25a1.002 1.002 0 0 1 1.002 1.002v3.75a1.002 1.002 0 0 1-1.002 1.002H11.5v.007Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </span>
                  Feedback & Ide Konten
                </h3>
                <p className="text-[#6A7282] text-xs font-inter leading-relaxed">
                  Punya ide postingan Instagram, TikTok, atau podcast? Sampaikan masukanmu langsung di sini!
                </p>
              </div>

              {/* Glassmorphism Form Fields */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name-input" className="text-xs font-bold text-[#101828] font-inter">Nama Lengkap *</label>
                  <Input
                    id="name-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nama kamu..."
                    required
                    className="bg-white/50 backdrop-blur-sm border-white/80 focus:bg-white/90 focus:border-[#7A9EAD] transition-all rounded-2xl shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="kelas-input" className="text-xs font-bold text-[#101828] font-inter">Kelas</label>
                  <Input
                    id="kelas-input"
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    placeholder="Contoh: XI-MIPA 1"
                    className="bg-white/50 backdrop-blur-sm border-white/80 focus:bg-white/90 focus:border-[#7A9EAD] transition-all rounded-2xl shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category-select" className="text-xs font-bold text-[#101828] font-inter">Kategori Media</label>
                  <select
                    id="category-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-11 bg-white/50 backdrop-blur-sm border border-white/80 focus:border-[#7A9EAD] focus:bg-white/90 focus:ring-2 focus:ring-[#7A9EAD]/30 rounded-2xl px-4 py-2.5 text-xs md:text-sm font-sans outline-none transition-all shadow-inner"
                  >
                    <option value="instagram">Instagram Feed / Story</option>
                    <option value="tiktok">TikTok Video</option>
                    <option value="youtube">YouTube Video / Live</option>
                    <option value="spotify">Podcast Agora Talk</option>
                    <option value="lainnya">Ide Umum Lainnya</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="suggestion-input" className="text-xs font-bold text-[#101828] font-inter">Saran Ide *</label>
                  <Textarea
                    id="suggestion-input"
                    name="suggestion"
                    value={formData.suggestion}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tulis ide detail konten kamu di sini..."
                    required
                    className="bg-white/50 backdrop-blur-sm border-white/80 focus:bg-white/90 focus:border-[#7A9EAD] transition-all rounded-2xl shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!formData.name || !formData.suggestion}
                  className="w-full py-3.5 bg-[#101828] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-xs md:text-sm font-bold font-inter hover:bg-[#101828]/90 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2 group/btn relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Kirim Saran
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                </button>
              </form>
            </GlassCard>

          </div>

        </div>

      </div>
    </section>
  );
}

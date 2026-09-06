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

  // Stat card fields (from Strapi attributes with metadata_json and static fallback)
  const statReachLabel = attrs?.stat_reach_label || metadata.stat_reach_label || 'ESTIMASI JANGKAUAN';
  const statReachValue = attrs?.stat_reach_value || metadata.stat_reach_value || '2.5K+';
  const statReachTrend = attrs?.stat_reach_trend || metadata.stat_reach_trend || '+12% Bulan ini';

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
  const showProfileCards = true;

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

            {/* Total Reach Dashboard */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 min-w-[260px] self-stretch md:self-auto hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#7A9EAD]/10 rounded-xl text-[#7A9EAD] shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.342 9.342 0 0 1 12.5 19.5a9.34 9.34 0 0 1-2.5-.373m0 0v-.003c0-1.113.285-2.16.786-3.07M10 19.128v.11c-.347.009-.693-.02-1.03-.09A9.308 9.308 0 0 1 4.5 18.046M10 19.128c-.753-.548-1.38-1.258-1.824-2.072M9.25 10.5c0 .414-.336.75-.75.75h-2.25a.75.75 0 0 1-.75-.75v-2.25c0-.414.336-.75.75-.75h2.25c.414 0 .75.336.75.75v2.25Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase font-inter">{statReachLabel}</span>
                <span className="text-[#101828] text-2xl font-extrabold font-inter leading-none">{statReachValue}</span>
                {statReachTrend && (
                  <span className="text-[#00BC7D] text-xs font-semibold font-inter mt-1 flex items-center gap-1">
                    <span>{statReachTrend}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {showProfileCards && (<>
          {/* SECTION 1: Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

            {/* Card 1: Instagram */}
            <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] rounded-3xl p-6 text-white flex flex-col justify-between h-[210px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/25 px-2 py-0.5 rounded-md backdrop-blur-sm">INSTAGRAM</span>
              </div>

              <div>
                <span className="text-[11px] font-medium opacity-80 block font-inter">
                  {attrs?.ig_handle || socialAccounts.instagram?.handle || '@osissmaitfi'}
                </span>
                <h3 className="text-xl font-bold font-inter mt-0.5">
                  {attrs?.ig_name || socialAccounts.instagram?.name || 'Osis SMAIT FI'}
                </h3>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black font-inter leading-none">
                      {attrs?.ig_followers || socialAccounts.instagram?.followers || '1,203'}
                    </span>
                    <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">FOLLOWER</span>
                  </div>
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-white text-[#FD1D1D] rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                  >
                    {instagramCtaText}
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: TikTok */}
            <div className="bg-[#09090B] border border-gray-800 rounded-3xl p-6 text-white flex flex-col justify-between h-[210px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.14.99 1.13 2.37 1.83 3.86 2.02v3.86c-1.08-.02-2.13-.24-3.13-.67-.85-.36-1.63-.9-2.28-1.57v7.54c.03 2.16-.72 4.26-2.12 5.88-1.39 1.62-3.37 2.62-5.51 2.78-2.58.19-5.16-.78-6.91-2.65C.2 17.06-.52 14.18-.32 11.58c.2-2.58 1.68-4.94 3.96-6.19 1.48-.81 3.16-1.18 4.84-1.07V8.2c-1.13-.08-2.26.23-3.17.92-.91.69-1.5 1.76-1.63 2.91-.25 2.19 1.29 4.19 3.47 4.5 1.58.23 3.2-.42 4.04-1.78.36-.59.54-1.28.53-1.97V.02z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded-md">TIKTOK</span>
              </div>

              <div>
                <span className="text-[11px] font-medium opacity-80 block font-inter">
                  {attrs?.tiktok_handle || socialAccounts.tiktok?.handle || '@osissmaitfi'}
                </span>
                <h3 className="text-xl font-bold font-inter mt-0.5">
                  {attrs?.tiktok_name || socialAccounts.tiktok?.name || 'Osis SMAIT FI'}
                </h3>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black font-inter leading-none">
                      {attrs?.tiktok_followers || socialAccounts.tiktok?.followers || '144'}
                    </span>
                    <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">FOLLOWER</span>
                  </div>
                  <a
                    href={tiktokLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-white text-black rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                  >
                    {tiktokCtaText}
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: YouTube */}
            <div className="bg-[#FF0000] rounded-3xl p-6 text-white flex flex-col justify-between h-[210px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-md">YOUTUBE</span>
              </div>

              <div>
                <span className="text-[11px] font-medium opacity-80 block font-inter">
                  {attrs?.youtube_handle || socialAccounts.youtube?.handle || '@osissmaitfithrahinsani9481'}
                </span>
                <h3 className="text-xl font-bold font-inter mt-0.5">
                  {attrs?.youtube_name || socialAccounts.youtube?.name || 'SMAIT Fithrah Insani'}
                </h3>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black font-inter leading-none">
                      {attrs?.youtube_subscribers || socialAccounts.youtube?.followers || '267'}
                    </span>
                    <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">SUBSCRIBER</span>
                  </div>
                  <a
                    href={youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-white text-[#FF0000] rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                  >
                    {youtubeCtaText}
                  </a>
                </div>
              </div>
            </div>

            {/* Card 4: Spotify */}
            <div className="bg-[#1DB954] rounded-3xl p-6 text-white flex flex-col justify-between h-[210px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.337.136-.669.471-.745 3.854-.88 7.15-.502 9.81 1.13.295.178.387.562.207.857zm1.226-2.724c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.667-1.11 8.23-.57 11.345 1.343.367.227.487.708.26 1.075zm.106-2.836C14.393 8.74 8.56 8.547 5.17 9.575c-.528.16-1.08-.14-1.24-.668-.16-.528.14-1.08.668-1.24C8.5 6.45 14.935 6.67 19.043 9.11c.475.282.63.897.347 1.37-.282.474-.897.63-1.37.347z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-md">SPOTIFY</span>
              </div>

              <div>
                <span className="text-[11px] font-medium opacity-80 block font-inter">
                  {attrs?.spotify_handle || socialAccounts.spotify?.handle || 'OSIS Podcast'}
                </span>
                <h3 className="text-xl font-bold font-inter mt-0.5">
                  {attrs?.spotify_name || socialAccounts.spotify?.name || 'Agora Talk'}
                </h3>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black font-inter leading-none">
                      {attrs?.spotify_listeners || socialAccounts.spotify?.followers || '436'}
                    </span>
                    <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">PENDENGAR</span>
                  </div>
                  <a
                    href={spotifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-white text-[#1DB954] rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                  >
                    {spotifyCtaText}
                  </a>
                </div>
            </div>

          </div>

        </div>
        </>)}

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

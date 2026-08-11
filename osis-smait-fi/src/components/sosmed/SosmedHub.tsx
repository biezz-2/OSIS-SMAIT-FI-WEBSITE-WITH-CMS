"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { fetchMediaAssetByKey, getStrapiMediaUrl } from '@/lib/strapi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock Data for Feeds
const FEEDS_DATA = [
  {
    id: 1,
    platform: 'instagram',
    image: 'https://placehold.co/600x600/185FA5/FFF?text=Media+OSIS?auto=format&fit=crop&w=600&h=600&q=80',
    title: 'Instagram Post',
    caption: 'Selamat Hari Pendidikan Nasional! Mari kita terus belajar demi masa depan gemilang 🎓✨ #Hardiknas #OsisSMAITFI #AgoraActa',
    likes: '142',
    date: '1 hari yang lalu',
    handle: '@osissmaitfi',
    link: 'https://www.instagram.com/osissmaitfi?igsh=MTRyMW43d2psd3gwaQ=='
  },
  {
    id: 2,
    platform: 'youtube',
    image: 'https://placehold.co/600x600/185FA5/FFF?text=Media+OSIS?auto=format&fit=crop&w=600&h=337&q=80',
    title: 'Aftermovie: LDKS OSIS 2024 - Membangun Generasi Pemimpin',
    views: '342 x ditonton',
    date: '2 hari yang lalu',
    duration: '12:45',
    link: 'https://www.youtube.com/@osissmaitfithrahinsani9481'
  },
  {
    id: 3,
    platform: 'tiktok',
    image: 'https://placehold.co/600x600/185FA5/FFF?text=Media+OSIS?auto=format&fit=crop&w=600&h=1066&q=80',
    caption: 'Recap Classmeeting hari ke-3! Serunya tak tertandingi 🔥🤩 #Classmeeting #FunTime #OSIS #SmaitFI',
    views: '14.5k x ditonton',
    date: '3 hari yang lalu',
    link: 'https://www.tiktok.com/@osissmaitfi?_r=1&_t=ZS-98SucgDTG2Z'
  },
  {
    id: 4,
    platform: 'spotify',
    image: 'https://placehold.co/600x600/185FA5/FFF?text=Media+OSIS?auto=format&fit=crop&w=600&h=600&q=80',
    title: 'Ep. 4: Tips Manajemen Waktu & Produktivitas Siswa',
    caption: 'Bahas tuntas cara bagi waktu belajar, organisasi, dan me-time bareng Ketua OSIS!',
    duration: '15:20',
    date: '5 hari yang lalu',
    link: 'https://spotify.com'
  }
];

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
  const spotifyPlayer = metadata.spotify_player || {};
  const customFeeds = metadata.feeds || null;

  const instagramLink = attrs?.link_instagram || socialAccounts.instagram?.link || 'https://www.instagram.com/osissmaitfi?igsh=MTRyMW43d2psd3gwaQ==';
  const tiktokLink = attrs?.link_tiktok || socialAccounts.tiktok?.link || 'https://www.tiktok.com/@osissmaitfi?_r=1&_t=ZS-98SucgDTG2Z';
  const youtubeLink = attrs?.link_youtube || socialAccounts.youtube?.link || 'https://www.youtube.com/@osissmaitfithrahinsani9481';
  const spotifyLink = attrs?.link_spotify || socialAccounts.spotify?.link || 'https://spotify.com';

  // We memoize the feeds list to avoid unnecessary recalculations
  const feedsList = useMemo(() => {
    return Array.isArray(customFeeds) ? customFeeds : FEEDS_DATA;
  }, [customFeeds]);

  const [activeTab, setActiveTab] = useState('all');
  const [filteredFeeds, setFilteredFeeds] = useState(feedsList);
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

  // Spotify Mini Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(83); // 1:23 in seconds
  const totalDurationSeconds = spotifyPlayer.duration_seconds || 245; // 4:05 in seconds

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    kelas: '',
    category: 'instagram',
    suggestion: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Filter functionality with smooth fade animation
  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      if (activeTab === 'all') {
        setFilteredFeeds(feedsList);
      } else {
        setFilteredFeeds(feedsList.filter(feed => feed.platform === activeTab));
      }
      setAnimating(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [activeTab, feedsList]);

  // Podcast Player Simulation Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds(prev => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDurationSeconds]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

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

    // 2. Spotify URL parsing (track, episode, playlist, show)
    if (trimmed.includes('spotify.com')) {
      let embedPath = trimmed;
      if (!trimmed.includes('/embed/')) {
        embedPath = trimmed.replace('open.spotify.com/', 'open.spotify.com/embed/');
      }
      return `<iframe style="border-radius:12px" src="${embedPath}" width="100%" height="352" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }

    // 3. TikTok Video URL parsing
    if (trimmed.includes('tiktok.com')) {
      const match = trimmed.match(/\/video\/(\d+)/);
      const videoId = match ? match[1] : '';
      if (videoId) {
        return `<iframe src="https://www.tiktok.com/embed/v2/${videoId}" width="100%" height="580" frameborder="0" allowfullscreen class="w-full rounded-2xl"></iframe>`;
      }
    }

    // 4. Instagram URL parsing (p, reel)
    if (trimmed.includes('instagram.com')) {
      let cleanUrl = trimmed.split('?')[0];
      if (!cleanUrl.endsWith('/')) cleanUrl += '/';
      return `<iframe src="${cleanUrl}embed" width="100%" height="540" frameborder="0" scrolling="no" allowtransparency="true" class="w-full rounded-2xl"></iframe>`;
    }

    return null;
  };

  const activeEmbedCode = getEmbedHtml((embeds as Record<string, string>)[activeTab]);

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
                <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase font-inter">ESTIMASI JANGKAUAN</span>
                <span className="text-[#101828] text-2xl font-extrabold font-inter leading-none">2.5K+</span>
                <span className="text-[#00BC7D] text-xs font-semibold font-inter mt-1 flex items-center gap-1">
                  <span>+12% Bulan ini</span>
                </span>
              </div>
            </div>
          </div>
        </div>

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
                {socialAccounts.instagram?.handle || '@osissmaitfi'}
              </span>
              <h3 className="text-xl font-bold font-inter mt-0.5">
                {socialAccounts.instagram?.name || 'Osis SMAIT FI'}
              </h3>
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-inter leading-none">
                    {socialAccounts.instagram?.followers || '1,203'}
                  </span>
                  <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">FOLLOWER</span>
                </div>
                <a
                  href={socialAccounts.instagram?.link || 'https://www.instagram.com/osissmaitfi?igsh=MTRyMW43d2psd3gwaQ=='}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white text-[#FD1D1D] rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                >
                  Kunjungi
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
                {socialAccounts.tiktok?.handle || '@osissmaitfi'}
              </span>
              <h3 className="text-xl font-bold font-inter mt-0.5">
                {socialAccounts.tiktok?.name || 'Osis SMAIT FI'}
              </h3>
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-inter leading-none">
                    {socialAccounts.tiktok?.followers || '144'}
                  </span>
                  <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">FOLLOWER</span>
                </div>
                <a
                  href={socialAccounts.tiktok?.link || 'https://www.tiktok.com/@osissmaitfi?_r=1&_t=ZS-98SucgDTG2Z'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white text-black rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                >
                  Kunjungi
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
                {socialAccounts.youtube?.handle || '@osissmaitfithrahinsani9481'}
              </span>
              <h3 className="text-xl font-bold font-inter mt-0.5">
                {socialAccounts.youtube?.name || 'SMAIT Fithrah Insani'}
              </h3>
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-inter leading-none">
                    {socialAccounts.youtube?.followers || '267'}
                  </span>
                  <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">SUBSCRIBER</span>
                </div>
                <a
                  href={socialAccounts.youtube?.link || 'https://www.youtube.com/@osissmaitfithrahinsani9481'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white text-[#FF0000] rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                >
                  Kunjungi
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
                {socialAccounts.spotify?.handle || 'OSIS Podcast'}
              </span>
              <h3 className="text-xl font-bold font-inter mt-0.5">
                {socialAccounts.spotify?.name || 'Agora Talk'}
              </h3>
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-inter leading-none">
                    {socialAccounts.spotify?.followers || '436'}
                  </span>
                  <span className="text-[9px] font-bold opacity-75 tracking-wider uppercase mt-1">PENDENGAR</span>
                </div>
                <a
                  href={socialAccounts.spotify?.link || 'https://spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white text-[#1DB954] rounded-full text-xs font-bold font-inter hover:bg-white/90 transition-colors shadow-sm"
                >
                  Kunjungi
                </a>
              </div>
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
              {/* Feeds Grid Container */}
              <div className={`w-full transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                {activeEmbedCode ? (
                  <div
                    className="w-full rounded-3xl overflow-hidden border border-gray-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-h-[600px] flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: activeEmbedCode }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    {filteredFeeds.map(feed => {
                      if (feed.platform === 'instagram') {
                        return (
                          <div key={feed.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-md transition-shadow">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center p-[1.5px]">
                                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-black select-none">FI</div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[#101828] text-xs font-bold leading-tight font-inter">{feed.handle}</span>
                                  <span className="text-[#6A7282] text-[9px] font-inter">{feed.date}</span>
                                </div>
                              </div>
                              <span className="text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                                </svg>
                              </span>
                            </div>

                            <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                              <img src={feed.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Instagram Post" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="flex items-center gap-6 text-white font-bold text-sm">
                                  <span className="flex items-center gap-1.5">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    {feed.likes}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                    </svg>
                                    8
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-5 flex flex-col gap-2.5">
                              <p className="text-gray-700 text-xs md:text-sm font-inter leading-relaxed line-clamp-2">
                                <span className="font-bold text-[#101828] mr-1.5">{feed.handle}</span>
                                {feed.caption}
                              </p>
                              <a href={feed.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#7A9EAD] hover:text-[#7A9EAD]/80 inline-flex items-center gap-1 mt-1 group">
                                Lihat di Instagram
                                <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        );
                      }

                      if (feed.platform === 'youtube') {
                        return (
                          <div key={feed.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative aspect-[16/9] bg-black overflow-hidden group">
                              <img src={feed.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="YouTube Thumbnail" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors duration-300">
                                <div className="p-3.5 bg-red-600 rounded-full text-white shadow-md transform group-hover:scale-110 transition-transform duration-300">
                                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                              <span className="absolute bottom-3 right-3 bg-black/80 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                                {feed.duration}
                              </span>
                            </div>

                            <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <h4 className="text-[#101828] text-sm md:text-base font-bold font-inter leading-snug line-clamp-2">
                                  {feed.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-inter">
                                  <span>OSIS TV</span>
                                  <span>•</span>
                                  <span>{feed.views}</span>
                                  <span>•</span>
                                  <span>{feed.date}</span>
                                </div>
                              </div>

                              <a href={feed.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1 group">
                                Tonton di YouTube
                                <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        );
                      }

                      if (feed.platform === 'tiktok') {
                        return (
                          <div key={feed.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-md transition-shadow">
                            <div className="relative aspect-[9/16] max-h-[350px] bg-black overflow-hidden group">
                              <img src={feed.image} className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105" alt="TikTok Preview" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 flex flex-col justify-between p-4">
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold font-inter">
                                    <span className="w-1.5 h-1.5 bg-[#00BC7D] rounded-full" />
                                    <span>{feed.handle || '@osis.sfithrahinsani'}</span>
                                  </div>
                                  <div className="p-1.5 bg-black/45 rounded-full text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                    </svg>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2.5 text-white">
                                  <p className="text-xs md:text-sm font-inter leading-relaxed line-clamp-2">
                                    {feed.caption}
                                  </p>
                                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                                    <div className="flex items-center gap-1.5 text-xs text-white/95 font-inter">
                                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                      <span>{feed.views}</span>
                                    </div>
                                    <a href={feed.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold bg-white text-black px-3 py-1 rounded-full hover:bg-white/90 transition-all font-inter">
                                      Lihat
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (feed.platform === 'spotify') {
                        return (
                          <div key={feed.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col hover:shadow-md transition-shadow">
                            <div className="p-4 bg-[#1DB954]/5 border-b border-[#1DB954]/10 flex items-center gap-3">
                              <div className="p-2 bg-[#1DB954] text-white rounded-xl">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.337.136-.669.471-.745 3.854-.88 7.15-.502 9.81 1.13.295.178.387.562.207.857zm1.226-2.724c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.667-1.11 8.23-.57 11.345 1.343.367.227.487.708.26 1.075zm.106-2.836C14.393 8.74 8.56 8.547 5.17 9.575c-.528.16-1.08-.14-1.24-.668-.16-.528.14-1.08.668-1.24C8.5 6.45 14.935 6.67 19.043 9.11c.475.282.63.897.347 1.37-.282.474-.897.63-1.37.347z" />
                                </svg>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[#1DB954] text-xs font-bold leading-tight font-inter">{socialAccounts.spotify?.name || 'Agora Talk'}</span>
                                <span className="text-[#6A7282] text-[9px] font-inter">{feed.date}</span>
                              </div>
                            </div>

                            <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                              <div className="flex gap-4">
                                <div className="w-16 h-16 bg-[#101828] rounded-2xl overflow-hidden shrink-0 shadow-sm">
                                  <img src={feed.image} className="w-full h-full object-cover" alt="Podcast Episode Art" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <h4 className="text-[#101828] text-sm md:text-base font-bold font-inter leading-tight line-clamp-1">
                                    {feed.title}
                                  </h4>
                                  <p className="text-gray-500 text-xs font-inter leading-relaxed line-clamp-2">
                                    {feed.caption}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-4">
                                <span className="text-xs text-gray-500 font-inter">Durasi: {feed.duration}</span>
                                <a href={feed.link} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-[#1DB954] text-white rounded-full text-xs font-bold hover:bg-[#1DB954]/95 transition-all inline-flex items-center gap-1 group font-inter">
                                  Dengarkan
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Spotify Live Player & Saran Konten Form (Takes 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-8 w-full">

            {/* Widget 1: Interactive Podcast Mini Player */}
            <div className="bg-[#191414] rounded-3xl p-6 text-white flex flex-col gap-5 border border-gray-900 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1DB954]/10 rounded-full blur-[40px] pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 bg-[#1DB954] text-black rounded-lg">
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.337.136-.669.471-.745 3.854-.88 7.15-.502 9.81 1.13.295.178.387.562.207.857zm1.226-2.724c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.667-1.11 8.23-.57 11.345 1.343.367.227.487.708.26 1.075zm.106-2.836C14.393 8.74 8.56 8.547 5.17 9.575c-.528.16-1.08-.14-1.24-.668-.16-.528.14-1.08.668-1.24C8.5 6.45 14.935 6.67 19.043 9.11c.475.282.63.897.347 1.37-.282.474-.897.63-1.37.347z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight font-inter">Agora Talk</span>
                    <span className="text-[9px] text-[#00BC7D] font-bold font-inter tracking-wide uppercase">PEMUTAR INTERAKTIF</span>
                  </div>
                </div>

                <div className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
              </div>

              {/* Cover Art and Info */}
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="relative w-16 h-16 bg-gray-900 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  <img
                    className={`w-full h-full object-cover transition-transform duration-[10s] ${isPlaying ? 'scale-105 rotate-3' : ''}`}
                    src={spotifyPlayer.image || "https://placehold.co/600x600/185FA5/FFF?text=Media+OSIS?auto=format&fit=crop&w=150&h=150&q=80"}
                    alt="Podcast Cover art"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-0.5">
                      <span className="w-1 h-3 bg-[#1DB954] rounded-full animate-[bounce_0.8s_infinite]" />
                      <span className="w-1 h-5 bg-[#1DB954] rounded-full animate-[bounce_0.6s_infinite_0.15s]" />
                      <span className="w-1 h-3.5 bg-[#1DB954] rounded-full animate-[bounce_0.7s_infinite_0.3s]" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase font-inter">EPISODE SEKARANG</span>
                  <h4 className="text-sm font-bold font-inter leading-tight text-white group-hover:text-[#1DB954] transition-colors">
                    {spotifyPlayer.title || "Ep. 4: Tips Manajemen Waktu Siswa"}
                  </h4>
                  <span className="text-gray-500 text-[10px] font-inter">{spotifyPlayer.host || "Host: OSIS Dev & Ketos"}</span>
                </div>
              </div>

              {/* Custom Player Controls */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={handlePlayPause}
                    className="p-2.5 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center shrink-0"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 flex flex-col gap-1.5">
                    {/* Progress Bar Container */}
                    <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#1DB954] rounded-full transition-all duration-1000"
                        style={{ width: `${(playbackSeconds / totalDurationSeconds) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[9px] font-mono text-gray-400">
                      <span>{formatTime(playbackSeconds)}</span>
                      <span>{formatTime(totalDurationSeconds)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Badge CTA */}
              <div className="bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-2xl flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-300 font-inter">Buka di Aplikasi</span>
                <a
                  href={spotifyPlayer.link || "https://spotify.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] hover:underline flex items-center gap-1 font-inter"
                >
                  Spotify Web
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Widget 2: Saran Konten Form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-sm relative flex flex-col gap-5 overflow-hidden">
              {formStatus === 'submitting' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 z-10">
                  <div className="w-8 h-8 border-4 border-[#7A9EAD] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-[#101828] font-inter">Mengirim ide kreatif...</span>
                </div>
              )}

              {formStatus === 'success' && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 gap-3 z-10 animate-fade-in">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-inner">
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

              <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-4">
                <h3 className="text-[#101828] text-lg font-bold font-inter flex items-center gap-2">
                  <span className="p-1.5 bg-[#7A9EAD]/10 text-[#7A9EAD] rounded-xl">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008Zm.37 0h.008v.008h-.008v-.008Zm.37 0h.008v.008h-.008v-.008Zm2 .478v-.007a1.002 1.002 0 0 1-1.002-1.002v-3.75a1.002 1.002 0 0 1 1.002-1.002h2.25a1.002 1.002 0 0 1 1.002 1.002v3.75a1.002 1.002 0 0 1-1.002 1.002H11.5v.007Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </span>
                  Saran Ide Konten
                </h3>
                <p className="text-gray-500 text-xs font-inter leading-relaxed">
                  Punya ide seru untuk postingan Instagram, video TikTok, atau bahasan podcast berikutnya? Sampaikan ke kami!
                </p>
              </div>

              {/* Form fields */}
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
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category-select" className="text-xs font-bold text-[#101828] font-inter">Kategori Media</label>
                  <select
                    id="category-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-11 bg-[#FAFBFC] border border-gray-200/90 focus:border-[#7A9EAD] focus:bg-white focus:ring-2 focus:ring-[#7A9EAD]/40 rounded-2xl px-4 py-2.5 text-xs md:text-sm font-sans outline-none transition-all shadow-sm"
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
                  />
                </div>

                <button
                  type="submit"
                  disabled={!formData.name || !formData.suggestion}
                  className="w-full py-3 bg-[#101828] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-xs md:text-sm font-bold font-inter hover:bg-[#101828]/95 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  Kirim Saran
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

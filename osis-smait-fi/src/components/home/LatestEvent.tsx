'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchStrapiAPI, getStrapiMediaUrl } from '@/lib/strapi';

interface EventData {
  title: string;
  bannerUrl: string;
  youtubeUrl?: string;
  description: string;
  secondaryText: string;
  tagline?: string;
  slug?: string;
  ctaHref?: string; // link CTA eksplisit dari Strapi (optional)
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }
  return null;
}

const LatestEvent = ({ initialHalamanData }: { initialHalamanData?: any }) => {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatestEvent() {
      try {
        const halamanAttrs = initialHalamanData ? (initialHalamanData.attributes || initialHalamanData) : null;
        const halamanYoutubeUrl = halamanAttrs?.embed_youtube || halamanAttrs?.metadata_json?.embed_youtube || '';

        let json: any;
        try {
          json = await fetchStrapiAPI('/api/events?sort[0]=tanggal_mulai:desc&sort[1]=createdAt:desc&populate=*');
        } catch {
          // Fallback: tanggal_mulai may not be exposed; sort by createdAt only
          json = await fetchStrapiAPI('/api/events?sort[0]=createdAt:desc&populate=*');
        }
        const items = json?.data || [];
        if (items.length > 0) {
          const item = items[0];
          const attrs = item.attributes || item;

          const title = attrs.nama || attrs.tema || '';
          const bannerUrl = getStrapiMediaUrl(attrs.banner || attrs.gambar, '');
          const youtubeUrl = attrs.youtube_url || attrs.youtubeUrl || halamanYoutubeUrl || '';
          const description = attrs.deskripsi || '';
          const secondaryText = attrs.tagline
            ? `Tagline: "${attrs.tagline}". ${attrs.ringkasan || ''}`
            : (attrs.ringkasan || attrs.sub_judul || '');
          const slug = attrs.slug || '';
          // cta_url dari Strapi diutamakan, fallback ke /events/{slug} (atau /edufest-infinity jika slug edufest)
          const ctaHref = attrs.cta_url || (slug === 'edufest-infinity' ? '/edufest-infinity' : (slug ? `/events/${slug}` : '/edufest-infinity'));

          if (title) {
            setEventData({
              title,
              bannerUrl,
              youtubeUrl,
              description,
              secondaryText,
              slug,
              ctaHref,
            });
          }
        }
      } catch (err) {
        console.warn('[LatestEvent] Failed to load event from Strapi:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLatestEvent();
  }, []);

  if (loading || !eventData) {
    return null; // Cleanly hide if no active event in Strapi
  }

  const embedUrl = getYouTubeEmbedUrl(eventData.youtubeUrl);

  return (
    <section className="w-full bg-white dark:bg-slate-900 px-4 sm:px-6 md:px-8 lg:px-12 py-12 lg:py-20 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* Left Column: Video or Banner Image Container (7 cols) */}
        <div className="lg:col-span-7 w-full flex items-center justify-center">
          <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative group bg-gray-100 dark:bg-slate-800">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${eventData.title} Video`}
                className="w-full h-full border-0 rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : eventData.bannerUrl ? (
              <Image
                src={eventData.bannerUrl}
                alt={`${eventData.title} Banner`}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                Banner / Video Event
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Text & Content Container (5 cols) */}
        <div className="lg:col-span-5 w-full flex flex-col justify-center items-start gap-6">
          <div className="flex flex-col gap-4 w-full">

            {/* Sub-header with horizontal line */}
            <div className="flex items-center gap-4 h-5">
              <div className="w-12 h-[2px] bg-[#185FA5] dark:bg-blue-400 rounded" />
              <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-bold tracking-wider uppercase font-roboto">
                Event Terbaru
              </span>
            </div>

            {/* Title */}
            <h2 className="text-[#1A202C] dark:text-slate-100 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight tracking-tight font-roboto uppercase break-words">
              {eventData.title}
            </h2>

            {/* Main Paragraph */}
            {eventData.description && (
              <p className="text-gray-800 dark:text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed font-roboto">
                {eventData.description}
              </p>
            )}

            {/* Secondary Paragraph */}
            {eventData.secondaryText && (
              <div className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm md:text-base font-normal leading-relaxed font-roboto whitespace-pre-line">
                {eventData.secondaryText}
              </div>
            )}

            {/* CTA: Read Full Report */}
            {eventData.slug && (
              <div className="pt-2">
                <a
                  href={eventData.ctaHref || `/${eventData.slug}`}
                  className="inline-flex items-center gap-2 group text-[#185FA5] dark:text-blue-400 hover:text-[#0e447b] dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <span className="text-base font-bold font-roboto">Lihat Detail Event</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};

export default LatestEvent;

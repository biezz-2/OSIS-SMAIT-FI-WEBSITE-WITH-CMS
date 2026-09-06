import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/events/EventCard';
import { fetchAllEventsForPage, fetchHalamanFromStrapi, getStrapiMediaUrl } from '@/lib/strapi';

export const revalidate = 60; // ISR 60s

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await fetchHalamanFromStrapi('events');
    const attrs = pageData?.attributes || pageData || {};

    return {
        title: attrs.seo_title || attrs.judul_hero || 'Events & Agenda Kegiatan',
        description: attrs.seo_description || attrs.sub_judul || 'Daftar acara, event, dan agenda kegiatan OSIS SMAIT Fithrah Insani.',
    };
}

export default async function EventsPage() {
    const [rawEvents, pageConfig] = await Promise.all([
        fetchAllEventsForPage(),
        fetchHalamanFromStrapi('events'),
    ]);

    const pageAttrs = pageConfig?.attributes || pageConfig || {};

    // Dynamic config from Strapi `halaman` entry with slug "events"
    const heroTitle = pageAttrs.judul_hero || 'EVENTS';
    const heroSubtitle = pageAttrs.sub_judul || pageAttrs.deskripsi || 'Saksikan dan ikuti berbagai event, agenda kegiatan, dan ajang penampilan bakat yang diselenggarakan oleh OSIS SMAIT Fithrah Insani sepanjang periode ini.';
    const heroBgUrl = getStrapiMediaUrl(pageAttrs.banner_image || pageAttrs.background_image, '');
    const customBgColor = pageAttrs.bg_color || '';
    const pageBgImage = getStrapiMediaUrl(pageAttrs.background_image, '');

    const now = new Date();

    const categorizedEvents = rawEvents.map((item: any) => {
        const attrs = item.attributes || item;
        const bannerMedia = attrs.banner || attrs.gambar;
        const bannerUrl = getStrapiMediaUrl(bannerMedia, '');

        const startDateStr = attrs.tanggal_mulai || attrs.tanggal || attrs.createdAt;
        const endDateStr = attrs.tanggal_selesai || startDateStr;

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        let statusCategory: 'ongoing' | 'upcoming' | 'past' = 'upcoming';
        if (now >= startDate && now <= endDate) {
            statusCategory = 'ongoing';
        } else if (now > endDate) {
            statusCategory = 'past';
        } else {
            statusCategory = 'upcoming';
        }

        return {
            id: item.id,
            title: attrs.nama || attrs.tema || 'Event OSIS',
            bannerUrl,
            youtubeUrl: attrs.youtube_url || attrs.embed_youtube || attrs.link_youtube || attrs.video_url || '',
            description: attrs.deskripsi || attrs.sub_judul || '',
            summary: attrs.ringkasan || (attrs.tagline ? `"${attrs.tagline}"` : ''),
            date: startDateStr,
            slug: attrs.slug || '',
            ctaUrl: attrs.cta_url || '',
            statusCategory,
        };
    });

    const ongoingEvents = categorizedEvents.filter((e: any) => e.statusCategory === 'ongoing');
    const upcomingEvents = categorizedEvents.filter((e: any) => e.statusCategory === 'upcoming');
    const pastEvents = categorizedEvents.filter((e: any) => e.statusCategory === 'past');

    return (
        <div
            className="min-h-screen flex flex-col text-[#1A1A1A] dark:text-stone-100 transition-colors duration-300 relative bg-[#F7F7F7] dark:bg-stone-950"
            style={{
                ...(customBgColor ? { backgroundColor: customBgColor } : {}),
                ...(pageBgImage ? { backgroundImage: `url(${pageBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
            }}
        >
            <Navbar />

            {/* Hero Section */}
            <section className="w-full relative min-h-[420px] sm:min-h-[500px] flex items-center justify-center bg-stone-900 overflow-hidden">
                {/* Background Image if set in Strapi */}
                {heroBgUrl && (
                    <Image
                        src={heroBgUrl}
                        alt={heroTitle}
                        fill
                        className="object-cover"
                        priority
                    />
                )}

                {/* Dark backdrop overlay matching mockup */}
                <div className="absolute inset-0 bg-black/85 z-10" />

                {/* Hero Content */}
                <div className="relative z-20 max-w-4xl mx-auto px-6 py-16 text-center flex flex-col items-center justify-center gap-6">
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal font-serif text-white tracking-[0.2em] sm:tracking-[0.3em] uppercase leading-none">
                        {heroTitle}
                    </h1>

                    <p className="max-w-2xl text-xs sm:text-sm lg:text-base font-sans text-stone-300 leading-relaxed tracking-wide">
                        {heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Events Listing Section */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 sm:py-20 flex flex-col gap-16 relative">
                {/* Ambient gradient orbs — give backdrop-blur something to refract */}
                {/* 1. EVENT SEDANG BERLANGSUNG */}
                {ongoingEvents.length > 0 && (
                    <section className="flex flex-col gap-8">
                        <div className="text-left border-b border-emerald-500/40 pb-3 flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                            <h2 className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 tracking-[0.15em] font-sans uppercase">
                                EVENT BERLANGSUNG
                            </h2>
                        </div>
                        <div className="flex flex-col gap-12">
                            {ongoingEvents.map((event: any) => (
                                <EventCard
                                    key={event.id}
                                    title={event.title}
                                    bannerUrl={event.bannerUrl}
                                    youtubeUrl={event.youtubeUrl}
                                    description={event.description}
                                    summary={event.summary}
                                    date={event.date}
                                    slug={event.slug}
                                    ctaUrl={event.ctaUrl}
                                    statusBadge="ongoing"
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 2. UPCOMING EVENT */}
                <section className="flex flex-col gap-8">
                    <div className="text-left border-b border-stone-300 dark:border-stone-800 pb-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#5F5C4F] dark:text-stone-200 tracking-[0.15em] font-sans uppercase">
                            UPCOMING EVENT
                        </h2>
                    </div>

                    {upcomingEvents.length > 0 ? (
                        <div className="flex flex-col gap-12">
                            {upcomingEvents.map((event: any) => (
                                <EventCard
                                    key={event.id}
                                    title={event.title}
                                    bannerUrl={event.bannerUrl}
                                    youtubeUrl={event.youtubeUrl}
                                    description={event.description}
                                    summary={event.summary}
                                    date={event.date}
                                    slug={event.slug}
                                    ctaUrl={event.ctaUrl}
                                    statusBadge="upcoming"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-stone-100/50 dark:bg-stone-900/50 rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-800">
                            <p className="text-stone-500 dark:text-stone-400 font-medium">
                                Belum ada event mendatang saat ini.
                            </p>
                        </div>
                    )}
                </section>

                {/* 3. EVENT TERDAHULU (Selesai) */}
                {pastEvents.length > 0 && (
                    <section className="flex flex-col gap-8 opacity-85 hover:opacity-100 transition-opacity">
                        <div className="text-left border-b border-stone-300 dark:border-stone-800 pb-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-stone-500 dark:text-stone-400 tracking-[0.15em] font-sans uppercase">
                                EVENT TERDAHULU
                            </h2>
                        </div>
                        <div className="flex flex-col gap-12">
                            {pastEvents.map((event: any) => (
                                <EventCard
                                    key={event.id}
                                    title={event.title}
                                    bannerUrl={event.bannerUrl}
                                    youtubeUrl={event.youtubeUrl}
                                    description={event.description}
                                    summary={event.summary}
                                    date={event.date}
                                    slug={event.slug}
                                    ctaUrl={event.ctaUrl}
                                    statusBadge="past"
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

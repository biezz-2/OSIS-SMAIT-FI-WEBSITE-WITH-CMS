'use client';

import React, { useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface EventCardProps {
    title: string;
    bannerUrl: string;
    description: string;
    summary: string;
    date?: string; // ISO date string or formatted date
    slug?: string;
    ctaUrl?: string;
    statusBadge?: 'upcoming' | 'ongoing' | 'past';
}

const MONTH_NAMES = [
    'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
    'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
];

function parseEventDate(dateStr?: string) {
    if (!dateStr) return { day: '12', month: 'OKT' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: '12', month: 'OKT' };

    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[d.getMonth()] || 'OKT';
    return { day, month };
}

export default function EventCard({
    title,
    bannerUrl,
    description,
    summary,
    date,
    slug,
    ctaUrl,
    statusBadge,
}: EventCardProps) {
    const { day, month } = parseEventDate(date);
    const targetUrl = ctaUrl || (slug ? `/events/${slug}` : '#');
    const glassRef = useRef<HTMLDivElement>(null);
    const reflectionRef = useRef<HTMLDivElement>(null);

    const badgeConfig = {
        upcoming: { text: 'Mendatang', bg: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-400/20 dark:text-amber-300' },
        ongoing: { text: 'Berlangsung', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-400/20 dark:text-emerald-300 animate-pulse' },
        past: { text: 'Selesai', bg: 'bg-stone-500/10 text-stone-500 border-stone-500/30 dark:bg-stone-800 dark:text-stone-400' },
    };

    // ponytail: plain CSS vars for mouse-follow. Upgrade to framer-motion useMotionValue if perf needed.
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!reflectionRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        reflectionRef.current.style.background = `radial-gradient(200px circle at ${x}px ${y}px, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 40%, transparent 70%)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!reflectionRef.current) return;
        reflectionRef.current.style.background = 'none';
    }, []);

    return (
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-8 py-6">
            {/* Date Column */}
            <div className="flex flex-row lg:flex-col items-center justify-center shrink-0 min-w-[100px] text-[#5B5B5B] dark:text-amber-200">
                <span className="text-2xl lg:text-3xl font-bold font-sans tracking-widest uppercase mr-3 lg:mr-0">
                    {month}
                </span>
                <span className="text-5xl lg:text-6xl font-extrabold font-serif tracking-widest">
                    {day}
                </span>
            </div>

            {/* Image Banner */}
            <div className="w-full lg:w-[450px] xl:w-[480px] h-[260px] sm:h-[300px] lg:h-[320px] relative rounded-2xl overflow-hidden shadow-md shrink-0 bg-stone-200 dark:bg-stone-800">
                {bannerUrl ? (
                    <Image
                        src={bannerUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 480px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 font-medium">
                        No Image Preview
                    </div>
                )}
            </div>

            {/* Info Card Container - Liquid Glass */}
            <div
                ref={glassRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="flex-1 w-full relative overflow-hidden rounded-[30px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.14) 100%)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.08)',
                }}
            >
                {/* Specular highlight — top edge glow like real glass */}
                <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[30px] sm:rounded-t-[40px]"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.30), rgba(255,255,255,0.05) 60%, transparent)',
                    }}
                />

                {/* Subtle noise texture for glass grain */}
                <span
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
                        backgroundSize: '4px 4px',
                    }}
                />

                {/* Dynamic mouse-follow reflection layer */}
                <div
                    ref={reflectionRef}
                    className="pointer-events-none absolute inset-0 transition-[background] duration-150"
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-3">
                    {statusBadge && badgeConfig[statusBadge] && (
                        <span className={`self-start px-3 py-1 rounded-full text-xs font-bold border tracking-wider backdrop-blur-sm ${badgeConfig[statusBadge].bg}`}>
                            {badgeConfig[statusBadge].text}
                        </span>
                    )}

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#5B5B5B] dark:text-stone-100 tracking-wider font-sans leading-tight">
                        {title || 'Lorem Ipsum'}
                    </h3>

                    {description && (
                        <p className="text-xs sm:text-sm font-semibold text-[#797979] dark:text-stone-300 tracking-wide line-clamp-3 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {summary && (
                        <p className="text-xs sm:text-sm text-[#797979] dark:text-stone-400 tracking-wide line-clamp-3 leading-relaxed">
                            {summary}
                        </p>
                    )}
                </div>

                {/* CTA Link */}
                <div className="relative z-10 mt-6 flex items-center gap-2 text-[#5B5B5B] dark:text-amber-300 font-bold text-sm sm:text-base tracking-wider hover:opacity-80 transition-opacity">
                    <Link href={targetUrl} className="inline-flex items-center gap-2 no-underline text-inherit">
                        <span>View Event Details</span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

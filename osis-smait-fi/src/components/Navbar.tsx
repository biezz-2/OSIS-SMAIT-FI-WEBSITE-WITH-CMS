"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    fetchHalamanFromStrapi,
    getStrapiMediaUrl,
    fetchMediaAssetByKey,
    fetchAllSekbidsFromStrapi,
    fetchNavbarConfigFromStrapi
} from '@/lib/strapi';
import { GooeyInput } from '@/components/ui/gooey-input';
import { MegaMenuItem, type MegaMenuCard } from '@/components/ui/MegaMenu';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import {
    ClipboardList,
    Image as ImageIcon,
    Camera,
    BookOpen,
    Shield,
    GraduationCap,
    Globe,
    Activity,
    Leaf,
    ShoppingBag,
    Tv
} from 'lucide-react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

// Nav items standar (di luar Mega Menu)
const defaultNavItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'EVENTS', path: '/events' },
    { name: 'MUBES', path: '/portal-mubes' },
    { name: 'ANGGOTA', path: '/anggota' },
    { name: 'MEDIA SOSIAL', path: '/media-sosial' },
    { name: 'PARTNERS', path: '/partners' },
];

// Fallback gradients for the 8 Sekbids
const gradients: Record<number, string> = {
    1: 'linear-gradient(135deg, #FA982E 0%, #B54708 100%)',
    2: 'linear-gradient(135deg, #12B76A 0%, #054F31 100%)',
    3: 'linear-gradient(135deg, #7A5AF8 0%, #3E1C96 100%)',
    4: 'linear-gradient(135deg, #F04438 0%, #9E1A1A 100%)',
    5: 'linear-gradient(135deg, #EE46BC 0%, #9C1878 100%)',
    6: 'linear-gradient(135deg, #06AED4 0%, #08667E 100%)',
    7: 'linear-gradient(135deg, #F79009 0%, #B54708 100%)',
    8: 'linear-gradient(135deg, #6366F1 0%, #312E81 100%)',
};

const getFallbackIcon = (nomor: number) => {
    switch (nomor) {
        case 1: return <BookOpen className="w-8 h-8 text-white" />;
        case 2: return <Shield className="w-8 h-8 text-white" />;
        case 3: return <GraduationCap className="w-8 h-8 text-white" />;
        case 4: return <Globe className="w-8 h-8 text-white" />;
        case 5: return <Activity className="w-8 h-8 text-white" />;
        case 6: return <Leaf className="w-8 h-8 text-white" />;
        case 7: return <ShoppingBag className="w-8 h-8 text-white" />;
        case 8: return <Tv className="w-8 h-8 text-white" />;
        default: return <BookOpen className="w-8 h-8 text-white" />;
    }
};

const defaultSekbids = [
    { nomor: 1, judul: 'Kerohanian', deskripsi: 'Pembinaan keimanan dan ketakwaan melalui kegiatan keagamaan seperti tilawah, kultum, takhosus, dan pendampingan rohis.' },
    { nomor: 2, judul: 'Kaderisasi', deskripsi: 'Membangun kedisiplinan dan ketertiban siswa melalui sidak tata tertib, piket kedisiplinan, dan apresiasi kelas disiplin.' },
    { nomor: 3, judul: 'Edukasi', deskripsi: 'Pengembangan potensi akademik melalui study club, notifikasi edukasi, dan konten pembelajaran singkat.' },
    { nomor: 4, judul: 'Bahasa', deskripsi: 'Pengembangan literasi dan bahasa melalui sayembara menulis, podcast sastra, dan kuis literasi rutin.' },
    { nomor: 5, judul: 'Minat & Bakat', deskripsi: 'Wadah pengembangan minat dan bakat siswa melalui talent showcase, refleksi diri, dan informasi lomba non-akademik.' },
    { nomor: 6, judul: 'Kesehatan & Lingkungan', deskripsi: 'Pengembangan kebersihan, kesehatan, dan lingkungan hidup melalui cleaning day, senam, dan edukasi gizi.' },
    { nomor: 7, judul: 'Kewirausahaan', deskripsi: 'Pengembangan jiwa kewirausahaan dan ekonomi kreatif melalui weekly market, wawancara pengusaha, dan direct marketing.' },
    { nomor: 8, judul: 'Kominfo', deskripsi: 'Pengelolaan komunikasi, informasi, dan media digital OSIS melalui sosial media, mading, website, dan studio konten.' }
];

const initialProgramKerjaCards = (): MegaMenuCard[] => {
    const cards: MegaMenuCard[] = [
        {
            title: 'Semua Program Kerja',
            description: 'Lihat seluruh program kerja OSIS SMAIT Fithrah Insani periode ini.',
            href: '/program-kerja',
            gradient: 'linear-gradient(135deg, #2E90FA 0%, #1849A9 100%)',
            icon: <ClipboardList className="w-8 h-8 text-white" />,
        }
    ];

    defaultSekbids.forEach(s => {
        cards.push({
            title: `Seksi Bidang ${s.nomor}`,
            description: s.judul,
            href: `/sekbid/sekbid-${s.nomor}`,
            gradient: gradients[s.nomor] || 'linear-gradient(135deg, #98A2B3 0%, #475467 100%)',
            icon: getFallbackIcon(s.nomor),
        });
    });

    return cards;
};

const initialGaleriCards = (): MegaMenuCard[] => [
    {
        title: 'Galeri Foto',
        description: 'Koleksi foto kegiatan OSIS SMAIT Fithrah Insani sepanjang tahun.',
        href: '/galeri/galeri-preview-infinity',
        gradient: 'linear-gradient(135deg, #F670C7 0%, #C11574 100%)',
        icon: <ImageIcon className="w-8 h-8 text-white" />,
    },
    {
        title: 'Dokumentasi Kegiatan',
        description: 'Rekam jejak dokumentasi berbagai kegiatan dan event OSIS.',
        href: '/galeri/galeri-preview-infinity',
        gradient: 'linear-gradient(135deg, #FDB022 0%, #B54708 100%)',
        icon: <Camera className="w-8 h-8 text-white" />,
    },
];

const Navbar = () => {
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [brandName, setBrandName] = useState<string>('OSIS SMAIT FITHRAH INSANI');
    const [brandNameMobile, setBrandNameMobile] = useState<string>('OSIS SMAIT FI');
    const [navItems, setNavItems] = useState(defaultNavItems);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const [programKerjaCards, setProgramKerjaCards] = useState<MegaMenuCard[]>(initialProgramKerjaCards);
    const [galeriCards, setGaleriCards] = useState<MegaMenuCard[]>(initialGaleriCards);

    const megaMenuSections: Array<{ label: string; href: string; cards: MegaMenuCard[] }> = [
        { label: 'PROGRAM KERJA', href: '/program-kerja', cards: programKerjaCards },
        { label: 'GALERI', href: '/galeri/galeri-preview-infinity', cards: galeriCards },
    ];

    // Fetch dynamic program kerja and sekbid data
    useEffect(() => {
        let isMounted = true;

        async function loadDynamicNavData() {
            try {
                // 1. Fetch program-kerja page for custom banner
                let pkBannerUrl = '';
                const pkPage = await fetchHalamanFromStrapi('program-kerja');
                if (pkPage) {
                    const attrs = pkPage.attributes || pkPage;
                    const resolved = getStrapiMediaUrl(attrs.banner_image || attrs.logo || attrs.background_image, '');
                    if (resolved) pkBannerUrl = resolved;
                }

                // 2. Fetch all Sekbids
                const apiSekbids = await fetchAllSekbidsFromStrapi();
                if (!isMounted) return;

                // 3. Build cards
                const updatedCards: MegaMenuCard[] = [
                    {
                        title: 'Semua Program Kerja',
                        description: 'Lihat seluruh program kerja OSIS SMAIT Fithrah Insani periode ini.',
                        href: '/program-kerja',
                        gradient: 'linear-gradient(135deg, #2E90FA 0%, #1849A9 100%)',
                        icon: pkBannerUrl || <ClipboardList className="w-8 h-8 text-white" />,
                    }
                ];

                defaultSekbids.forEach(s => {
                    const matched = apiSekbids?.find((apiS: any) => {
                        const attrs = apiS.attributes || apiS;
                        return (attrs.nomor || apiS.id) === s.nomor;
                    });

                    let title = `Seksi Bidang ${s.nomor}`;
                    let description = s.judul;
                    let iconNode: React.ReactNode = getFallbackIcon(s.nomor);

                    if (matched) {
                        const attrs = matched.attributes || matched;
                        if (attrs.judul) {
                            title = `Seksi Bidang ${s.nomor} (${attrs.judul})`;
                        }
                        if (attrs.deskripsi) {
                            description = attrs.deskripsi;
                        }

                        const iconMedia = attrs.icon || attrs.banner || attrs.gambar;
                        const resolvedIcon = getStrapiMediaUrl(iconMedia, '', 'small');
                        if (resolvedIcon) {
                            iconNode = resolvedIcon;
                        }
                    }

                    updatedCards.push({
                        title,
                        description,
                        href: `/sekbid/sekbid-${s.nomor}`,
                        gradient: gradients[s.nomor] || 'linear-gradient(135deg, #98A2B3 0%, #475467 100%)',
                        icon: iconNode,
                    });
                });

                setProgramKerjaCards(updatedCards);
            } catch (err) {
                console.warn('Failed to load dynamic nav data:', err);
            }
        }

        loadDynamicNavData();
        return () => {
            isMounted = false;
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setExpandedAccordion(null);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    useEffect(() => {
        async function loadNavbarConfig() {
            try {
                const config = await fetchNavbarConfigFromStrapi();
                if (config) {
                    if (config.brand_name) setBrandName(config.brand_name);
                    if (config.brand_name_mobile) setBrandNameMobile(config.brand_name_mobile);
                    if (config.logo_url) setLogoUrl(config.logo_url);
                    if (config.nav_items && config.nav_items.length > 0) {
                        setNavItems(config.nav_items);
                    }
                }
            } catch (err) {
                console.warn('Failed to load navbar config from Strapi:', err);
            }
        }
        loadNavbarConfig();
    }, []);

    useEffect(() => {
        async function loadLogo() {
            try {
                const homeData = await fetchHalamanFromStrapi('home');
                if (homeData) {
                    const attrs = homeData.attributes || homeData;
                    const url = getStrapiMediaUrl(attrs.logo, '');
                    if (url) { setLogoUrl(url); return; }
                }
                const logoAsset = await fetchMediaAssetByKey('logo', '');
                if (logoAsset?.src) setLogoUrl(logoAsset.src);
            } catch (err) {
                console.warn('Failed to load logo in Navbar:', err);
            }
        }
        loadLogo();
    }, []);

    const toggleMobile = useCallback(() => {
        setMobileOpen(prev => !prev);
    }, []);

    const toggleAccordion = useCallback((label: string) => {
        setExpandedAccordion(prev => prev === label ? null : label);
    }, []);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <>
            {/* ─── NAVBAR BAR ─────────────────────────────────────────── */}
            <nav
                className="w-full flex items-center justify-between px-4 md:px-[4%] py-2 relative z-40"
                style={{
                    minHeight: 54,
                    background: '#2E90FA',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderBottom: '1px rgba(255, 255, 255, 0.10) solid',
                }}
            >
                {/* Logo + nama */}
                <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt="Logo OSIS"
                            width={32}
                            height={32}
                            priority
                            style={{ objectFit: 'contain', borderRadius: '50%' }}
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-black" />
                    )}
                    <span className="text-white text-sm font-bold font-[Roboto,sans-serif] leading-[17px] hidden min-[420px]:inline">
                        {brandName}
                    </span>
                    <span className="text-white text-sm font-bold font-[Roboto,sans-serif] leading-[17px] min-[420px]:hidden">
                        {brandNameMobile}
                    </span>
                </Link>

                {/* Desktop Nav items — hidden on mobile & tablet (shows on xl: 1280px+) */}
                <div className="hidden xl:flex items-center gap-1.5 xl:gap-2.5 relative z-50">
                    {/* 1. HOME */}
                    <Link href="/" className="no-underline">
                        <div
                            className="px-2.5 xl:px-3 py-1.5 rounded transition-all duration-200 flex items-center justify-center cursor-pointer hover:opacity-80 shrink-0"
                            style={{ background: isActive('/') ? '#E8850A' : '#FA982E' }}
                        >
                            <span className="text-[#1A1A1A] text-xs font-bold font-[Inter,sans-serif] leading-4 whitespace-nowrap">
                                HOME
                            </span>
                        </div>
                    </Link>

                    {/* 2. ABOUT */}
                    <Link href="/about" className="no-underline">
                        <div
                            className="px-2.5 xl:px-3 py-1.5 rounded transition-all duration-200 flex items-center justify-center cursor-pointer hover:opacity-80 shrink-0"
                            style={{ background: isActive('/about') ? '#E8850A' : '#FA982E' }}
                        >
                            <span className="text-[#1A1A1A] text-xs font-bold font-[Inter,sans-serif] leading-4 whitespace-nowrap">
                                ABOUT
                            </span>
                        </div>
                    </Link>

                    {/* 3. EVENTS */}
                    <Link href="/events" className="no-underline">
                        <div
                            className="px-2.5 xl:px-3 py-1.5 rounded transition-all duration-200 flex items-center justify-center cursor-pointer hover:opacity-80 shrink-0"
                            style={{ background: isActive('/events') ? '#E8850A' : '#FA982E' }}
                        >
                            <span className="text-[#1A1A1A] text-xs font-bold font-[Inter,sans-serif] leading-4 whitespace-nowrap">
                                EVENTS
                            </span>
                        </div>
                    </Link>

                    {/* 4. ANGGOTA */}
                    <Link href="/anggota" className="no-underline">
                        <div
                            className="px-2.5 xl:px-3 py-1.5 rounded transition-all duration-200 flex items-center justify-center cursor-pointer hover:opacity-80 shrink-0"
                            style={{ background: isActive('/anggota') ? '#E8850A' : '#FA982E' }}
                        >
                            <span className="text-[#1A1A1A] text-xs font-bold font-[Inter,sans-serif] leading-4 whitespace-nowrap">
                                ANGGOTA
                            </span>
                        </div>
                    </Link>

                    {/* 5. PROGRAM KERJA (Mega Menu) */}
                    <MegaMenuItem
                        label="PROGRAM KERJA"
                        href="/program-kerja"
                        cards={programKerjaCards}
                    />

                    {/* 6. MEDIA SOSIAL */}
                    <Link href="/media-sosial" className="no-underline">
                        <div
                            className="px-2.5 xl:px-3 py-1.5 rounded transition-all duration-200 flex items-center justify-center cursor-pointer hover:opacity-80 shrink-0"
                            style={{ background: isActive('/media-sosial') ? '#E8850A' : '#FA982E' }}
                        >
                            <span className="text-[#1A1A1A] text-xs font-bold font-[Inter,sans-serif] leading-4 whitespace-nowrap">
                                MEDIA SOSIAL
                            </span>
                        </div>
                    </Link>

                    {/* 7. PARTNERS */}
                    <Link href="/partners" className="no-underline">
                        <div
                            className="px-2.5 xl:px-3 py-1.5 rounded transition-all duration-200 flex items-center justify-center cursor-pointer hover:opacity-80 shrink-0"
                            style={{ background: isActive('/partners') ? '#E8850A' : '#FA982E' }}
                        >
                            <span className="text-[#1A1A1A] text-xs font-bold font-[Inter,sans-serif] leading-4 whitespace-nowrap">
                                PARTNERS
                            </span>
                        </div>
                    </Link>

                    {/* 8. GALERI (Mega Menu) */}
                    <MegaMenuItem
                        label="GALERI"
                        href="/galeri/galeri-preview-infinity"
                        cards={galeriCards}
                    />

                    <GooeyInput
                        placeholder="Cari..."
                        collapsedWidth={105}
                        expandedWidth={200}
                        expandedOffset={45}
                    />
                    <AnimatedThemeToggler variant="diamond" />

                    {/* Clerk Auth Controls */}
                    <div className="flex items-center gap-2 pl-1">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold font-[Inter,sans-serif] transition-colors cursor-pointer"
                                >
                                    Masuk
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 rounded-lg bg-[#2E90FA] hover:bg-[#1570EF] text-white text-xs font-semibold font-[Inter,sans-serif] transition-colors cursor-pointer"
                                >
                                    Daftar
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>

                {/* Mobile & Tablet Right Controls: Theme Toggler + Hamburger (shows below xl) */}
                <div className="xl:hidden flex items-center gap-1.5">
                    <AnimatedThemeToggler variant="diamond" className="hover:bg-white/25 text-white" />
                    <button
                        type="button"
                        onClick={toggleMobile}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 transition-colors duration-200"
                        aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={mobileOpen}
                    >
                        <div className="flex flex-col items-center justify-center gap-[5px] w-5 h-5 relative">
                            <span
                                className="w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center"
                                style={{
                                    transform: mobileOpen ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
                                }}
                            />
                            <span
                                className="w-5 h-[2px] bg-white rounded-full transition-all duration-300"
                                style={{
                                    opacity: mobileOpen ? 0 : 1,
                                    transform: mobileOpen ? 'translateX(-8px)' : 'none',
                                }}
                            />
                            <span
                                className="w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center"
                                style={{
                                    transform: mobileOpen ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
                                }}
                            />
                        </div>
                    </button>
                </div>
            </nav>

            {/* ─── MOBILE & TABLET DRAWER OVERLAY ────────────────────── */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[45] transition-opacity duration-300 xl:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-[85vw] max-w-[360px] bg-white z-50 transform transition-transform duration-300 ease-out xl:hidden overflow-y-auto overflow-x-hidden overscroll-contain ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <span className="text-[#1A1A1A] text-base font-bold font-[Inter,sans-serif]">
                        Menu
                    </span>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                        aria-label="Tutup menu"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
                            <path d="M4 4L12 12M12 4L4 12" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Search — full width */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex-1">
                        <GooeyInput
                            placeholder="Cari halaman, proker..."
                            collapsedWidth="100%"
                            expandedWidth="100%"
                            expandedOffset={0}
                            className="w-full"
                            classNames={{
                                filterWrap: "w-full"
                            }}
                        />
                    </div>
                    <AnimatedThemeToggler variant="diamond" className="text-[#1A1A1A] hover:bg-gray-100" />
                </div>

                {/* Mobile Nav Links Sesuai Urutan Presisi */}
                <div className="flex flex-col py-2">
                    {/* Mobile Clerk Auth Controls */}
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                        <SignedOut>
                            <div className="flex items-center gap-2 w-full">
                                <SignInButton mode="modal">
                                    <button
                                        type="button"
                                        className="flex-1 py-2 text-center rounded-lg border border-gray-200 text-[#1A1A1A] text-xs font-semibold font-[Inter,sans-serif] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                    >
                                        Masuk
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button
                                        type="button"
                                        className="flex-1 py-2 text-center rounded-lg bg-[#2E90FA] text-white text-xs font-semibold font-[Inter,sans-serif] hover:bg-[#1570EF] active:bg-[#1849A9] transition-colors"
                                    >
                                        Daftar
                                    </button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-semibold text-gray-700 font-[Inter,sans-serif]">Akun Pengguna</span>
                                <UserButton />
                            </div>
                        </SignedIn>
                    </div>

                    {/* 1. HOME */}
                    <Link href="/" className="no-underline" onClick={() => setMobileOpen(false)}>
                        <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 ${isActive('/') ? 'bg-[#2E90FA]/10 text-[#2E90FA]' : 'text-[#1A1A1A] hover:bg-gray-50 active:bg-gray-100'}`}>
                            <span className="text-sm font-bold font-[Inter,sans-serif]">HOME</span>
                            {isActive('/') && <div className="w-1.5 h-1.5 rounded-full bg-[#2E90FA]" />}
                        </div>
                    </Link>

                    {/* 2. ABOUT */}
                    <Link href="/about" className="no-underline" onClick={() => setMobileOpen(false)}>
                        <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 ${isActive('/about') ? 'bg-[#2E90FA]/10 text-[#2E90FA]' : 'text-[#1A1A1A] hover:bg-gray-50 active:bg-gray-100'}`}>
                            <span className="text-sm font-bold font-[Inter,sans-serif]">ABOUT</span>
                            {isActive('/about') && <div className="w-1.5 h-1.5 rounded-full bg-[#2E90FA]" />}
                        </div>
                    </Link>

                    {/* 3. EVENTS */}
                    <Link href="/events" className="no-underline" onClick={() => setMobileOpen(false)}>
                        <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 ${isActive('/events') ? 'bg-[#2E90FA]/10 text-[#2E90FA]' : 'text-[#1A1A1A] hover:bg-gray-50 active:bg-gray-100'}`}>
                            <span className="text-sm font-bold font-[Inter,sans-serif]">EVENTS</span>
                            {isActive('/events') && <div className="w-1.5 h-1.5 rounded-full bg-[#2E90FA]" />}
                        </div>
                    </Link>

                    {/* 4. ANGGOTA */}
                    <Link href="/anggota" className="no-underline" onClick={() => setMobileOpen(false)}>
                        <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 ${isActive('/anggota') ? 'bg-[#2E90FA]/10 text-[#2E90FA]' : 'text-[#1A1A1A] hover:bg-gray-50 active:bg-gray-100'}`}>
                            <span className="text-sm font-bold font-[Inter,sans-serif]">ANGGOTA</span>
                            {isActive('/anggota') && <div className="w-1.5 h-1.5 rounded-full bg-[#2E90FA]" />}
                        </div>
                    </Link>

                    {/* 5. PROGRAM KERJA (Accordion) */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleAccordion('PROGRAM KERJA')}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                            <span className="text-sm font-bold font-[Inter,sans-serif] text-[#1A1A1A]">PROGRAM KERJA</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="#6A7282"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-transform duration-200"
                                style={{ transform: expandedAccordion === 'PROGRAM KERJA' ? 'rotate(180deg)' : 'none' }}
                            >
                                <path d="M4 6L8 10L12 6" />
                            </svg>
                        </button>

                        <div
                            className="overflow-hidden transition-all duration-300 ease-out"
                            style={{
                                maxHeight: expandedAccordion === 'PROGRAM KERJA' ? `${programKerjaCards.length * 110 + 20}px` : '0px',
                                opacity: expandedAccordion === 'PROGRAM KERJA' ? 1 : 0,
                            }}
                        >
                            <div className="px-5 pb-3 flex flex-col gap-2">
                                {programKerjaCards.map((card) => (
                                    <Link key={card.href} href={card.href} className="no-underline" onClick={() => setMobileOpen(false)}>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 overflow-hidden" style={{ background: card.gradient }}>
                                                {card.icon && (typeof card.icon === 'string' && (card.icon.startsWith('/') || card.icon.startsWith('http'))) ? (
                                                    <img src={card.icon} alt={card.title} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <div className="text-white flex items-center justify-center">{card.icon ?? '📄'}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="text-xs font-bold text-[#1A1A1A] truncate">{card.title}</span>
                                                <span className="text-[11px] text-[#6A7282] line-clamp-1">{card.description}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 6. MEDIA SOSIAL */}
                    <Link href="/media-sosial" className="no-underline" onClick={() => setMobileOpen(false)}>
                        <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 ${isActive('/media-sosial') ? 'bg-[#2E90FA]/10 text-[#2E90FA]' : 'text-[#1A1A1A] hover:bg-gray-50 active:bg-gray-100'}`}>
                            <span className="text-sm font-bold font-[Inter,sans-serif]">MEDIA SOSIAL</span>
                            {isActive('/media-sosial') && <div className="w-1.5 h-1.5 rounded-full bg-[#2E90FA]" />}
                        </div>
                    </Link>

                    {/* 7. PARTNERS */}
                    <Link href="/partners" className="no-underline" onClick={() => setMobileOpen(false)}>
                        <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 ${isActive('/partners') ? 'bg-[#2E90FA]/10 text-[#2E90FA]' : 'text-[#1A1A1A] hover:bg-gray-50 active:bg-gray-100'}`}>
                            <span className="text-sm font-bold font-[Inter,sans-serif]">PARTNERS</span>
                            {isActive('/partners') && <div className="w-1.5 h-1.5 rounded-full bg-[#2E90FA]" />}
                        </div>
                    </Link>

                    {/* 8. GALERI (Accordion) */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleAccordion('GALERI')}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                            <span className="text-sm font-bold font-[Inter,sans-serif] text-[#1A1A1A]">GALERI</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="#6A7282"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-transform duration-200"
                                style={{ transform: expandedAccordion === 'GALERI' ? 'rotate(180deg)' : 'none' }}
                            >
                                <path d="M4 6L8 10L12 6" />
                            </svg>
                        </button>

                        <div
                            className="overflow-hidden transition-all duration-300 ease-out"
                            style={{
                                maxHeight: expandedAccordion === 'GALERI' ? `${galeriCards.length * 110 + 20}px` : '0px',
                                opacity: expandedAccordion === 'GALERI' ? 1 : 0,
                            }}
                        >
                            <div className="px-5 pb-3 flex flex-col gap-2">
                                {galeriCards.map((card) => (
                                    <Link key={card.href} href={card.href} className="no-underline" onClick={() => setMobileOpen(false)}>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 overflow-hidden" style={{ background: card.gradient }}>
                                                {card.icon && (typeof card.icon === 'string' && (card.icon.startsWith('/') || card.icon.startsWith('http'))) ? (
                                                    <img src={card.icon} alt={card.title} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <div className="text-white flex items-center justify-center">{card.icon ?? '📄'}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="text-xs font-bold text-[#1A1A1A] truncate">{card.title}</span>
                                                <span className="text-[11px] text-[#6A7282] line-clamp-1">{card.description}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="mt-auto px-5 py-5 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[10px] text-[#99A1AF] font-[Inter,sans-serif] text-center">
                        © {new Date().getFullYear()} OSIS SMAIT Fithrah Insani
                    </p>
                </div>
            </div>
        </>
    );
};

export default Navbar;

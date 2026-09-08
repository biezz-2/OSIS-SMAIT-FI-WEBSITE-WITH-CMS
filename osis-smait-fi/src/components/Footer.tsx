"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFooterConfigFromStrapi, FooterConfig } from '@/lib/strapi';

const defaultFooterConfig: FooterConfig = {
  brand_title: 'OSIS SMAIT FI',
  slogan: 'Agora Acta - Dari Gagasan Menuju Aksi, Dari Partisipasi Menuju Kontribusi.',
  slogan_sub: '2025 - 2026',
  periode: '2025 - 2026',
  social_links: [
    { platform: 'instagram', url: 'https://www.instagram.com/osissmaitfi?igsh=MTRyMW43d2psd3gwaQ==', label: 'Instagram' },
    { platform: 'youtube', url: 'https://www.youtube.com/@osissmaitfithrahinsani9481', label: 'YouTube' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@osissmaitfi?_r=1&_t=ZS-98SucgDTG2Z', label: 'TikTok' },
    { platform: 'email', url: 'mailto:osissmaitfi@gmail.com', label: 'Email' }
  ],
  quick_links: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Program Kerja', href: '/program-kerja' },
    { label: 'Portal Mubes', href: '/portal-mubes' },
    { label: 'Social Media', href: '/media-sosial' },
    { label: 'Foto Anggota', href: '/anggota' },
    { label: 'Partners', href: '/partners' }
  ],
  alamat: 'SMAIT Fithrah Insani, Jl. H. Gofur No. 10 Tanimulya, Ngamprah, Kab. Bandung Barat',
  telepon: '(022) 87808984',
  email: 'osissmaitfi@gmail.com',
  copyright_text: 'OSIS SMAIT Fithrah Insani. All rights reserved.'
};

const Footer = () => {
  const [config, setConfig] = useState<FooterConfig>(defaultFooterConfig);

  useEffect(() => {
    async function loadFooterData() {
      try {
        const data = await fetchFooterConfigFromStrapi();
        if (data) setConfig(data);
      } catch (err) {
        console.warn('Failed to load footer data from Strapi:', err);
      }
    }
    loadFooterData();
  }, []);

  return (
    <footer className="w-full bg-[#111827] text-[#9CA3AF] py-16 px-6 md:px-12 lg:px-16 overflow-hidden border-t border-gray-800">
      <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

        {/* Column 1: Organization Branding & Slogan (takes 6 columns on lg) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-6">
            {/* Header logo / Title */}
            <div className="flex items-center gap-3.5">
              <span className="text-white text-xl font-bold tracking-wide font-roboto">
                {config.brand_title}
              </span>
            </div>

            {/* Slogan */}
            <p className="text-sm font-normal leading-relaxed max-w-[370px] font-roboto">
              {config.slogan}{" "}
              <span className="text-[#9CA3AF] block mt-1">
                {config.slogan_sub || config.periode}
              </span>
            </p>
          </div>

          {/* Social Media Circular Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {config.social_links.map((social) => {
              const platform = social.platform.toLowerCase();
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FA982E] hover:text-white hover:scale-110 transition-all duration-300 group"
                  aria-label={social.label || social.platform}
                >
                  {platform.includes('instagram') && (
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                  {platform.includes('youtube') && (
                    <svg className="w-5 h-5 fill-current text-gray-400 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  )}
                  {platform.includes('tiktok') && (
                    <svg className="w-5 h-5 fill-current text-gray-400 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.14.99 1.13 2.37 1.83 3.86 2.02v3.86c-1.08-.02-2.13-.24-3.13-.67-.85-.36-1.63-.9-2.28-1.57v7.54c.03 2.16-.72 4.26-2.12 5.88-1.39 1.62-3.37 2.62-5.51 2.78-2.58.19-5.16-.78-6.91-2.65C.2 17.06-.52 14.18-.32 11.58c.2-2.58 1.68-4.94 3.96-6.19 1.48-.81 3.16-1.18 4.84-1.07V8.2c-1.13-.08-2.26.23-3.17.92-.91.69-1.5 1.76-1.63 2.91-.25 2.19 1.29 4.19 3.47 4.5 1.58.23 3.2-.42 4.04-1.78.36-.59.54-1.28.53-1.97V.02z" />
                    </svg>
                  )}
                  {platform.includes('email') && (
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Quick Links (takes 3 columns on lg) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <h3 className="text-white text-lg font-bold tracking-wide font-roboto">
            QUICK LINKS
          </h3>
          <ul className="flex flex-col gap-4 font-roboto text-sm">
            {config.quick_links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Us (takes 3 columns on lg) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <h3 className="text-white text-lg font-bold tracking-wide font-roboto">
            CONTACT US
          </h3>
          <div className="flex flex-col gap-6 font-roboto text-sm">

            {/* Address */}
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="leading-relaxed">
                {config.alamat}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a href={`tel:${config.telepon.replace(/[^0-9]/g, '')}`} className="hover:text-white transition-colors duration-200">
                {config.telepon}
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href={`mailto:${config.email}`}
                className="hover:text-white transition-colors duration-200 break-all"
              >
                {config.email}
              </a>
            </div>

          </div>
        </div>

      </div>

      <div className="max-w-[1120px] mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-roboto text-gray-500">
        <span>© {new Date().getFullYear()} {config.copyright_text}</span>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

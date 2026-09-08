"use client";

import Image from "next/image";
import CtaButton from "./cta-button";
import { useEventTheme } from "./theme-provider";
import { eventDetailThemeTokens } from "./theme";

export interface EventHeroProps {
  title: string;
  tagline?: string;
  categoryBanner?: string;
  dateStr?: string;
  bannerUrl?: string;
  ctaUrl?: string;
}

export default function EventHeroSection({
  title,
  tagline,
  categoryBanner = "LOMBA & FESTIVAL / PANGGUNG SENI / ALL DAY",
  dateStr = "18.08.26 7:00 PM",
  bannerUrl = "/images/hero-photo.png",
  ctaUrl,
}: EventHeroProps) {
  const { theme } = useEventTheme();
  const tokens = eventDetailThemeTokens[theme];

  // Pisahkan judul jika ada beberapa kata untuk display bertingkat
  const titleWords = (title || "GEMA MERDEKA").trim().split(" ");
  const firstWord = titleWords[0];
  const remainingWords = titleWords.slice(1).join(" ");

  return (
    <section
      className={`relative w-full min-h-screen mx-auto overflow-hidden flex flex-col justify-between ${
        theme === "dark" ? "event-hero-radial-dark" : "event-hero-radial-light"
      }`}
      style={{ backgroundColor: tokens.heroBg }}
    >
      <div className="absolute top-0 left-0 w-full h-[60%] md:h-[65%] lg:h-[70%] z-0">
        <Image
          src={bannerUrl || "/images/hero-photo.png"}
          alt={title || "Event Hero Visual"}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: tokens.heroGradient }}
      />

      <div className="absolute top-[20px] md:top-[32px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-64px)] max-w-[1400px] min-h-[60px] md:h-[76px] z-10">
        <div className="absolute inset-0 rounded-[20px] md:rounded-[33px] liquid-glass" />
        <div
          className="relative h-full font-mono text-[10px] md:text-[12px] tracking-[0.57px] flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 px-6 md:px-12 py-3 md:py-0"
          style={{ color: tokens.heroBannerText }}
        >
          <p className="max-w-[360px] leading-[16.63px]">
            {tagline || "Perayaan Semangat Kebangsaan & Kebersamaan Generasi Muda"}
          </p>
          <p className="max-w-[360px] md:text-right leading-[16.63px]">
            {categoryBanner}
          </p>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-20"
        style={{
          background:
            "linear-gradient(to top, #0B0F17 0%, rgba(11, 15, 23, 0.8) 40%, transparent 100%)",
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-10 px-6 md:px-12 lg:px-16 pb-10 md:pb-14">
          <div className="relative w-full md:max-w-[760px] shrink-0">
            <h1
              className="font-playfair text-[48px] sm:text-[64px] md:text-[84px] lg:text-[96px] font-normal tracking-[0.74px] not-italic flex flex-col gap-[4px] uppercase"
              style={{
                color: tokens.heroTitle,
                textShadow: "0px 6px 40px rgba(0, 0, 0, 0.50)",
                lineHeight: "1.02",
              }}
            >
              <span className="block">{firstWord}</span>
              {remainingWords && <span className="block">{remainingWords}</span>}
            </h1>
          </div>

          <div className="flex flex-col items-start gap-[14px] shrink-0 pb-1">
            <p
              className="text-[14px] md:text-[16px] font-mono tracking-[1.2px]"
              style={{ color: tokens.heroSubtitle }}
            >
              {dateStr}
            </p>
            <CtaButton href={ctaUrl || "#dome"}>VIEW MORE</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

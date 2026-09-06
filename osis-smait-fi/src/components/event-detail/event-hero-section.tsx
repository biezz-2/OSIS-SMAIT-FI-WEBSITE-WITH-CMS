"use client";

import Image from "next/image";
import EventNavbar from "./event-navbar";
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
      className={`relative w-full max-w-[1200px] min-h-[520px] md:min-h-[680px] lg:h-[811px] mx-auto overflow-hidden ${
        theme === "dark" ? "event-hero-radial-dark" : "event-hero-radial-light"
      }`}
      style={{ backgroundColor: tokens.heroBg }}
    >
      <div className="absolute top-[60px] md:top-[75px] left-0 w-full h-[45%] md:h-[55%] lg:h-[601px] z-0">
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

      <div className="relative z-50 pointer-events-auto">
        <EventNavbar />
      </div>

      <div className="absolute top-[72px] md:top-[90px] left-[16px] md:left-[26px] w-[calc(100%-32px)] md:w-[calc(100%-52px)] max-w-[1141px] min-h-[70px] md:h-[91px] z-10">
        <div className="absolute left-[12px] md:left-[23px] top-[-3px] w-[calc(100%-24px)] md:w-[calc(100%-46px)] h-full rounded-[20px] md:rounded-[33px] bg-[#6E6456]/30 shadow-[0px_25px_37.7px_16px_rgba(0,0,0,0.25)]" />
        <div
          className="relative h-full font-mono text-[10px] md:text-[12px] tracking-[0.57px] flex flex-col md:block gap-2 md:gap-0 px-4 md:px-0 py-3 md:py-0"
          style={{ color: tokens.heroBannerText }}
        >
          <p className="md:absolute md:left-[50px] md:top-1/2 md:-translate-y-1/2 md:w-[239px] leading-[16.63px]">
            {tagline || "Perayaan Semangat Kebangsaan & Kebersamaan Generasi Muda"}
          </p>
          <p className="md:absolute md:right-[56px] md:top-1/2 md:-translate-y-1/2 md:w-[231px] md:text-right leading-[16.63px]">
            {categoryBanner}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-10 px-4 md:px-[46px] pb-8 md:pb-[40px] pt-6 md:pt-0">
        <div className="relative w-full md:max-w-[680px] shrink-0">
          <h1
            className="font-playfair text-[42px] sm:text-[56px] md:text-[74px] font-normal tracking-[0.74px] not-italic flex flex-col gap-[6px] md:gap-[4px] uppercase"
            style={{
              color: tokens.heroTitle,
              textShadow: "0px 6px 40px rgba(0, 0, 0, 0.50)",
              lineHeight: "1.05",
            }}
          >
            <span className="block">{firstWord}</span>
            {remainingWords && <span className="block">{remainingWords}</span>}
          </h1>
        </div>

        <div className="flex flex-col items-start gap-[14px] shrink-0 pb-1 md:pb-0">
          <p
            className="text-[13px] md:text-[15px] font-mono tracking-[1.2px]"
            style={{ color: tokens.heroSubtitle }}
          >
            {dateStr}
          </p>
          <CtaButton href={ctaUrl || "#dome"}>VIEW MORE</CtaButton>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import CtaButton from "./cta-button";
import { useEventTheme } from "./theme-provider";
import { eventDetailThemeTokens } from "./theme";

export interface DomeImageItem {
  src: string;
  alt: string;
}

export interface EventDomeProps {
  heading?: string;
  bodyUpper?: string;
  bodyLower?: string;
  images?: DomeImageItem[];
}

const defaultDomeImages: DomeImageItem[] = [
  {
    src: "/images/dome-photo.png",
    alt: "Dome vortex projection",
  },
  {
    src: "/images/event-distance.png",
    alt: "Edufest Infinity visual",
  },
  {
    src: "/images/event-orion.png",
    alt: "MPLS Sancaya Wiyata visual",
  },
  {
    src: "/images/event-newton.png",
    alt: "Univ Day visual",
  },
];

export default function EventDomeSection({
  heading = "GEMA KEMERDEKAAN",
  bodyUpper = "DI DALAM DOME, CAHAYA DAN VISUAL BERGERAK MENYATUKAN CERITA TENTANG KEMERDEKAAN, PERJUANGAN,DAN SEMANGAT GENERASI MUDA.",
  bodyLower = "Nikmati perjalanan visual yang membawa kisah kemerdekaan dari masa lalu hingga masa kini. Cahaya, suara, dan gambar berpadu menciptakan pengalaman yang mengajak kita mengenang perjuangan sekaligus merayakan semangat Indonesia hari ini.",
  images = defaultDomeImages,
}: EventDomeProps) {
  const { theme } = useEventTheme();
  const tokens = eventDetailThemeTokens[theme];
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeImages = images && images.length > 0 ? images : defaultDomeImages;

  const goPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + activeImages.length) % activeImages.length
    );
  }, [activeImages.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  }, [activeImages.length]);

  return (
    <section
      id="dome"
      className="w-full max-w-[1200px] mx-auto pt-[48px] md:pt-[80px] pb-0 px-4 md:px-[46px] flex flex-col gap-[20px] md:gap-[26px]"
      style={{ backgroundColor: tokens.sectionBg }}
    >
      <div className="flex items-center justify-between w-full gap-4">
        <h2
          className="font-playfair italic font-semibold text-[26px] md:text-[38px] tracking-[0.38px] uppercase"
          style={{ color: tokens.domeHeading }}
        >
          {heading}
        </h2>
        {activeImages.length > 1 && (
          <div
            className="flex items-center gap-3 md:gap-4 font-mono text-[18px] md:text-[22px] tracking-[6.6px] pb-[3px] shrink-0 select-none"
            style={{ color: tokens.domeNav }}
          >
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="hover:opacity-70 transition-opacity cursor-pointer"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="hover:opacity-70 transition-opacity cursor-pointer"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-[24px] md:gap-[34px] items-start w-full pb-[26px]">
        <div className="w-full lg:w-[290px] shrink-0 flex flex-col justify-between lg:min-h-[407px] gap-8 lg:gap-0">
          <div>
            <p
              className="font-mono text-[13px] md:text-[15px] leading-[1.65] md:leading-[24.75px] tracking-[0.45px] uppercase"
              style={{ color: tokens.domeBodyUpper }}
            >
              {bodyUpper}
            </p>
            <p
              className="mt-[16px] md:mt-[21.25px] font-mono text-[10px] leading-[18.5px] tracking-[0.1px]"
              style={{ color: tokens.domeBodyLower }}
            >
              {bodyLower}
            </p>
          </div>
          <div className="lg:pt-[54px]">
            <CtaButton href="#other-events">OTHER EVENTS</CtaButton>
          </div>
        </div>

        <div className="relative flex-1 w-full aspect-[784/400] min-w-0 overflow-hidden bg-stone-900 rounded-sm">
          {activeImages.map((image, index) => (
            <Image
              key={`${image.src}-${index}`}
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-opacity duration-500"
              style={{ opacity: index === currentIndex ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

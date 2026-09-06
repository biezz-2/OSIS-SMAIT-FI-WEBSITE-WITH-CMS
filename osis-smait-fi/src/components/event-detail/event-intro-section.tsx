"use client";

import { useEventTheme } from "./theme-provider";
import { eventDetailThemeTokens } from "./theme";

export interface EventIntroProps {
  introText?: string;
}

export default function EventIntroSection({ introText }: EventIntroProps) {
  const { theme } = useEventTheme();
  const tokens = eventDetailThemeTokens[theme];

  const defaultIntro =
    "Kemerdekaan bukan sekadar jejak sejarah, melainkan jembatan yang menghubungkan gagasan, karya, dan semangat kebersamaan. Mari bergabung dalam perayaan puncak HUT RI ke-81 melalui rangkaian lomba kreatif, pertunjukan seni budaya, dan panggung apresiasi generasi muda.";

  return (
    <section
      className="w-full max-w-[1200px] mx-auto px-4 md:px-[46px] py-[26px] md:py-[30px] flex items-center"
      style={{ backgroundColor: tokens.sectionBg }}
    >
      <p
        className="w-full font-mono text-[14px] md:text-[17.5px] leading-[1.75] md:leading-[30.63px] tracking-[0.35px]"
        style={{ color: tokens.introText }}
      >
        {introText || defaultIntro}
      </p>
    </section>
  );
}

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useEventTheme } from "./theme-provider";
import { eventDetailThemeTokens } from "./theme";

export interface EventIntroProps {
  introText?: string;
}

export default function EventIntroSection({ introText }: EventIntroProps) {
  const { theme } = useEventTheme();
  const tokens = eventDetailThemeTokens[theme];

  const defaultIntro =
    "Rangkaian agenda dan kegiatan resmi OSIS SMAIT Fithrah Insani.";

  return (
    <section
      className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-[36px] md:py-[48px] flex items-center"
      style={{ backgroundColor: tokens.sectionBg }}
    >
      <div
        className="w-full font-mono text-[14px] md:text-[17.5px] leading-[1.75] md:leading-[30.63px] tracking-[0.35px] prose prose-invert max-w-none [&>p]:mb-3 [&>p:last-child]:mb-0"
        style={{ color: tokens.introText }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {introText || defaultIntro}
        </ReactMarkdown>
      </div>
    </section>
  );
}

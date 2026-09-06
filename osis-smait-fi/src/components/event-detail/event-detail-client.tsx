"use client";

import React from "react";
import { useEventTheme } from "@/components/event-detail/theme-provider";
import { eventDetailThemeTokens } from "@/components/event-detail/theme";
import EventHeroSection, { EventHeroProps } from "@/components/event-detail/event-hero-section";
import EventIntroSection from "@/components/event-detail/event-intro-section";
import EventDomeSection, { DomeImageItem } from "@/components/event-detail/event-dome-section";
import EventOthersSection, { OtherEventItem } from "@/components/event-detail/event-others-section";

interface EventDetailClientProps {
  hero: EventHeroProps;
  introText?: string;
  domeHeading?: string;
  domeBodyUpper?: string;
  domeBodyLower?: string;
  domeImages?: DomeImageItem[];
  otherEvents?: OtherEventItem[];
}

export default function EventDetailClient({
  hero,
  introText,
  domeHeading,
  domeBodyUpper,
  domeBodyLower,
  domeImages,
  otherEvents,
}: EventDetailClientProps) {
  const { theme } = useEventTheme();
  const tokens = eventDetailThemeTokens[theme];

  return (
    <main
      className="min-h-screen w-full text-white flex flex-col items-center p-0 transition-colors duration-300 overflow-x-hidden"
      style={{ backgroundColor: tokens.pageBg }}
    >
      <div className="w-full flex flex-col items-center">
        <EventHeroSection {...hero} />
        <EventIntroSection introText={introText} />
        <EventDomeSection
          heading={domeHeading}
          bodyUpper={domeBodyUpper}
          bodyLower={domeBodyLower}
          images={domeImages}
        />
        <EventOthersSection events={otherEvents} />
      </div>
    </main>
  );
}

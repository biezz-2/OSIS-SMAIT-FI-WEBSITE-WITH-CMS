"use client";

import Image from "next/image";
import Link from "next/link";
import { useEventTheme } from "./theme-provider";
import { eventDetailThemeTokens } from "./theme";

export interface OtherEventItem {
  id: string | number;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface OtherEventsProps {
  heading?: string;
  events?: OtherEventItem[];
}

const defaultOtherEvents: OtherEventItem[] = [
  {
    id: 1,
    title: "EDUFEST INFINITY",
    description:
      "An exploration of how cultures interpret spatial relationships in the night sky, turning distance into narrative and meaning.",
    image: "/images/event-distance.png",
    href: "/edufest-infinity",
  },
  {
    id: 2,
    title: "MPLS SANCAYA WIYATA",
    description:
      "A comparative reading of Orion, tracing how one constellation becomes multiple figures across myth traditions.",
    image: "/images/event-orion.png",
    href: "/events/mpls-sancaya-wiyata",
  },
  {
    id: 3,
    title: "UNIV DAY",
    description:
      "Examines Étienne-Louis Boullée's visionary monument to Newton as a speculative space where architecture and astronomy converge.",
    image: "/images/event-newton.png",
    href: "/events/univ-day",
  },
  {
    id: 4,
    title: "CLASSMEET",
    description:
      "An examination of early celestial mapping, where imagination shaped the structure of the sky.",
    image: "/images/event-starmaps.png",
    href: "/events/classmeet",
  },
];

export default function EventOthersSection({
  heading = "OTHER EVENTS",
  events = defaultOtherEvents,
}: OtherEventsProps) {
  const { theme } = useEventTheme();
  const tokens = eventDetailThemeTokens[theme];

  const displayList = events && events.length > 0 ? events : defaultOtherEvents;

  return (
    <section
      id="other-events"
      className="w-full max-w-[1400px] mx-auto pt-[56px] md:pt-[96px] pb-[56px] md:pb-[80px] px-6 md:px-12 lg:px-16 flex flex-col gap-[24px] md:gap-[32px]"
      style={{ backgroundColor: tokens.sectionBg }}
    >
      <h2
        className="font-playfair italic font-semibold text-[26px] md:text-[38px] tracking-[0.38px] uppercase"
        style={{ color: tokens.heading }}
      >
        {heading}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] w-full">
        {displayList.map((event) => (
          <article key={event.id} className="flex flex-col gap-[9px] min-w-0">
            <Link href={event.href} className="group flex flex-col gap-[9px] min-w-0 no-underline">
              <div className="relative w-full h-[180px] sm:h-[200px] lg:h-[230px] overflow-hidden bg-stone-900">
                <Image
                  src={event.image || "/images/event-distance.png"}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3
                className="pt-[7px] font-mono text-[12px] md:text-[13.5px] tracking-[0.945px] uppercase transition-opacity group-hover:opacity-80"
                style={{ color: tokens.eventsTitle }}
              >
                {event.title}
              </h3>
              <p
                className="font-mono text-[10px] leading-[18.5px] tracking-[0.1px] line-clamp-4"
                style={{ color: tokens.eventsDesc }}
              >
                {event.description}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

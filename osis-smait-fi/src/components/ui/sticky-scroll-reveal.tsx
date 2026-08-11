"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StickyScrollItem {
  title: string;
  description: string;
  content?: React.ReactNode;
}

export function StickyScroll({
  content,
  contentClassName,
}: {
  content: StickyScrollItem[];
  contentClassName?: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const accentColors = [
    "#AACDDC",
    "#7A9EAD",
    "#1C2331",
    "#AACDDC",
    "#7A9EAD",
    "#1C2331",
    "#AACDDC",
    "#7A9EAD",
  ];

  return (
    <motion.div
      ref={ref}
      className="relative flex h-[32rem] justify-center gap-10 overflow-y-auto rounded-2xl px-8 py-10"
      style={{ background: "#F7F7F7" }}
    >
      {/* Left: scrollable text */}
      <div className="relative flex items-start">
        <div className="max-w-sm">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold text-[#101828]"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.2 }}
                className="mt-4 max-w-sm text-sm leading-relaxed text-[#4A5565]"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>

      {/* Right: sticky panel */}
      <div
        className={cn(
          "sticky top-10 hidden h-72 w-80 overflow-hidden rounded-2xl lg:block",
          contentClassName,
        )}
        style={{
          border: `2px solid ${accentColors[activeCard % accentColors.length]}`,
          transition: "border-color 0.3s ease",
        }}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const bgColors = [
  'bg-blue-500 text-white',
  'bg-emerald-500 text-white',
  'bg-violet-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-500 text-white',
  'bg-indigo-500 text-white',
  'bg-teal-500 text-white',
];

const getColorClass = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
};

export const AnimatedTooltip = ({
  items,
  sizeClass = "h-14 w-14",
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image?: string | null;
  }[];
  sizeClass?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: any) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = event.target.offsetWidth / 2;
      x.set(event.nativeEvent.offsetX - halfWidth);
    });
  };

  const isSmall = sizeClass.includes("h-8");
  const marginClass = isSmall ? "-mr-2" : "-mr-4";
  const fontSizeClass = isSmall ? "text-[10px]" : "text-sm";

  return (
    <>
      {items.map((item) => (
        <div
          className={`group relative ${marginClass}`}
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-xs font-bold text-white">
                  {item.name}
                </div>
                <div className="text-[10px] text-gray-300">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {item.image ? (
            <img
               onMouseMove={handleMouseMove}
               src={item.image}
               alt={item.name}
               className={`relative !m-0 ${sizeClass} rounded-full border-2 border-white dark:border-slate-900 object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105`}
            />
          ) : (
            <div
               onMouseMove={handleMouseMove}
               className={`relative !m-0 ${sizeClass} rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center font-bold select-none transition duration-500 group-hover:z-30 group-hover:scale-105 ${fontSizeClass} ${getColorClass(item.name)}`}
            >
              {getInitials(item.name)}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

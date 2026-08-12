"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BorderBeamButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  beamSize?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderBeamClassName?: string;
  children: React.ReactNode;
}

export function BorderBeamButton({
  className,
  borderBeamClassName,
  duration = 4,
  colorFrom = "#60a5fa",
  colorTo = "#c084fc",
  children,
  ...props
}: BorderBeamButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] font-semibold transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg",
        className
      )}
      {...props}
    >
      {/* Animated Border Beam */}
      <span
        className={cn(
          "absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,var(--beam-from)_85%,var(--beam-to)_100%)]",
          borderBeamClassName
        )}
        style={
          {
            "--beam-from": colorFrom,
            "--beam-to": colorTo,
            animationDuration: `${duration}s`,
          } as React.CSSProperties
        }
      />
      {/* Button Surface */}
      <span className="relative z-10 flex items-center justify-center gap-2 rounded-full bg-black/90 px-8 py-4 text-white backdrop-blur-md hover:bg-neutral-900 transition-colors">
        {children}
      </span>
    </button>
  );
}

export function BorderBeamIconButton({
  className,
  children,
  ...props
}: BorderBeamButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] font-semibold transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg",
        className
      )}
      {...props}
    >
      <span
        className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#60a5fa_85%,#c084fc_100%)]"
      />
      <span className="relative z-10 flex items-center justify-center p-3 rounded-full bg-black/90 text-white backdrop-blur-md hover:bg-neutral-900 transition-colors">
        {children}
      </span>
    </button>
  );
}

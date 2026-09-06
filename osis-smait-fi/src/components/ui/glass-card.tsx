"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export function GlassCard({
    children,
    className,
    glowColor = "rgba(122, 158, 173, 0.25)",
    ...props
}: GlassCardProps) {
    return (
        <div className="relative group w-full">
            {/* Ambient background glow */}
            <div
                className="absolute -inset-1 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${glowColor} 0%, rgba(16, 24, 40, 0) 70%)`,
                }}
            />

            {/* Main glass card container */}
            <div
                className={cn(
                    "relative overflow-hidden rounded-3xl p-6 md:p-8",
                    "bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(16,24,40,0.08)]",
                    "transition-all duration-300 hover:border-white/80 hover:shadow-[0_12px_40px_0_rgba(16,24,40,0.12)]",
                    className
                )}
                {...props}
            >
                {/* Subtle glass reflection gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">{children}</div>
            </div>
        </div>
    );
}

// ponytail: basic glass card primitive without 3D tilt. Upgrade to framer-motion 3D tilt if interactive depth requested.

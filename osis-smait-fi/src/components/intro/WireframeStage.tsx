"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface WireframeStageProps {
    duration?: number;
    onComplete?: () => void;
}

export default function WireframeStage({
    duration = 2500,
    onComplete
}: WireframeStageProps) {
    const [particles, setParticles] = useState<Array<{
        left: number;
        top: number;
        x: number;
        y: number;
        delay: number;
    }>>([]);

    useEffect(() => {
        setParticles(
            [...Array(30)].map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                delay: Math.random() * 0.8,
            }))
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    // Precise coordinate numbers for 100x100 viewbox
    const lines = [
        // Outer Frame Brackets
        { x1: 20, y1: 20, x2: 35, y2: 20, delay: 0 }, // Top-Left Horizontal
        { x1: 20, y1: 20, x2: 20, y2: 35, delay: 0 }, // Top-Left Vertical

        { x1: 65, y1: 20, x2: 80, y2: 20, delay: 0.1 }, // Top-Right Horizontal
        { x1: 80, y1: 20, x2: 80, y2: 35, delay: 0.1 }, // Top-Right Vertical

        { x1: 20, y1: 80, x2: 35, y2: 80, delay: 0.2 }, // Bottom-Left Horizontal
        { x1: 20, y1: 65, x2: 20, y2: 80, delay: 0.2 }, // Bottom-Left Vertical

        { x1: 65, y1: 80, x2: 80, y2: 80, delay: 0.3 }, // Bottom-Right Horizontal
        { x1: 80, y1: 65, x2: 80, y2: 80, delay: 0.3 }, // Bottom-Right Vertical

        // Inner Guide Lines
        { x1: 25, y1: 50, x2: 40, y2: 50, delay: 0.4 }, // Left Middle
        { x1: 60, y1: 50, x2: 75, y2: 50, delay: 0.4 }, // Right Middle
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)] overflow-hidden"
        >
            {/* Precise Technical Grid */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
              linear-gradient(var(--foreground) 1px, transparent 1px),
              linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
            `,
                        backgroundSize: '20px 20px',
                    }}
                />
            </div>

            {/* Main Assembly Area */}
            <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
                {/* Geometric Drawing */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                >
                    {lines.map((line, i) => (
                        <motion.line
                            key={i}
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            stroke="#ff0088"
                            strokeWidth="0.2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{
                                pathLength: { duration: 0.8, delay: line.delay, ease: "easeInOut" },
                                opacity: { duration: 0.2, delay: line.delay },
                            }}
                        />
                    ))}

                    {/* Central Target Circle */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="12"
                        fill="none"
                        stroke="#ff0088"
                        strokeWidth="0.15"
                        strokeDasharray="2 1"
                        initial={{ scale: 0, opacity: 0, rotate: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 0.4,
                            rotate: 360
                        }}
                        transition={{
                            scale: { duration: 1, delay: 0.4 },
                            opacity: { duration: 1, delay: 0.4 },
                            rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                        }}
                    />

                    {/* Technical Markers */}
                    <motion.text
                        x="22"
                        y="18"
                        fill="#ff0088"
                        fontSize="1.5"
                        className="font-mono uppercase opacity-40 select-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        SYS-REF: 8.0-INF
                    </motion.text>

                    <motion.text
                        x="80"
                        y="85"
                        fill="#ff0088"
                        fontSize="1.5"
                        textAnchor="end"
                        className="font-mono uppercase opacity-40 select-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        GRID: ACTIVE
                    </motion.text>
                </svg>

                {/* Logo Shadow Reveal */}
                <motion.div
                    className="relative w-[80%] h-auto flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                    animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                >
                    <Image
                        src="/images/logo-fiedufest.png"
                        alt="FIEDUFEST"
                        width={800}
                        height={400}
                        className="w-full h-auto grayscale"
                        priority
                    />
                </motion.div>

                {/* Precise Scanning Line */}
                <motion.div
                    className="absolute inset-0 w-full h-[1px] bg-[#ff0088] opacity-30 shadow-[0_0_10px_#ff0088]"
                    animate={{
                        top: ["0%", "100%", "0%"],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Modern Status Text */}
            <div className="absolute bottom-16 left-0 w-full flex flex-col items-center gap-2">
                <div className="flex items-baseline gap-4">
                    <motion.p
                        className="text-[10px] tracking-[0.5em] uppercase text-[var(--foreground)] font-mono font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                    >
                        Constructing Infinite Path
                    </motion.p>
                    <motion.span
                        className="text-[10px] font-mono text-[#ff0088]"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        _
                    </motion.span>
                </div>

                {/* Technical Progress Bars */}
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-10 h-[2px] bg-[var(--muted)] overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                        >
                            <motion.div
                                className="h-full bg-[#ff0088]"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Assembly Particles */}
            {particles.length > 0 && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((particle, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-[1px] h-[1px] bg-[#ff0088] rounded-full"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 0.4, 0],
                                scale: [0, 1.5, 0],
                                x: [0, particle.x],
                                y: [0, particle.y],
                            }}
                            transition={{
                                duration: 2,
                                delay: particle.delay,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

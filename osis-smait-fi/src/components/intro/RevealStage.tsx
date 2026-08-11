"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RevealStageProps {
    duration?: number;
    onComplete?: () => void;
}

export default function RevealStage({
    duration = 1500,
    onComplete
}: RevealStageProps) {
    const [sparkles, setSparkles] = useState<Array<{
        left: number;
        top: number;
        delay: number;
        scale: number;
    }>>([]);

    useEffect(() => {
        // Generate particles once on mount
        setSparkles(
            [...Array(40)].map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 0.5,
                scale: 0.5 + Math.random() * 1.5,
            }))
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)] overflow-hidden pointer-events-none"
        >
            {/* 1. Cinematic Flash Spread */}
            <motion.div
                className="absolute inset-0 z-30"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 1, 0],
                    backgroundColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0)"]
                }}
                transition={{ duration: 0.8, times: [0, 0.2, 1] }}
            />

            {/* 2. Concentric Shockwaves (Igloo Style) */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[300px] h-[300px] border-[0.5px] border-[#ff0088] rounded-full z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 15],
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        delay: i * 0.15,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                />
            ))}

            {/* 3. Radial Burst of Particles */}
            <div className="absolute inset-0 z-20">
                {sparkles.length > 0 && sparkles.map((sparkle, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[1.5px] h-[1.5px] bg-[#ff0088] rounded-full shadow-[0_0_12px_#ff0088]"
                        style={{
                            left: `${sparkle.left}%`,
                            top: `${sparkle.top}%`,
                        }}
                        initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                        animate={{
                            scale: [0, sparkle.scale, 0],
                            opacity: [0, 1, 0],
                            x: (sparkle.left - 50) * 12,
                            y: (sparkle.top - 50) * 12,
                        }}
                        transition={{
                            duration: 1.4,
                            delay: sparkle.delay,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </div>

            {/* 4. Technical Grid Dissolve Effect */}
            <motion.div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                animate={{
                    opacity: [0.05, 0.1, 0],
                    scale: [1, 1.1]
                }}
                transition={{ duration: 1.5 }}
            >
                <svg className="w-full h-full">
                    <pattern id="transition-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ff0088" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#transition-grid)" />
                </svg>
            </motion.div>

            {/* 5. Center Core Light */}
            <motion.div
                className="absolute w-[200px] h-[200px] bg-[#ff0088] rounded-full blur-[100px]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: [0, 5],
                    opacity: [0, 0.6, 0]
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />
        </motion.div>
    );
}

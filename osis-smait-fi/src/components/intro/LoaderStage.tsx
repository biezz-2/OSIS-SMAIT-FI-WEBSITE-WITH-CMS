"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoaderStageProps {
    duration?: number;
    onComplete?: () => void;
}

export default function LoaderStage({
    duration = 2000,
    onComplete
}: LoaderStageProps) {
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState<Array<{
        left: number;
        top: number;
        duration: number;
        delay: number;
    }>>([]);

    useEffect(() => {
        setParticles(
            [...Array(25)].map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
            }))
        );
    }, []);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (elapsed >= duration) {
                clearInterval(interval);
                setTimeout(() => onComplete?.(), 200);
            }
        }, 16);

        return () => clearInterval(interval);
    }, [duration, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)] overflow-hidden"
        >
            {/* Premium Technical Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
              linear-gradient(var(--foreground) 1px, transparent 1px),
              linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* Centered Technical Readout */}
            <div className="relative z-10 flex flex-col items-center gap-12 max-w-sm w-full px-8">
                {/* Progress Value */}
                <div className="flex flex-col items-center gap-1">
                    <motion.div
                        className="flex items-baseline"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <span className="font-mono text-5xl md:text-7xl font-bold text-[var(--foreground)] tabular-nums tracking-tighter">
                            {Math.floor(progress).toString().padStart(3, '0')}
                        </span>
                        <span className="font-mono text-xl text-[#ff0088] ml-2 opacity-80 font-bold">%</span>
                    </motion.div>

                    <motion.div
                        className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted-foreground)] font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                    >
                        Data Stream Synchronization
                    </motion.div>
                </div>

                {/* Precise Progress Bar */}
                <div className="w-full h-[1px] relative">
                    <div className="absolute inset-0 bg-[var(--border)] opacity-20" />
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-[#ff0088]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                    {/* Moving Indicator Dot */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-[#ff0088] rounded-full shadow-[0_0_8px_#ff0088]"
                        style={{ left: `${progress}%` }}
                    />
                </div>

                {/* Technical ID & Status */}
                <div className="flex justify-between w-full font-mono text-[8px] uppercase tracking-widest text-[var(--muted-foreground)] opacity-40">
                    <span>ID: INF-2025-V1</span>
                    <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Secure Link Established
                    </motion.span>
                </div>
            </div>

            {/* Floating Particles */}
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[1px] h-[1px] bg-[#ff0088] rounded-full opacity-20"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </motion.div>
    );
}

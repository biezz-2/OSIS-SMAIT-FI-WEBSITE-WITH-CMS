"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface PageLoaderProps {
    children: ReactNode;
    loadingText?: string;
}

export default function PageLoader({ children, loadingText = "Initialising Experience" }: PageLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
            }
        });

        // Reveal animation for the logo
        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" }
        )
            .fromTo(".logo-reveal",
                { scale: 0.8, opacity: 0, filter: "blur(20px)" },
                { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out" },
                "-=0.4"
            )
            .to(".logo-reveal", {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        // Flowing light shimmer animation
        gsap.to(".shimmer-layer", {
            xPercent: 200,
            duration: 2.5,
            repeat: -1,
            ease: "power2.inOut",
            repeatDelay: 0.5
        });

        // Auto-hide after a delay (minimum 2 seconds)
        // Add pointer-events-none at the start of fade out to prevent blocking clicks
        tl.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            delay: 2
        })
        .set(containerRef.current, { pointerEvents: "none" }, "-=0.8"); // Remove pointer events during fade out

        return () => {
            tl.kill();
            gsap.killTweensOf(".shimmer-layer");
        };
    }, []);

    return (
        <>
            {/* Loading Screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
                    >
                        {/* Background glow effect */}
                        <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center logo-reveal">
                            {/* Base logo */}
                            <img
                                src="/assets/loading-infinity/infinity-logo.svg"
                                alt="Infinity Logo"
                                className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            />

                            {/* Flowing light layer */}
                            <div
                                className="absolute inset-0 pointer-events-none overflow-hidden"
                                style={{
                                    maskImage: 'url("/assets/loading-infinity/infinity-logo.svg")',
                                    WebkitMaskImage: 'url("/assets/loading-infinity/infinity-logo.svg")',
                                    maskSize: 'contain',
                                    WebkitMaskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    WebkitMaskPosition: 'center',
                                }}
                            >
                                <div
                                    className="shimmer-layer absolute inset-0 w-[200%] h-full -translate-x-full"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%, transparent 100%)',
                                    }}
                                />
                            </div>
                        </div>

                        <p className="mt-12 text-white/40 tracking-[0.5em] font-light uppercase text-xs animate-pulse relative">
                            {loadingText}
                        </p>

                        {/* Subtle progress line */}
                        <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Content */}
            <div ref={contentRef}>
                {children}
            </div>
        </>
    );
}

import { useRef } from "react";

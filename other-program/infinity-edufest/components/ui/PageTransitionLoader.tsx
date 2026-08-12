"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function PageTransitionLoader() {
    const pathname = usePathname();
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const previousPathname = useRef(pathname);

    useEffect(() => {
        // Skip initial load - only show on navigation
        if (previousPathname.current !== pathname && pathname !== null) {
            setIsTransitioning(true);
        }
        previousPathname.current = pathname;
    }, [pathname]);

    // Listen to router events for more reliable navigation detection
    useEffect(() => {
        const handleRouteChangeStart = () => {
            setIsTransitioning(true);
        };

        const handleRouteChangeComplete = () => {
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        };

        // These events are not directly available in App Router,
        // but we can use a proxy approach or rely on pathname changes
    }, [router]);

    useEffect(() => {
        if (!containerRef.current) return;

        if (isTransitioning) {
            // Show loading animation
            const tl = gsap.timeline();

            // Immediate show
            gsap.set(containerRef.current, { opacity: 1, pointerEvents: "auto" });

            // Animate logo
            tl.fromTo(".logo-reveal",
                { scale: 0.8, opacity: 0, filter: "blur(20px)" },
                { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "expo.out" }
            );

            // Shimmer effect
            gsap.to(".shimmer-layer", {
                xPercent: 200,
                duration: 1.5,
                repeat: -1,
                ease: "power2.inOut",
                repeatDelay: 0.3
            });

            // Auto hide after minimum display time
            const hideTimer = setTimeout(() => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        setIsTransitioning(false);
                        gsap.set(containerRef.current, { pointerEvents: "none" });
                    }
                });
            }, 1200);

            return () => {
                clearTimeout(hideTimer);
                gsap.killTweensOf(containerRef.current);
                gsap.killTweensOf(".shimmer-layer");
            };
        } else {
            gsap.set(containerRef.current, { opacity: 0, pointerEvents: "none" });
        }
    }, [isTransitioning]);

    // Don't render on initial load
    if (pathname === null) {
        return null;
    }

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
                >
                    {/* Background glow effect */}
                    <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center logo-reveal">
                        {/* Base logo */}
                        <img
                            src="/assets/loading-infinity/infinity-logo.svg"
                            alt="Loading"
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

                    <p className="mt-8 text-white/40 tracking-[0.5em] font-light uppercase text-xs">
                        Loading
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

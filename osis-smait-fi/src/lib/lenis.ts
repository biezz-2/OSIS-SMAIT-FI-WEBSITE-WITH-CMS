"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

export const useSmoothScroll = () => {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        // Sync with ScrollTrigger synchronously on each scroll frame
        lenisInstance.on("scroll", ScrollTrigger.update);

        let rafId: number;
        function raf(time: number) {
            lenisInstance.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenisInstance.destroy();
        };
    }, []);

    return lenis;
};

"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useSmoothScroll = () => {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        let rafId: number;
        function raf(time: number) {
            lenisInstance.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        // Sync with ScrollTrigger without dynamic import per frame
        lenisInstance.on("scroll", ScrollTrigger.update);

        return () => {
            cancelAnimationFrame(rafId);
            lenisInstance.destroy();
        };
    }, []);

    return lenis;
};


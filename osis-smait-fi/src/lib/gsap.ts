"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = (effect: (gsapInstance: typeof gsap, scrollTrigger: typeof ScrollTrigger) => void | (() => void), deps: React.DependencyList = []) => {
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            effect(gsap, ScrollTrigger);
        });
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effect, ...deps]);
};

export { gsap, ScrollTrigger };

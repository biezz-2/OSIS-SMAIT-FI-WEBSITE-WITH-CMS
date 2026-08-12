"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";

export default function SceneOne() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useGSAP((gsap, ScrollTrigger) => {

        // Pin the section
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=300%", // Increased scroll distance
            pin: true,
            pinSpacing: true,
        });

        // Animate text horizontally during scroll
        gsap.to(textRef.current, {
            x: "-70%", // Increased horizontal distance
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%",
                scrub: 1,
            },
        });

    }, []);

    return (
        <section ref={containerRef} className="h-screen w-full bg-gradient-to-b from-[var(--background-accent)] to-[var(--background)] text-[var(--foreground)] flex items-center overflow-hidden relative border-t border-[var(--border)]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Decorative element using accent color */}
                <div className="w-[80vw] h-[60vh] bg-[var(--accent)] opacity-10 transform rotate-6 rounded-3xl blur-3xl"></div>
            </div>

            <h2 ref={textRef} className="text-[15vw] font-bold uppercase whitespace-nowrap pl-[10vw] select-none opacity-90 tracking-tighter">
                potential • hope • opportunity
            </h2>
        </section>
    );
}

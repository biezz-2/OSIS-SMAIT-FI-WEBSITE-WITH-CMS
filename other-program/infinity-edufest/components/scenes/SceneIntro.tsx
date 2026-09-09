"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import Image from "next/image";

export default function SceneIntro() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLImageElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);

    useGSAP((gsap) => {
        const tl = gsap.timeline();

        // High-end cinematic reveal matching the Intro transition
        tl.fromTo(
            logoRef.current,
            {
                scale: 0.8,
                opacity: 0,
                filter: "blur(20px) brightness(2)"
            },
            {
                scale: 1,
                opacity: 1,
                filter: "blur(0px) brightness(1)",
                duration: 1.5,
                ease: "expo.out"
            }
        )
            .fromTo(
                textRef.current,
                {
                    y: 80,
                    opacity: 0,
                    filter: "blur(15px)",
                    rotateX: -45
                },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    rotateX: 0,
                    duration: 1.2,
                    ease: "power4.out"
                },
                "-=1.0"
            )
            .fromTo(
                taglineRef.current,
                { opacity: 0, y: 20 },
                { opacity: 0.6, y: 0, duration: 1, ease: "power2.out" },
                "-=0.5"
            );
    }, []);

    return (
        <section ref={containerRef} className="h-screen w-full flex items-center justify-center relative z-10 bg-gradient-to-b from-[var(--background)] to-[var(--background-accent)]">
            <div className="text-center flex flex-col items-center gap-0">
                <div ref={logoRef}>
                    <Image
                        src="/images/logo-fiedufest.png"
                        alt="The 8th Annual FIEDUFEST"
                        width={1000}
                        height={500}
                        priority
                        className="w-96 md:w-[850px] h-auto drop-shadow-2xl"
                    />
                </div>
                <div ref={taglineRef} className="flex flex-col items-center gap-4 mt-8 relative z-30">
                    <Image
                        ref={textRef}
                        src="/images/logo-infinity.png"
                        alt="INFINITY"
                        width={800}
                        height={400}
                        priority
                        className="w-80 md:w-[600px] h-auto object-contain"
                    />
                    <div className="w-12 h-[1px] bg-[#ff0088] opacity-50" />
                    <p className="text-[10px] tracking-[0.6em] uppercase text-[var(--muted-foreground)] font-bold">
                        Scroll to Explore
                    </p>
                </div>
            </div>
        </section>
    );
}

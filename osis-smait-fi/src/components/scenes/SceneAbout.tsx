"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { Poppins } from "next/font/google";
import { getEdufestConfig } from "@/lib/edufest-api";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "600", "800"],
    variable: "--font-poppins",
});

export default function SceneAbout() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState("About Edufest");
    const [text, setText] = useState("Edufest merupakan event rutin yang dilaksanakan oleh SMA IT Fithrah Insani dan SMK Informatika Fithrah Insani yang berisi kegiatan perlombaan untuk mewadahi bakat kreatif Siswa/i SMP/MTs sederajat dalam bidang Pendidikan dan Teknologi, serta melatih meningkatkan kepedulian terhadap sesama manusia melalui kegiatan amal.");

    useEffect(() => {
        getEdufestConfig().then((cfg) => {
            if (cfg.aboutTitle) setTitle(cfg.aboutTitle);
            if (cfg.aboutText) setText(cfg.aboutText);
        });
    }, []);

    useGSAP((gsap) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400%",
                scrub: 1,
                pin: true,
            }
        });

        // 1. Entrance: Zoom In & Fade In
        tl.fromTo(contentRef.current,
            { scale: 0.8, opacity: 0, filter: "none" },
            { scale: 1, opacity: 1, filter: "none", duration: 2, ease: "power2.out" }
        )
            // 2. Pause: Hold for reading
            .to({}, { duration: 0.3 })
            // 3. Exit: Continue Zooming In & Fade Out
            .to(contentRef.current, {
                scale: 2,
                opacity: 0,
                filter: "none",
                duration: 1,
                ease: "power2.in"
            })
            // 4. Buffer
            .to({}, { duration: 1 });

    }, []);

    return (
        <section ref={containerRef} className={`h-screen w-full bg-[var(--background)] flex items-center justify-center relative overflow-hidden px-6 ${poppins.variable} font-sans`}>
            <div ref={contentRef} className="max-w-7xl text-center flex flex-col items-center pointer-events-none">
                <h2 className="text-5xl md:text-8xl font-extrabold uppercase tracking-tighter mb-12 text-[var(--foreground)] leading-none">
                    {title}
                </h2>
                <div className="w-24 h-1 bg-[var(--foreground)] mb-1 opacity-0"></div>
                <p className="text-xl md:text-3xl font-normal leading-relaxed text-[var(--foreground)] tracking-wide max-w-4xl">
                    {text}
                </p>
            </div>
        </section>
    );
}

"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "600", "800"],
    variable: "--font-poppins",
});

export default function SceneSelayang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP((gsap) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=500%",
                scrub: 1,
                pin: true,
            }
        });

        // 1. Title Entrance: Slide in and fade
        tl.fromTo(titleRef.current,
            { y: 100, opacity: 0, filter: "blur(10px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }
        )
            // 2. Hold title
            .to({}, { duration: 0.5 })
            // 3. Content Entrance
            .fromTo(contentRef.current,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" },
                "-=0.3"
            )
            // 4. Hold for reading
            .to({}, { duration: 2 })
            // 5. Exit: Fade out everything
            .to([titleRef.current, contentRef.current], {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.in",
                stagger: 0.1
            })
            // 6. Buffer
            .to({}, { duration: 0.5 });

    }, []);

    return (
        <section
            ref={containerRef}
            className={`min-h-screen w-full bg-[var(--background)] flex items-center justify-center relative overflow-hidden px-6 py-20 ${poppins.variable} font-sans`}
        >
            {/* Decorative accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#78a0d4] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl w-full flex flex-col items-center text-center gap-12 relative z-10">
                {/* Title */}
                <div ref={titleRef} className="flex flex-col items-center gap-2">
                    <h2 className="text-6xl md:text-8xl font-extrabold uppercase tracking-tighter text-black leading-[0.9]">
                        Selayang
                    </h2>
                    <h2 className="text-6xl md:text-8xl font-extrabold uppercase tracking-tighter text-black leading-[0.9]">
                        Pandang
                    </h2>
                    <div className="w-20 h-1 bg-[#78a0d4] mt-6 rounded-full" />
                </div>

                {/* Content */}
                <div ref={contentRef} className="flex flex-col gap-8 max-w-4xl">
                    <p className="text-lg md:text-2xl font-normal leading-relaxed text-black/80 tracking-wide">
                        Kegiatan yang merupakan kelanjutan dari <strong className="text-[#78a0d4]">FI EDUFEST 1, 2, 3, 4, 5, 6 dan 7</strong> yang sudah berjalan sukses di tahun-tahun sebelumnya.
                    </p>

                    <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 md:p-10 border border-black/10">
                        <p className="text-lg md:text-xl font-medium leading-relaxed text-black/90">
                            <span className="text-[#78a0d4] font-bold">The Eighth Annual Fithrah Insani Education Festival</span> mengangkat tema{" "}
                            <em className="font-semibold">&ldquo;Ketakterbatasan Potensi Bakat Remaja&rdquo;</em> dengan judul{" "}
                            <strong className="text-2xl md:text-3xl font-extrabold tracking-tight">&ldquo;INFINITY&rdquo;</strong> dan tagline{" "}
                            <span className="italic text-[#78a0d4] font-semibold">&ldquo;Growing Talents Beyond Infinity&rdquo;</span>
                        </p>
                    </div>

                    <p className="text-base md:text-xl font-light leading-relaxed text-black/70 tracking-wide">
                        Tema ketakterbatasan ini diambil karena kekhawatiran mengenai remaja-remaja Indonesia yang takut untuk mencoba hal-hal baru, keluar dari zona nyamannya, dan malu untuk peduli dengan lingkungan sekitar.
                    </p>
                </div>
            </div>
        </section>
    );
}

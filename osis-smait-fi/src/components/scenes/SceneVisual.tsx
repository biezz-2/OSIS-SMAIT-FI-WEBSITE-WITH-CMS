"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";

export default function SceneVisual() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);

    useGSAP((gsap) => {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=500%", // Longer scroll for distinct steps
                scrub: true,
                pin: true,
            }
        });

        // Step 1: Image/Container Entrance
        tl.fromTo(imageRef.current,
            { scale: 0.8, opacity: 0, y: 100, filter: "blur(20px)" },
            { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
        )
            // Step 2: "About Edufest" Title appears
            .fromTo(titleRef.current,
                { opacity: 0, scale: 0.9, filter: "blur(10px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 },
                "+=0.2"
            )
            // Step 3: Hold Title
            .to({}, { duration: 1 }) // Dummy hold
            // Step 4: Title disappears
            .to(titleRef.current, {
                opacity: 0, scale: 1.1, filter: "blur(10px)", duration: 0.8
            })
            // Step 5: Description appears
            .fromTo(descRef.current,
                { opacity: 0, y: 30, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
                "+=0.2"
            )
            // Step 6: Hold Description
            .to({}, { duration: 1.5 });

    }, []);

    return (
        <section ref={containerRef} className="h-screen w-full bg-[var(--background)] flex items-center justify-center relative overflow-hidden p-6 md:p-12">
            <div
                ref={imageRef}
                className="w-full h-full md:w-[90vw] md:h-[80vh] bg-white rounded-[2rem] md:rounded-[4rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[var(--border)]"
            >
                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-24 text-center">
                    {/* Container for both texts to occupy the same space */}
                    <div className="relative w-full h-full flex items-center justify-center">

                        {/* Part 1: Title */}
                        <div ref={titleRef} className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-5xl md:text-9xl font-black tracking-tighter text-[var(--foreground)] uppercase leading-none">
                                About <br className="md:hidden" /> Edufest
                            </h3>
                        </div>

                        {/* Part 2: Description */}
                        <div ref={descRef} className="opacity-0 max-w-6xl">
                            <p className="text-xl md:text-5xl font-bold leading-[1.1] text-[var(--foreground)] tracking-tight">
                                Edufest merupakan event rutin yang dilaksanakan oleh SMA IT Fithrah Insani dan SMK Informatika Fithrah Insani yang berisi kegiatan perlombaan untuk mewadahi bakat kreatif Siswa/i SMP/MTs sederajat dalam bidang Pendidikan dan Teknologi, serta melatih meningkatkan kepedulian terhadap sesama manusia melalui kegiatan amal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

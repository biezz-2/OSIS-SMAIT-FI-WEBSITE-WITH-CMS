"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import { useGSAP } from "@/lib/gsap";
import TickerGallery from "@/components/TickerGallery";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function SceneInteractive() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleExploreMore = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate loading time or wait for animation
        setTimeout(() => {
            router.push("/timeline");
        }, 2500); // 2.5s for the animation to feel meaningful
    };

    useGSAP((gsap) => {
        gsap.from(".interactive-title", {
            y: 50,
            opacity: 0,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom center",
                scrub: 1,
            }
        });
    }, []);

    return (
        <section ref={containerRef} className="min-h-screen w-full bg-[var(--background)] flex flex-col items-center justify-center py-20 relative">
            {isLoading && <LoadingScreen />}
            <h3 className="interactive-title text-4xl mb-20 font-light tracking-widest text-[var(--foreground)] opacity-80 uppercase">Documentation</h3>

            <div className="w-full max-w-7xl px-4">
                <TickerGallery />
            </div>

            <div className="mt-20 relative z-50">
                <div onClick={handleExploreMore} className="cursor-pointer">
                    <MagneticButton>
                        <div className="px-10 py-4 border border-[var(--border)] rounded-full text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 text-center">
                            Explore More
                        </div>
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import { BorderBeamButton } from "@/components/ui/border-beam-button";


export default function SceneOutro() {
    const containerRef = useRef<HTMLDivElement>(null);


    return (
        <section ref={containerRef} className="h-screen w-full bg-blue-900 flex flex-col items-center justify-center relative overflow-hidden z-40">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black to-transparent"></div>
            </div>

            <div className="relative z-10 text-center">
                <h2 className="text-6xl md:text-8xl font-bold mb-8">Explore Our Journey</h2>
                <Link href="/timeline">
                    <BorderBeamButton className="inline-block">
                        <div className="text-2xl md:text-4xl px-12 py-6 text-white font-bold cursor-pointer">
                            Explore Me
                        </div>
                    </BorderBeamButton>
                </Link>
            </div>

        </section>
    );
}

"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React, { useRef } from "react";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
    text: string;
    className?: string;
    showAsterisk?: boolean;
    style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const words = text.split(" ");

    return (
        <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
            {words.map((word, i) => {
                const isLast = i === words.length - 1;
                return (
                    <motion.span
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block relative"
                        style={{ marginRight: isLast ? 0 : "0.25em" }}
                    >
                        {word}
                        {showAsterisk && isLast && (
                            <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
                        )}
                    </motion.span>
                );
            })}
        </div>
    );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
    text: string;
    className?: string;
}

interface WordsPullUpMultiStyleProps {
    segments: Segment[];
    className?: string;
    style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    const words: { word: string; className?: string }[] = [];
    segments.forEach((seg) => {
        seg.text.split(" ").forEach((w) => {
            if (w) words.push({ word: w, className: seg.className });
        });
    });

    return (
        <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
            {words.map((w, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={`inline-block ${w.className ?? ""}`}
                    style={{ marginRight: "0.25em" }}
                >
                    {w.word}
                </motion.span>
            ))}
        </div>
    );
};

/* ---------------- Hero ---------------- */
export interface PrismaHeroProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    videoSrc?: string;
}

const PrismaHero = ({
    title = "Partners",
    description = "OSIS SMAIT Fithrah Insani membuka kolaborasi dan kemitraan strategis bersama berbagai lembaga, instansi, dan sponsor untuk mewujudkan inovasi dan dampak positif.",
    buttonText = "Mulai Kolaborasi",
    onButtonClick,
    videoSrc = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4",
}: PrismaHeroProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
        }
    }, [videoSrc]);

    return (
        <section className="h-screen w-full p-2 sm:p-4">
            <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">

                {/* Background video */}
                <video
                    ref={videoRef}
                    key={videoSrc}
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Noise overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay bg-black/10" />

                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:px-6 md:px-10">
                    <div className="grid grid-cols-12 items-end gap-4">

                        <div className="col-span-12 lg:col-span-8">
                            <h1
                                className="font-medium leading-[0.85] tracking-[-0.07em] text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] xl:text-[15vw] 2xl:text-[16vw]"
                                style={{ color: "#E1E0CC" }}
                            >
                                <WordsPullUp text={title} showAsterisk />
                            </h1>
                        </div>

                        <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="text-xs text-[#E1E0CC]/80 sm:text-sm md:text-base"
                                style={{ lineHeight: 1.2 }}
                            >
                                {description}
                            </motion.p>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                onClick={onButtonClick}
                                className="group inline-flex items-center gap-2 self-start rounded-full bg-[#E1E0CC] py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base cursor-pointer"
                            >
                                {buttonText}
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                                    <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                                </span>
                            </motion.button>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { PrismaHero };

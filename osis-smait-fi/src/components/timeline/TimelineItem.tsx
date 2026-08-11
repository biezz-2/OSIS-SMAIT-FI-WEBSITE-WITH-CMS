"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Calendar, Music } from "lucide-react";

interface Guest {
    name: string;
    imageSrc?: string;
    objectPosition?: string; // Untuk menyesuaikan posisi gambar jika wajah terpotong
}

interface TimelineItemProps {
    year: string;
    date: string;
    theme: string;
    participants: string;
    guests: Guest[];
    index: number;
}

export default function TimelineItem({ year, date, theme, participants, guests, index }: TimelineItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y, scale }}
            className={`flex w-full mb-24 items-stretch justify-between ${isEven ? "flex-row" : "flex-row-reverse"
                }`}
        >
            {/* Content Side */}
            <div className={`w-full md:w-5/12 ${isEven ? "text-right" : "text-left"}`}>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-colors duration-300 h-full flex flex-col relative overflow-hidden group">
                    {/* Decorative Year Background */}
                    <div className={`absolute top-0 ${isEven ? "left-0" : "right-0"} -translate-y-1/2 text-[120px] font-bold text-white/5 pointer-events-none select-none z-0`}>
                        {year}
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className={`flex flex-col ${isEven ? "items-end" : "items-start"} mb-4`}>
                            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                                {year}
                            </h2>
                            <span className="flex items-center gap-2 text-sm text-purple-300 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/20">
                                <Calendar className="w-3 h-3" />
                                {date}
                            </span>
                        </div>

                        <div className={`mb-6 flex-grow ${isEven ? "items-end" : "items-start"}`}>
                            <h3 className="text-xl font-semibold text-white mb-2 italic">
                                &quot;{theme}&quot;
                            </h3>
                            <div className={`flex items-center gap-2 text-white/60 text-sm ${isEven ? "justify-end" : "justify-start"}`}>
                                <Users className="w-4 h-4" />
                                {participants}
                            </div>
                        </div>

                        <div className={`mt-auto ${isEven ? "text-right" : "text-left"}`}>
                            <h4 className={`text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2 ${isEven ? "justify-end" : "justify-start"}`}>
                                <Music className="w-3 h-3" />
                                Guest Stars
                            </h4>
                            <div className={`flex flex-wrap gap-4 ${isEven ? "justify-end" : "justify-start"}`}>
                                {guests.map((guest, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group/guest w-32 md:w-40 flex-shrink-0">
                                        {guest.imageSrc ? (
                                            <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden bg-white/10 shadow-lg group-hover/guest:scale-110 transition-transform duration-300">
                                                <Image
                                                    src={guest.imageSrc}
                                                    alt={guest.name}
                                                    fill
                                                    className="object-cover"
                                                    style={{ objectPosition: guest.objectPosition || "center" }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-[130px] h-[130px] rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-lg group-hover/guest:scale-110 transition-transform duration-300">
                                                {guest.name.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-xs text-white/80 font-medium text-center leading-tight line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                                            {guest.name}
                                        </span>
                                    </div>
                                ))}
                                {guests.length === 0 && (
                                    <span className="text-xs text-white/40 italic">To Be Announced</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Line Dot */}
            <div className="hidden md:flex w-2/12 justify-center relative">
                <div className="sticky top-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)] z-10" />
            </div>

            {/* Empty Space for layout balance */}
            <div className="hidden md:block w-5/12" />
        </motion.div>
    );
}

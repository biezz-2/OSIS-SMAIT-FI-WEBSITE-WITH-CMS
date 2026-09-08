"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Users, Music } from "lucide-react";
import { Timeline, TimelineEntry } from "@/components/ui/timeline";
import { getEdufestTimeline, type TimelineItemData } from "@/lib/edufest-api";

const FALLBACK_TIMELINE: TimelineItemData[] = [
    {
        year: "2017",
        date: "19 Februari 2017",
        theme: "Pentas Seni, Perlombaan, Penggalangan Dana",
        participants: "500 (Peserta & Audiens)",
        guests: [
            { name: "Shoutul Harokah", src: "/assets/timeline/Shoutul%20Harokah.jpg", objectPosition: "50% 35%" },
            { name: "Ebith Beat A", src: "/assets/timeline/Ebith%20Beat%20A.jpg" }
        ]
    },
    {
        year: "2018",
        date: "16–17 Februari 2018",
        theme: "It’s Time To Shine",
        participants: "625 (Peserta & Audiens)",
        guests: [
            { name: "Ust. Zae Hannan", src: "/assets/timeline/Ust.%20Zae%20Hannan.jpg" },
            { name: "Syekh Nashif Nashir", src: "/assets/timeline/Syekh%20Nashif%20Nashir.jpg" },
            { name: "Ali Sastra", src: "/assets/timeline/Ali%20Sastra.jpg" }
        ]
    },
    {
        year: "2019",
        date: "16–17 Februari 2019",
        theme: "Prove Our Ability Show Our Creativity",
        participants: "760 (Peserta & Audiens)",
        guests: [
            { name: "Ridwan Hafidz", src: "/assets/timeline/Ridwan%20Hafidz.jpg" },
            { name: "Ibnu The Jenggot", src: "/assets/timeline/Ibnu%20The%20Jenggot.jpg" }
        ]
    },
    {
        year: "2020",
        date: "14 Februari 2020",
        theme: "ANAGATA: Today For The Future",
        participants: "800 (Peserta & Audiens)",
        guests: [
            { name: "Kang Yan Hidayatullah", src: "/assets/timeline/Kang%20Yan%20Hidayatullah.jpg" },
            { name: "Aleehya", src: "/assets/timeline/Aleehya.jpg" }
        ]
    },
    {
        year: "2023",
        date: "13–14 Februari 2023",
        theme: "Universe: Be The Best In The Universe (Kajian Palestina, Bazaar)",
        participants: "900 (Peserta & Audiens)",
        guests: [
            { name: "Genya", src: "/assets/timeline/Genya.jpg" },
            { name: "Ust. Handy Bonny", src: "/assets/timeline/Ust.%20Handy%20Bonny.jpg" }
        ]
    },
    {
        year: "2024",
        date: "18–19 Februari 2024",
        theme: "Unity: Unity In Diversity",
        participants: "1000 (Peserta & Audiens)",
        guests: [
            { name: "Ustadzah Haneen Akira", src: "/assets/timeline/Ustadzah%20Haneen%20Akira.jpg" }
        ]
    },
    {
        year: "2025",
        date: "13–14 Februari 2025",
        theme: "Aidentity: Amazing Intelligence, Delightful Entertain and Humanity",
        participants: "1500 (Peserta & Audiens)",
        guests: [
            { name: "Fajri (Unity)", src: "/assets/timeline/Fajri%20(unity).jpg" },
            { name: "Zein Permana", src: "/assets/timeline/Zein%20Permana.jpg", objectPosition: "50% 35%" },
            { name: "Ray Shareza", src: "/assets/timeline/Ray%20Shareza.jpg" }
        ]
    },
    {
        year: "2026",
        date: "13–14 Februari 2026",
        theme: "Infinity: Growing Talents Beyond Infinity",
        participants: "To Be Continued",
        guests: []
    }
];

export default function TimelineOrchestrator() {
    const [timelineItems, setTimelineItems] = useState<TimelineItemData[]>(FALLBACK_TIMELINE);

    useEffect(() => {
        getEdufestTimeline().then((data) => {
            if (data && data.length > 0) {
                setTimelineItems(data);
            }
        });
    }, []);

    const formattedData: TimelineEntry[] = timelineItems.map((item) => ({
        title: item.year,
        content: (
            <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-black/10 dark:border-white/10 hover:border-purple-500/40 dark:hover:border-purple-500/30 transition-colors duration-300 relative overflow-hidden group">
                <div className="flex flex-col mb-4">
                    <span className="inline-flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/20 w-fit mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 italic">
                        "{item.theme}"
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-sm">
                        <Users className="w-4 h-4" />
                        {item.participants}
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                        <Music className="w-3.5 h-3.5" />
                        Guest Stars
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        {item.guests.map((guest, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 bg-black/[0.03] dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-colors group/guest w-32 md:w-40 flex-shrink-0">
                                {guest.src ? (
                                    <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden bg-black/5 dark:bg-white/10 shadow-md group-hover/guest:scale-105 transition-transform duration-300">
                                        <Image
                                            src={guest.src}
                                            alt={guest.name}
                                            fill
                                            className="object-cover"
                                            style={{ objectPosition: guest.objectPosition || "center" }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-md group-hover/guest:scale-105 transition-transform duration-300">
                                        {guest.name.charAt(0)}
                                    </div>
                                )}
                                <span className="text-xs text-gray-800 dark:text-white/80 font-medium text-center leading-tight line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                                    {guest.name}
                                </span>
                            </div>
                        ))}
                        {item.guests.length === 0 && (
                            <span className="text-xs text-gray-500 dark:text-white/40 italic">To Be Announced</span>
                        )}
                    </div>
                </div>
            </div>
        ),
    }));

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/noise.png')] opacity-5 dark:opacity-10 bg-repeat" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-900/20 rounded-full blur-3xl filter" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-900/20 rounded-full blur-3xl filter" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20">
                {/* Header */}
                <div className="flex flex-col items-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-gray-900 to-blue-600 dark:from-purple-400 dark:via-white dark:to-blue-400 text-center"
                    >
                        Our Journey
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mt-4 rounded-full"
                    />
                </div>

                {/* Aceternity Timeline */}
                <Timeline data={formattedData} />

                {/* Footer Filler */}
                <div className="h-48 flex items-center justify-center text-gray-500 dark:text-white/30 text-center text-sm">
                    <p>Building the future, one event at a time.</p>
                </div>
            </div>
        </div>
    );
}

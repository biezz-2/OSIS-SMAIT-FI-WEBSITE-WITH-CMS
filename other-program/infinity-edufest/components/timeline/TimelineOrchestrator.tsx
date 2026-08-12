"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import TimelineItem from "./TimelineItem";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LiquidGlassNav from "@/components/ui/LiquidGlassNav";

const TIMELINE_HISTORY = [
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
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0a]">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-full h-full bg-[url('/assets/noise.png')] opacity-10 bg-repeat"
                />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl filter" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl filter" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20">
                <LiquidGlassNav />

                {/* Header */}
                <div className="flex flex-col items-center mb-24">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-blue-400 text-center"
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

                {/* Timeline Items */}
                <div className="relative">
                    {/* Vertical Line - Hidden on Mobile, Visible on Desktop */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2 hidden md:block" />

                    {TIMELINE_HISTORY.map((item, index) => (
                        <TimelineItem
                            key={index}
                            year={item.year}
                            date={item.date}
                            theme={item.theme}
                            participants={item.participants}
                            guests={item.guests.map(g => ({
                                name: g.name,
                                imageSrc: g.src,
                                objectPosition: g.objectPosition
                            }))}
                            index={index}
                        />
                    ))}
                </div>

                {/* Footer Filler */}
                <div className="h-48 flex items-center justify-center text-white/30 text-center">
                    <p>Building the future, one event at a time.</p>
                </div>

            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { Menu, X, Home, Clock, MapPin, Users, Settings, InfoIcon } from "lucide-react";
import Link from "next/link";

export default function LiquidGlassNav() {
    const [open, setOpen] = useState(false);

    // liquid reflection motion values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const background = useMotionTemplate`
    radial-gradient(
      140px circle at ${x}px ${y}px,
      rgba(255,255,255,0.18),
      rgba(255,255,255,0.08) 40%,
      transparent 70%
    )
  `;

    const navItems = [
        { label: "Home", href: "/", icon: Home },
        { label: "Timeline", href: "/timeline", icon: Clock },
        { label: "Location", href: "/location", icon: MapPin },
        { label: "Panitia", href: "/panitia", icon: Users },
        { label: "About", href: "#", icon: Settings },
        { label: "More Info", href: "https://edufestbio.biezz.my.id", icon: InfoIcon },
    ];

    return (
        <nav className="fixed top-8 right-8 z-[100] flex flex-col items-end gap-4">
            {/* Liquid Glass Hamburger Button */}
            <motion.button
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                whileTap={{ scale: 0.96 }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    x.set(e.clientX - rect.left);
                    y.set(e.clientY - rect.top);
                }}
                className="relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-[24px] border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition group"
            >
                {/* liquid reflection layer */}
                <motion.span
                    style={{ background }}
                    className="pointer-events-none absolute inset-0"
                />

                {/* top specular highlight */}
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-30" />

                {/* subtle noise */}
                <span className="pointer-events-none absolute inset-0 rounded-full opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] bg-[length:4px_4px]" />

                <span className="relative z-10 text-sm font-medium tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                    {open ? "Close" : "Menu"}
                </span>
                <div className="relative z-10 w-5 h-5 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {open ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={20} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={20} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            mass: 0.8
                        }}
                        className="relative w-64 rounded-[32px] bg-white/5 backdrop-blur-[32px] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                    >
                        {/* liquid overlay */}
                        <motion.span
                            style={{ background }}
                            className="pointer-events-none absolute inset-0"
                        />

                        {/* top glass highlight */}
                        <span className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-25" />

                        <ul className="relative z-10 py-4 px-2 flex flex-col gap-1">
                            {navItems.map((item, index) => (
                                <motion.li
                                    key={item.label}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                                        onClick={() => setOpen(false)}
                                    >
                                        <item.icon size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-base font-light tracking-wide italic lowercase">
                                            {item.label}
                                        </span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        {/* subtle noise */}
                        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/assets/noise.png')]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

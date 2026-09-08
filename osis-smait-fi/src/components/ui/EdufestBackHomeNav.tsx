"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function EdufestBackHomeNav() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-6 left-6 sm:top-8 sm:left-8 z-[100]"
    >
      <Link
        href="/"
        aria-label="Kembali ke Beranda Utama OSIS"
        className="group relative flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur-[24px] border border-black/10 dark:border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.45)] text-gray-900 dark:text-white transition-all duration-300 active:scale-95 hover:bg-white/90 dark:hover:bg-white/10"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 opacity-70 group-hover:opacity-100" />
        <div className="relative w-5 h-5 shrink-0">
          <Image
            src="/images/noctra-logo.png"
            alt="Logo OSIS SMAIT Fithrah Insani"
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
        </div>
        <span className="hidden sm:inline text-xs font-medium tracking-wider uppercase opacity-80 group-hover:opacity-100">
          Beranda OSIS
        </span>
      </Link>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Cursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            setIsPointer(window.getComputedStyle(target).cursor === "pointer");
        };

        window.addEventListener("mousemove", updatePosition);
        return () => window.removeEventListener("mousemove", updatePosition);
    }, []);

    return (
        <motion.div
            className={cn(
                "hidden md:block fixed top-0 left-0 w-4 h-4 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999]",
                isPointer ? "w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-transparent border border-white" : ""
            )}
            animate={{
                x: position.x - (isPointer ? 20 : 8),
                y: position.y - (isPointer ? 20 : 8),
                scale: isPointer ? 1.5 : 1
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        />
    );
}

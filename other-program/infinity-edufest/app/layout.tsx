"use client";

import { useSmoothScroll } from "@/lib/lenis";
import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname } from "next/navigation";
import IntroOrchestrator from "@/components/intro/IntroOrchestrator";
import LiquidGlassNav from "@/components/ui/LiquidGlassNav";
import PageTransitionLoader from "@/components/ui/PageTransitionLoader";

// Load CursorParticles only on client-side to avoid hydration mismatch
const CursorParticles = dynamic(() => import("@/components/CursorParticles"), {
  ssr: false,
});

const AudioManager = dynamic(() => import("@/components/AudioManager"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();
  const [introComplete, setIntroComplete] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const showNav = !isHomePage || introComplete;

  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] antialiased no-scrollbar`}>
        <CursorParticles />
        <AudioManager isLoading={isHomePage && !introComplete} />
        <PageTransitionLoader />
        {isHomePage && !introComplete ? (
          <IntroOrchestrator
            onComplete={() => setIntroComplete(true)}
            skipOnRevisit={true}
          />
        ) : (
          <>
            <LiquidGlassNav />
            {children}
          </>
        )}
      </body>
    </html>
  );
}

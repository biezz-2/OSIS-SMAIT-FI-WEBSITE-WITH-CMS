"use client";

import { useSmoothScroll } from "@/lib/lenis";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import LiquidGlassNav from "@/components/ui/LiquidGlassNav";
import EdufestBackHomeNav from "@/components/ui/EdufestBackHomeNav";
import PageTransitionLoader from "@/components/ui/PageTransitionLoader";

const IntroOrchestrator = dynamic(() => import("@/components/intro/IntroOrchestrator"), {
  ssr: false,
});

// Load CursorParticles only on client-side to avoid hydration mismatch
const CursorParticles = dynamic(() => import("@/components/CursorParticles"), {
  ssr: false,
});

const AudioManager = dynamic(() => import("@/components/AudioManager"), {
  ssr: false,
});

export default function EdufestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenis = useSmoothScroll();
  const [introComplete, setIntroComplete] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!introComplete) return;

    // Recalculate dimensions once children scenes mount into the DOM
    const timer = setTimeout(() => {
      if (lenis) {
        lenis.resize();
      }
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("resize"));
    }, 150);

    const followUpTimer = setTimeout(() => {
      if (lenis) {
        lenis.resize();
      }
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(followUpTimer);
    };
  }, [introComplete, lenis, pathname]);

  return (
    <div className="edufest-theme bg-[var(--background)] text-[var(--foreground)] min-h-screen antialiased no-scrollbar transition-colors duration-300">
      <CursorParticles />
      <AudioManager isLoading={!introComplete} />
      <PageTransitionLoader />
      {!introComplete ? (
        <IntroOrchestrator
          onComplete={() => setIntroComplete(true)}
          skipOnRevisit={false}
        />
      ) : (
        <>
          <EdufestBackHomeNav />
          <LiquidGlassNav />
          {children}
        </>
      )}
    </div>
  );
}


"use client";

import { useSmoothScroll } from "@/lib/lenis";
import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LiquidGlassNav from "@/components/ui/LiquidGlassNav";
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
  useSmoothScroll();
  const [introComplete, setIntroComplete] = useState(false);
  const pathname = usePathname();

  // Navigation should only show on pages other than the intro-landing page
  const showNav = pathname !== "/edufest-infinity";

  return (
    <div className="edufest-theme bg-[var(--background)] text-[var(--foreground)] min-h-screen antialiased no-scrollbar">
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
          {showNav && <LiquidGlassNav />}
          {children}
        </>
      )}
    </div>
  );
}

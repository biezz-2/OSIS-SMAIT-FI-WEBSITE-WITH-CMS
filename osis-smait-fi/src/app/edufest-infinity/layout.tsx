"use client";

import { useSmoothScroll } from "@/lib/lenis";
import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
  useSmoothScroll();
  const [introComplete, setIntroComplete] = useState(false);
  const pathname = usePathname();

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

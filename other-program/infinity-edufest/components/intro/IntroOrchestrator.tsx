"use client";

import { AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import LoaderStage from "./LoaderStage";
import WireframeStage from "./WireframeStage";
import RevealStage from "./RevealStage";

type IntroStage = "loading" | "wireframe" | "reveal" | "complete";

interface IntroOrchestratorProps {
    onComplete?: () => void;
    skipOnRevisit?: boolean;
}

export default function IntroOrchestrator({
    onComplete,
    skipOnRevisit = true
}: IntroOrchestratorProps) {
    const [stage, setStage] = useState<IntroStage>("loading");

    const handleComplete = useCallback(() => {
        // Mark intro as seen
        if (skipOnRevisit) {
            localStorage.setItem("fiedufest_intro_seen", "true");
        }

        setStage("complete");

        // Small delay before calling onComplete for smooth transition
        setTimeout(() => {
            onComplete?.();
        }, 300);
    }, [skipOnRevisit, onComplete]);

    useEffect(() => {
        // Check if user has seen intro before
        if (skipOnRevisit) {
            const hasSeenIntro = localStorage.getItem("fiedufest_intro_seen");
            if (hasSeenIntro === "true") {
                // Skip intro for returning visitors
                handleComplete();
                return;
            }
        }
    }, [skipOnRevisit, handleComplete]);

    const progressStage = () => {
        switch (stage) {
            case "loading":
                setStage("wireframe");
                break;
            case "wireframe":
                setStage("reveal");
                break;
            case "reveal":
                handleComplete();
                break;
        }
    };

    // Don't render anything if already complete
    if (stage === "complete") {
        return null;
    }

    return (
        <>
            <button
                type="button"
                onClick={handleComplete}
                className="fixed bottom-6 right-6 z-[120] px-4 py-2 text-xs uppercase tracking-widest text-white/70 hover:text-white bg-black/40 hover:bg-black/70 border border-white/20 rounded-full backdrop-blur-md transition"
                aria-label="Skip Intro Animation"
            >
                Skip Intro ✕
            </button>
            <AnimatePresence mode="wait">
                {stage === "loading" && (
                    <LoaderStage
                        key="loading"
                        duration={2000}
                        onComplete={progressStage}
                    />
                )}

                {stage === "wireframe" && (
                    <WireframeStage
                        key="wireframe"
                        duration={2500}
                        onComplete={progressStage}
                    />
                )}

                {stage === "reveal" && (
                    <RevealStage
                        key="reveal"
                        duration={1500}
                        onComplete={progressStage}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

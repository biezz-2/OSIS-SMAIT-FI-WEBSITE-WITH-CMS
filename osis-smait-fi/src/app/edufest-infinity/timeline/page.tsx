'use client';

import dynamic from "next/dynamic";

const TimelineOrchestrator = dynamic(
    () => import("@/components/timeline/TimelineOrchestrator"),
    { ssr: false }
);

export default function TimelinePage() {
    return (
        <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            <TimelineOrchestrator />
        </main>
    );
}

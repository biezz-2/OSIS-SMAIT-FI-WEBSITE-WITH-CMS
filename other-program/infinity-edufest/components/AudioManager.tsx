"use client";

import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";

interface AudioManagerProps {
    isLoading?: boolean;
}

export default function AudioManager({ isLoading = false }: AudioManagerProps) {
    const [volume, setVolume] = useState(0.25);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initial attempt to play muted on mount (priming)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                // Muted autoplay usually works on most platforms
                console.log("Initial silent autoplay attempt");
            });
        }
    }, []);

    // Sync volume and playback when loading state or interaction changes
    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;

            // If still loading, keep volume at 0 (silent)
            if (isLoading) {
                audio.volume = 0;
            } else {
                // Once loading is finished, attempt to play with sound
                audio.volume = volume;
                audio.muted = false;

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Autoplay with sound was blocked. Waiting for user interaction.", error);
                    });
                }
            }
        }
    }, [isLoading, volume, hasInteracted]);

    useEffect(() => {
        const handleInteraction = () => {
            if (hasInteracted) return;

            // CRITICAL: We MUST call play() directly inside the event handler 
            // to "unlock" audio for mobile browsers.
            if (audioRef.current) {
                const audio = audioRef.current;
                audio.muted = false;
                // If still loading, we play silently to unlock the context
                audio.volume = isLoading ? 0 : volume;

                audio.play()
                    .then(() => {
                        console.log("Audio unlocked successfully on interaction");
                        setHasInteracted(true);
                    })
                    .catch(e => console.log("Audio unlock failed on interaction", e));
            }

            const events = ['click', 'touchstart', 'mousedown', 'keydown', 'touchend', 'pointerdown', 'scroll'];
            events.forEach(e => window.removeEventListener(e, handleInteraction));
        };

        const events = ['click', 'touchstart', 'mousedown', 'keydown', 'touchend', 'pointerdown', 'scroll'];
        events.forEach(e => window.addEventListener(e, handleInteraction, { passive: true }));

        return () => {
            events.forEach(e => window.removeEventListener(e, handleInteraction));
        };
    }, [hasInteracted, isLoading, volume]);

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div
            className={`fixed bottom-5 right-5 md:bottom-10 md:right-10 z-[9999] transition-opacity duration-500 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <audio
                ref={audioRef}
                src="/sounds/Aidentity.mp3"
                loop
                autoPlay
                muted={true}
                playsInline
            />
            <Slider value={volume} onChange={handleVolumeChange} />
        </div>
    );
}

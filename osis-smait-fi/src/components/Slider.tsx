'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/Slider.module.css';

interface SliderProps {
    value?: number;
    onChange?: (value: number) => void;
}

export default function Slider({ value = 0.5, onChange }: SliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [internalValue, setInternalValue] = useState(value);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const updateValue = (clientY: number) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const height = rect.height;
        const bottom = rect.bottom;
        // Calculate new value based on Y position (bottom is 0, top is 1)
        let newValue = (bottom - clientY) / height;

        // Clamp between 0 and 1
        newValue = Math.max(0, Math.min(1, newValue));

        setInternalValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        updateValue(e.clientY);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        updateValue(e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Allow click as well (handled by PointerDown/Up logic usually, but let's ensure simple click works)
    // pointerdown + pointerup covers click.

    return (
        <div className={styles.container}>
            <div
                className={styles.slider}
                tabIndex={0}
                role="slider"
                aria-label="Volume control"
                aria-valuenow={Math.round(internalValue * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                ref={sliderRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ boxShadow: isDragging ? '0px 0px 0px 4px #0d63f8ff' : '0px 0px 0px 2px #0d63f844' }}
            >
                <div className={styles.indicator} style={{ transform: `scaleY(${internalValue})` }} />
                <div className={styles.iconContainer}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.icon}
                    >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}

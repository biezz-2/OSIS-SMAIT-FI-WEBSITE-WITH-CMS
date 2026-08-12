'use client';

import { useEffect, useRef } from 'react';
import { PoissonDiskSampling } from '@/lib/poisson-disk';
import styles from './CursorParticles.module.css';

interface Particle {
    homeX: number;
    homeY: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    hue: number;
    thickness: number;
    length: number;
    angle: number;
}

interface CursorParticlesProps {
    particleCount?: number;
    minDistance?: number;
    repelRadius?: number;
    repelStrength?: number;
    springStrength?: number;
    friction?: number;
    colors?: string[];
}

export default function CursorParticles({
    minDistance = 45,
    repelRadius = 150,
    repelStrength = 0.8,
    springStrength = 0.08,
    friction = 0.88,
    colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#60a5fa', '#a78bfa'],
}: CursorParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const cursorRef = useRef({ x: -1000, y: -1000 });
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const initParticles = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const sampler = new PoissonDiskSampling(
                canvas.width,
                canvas.height,
                minDistance
            );

            const points = sampler.generate();
            particlesRef.current = points.map((point) => {
                const colorIndex = Math.floor(Math.random() * colors.length);
                const hue = (colorIndex / colors.length) * 360;

                return {
                    homeX: point.x,
                    homeY: point.y,
                    x: point.x,
                    y: point.y,
                    vx: 0,
                    vy: 0,
                    size: 1.5 + Math.random() * 1.5,
                    hue: hue,
                    thickness: 1.2 + Math.random() * 1,
                    length: 4 + Math.random() * 6,
                    angle: Math.random() * Math.PI * 2
                };
            });
        };

        initParticles();

        const handleResize = () => {
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            cursorRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                cursorRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { x: curX, y: curY } = cursorRef.current;

            // Magnetic parameters
            const magnetRadius = repelRadius * 2.5;
            const magnetStrength = 0.02;

            particlesRef.current.forEach((p) => {
                // Calculation for physics
                const dx = curX - p.x;
                const dy = curY - p.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                if (dist < repelRadius) {
                    // Strong repulsion at close range
                    const force = (repelRadius - dist) / repelRadius;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force * repelRadius * repelStrength * 0.08;
                    p.vy -= Math.sin(angle) * force * repelRadius * repelStrength * 0.08;
                } else if (dist < magnetRadius) {
                    // Subtle attraction at medium range (Magnet effect)
                    const force = (magnetRadius - dist) / magnetRadius;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * magnetStrength * 15;
                    p.vy += Math.sin(angle) * force * magnetStrength * 15;
                }

                // Calculation for returning home
                const homeDx = p.homeX - p.x;
                const homeDy = p.homeY - p.y;
                p.vx += homeDx * springStrength;
                p.vy += homeDy * springStrength;

                // Physics update
                p.vx *= friction;
                p.vy *= friction;
                p.x += p.vx;
                p.y += p.vy;

                // Dynamic angle based on movement
                p.angle = Math.atan2(p.vy, p.vx);
                if (Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1) {
                    p.angle += 0.01; // Subtle rotation when still
                }

                // Render as small dashes
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);

                // Opacity based on distance from home
                const distFromHome = Math.sqrt(Math.pow(p.homeX - p.x, 2) + Math.pow(p.homeY - p.y, 2));
                const opacity = Math.min(0.8, 0.4 + distFromHome / 50);

                ctx.strokeStyle = `hsla(${p.hue}, 80%, 65%, ${opacity})`;
                ctx.lineWidth = p.thickness;
                ctx.beginPath();
                ctx.moveTo(-p.length / 2, 0);
                ctx.lineTo(p.length / 2, 0);
                ctx.stroke();

                // Add a small glowing head
                ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${opacity * 0.5})`;
                ctx.beginPath();
                ctx.arc(p.length / 2, 0, p.thickness / 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [colors, minDistance, repelRadius, repelStrength, springStrength, friction]);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}

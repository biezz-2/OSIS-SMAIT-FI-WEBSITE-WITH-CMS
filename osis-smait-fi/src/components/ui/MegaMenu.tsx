"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

export interface MegaMenuCard {
  title: string;
  description: string;
  href: string;
  /** CSS gradient string, e.g. "linear-gradient(135deg, #2E90FA 0%, #1849A9 100%)" */
  gradient: string;
  /** Optional emoji / icon string or React component shown in thumbnail */
  icon?: string | React.ReactNode;
}

interface MegaMenuProps {
  label: string;
  href: string;
  cards: MegaMenuCard[];
}

export function MegaMenuItem({ label, href, cards }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    // small delay agar kursor bisa geser ke dropdown tanpa flicker
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  // Toggle on click/touch for mobile-friendly behavior
  const handleToggle = useCallback((e: React.MouseEvent) => {
    // On touch devices, prevent navigation and toggle dropdown instead
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(prev => !prev);
    }
  }, []);

  // Close on outside click (for touch-opened state)
  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger button — same style as regular nav pill */}
      <Link href={href} style={{ textDecoration: "none" }} onClick={handleToggle}>
        <div
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 5,
            paddingBottom: 5,
            background: "#FA982E",
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            display: "flex",
            cursor: "pointer",
            transition: "opacity 0.2s",
            userSelect: "none",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <div
            style={{
              color: "#1A1A1A",
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
              fontWeight: "700",
              lineHeight: "16px",
              wordWrap: "break-word",
            }}
          >
            {label}
          </div>
          {/* chevron hint */}
          <svg
            width={10}
            height={10}
            viewBox="0 0 10 10"
            fill="none"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="#1A1A1A"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>

      {/* Dropdown — pt-3 buffer agar kursor tidak kehilangan fokus */}
      <div
        className="absolute top-full left-1/2 pt-3 z-50 w-[calc(100vw-32px)] max-w-[560px]"
        style={{
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
          transform: open
            ? "translateX(-50%) translateY(0) scale(1)"
            : "translateX(-50%) translateY(-6px) scale(0.97)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <div
          className="w-full bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-4 border border-black/[0.07]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cards.map((card) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                <div
                  className="rounded-lg overflow-hidden border border-black/[0.06] cursor-pointer transition-all duration-200 hover:shadow-[0_4px_16px_rgba(46,144,250,0.18)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {/* Thumbnail */}
                  <div
                    className="h-[72px] flex items-center justify-center overflow-hidden"
                    style={{ background: card.gradient }}
                  >
                    {card.icon && (typeof card.icon === 'string' && (card.icon.startsWith('/') || card.icon.startsWith('http'))) ? (
                      <img 
                        src={card.icon} 
                        alt={card.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="text-white flex items-center justify-center text-[28px]">
                        {card.icon ?? "📄"}
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div className="p-3">
                    <div className="font-[Inter,sans-serif] font-bold text-[13px] text-[#101828] mb-1">
                      {card.title}
                    </div>
                    <div
                      className="font-[Inter,sans-serif] text-xs text-[#6A7282] leading-relaxed line-clamp-2"
                    >
                      {card.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEventTheme } from "./theme-provider";
import { eventDetailThemeTokens } from "./theme";

const navLinks = [
  { href: "/", label: "BERANDA" },
  { href: "/events", label: "EVENTS" },
  { href: "/program-kerja", label: "PROGRAMS" },
  { href: "/anggota", label: "ANGGOTA" },
  { href: "/galeri", label: "GALERI" },
];

export default function EventNavbar() {
  const { theme, toggleTheme } = useEventTheme();
  const tokens = eventDetailThemeTokens[theme];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative w-full min-h-[71px] flex items-start justify-between pt-[20px] md:pt-[26px] px-4 md:px-[46px] max-w-[1200px] mx-auto font-mono">
      <div className="h-[32px] md:h-[36px] w-auto relative shrink-0 flex items-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/images/noctra-logo.png"
            alt="Agora Acta Logo"
            width={36}
            height={36}
            className="h-[32px] md:h-[36px] w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-[26px]">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[10.5px] tracking-[0.945px] uppercase transition-colors"
            style={{ color: tokens.navLink }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = tokens.navLinkHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = tokens.navLink;
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="relative z-50 w-[44px] h-[22px] rounded-full transition-colors duration-300 cursor-pointer shrink-0"
          style={{
            backgroundColor:
              theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)",
          }}
        >
          <span
            className="absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-full flex items-center justify-center text-[9px] transition-transform duration-300"
            style={{
              backgroundColor: theme === "dark" ? "#EFECE4" : "#F6F2E8",
              transform:
                theme === "light" ? "translateX(22px)" : "translateX(0)",
            }}
          >
            {theme === "dark" ? "☀" : "☾"}
          </span>
        </button>

        <button
          type="button"
          className="lg:hidden flex flex-col gap-[5px] p-1 cursor-pointer"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span
            className="block w-[20px] h-[1.5px] transition-colors"
            style={{ backgroundColor: tokens.navLink }}
          />
          <span
            className="block w-[20px] h-[1.5px] transition-colors"
            style={{ backgroundColor: tokens.navLink }}
          />
          <span
            className="block w-[14px] h-[1.5px] transition-colors"
            style={{ backgroundColor: tokens.navLink }}
          />
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute top-[71px] left-0 right-0 z-50 flex flex-col gap-4 px-4 py-5 lg:hidden shadow-lg border-b border-stone-700/30"
          style={{ backgroundColor: tokens.sectionBg }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[0.945px] uppercase transition-colors"
              style={{ color: tokens.navLink }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

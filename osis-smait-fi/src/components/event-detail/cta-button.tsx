"use client";

import React from "react";

type CtaButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
};

export default function CtaButton({
  children,
  className = "",
  onClick,
  href,
  target,
}: CtaButtonProps) {
  const baseClasses = `inline-block w-[200px] py-[14px] bg-[#EFE9DC] hover:bg-white text-[#1A1814] text-[10px] font-mono tracking-[1.8px] text-center uppercase transition-colors cursor-pointer ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
    >
      {children}
    </button>
  );
}

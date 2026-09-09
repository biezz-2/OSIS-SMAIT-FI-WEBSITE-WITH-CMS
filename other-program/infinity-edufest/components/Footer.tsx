"use client";

export default function Footer() {
    return (
        <footer className="w-full py-10 text-center text-[var(--foreground)]/60 text-sm bg-[var(--background)] border-t border-[var(--border)]/10">
            <p>© {new Date().getFullYear()} OSIS SMAIT Fithrah Insani - Edufest Infinity. All rights reserved.</p>
        </footer>
    );
}


"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { committeeData as fallbackCommitteeData, findDivisionByMember, getMainPhoto, type Member, type Division } from "@/data/committee";
import { getEdufestCommittee } from "@/lib/edufest-api";

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Get accent color based on role/position
function getRoleAccentColor(role?: string): string {
  if (!role) return "from-white/10 to-white/5";
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("主席") || lowerRole.includes("ketua")) {
    return "from-amber-500/20 to-amber-500/5";
  }
  if (lowerRole.includes("副主席") || lowerRole.includes("waket")) {
    return "from-orange-500/20 to-orange-500/5";
  }
  if (lowerRole.includes("秘书") || lowerRole.includes("sek")) {
    return "from-cyan-500/20 to-cyan-500/5";
  }
  if (lowerRole.includes("财务") || lowerRole.includes("bend")) {
    return "from-emerald-500/20 to-emerald-500/5";
  }
  return "from-white/10 to-white/5";
}

// Get border color based on role
function getRoleBorderColor(role?: string): string {
  if (!role) return "border-white/10";
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("主席") || lowerRole.includes("ketua")) {
    return "border-amber-500/30";
  }
  if (lowerRole.includes("副主席") || lowerRole.includes("waket")) {
    return "border-orange-500/30";
  }
  if (lowerRole.includes("秘书") || lowerRole.includes("sek")) {
    return "border-cyan-500/30";
  }
  if (lowerRole.includes("财务") || lowerRole.includes("bend")) {
    return "border-emerald-500/30";
  }
  return "border-white/10";
}

// Get glow color based on role
function getRoleGlowColor(role?: string): string {
  if (!role) return "rgba(255,255,255,0.1)";
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("主席") || lowerRole.includes("ketua")) {
    return "rgba(245,158,11,0.15)";
  }
  if (lowerRole.includes("副主席") || lowerRole.includes("waket")) {
    return "rgba(249,115,22,0.15)";
  }
  if (lowerRole.includes("秘书") || lowerRole.includes("sek")) {
    return "rgba(6,182,212,0.15)";
  }
  if (lowerRole.includes("财务") || lowerRole.includes("bend")) {
    return "rgba(16,185,129,0.15)";
  }
  return "rgba(255,255,255,0.1)";
}

// Get badge color based on role
function getRoleBadgeColor(role?: string): string {
  if (!role) return "bg-white/10 text-white/60 border-white/20";
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("主席") || lowerRole.includes("ketua")) {
    return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  }
  if (lowerRole.includes("副主席") || lowerRole.includes("waket")) {
    return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  }
  if (lowerRole.includes("秘书") || lowerRole.includes("sek")) {
    return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
  }
  if (lowerRole.includes("财务") || lowerRole.includes("bend")) {
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  }
  return "bg-white/10 text-white/60 border-white/20";
}

// ID Card Modal Component - Extra Large Version with Rectangular Photo
interface IdCardModalProps {
  member: Member | string;
  division?: string;
  isOpen: boolean;
  onClose: () => void;
}

function IdCardModal({ member, division, isOpen, onClose }: IdCardModalProps) {
  const name = typeof member === "string" ? member : member.name;
  const role = typeof member === "string" ? undefined : member.role;
  const photos = useMemo(() => {
    if (!member || typeof member === "string") return undefined;
    return member.photos || (member.photo ? [member.photo] : undefined);
  }, [member]);
  const initials = getInitials(name);
  const gradientClass = getRoleAccentColor(role);
  const borderClass = getRoleBorderColor(role);
  const badgeClass = getRoleBadgeColor(role);

  // Slider state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Reset slider when member changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [member]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Auto-slide when not hovered
  useEffect(() => {
    if (!isHovered && photos && photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, photos]);

  const prevSlide = useCallback(() => {
    if (photos && photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }, [photos]);

  const nextSlide = useCallback(() => {
    if (photos && photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  }, [photos]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal Container - Extra Large */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-16 right-0 text-white/50 hover:text-white transition-colors duration-200"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ID Card Design - Extra Large */}
          <div className={`relative bg-gradient-to-br ${gradientClass} backdrop-blur-xl border ${borderClass} rounded-3xl overflow-hidden shadow-2xl`}>
            {/* Background decoration - Larger */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Content - Very Large padding */}
            <div className="relative p-16">
              {/* Edufest Logo/Header - Larger */}
              <div className="text-center mb-10">
                <p className="text-base font-medium text-white/40 tracking-widest uppercase">Edufest 2025</p>
              </div>

              {/* Photo Slider */}
              <div className="flex justify-center mb-10">
                <div className="relative">
                  {/* Photo container - Auto size based on photo */}
                  <div className={`rounded-2xl bg-gradient-to-br ${gradientClass} p-[4px]`}>
                    <div
                      className="rounded-xl bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative"
                      style={{ maxWidth: '100%', maxHeight: '60vh' }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {photos && photos.length > 0 ? (
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentPhotoIndex}
                            src={photos[currentPhotoIndex]}
                            alt={`${name} - Photo ${currentPhotoIndex + 1}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-full max-h-[55vh] w-auto h-auto object-contain"
                          />
                        </AnimatePresence>
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center">
                          <span className="text-8xl font-semibold text-white/90">{initials}</span>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      {photos && photos.length > 1 && (
                        <>
                          <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                            style={{ opacity: isHovered ? 1 : 0 }}
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                            style={{ opacity: isHovered ? 1 : 0 }}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Role badge - Below photo */}
                  {role && (
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-lg font-medium border ${badgeClass} whitespace-nowrap`}>
                      {role.includes(" ") ? role.split(" ")[1] : role}
                    </div>
                  )}

                  {/* Dots indicator */}
                  {photos && photos.length > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {photos.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPhotoIndex
                            ? "bg-white/80 w-8"
                            : "bg-white/20 w-2"
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Name - Responsive for long names */}
              <div className="text-center mb-8">
                <h3 className="text-4xl font-semibold text-white tracking-wide break-words max-w-full">
                  {name}
                </h3>
              </div>

              {/* Division Badge - Larger */}
              {division && (
                <div className="flex justify-center mb-8">
                  <div className="px-10 py-4 rounded-full bg-white/5 border border-white/10">
                    <span className="text-xl font-medium text-white/60">{division}</span>
                  </div>
                </div>
              )}

              {/* Footer decoration - Larger */}
              <div className="flex justify-center items-center gap-4 pt-8 border-t border-white/10">
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="w-4 h-4 rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-center text-white/30 text-base mt-6">
            Klik di luar atau tekan ESC untuk menutup
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Member Card Component - Modern Futuristik Minimalis
interface MemberCardProps {
  member: Member | string;
  index: number;
  isCore?: boolean;
  onClick?: (member: Member | string) => void;
}

function MemberCard({ member, index, isCore = false, onClick }: MemberCardProps) {
  const name = typeof member === "string" ? member : member.name;
  const role = typeof member === "string" ? undefined : member.role;
  const initials = getInitials(name);
  const gradientClass = getRoleAccentColor(role);
  const borderClass = getRoleBorderColor(role);
  const glowColor = getRoleGlowColor(role);
  const mainPhoto = typeof member === "string" ? undefined : getMainPhoto(member);

  const handleClick = () => {
    if (onClick) {
      onClick(member);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      onClick={handleClick}
      className={`relative p-5 bg-gradient-to-br ${gradientClass} backdrop-blur-md border ${borderClass} bg-white/80 dark:bg-white/5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 group cursor-pointer hover:scale-105 hover:shadow-lg`}
    >
      {/* Subtle glow effect on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)` }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center">
        {/* Photo circle dengan subtle ring - Main photo */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 dark:from-white/10 to-transparent p-[1px] mb-3">
          <div className="relative w-full h-full rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
            {mainPhoto ? (
              <Image
                src={mainPhoto}
                alt={name}
                fill
                sizes="64px"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-800 dark:text-white/90">{initials}</span>
            )}
          </div>
        </div>

        {/* Name dengan subtle gradient */}
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white/90 mb-1 tracking-wide">
          {name}
        </h4>

        {/* Role */}
        {role && (
          <p className="text-xs text-gray-600 dark:text-white/50 font-light px-2">
            {role.split(" ").slice(1).join(" ")}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Connector Line Component - Thin and elegant
interface ConnectorProps {
  type: "vertical" | "horizontal" | "branch";
  count?: number;
}

function Connector({ type, count = 1 }: ConnectorProps) {
  if (type === "vertical") {
    return (
      <div className="flex justify-center py-3">
        <div className="w-px h-6 bg-gradient-to-b from-white/20 to-white/10" />
      </div>
    );
  }

  if (type === "horizontal") {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="h-px w-full max-w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    );
  }

  // Branch connector
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex space-x-2">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
            className="h-px bg-white/15"
            style={{ width: "32px" }}
          />
        ))}
      </div>
    </div>
  );
}

// Level Container
interface LevelProps {
  title?: string;
  children: React.ReactNode;
  isCore?: boolean;
}

function Level({ title, children, isCore = false }: LevelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      {title && (
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-xs font-medium tracking-widest mb-5 px-4 py-1.5 rounded-full border ${isCore
            ? "bg-amber-500/10 text-amber-300/80 border-amber-500/20"
            : "bg-white/5 text-white/50 border-white/10 uppercase tracking-wider"
            }`}
        >
          {title}
        </motion.h3>
      )}

      <div className="flex flex-wrap justify-center gap-3 px-2">
        {children}
      </div>
    </motion.div>
  );
}

// Division Section with tree structure
interface DivisionSectionProps {
  division: Division;
  index: number;
  onMemberClick?: (member: Member | string) => void;
}

function DivisionSection({ division, index, onMemberClick }: DivisionSectionProps) {
  const isCore = division.type === "core";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      {/* Division header card - Minimal */}
      <div className={`relative px-5 py-2.5 mb-4 rounded-lg bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10`}>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white/80 tracking-wide">
            {division.label}
          </h3>
          {division.coordinator && (
            <p className="text-xs text-gray-600 dark:text-white/40 mt-0.5">
              Koord. <span className="text-gray-800 dark:text-white/60">{division.coordinator}</span>
            </p>
          )}
        </div>
      </div>

      {/* Members grid */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {division.members.map((member, idx) => (
          <MemberCard
            key={typeof member === 'string' ? `${division.id}_${idx}` : member.id}
            member={member}
            index={idx}
            isCore={isCore}
            onClick={onMemberClick}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Tree connector between levels
function TreeConnector({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex justify-center py-2">
      <div className="relative">
        {/* Vertical line */}
        <div className="w-px h-5 bg-gradient-to-b from-white/25 to-white/10" />
      </div>
    </div>
  );
}

export default function PanitiaPage() {
  const [hoveredDivision, setHoveredDivision] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [committee, setCommittee] = useState<Division[]>(fallbackCommitteeData);

  useEffect(() => {
    getEdufestCommittee().then((data) => {
      if (data && data.length > 0) {
        setCommittee(data);
      }
    });
  }, []);

  // Separate core and divisions
  const coreDivision = committee.find(d => d.type === "core");
  const otherDivisions = committee.filter(d => d.type !== "core");

  // Handle member click
  const handleMemberClick = useCallback((member: Member | string) => {
    setSelectedMember(member);
    const division = findDivisionByMember(member, committee);
    setSelectedDivision(division || null);
  }, [committee]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedMember(null);
    setSelectedDivision(null);
  }, []);

  // Group divisions into rows for better layout
  const divisionRows = useMemo(() => {
    const rows: Division[][] = [];
    let currentRow: Division[] = [];
    let currentCount = 0;

    otherDivisions.forEach((div) => {
      const count = div.members.length + 1;
      if (currentCount + count > 4 && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [div];
        currentCount = count;
      } else {
        currentRow.push(div);
        currentCount += count;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, [otherDivisions]);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* Background - Dynamic adaptive gradient */}
      <div className="fixed inset-0 bg-[var(--background)] transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-[var(--background)] to-[var(--background)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px"
          }}
        />

        {/* Subtle glow accents */}
        <motion.div
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-24 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-[var(--foreground)] mb-3 tracking-tight">
            Struktur <span className="font-medium text-[var(--foreground)]">Panitia</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--foreground)]/60 max-w-lg mx-auto font-light">
            Tim yang akan mewujudkan Edufest 2025
          </p>
        </motion.div>

        {/* Tree Container - Hierarchical Structure */}
        <div className="max-w-6xl mx-auto">
          {/* Level 1: Core Committee (Top) */}
          {coreDivision && (
            <Level title="Dewan Pengurus" isCore={true}>
              {coreDivision.members.map((member, idx) => (
                <MemberCard
                  key={typeof member === 'string' ? `core_${idx}` : member.id}
                  member={member}
                  index={idx}
                  isCore={true}
                  onClick={handleMemberClick}
                />
              ))}
            </Level>
          )}

          {/* Connector to next level */}
          {coreDivision && otherDivisions.length > 0 && (
            <TreeConnector index={0} total={divisionRows.length + 1} />
          )}

          {/* Level 2+: Divisions in rows */}
          <div className="space-y-8">
            {divisionRows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`}>
                {rowIndex > 0 && (
                  <TreeConnector index={rowIndex} total={divisionRows.length} />
                )}

                {/* Subtle divider line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.08 }}
                  className="flex justify-center mb-6"
                >
                  <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </motion.div>

                {/* Division cards in this row */}
                <div className="flex flex-wrap justify-center gap-6">
                  {row.map((division, idx) => (
                    <DivisionSection
                      key={division.id}
                      division={division}
                      index={rowIndex * row.length + idx}
                      onMemberClick={handleMemberClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-amber-400/60" />
            <span className="text-xs text-white/50">Ketum</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-orange-400/60" />
            <span className="text-xs text-white/50">Waket</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
            <span className="text-xs text-white/50">Sekretaris</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
            <span className="text-xs text-white/50">Bendahara</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-white/25 font-light">Edufest 2025 ©</p>
      </footer>

      {/* ID Card Modal - Extra Large Version with Rectangular Photo */}
      <IdCardModal
        member={selectedMember || ""}
        division={selectedDivision || undefined}
        isOpen={selectedMember !== null}
        onClose={handleCloseModal}
      />
    </main>
  );
}

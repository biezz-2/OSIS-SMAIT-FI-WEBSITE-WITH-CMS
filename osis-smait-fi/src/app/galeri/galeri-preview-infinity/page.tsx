"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { fetchGaleriFotoFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { useImageQuality } from "@/context/ImageQualityContext";

interface GalleryPhoto {
  id: number;
  src: string;
  width: number;
  height: number;
  title: string;
  description?: string;
  kategori?: string;
  tanggal?: string;
}

const BASE_PHOTOS: GalleryPhoto[] = [
  { id: 1, src: "https://placehold.co/600x400/0f172a/334155?text=Galeri+OSIS+1", title: "Rapat Koordinasi Pengurus OSIS", description: "Dokumentasi rapat koordinasi pengurus OSIS SMAIT Fithrah Insani.", width: 600, height: 400, kategori: "kegiatan" },
  { id: 2, src: "https://placehold.co/600x800/0f172a/334155?text=Galeri+OSIS+2", title: "Presentasi Program Kerja", description: "Pemaparan proker pengurus harian OSIS.", width: 600, height: 800, kategori: "kegiatan" },
  { id: 3, src: "https://placehold.co/600x450/0f172a/334155?text=Galeri+OSIS+3", title: "Ukhuwah dan Kolaborasi", description: "Kegiatan kebersamaan antar sekbid.", width: 600, height: 450, kategori: "dokumentasi" },
  { id: 4, src: "https://placehold.co/600x700/0f172a/334155?text=Galeri+OSIS+4", title: "Pelatihan Kepemimpinan", description: "Latihan kepemimpinan siswa OSIS SMAIT FI.", width: 600, height: 700, kategori: "kegiatan" },
  { id: 5, src: "https://placehold.co/600x500/0f172a/334155?text=Galeri+OSIS+5", title: "Kajian Rutin Agama", description: "Kajian dan pembinaan karakter islami.", width: 600, height: 500, kategori: "dokumentasi" },
  { id: 6, src: "https://placehold.co/600x750/0f172a/334155?text=Galeri+OSIS+6", title: "Pentas Seni & Bakat", description: "Unjuk bakat dan ekspresi seni siswa.", width: 600, height: 750, kategori: "kegiatan" },
];

const COLUMN_WIDTH = 340;
const GAP = 0;
const NUM_COLUMNS = 8;
const TOTAL_WIDTH = NUM_COLUMNS * (COLUMN_WIDTH + GAP);

const GX_RANGE = [-1, 0, 1, 2];
const CI_RANGE = [-2, -1, 0, 1, 2];

const KATEGORI_LABELS: Record<string, string> = {
  all: "Semua",
  kegiatan: "Kegiatan",
  dokumentasi: "Dokumentasi",
};

const KATEGORI_COLORS: Record<string, string> = {
  kegiatan: "#2E90FA",
  dokumentasi: "#FA982E",
};

export default function GaleriPreviewInfinityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const columnsRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>(BASE_PHOTOS);
  const [loading, setLoading] = useState(true);
  const [activeKategori, setActiveKategori] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const [showHint, setShowHint] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const posRef = useRef<{ x: number; y: number }>({ x: -400, y: -400 });
  const scaleRef = useRef<number>(0.85);
  const targetPos = useRef<{ x: number; y: number }>({ x: -400, y: -400 });
  const targetScale = useRef<number>(0.85);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({ startX: 0, startY: 0, initialPosX: -400, initialPosY: -400 });
  const dragDistanceRef = useRef<number>(0);
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastMouseRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(0.85);

  useEffect(() => {
    async function loadGaleri() {
      setLoading(true);
      try {
        const data = await fetchGaleriFotoFromStrapi();
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: GalleryPhoto[] = data.map((item: any) => {
            const attrs = item.attributes || item;
            const fotoObj = attrs.foto?.data?.attributes || attrs.foto?.attributes || attrs.foto;
            const src = getStrapiMediaUrl(fotoObj || attrs.foto, "https://placehold.co/600x400/0f172a/334155?text=OSIS");
            const w = fotoObj?.width || attrs.width || 600;
            const h = fotoObj?.height || attrs.height || 400;
            return {
              id: item.id,
              src,
              width: typeof w === "number" && w > 0 ? w : 600,
              height: typeof h === "number" && h > 0 ? h : 400,
              title: attrs.judul || "Dokumentasi OSIS",
              description: attrs.deskripsi || "Dokumentasi resmi kegiatan siswa SMAIT Fithrah Insani.",
              kategori: attrs.kategori || "kegiatan",
              tanggal: attrs.tanggal || "",
            };
          });
          setAllPhotos(mapped);
        }
      } catch (err) {
        console.error("Failed fetching galeri foto:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGaleri();
  }, []);

  useEffect(() => {
    if (isDragging) setShowHint(false);
  }, [isDragging]);

  const photos = useMemo(() => {
    if (activeKategori === "all") return allPhotos;
    const filtered = allPhotos.filter(p => p.kategori === activeKategori);
    return filtered.length > 0 ? filtered : allPhotos;
  }, [allPhotos, activeKategori]);

  const columnsData = useMemo(() => {
    if (!photos || photos.length === 0) return [];

    return Array.from({ length: NUM_COLUMNS }).map((_, c) => {
      let colPhotos = photos.filter((_, idx) => idx % NUM_COLUMNS === c);
      if (colPhotos.length === 0) {
        colPhotos = photos.filter((_, idx) => (idx + c) % photos.length === 0);
        if (colPhotos.length === 0) colPhotos = [photos[c % photos.length]];
      }

      const calcH = (list: GalleryPhoto[]) =>
        list.reduce((sum, p) => {
          const w = p.width && p.width > 0 ? p.width : 600;
          const h = p.height && p.height > 0 ? p.height : 400;
          return sum + COLUMN_WIDTH * (h / w) + GAP;
        }, 0);

      let finalPhotos = [...colPhotos];
      let h = calcH(finalPhotos);
      let safety = 0;
      while (h < 3600 && safety < 30) {
        finalPhotos = [...finalPhotos, ...colPhotos];
        h = calcH(finalPhotos);
        safety++;
      }
      return { photos: finalPhotos, height: h };
    });
  }, [photos]);

  useEffect(() => {
    let animId: number;
    const tick = () => {
      const k = 0.18;
      const dx = targetPos.current.x - posRef.current.x;
      const dy = targetPos.current.y - posRef.current.y;
      posRef.current.x = Math.abs(dx) < 0.01 ? targetPos.current.x : posRef.current.x + dx * k;
      posRef.current.y = Math.abs(dy) < 0.01 ? targetPos.current.y : posRef.current.y + dy * k;
      const ds = targetScale.current - scaleRef.current;
      scaleRef.current = Math.abs(ds) < 0.0005 ? targetScale.current : scaleRef.current + ds * k;

      if (canvasRef.current && columnsData.length > 0) {
        const x = posRef.current.x;
        const y = posRef.current.y;
        const scale = scaleRef.current;

        const wx = ((x % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH - TOTAL_WIDTH;
        canvasRef.current.style.transform = `translate3d(${wx}px, 0px, 0) scale(${scale})`;

        GX_RANGE.forEach((gx) => {
          for (let c = 0; c < NUM_COLUMNS; c++) {
            const el = columnsRefs.current[`${gx}_${c}`];
            const col = columnsData[c];
            if (el && col && col.height > 0) {
              const wy = ((y % col.height) + col.height) % col.height - col.height;
              el.style.transform = `translate3d(0px, ${wy}px, 0)`;
            }
          }
        });
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [columnsData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1 && e.button !== 2) return;
    setIsDragging(true);
    dragDistanceRef.current = 0;
    dragStartRef.current = { startX: e.clientX, startY: e.clientY, initialPosX: targetPos.current.x, initialPosY: targetPos.current.y };
    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velocityRef.current = { vx: 0, vy: 0 };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    dragDistanceRef.current = Math.hypot(dx, dy);
    const now = performance.now();
    const dt = Math.max(now - lastMouseRef.current.time, 1);
    velocityRef.current = { vx: (e.clientX - lastMouseRef.current.x) / (dt / 16.6), vy: (e.clientY - lastMouseRef.current.y) / (dt / 16.6) };
    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
    targetPos.current = { x: dragStartRef.current.initialPosX + dx / scaleRef.current, y: dragStartRef.current.initialPosY + dy / scaleRef.current };
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const speed = Math.hypot(velocityRef.current.vx, velocityRef.current.vy);
    if (speed > 0.1) {
      targetPos.current = { x: targetPos.current.x + velocityRef.current.vx * 10, y: targetPos.current.y + velocityRef.current.vy * 10 };
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const f = e.deltaY < 0 ? 1.08 : 0.92;
        targetScale.current = Math.min(Math.max(targetScale.current * f, 0.4), 2.5);
      } else {
        targetPos.current = { x: targetPos.current.x - (e.deltaX * 0.95) / scaleRef.current, y: targetPos.current.y - (e.deltaY * 0.95) / scaleRef.current };
      }
    };

    const getTouchDist = (t1: Touch, t2: Touch) => Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        setIsDragging(true);
        dragStartRef.current = { startX: t.clientX, startY: t.clientY, initialPosX: targetPos.current.x, initialPosY: targetPos.current.y };
        lastMouseRef.current = { x: t.clientX, y: t.clientY, time: performance.now() };
        velocityRef.current = { vx: 0, vy: 0 };
        initialPinchDistRef.current = null;
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        initialPinchDistRef.current = getTouchDist(e.touches[0], e.touches[1]);
        initialPinchScaleRef.current = targetScale.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (e.touches.length === 1 && initialPinchDistRef.current === null) {
        const t = e.touches[0];
        const dx = t.clientX - dragStartRef.current.startX;
        const dy = t.clientY - dragStartRef.current.startY;
        const now = performance.now();
        const dt = Math.max(now - lastMouseRef.current.time, 1);
        velocityRef.current = { vx: (t.clientX - lastMouseRef.current.x) / (dt / 16.6), vy: (t.clientY - lastMouseRef.current.y) / (dt / 16.6) };
        lastMouseRef.current = { x: t.clientX, y: t.clientY, time: now };
        targetPos.current = { x: dragStartRef.current.initialPosX + dx / scaleRef.current, y: dragStartRef.current.initialPosY + dy / scaleRef.current };
      } else if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
        const ratio = getTouchDist(e.touches[0], e.touches[1]) / initialPinchDistRef.current;
        targetScale.current = Math.min(Math.max(initialPinchScaleRef.current * ratio, 0.4), 2.5);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        if (initialPinchDistRef.current === null) {
          const speed = Math.hypot(velocityRef.current.vx, velocityRef.current.vy);
          if (speed > 0.1) {
            targetPos.current = { x: targetPos.current.x + velocityRef.current.vx * 10, y: targetPos.current.y + velocityRef.current.vy * 10 };
          }
        }
        setIsDragging(false);
        initialPinchDistRef.current = null;
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        dragStartRef.current = { startX: t.clientX, startY: t.clientY, initialPosX: targetPos.current.x, initialPosY: targetPos.current.y };
        lastMouseRef.current = { x: t.clientX, y: t.clientY, time: performance.now() };
        initialPinchDistRef.current = null;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const handleResetView = () => {
    targetPos.current = { x: -400, y: -400 };
    targetScale.current = 0.85;
  };

  const openPhoto = useCallback((photo: GalleryPhoto) => {
    const idx = photos.findIndex(p => p.id === photo.id && p.src === photo.src);
    setSelectedPhoto(photo);
    setSelectedIdx(idx >= 0 ? idx : 0);
  }, [photos]);

  const navigatePhoto = useCallback((dir: 1 | -1) => {
    setSelectedIdx(prev => {
      const next = (prev + dir + photos.length) % photos.length;
      setSelectedPhoto(photos[next]);
      return next;
    });
  }, [photos]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigatePhoto(1);
      else if (e.key === "ArrowLeft") navigatePhoto(-1);
      else if (e.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedPhoto, navigatePhoto]);

  const kategoriList = useMemo(() => {
    const cats = Array.from(new Set(allPhotos.map(p => p.kategori).filter(Boolean))) as string[];
    return ["all", ...cats];
  }, [allPhotos]);

  const formatTanggal = (t?: string) => {
    if (!t) return "";
    try {
      return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(t));
    } catch {
      return t;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#030712] overflow-hidden select-none font-sans">
      <div className="z-50 shrink-0">
        <Navbar />
      </div>

      <div
        ref={containerRef}
        className={`relative flex-1 w-full overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1.5px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        onContextMenu={e => e.preventDefault()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* HUD Controls */}
        <div className="absolute top-3 left-3 right-3 z-40 flex items-start gap-2 pointer-events-none">
          <div className="flex-1 py-3 px-4 rounded-2xl border border-white/10 bg-[#0b0f19]/85 backdrop-blur-md shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h1
                  className="font-black tracking-tight uppercase bg-gradient-to-r from-[#2E90FA] via-[#64B5F6] to-[#FA982E] bg-clip-text text-transparent"
                  style={{ fontSize: "clamp(14px, 2.2vw, 22px)", fontFamily: "Poppins, sans-serif" }}
                >
                  GALERI KEGIATAN
                </h1>
                <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {loading ? "Memuat foto..." : `${photos.length} foto · OSIS SMAIT Fithrah Insani`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {kategoriList.map(k => (
                  <button
                    key={k}
                    onClick={() => setActiveKategori(k)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 border ${
                      activeKategori === k
                        ? "bg-white text-[#0b0f19] border-white shadow"
                        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {KATEGORI_LABELS[k] || k}
                    {k !== "all" && (
                      <span className="ml-1 opacity-60 font-normal">
                        ({allPhotos.filter(p => p.kategori === k).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            <button
              onClick={handleResetView}
              title="Reset tampilan"
              className="w-9 h-9 rounded-none bg-[#0b0f19]/85 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 transition flex items-center justify-center shadow-lg"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
            <button
              onClick={() => { targetScale.current = Math.min(targetScale.current * 1.2, 2.5); }}
              title="Zoom in"
              className="w-9 h-9 rounded-none bg-[#0b0f19]/85 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 transition flex items-center justify-center shadow-lg text-base font-bold"
            >
              +
            </button>
            <button
              onClick={() => { targetScale.current = Math.max(targetScale.current * 0.83, 0.4); }}
              title="Zoom out"
              className="w-9 h-9 rounded-none bg-[#0b0f19]/85 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 transition flex items-center justify-center shadow-lg text-lg font-bold"
            >
              -
            </button>
          </div>
        </div>

        {/* Floating Hint */}
        {showHint && !loading && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-pulse">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b0f19]/85 border border-white/10 backdrop-blur-md text-white/50 text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
              </svg>
              Drag untuk jelajah · Ctrl+Scroll untuk zoom · Klik foto untuk perbesar
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#2E90FA]/20 border-t-[#2E90FA] rounded-full animate-spin" />
              <p className="text-slate-400 text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>Memuat galeri foto...</p>
            </div>
          </div>
        )}

        {/* Infinite Canvas */}
        <div
          ref={canvasRef}
          className="absolute inset-0 origin-top-left pointer-events-auto"
          style={{
            transform: "translate3d(-400px, 0px, 0) scale(0.85)",
            willChange: "transform",
          }}
        >
          {GX_RANGE.map((gx) => (
            <div
              key={`grid-${gx}`}
              className="absolute top-0"
              style={{ left: `${gx * TOTAL_WIDTH}px`, width: `${TOTAL_WIDTH}px` }}
            >
              {columnsData.map((col, c) => (
                <div
                  key={`col-${gx}-${c}`}
                  ref={(el) => { if (columnsRefs.current) columnsRefs.current[`${gx}_${c}`] = el; }}
                  className="absolute top-0 flex flex-col"
                  style={{
                    left: `${c * (COLUMN_WIDTH + GAP)}px`,
                    width: `${COLUMN_WIDTH}px`,
                    willChange: "transform",
                  }}
                >
                  {CI_RANGE.map((ci) => (
                    <div
                      key={ci}
                      className="absolute top-0 left-0 w-full flex flex-col"
                      style={{
                        gap: `${GAP}px`,
                        transform: `translate3d(0, ${ci * col.height}px, 0)`,
                      }}
                    >
                      {col.photos.map((photo, pi) => (
                        <PhotoCard
                          key={`${gx}-${c}-${ci}-${pi}-${photo.id}`}
                          photo={photo}
                          onSelect={openPhoto}
                          dragDistanceRef={dragDistanceRef}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0b0f19]/98 rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col md:flex-row"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center border border-white/10 transition text-sm"
            >
              ✕
            </button>

            {/* Image Preview */}
            <div className="md:w-2/3 bg-black/70 flex items-center justify-center min-h-[280px] max-h-[80vh] relative">
              <button
                onClick={() => navigatePhoto(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center border border-white/10 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              </button>
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain max-h-[80vh] p-2"
              />
              <button
                onClick={() => navigatePhoto(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center border border-white/10 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>

            {/* Info details */}
            <div className="md:w-1/3 p-6 flex flex-col justify-between text-white border-l border-white/5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedPhoto.kategori && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${KATEGORI_COLORS[selectedPhoto.kategori] || "#94a3b8"}18`,
                        color: KATEGORI_COLORS[selectedPhoto.kategori] || "#94a3b8",
                        borderColor: `${KATEGORI_COLORS[selectedPhoto.kategori] || "#94a3b8"}30`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: KATEGORI_COLORS[selectedPhoto.kategori] || "#94a3b8" }} />
                      {KATEGORI_LABELS[selectedPhoto.kategori] || selectedPhoto.kategori}
                    </span>
                  )}
                  <span className="text-slate-500 text-[10px] font-mono">{selectedIdx + 1} / {photos.length}</span>
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">{selectedPhoto.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{selectedPhoto.description || "Dokumentasi resmi kegiatan siswa SMAIT Fithrah Insani."}</p>
                {selectedPhoto.tanggal && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    {formatTanggal(selectedPhoto.tanggal)}
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
                <span className="text-slate-500 text-xs font-mono">Agora Acta OSIS</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => navigatePhoto(-1)} className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/10 transition">←</button>
                  <button onClick={() => navigatePhoto(1)} className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/10 transition">→</button>
                  <button onClick={() => setSelectedPhoto(null)} className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#2E90FA] to-[#185FA5] hover:opacity-90 text-white text-xs font-bold transition shadow-md">Tutup</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PhotoCard = React.memo(function PhotoCard({
  photo,
  onSelect,
  dragDistanceRef,
}: {
  photo: GalleryPhoto;
  onSelect: (photo: GalleryPhoto) => void;
  dragDistanceRef: React.RefObject<number>;
}) {
  const color = KATEGORI_COLORS[photo.kategori || ""] || "#2E90FA";
  const [imgError, setImgError] = useState(false);

  const finalSrc = photo.src;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if ((dragDistanceRef.current ?? 0) < 5) onSelect(photo);
      }}
      className="group relative overflow-hidden bg-[#0a101d] rounded-none cursor-pointer border border-white/5 shadow-md hover:border-white/20 transition-all duration-300 hover:z-20 hover:scale-[1.02]"
      style={{
        width: "100%",
        aspectRatio: `${photo.width} / ${photo.height}`,
      }}
      title="Klik me untuk perbesar"
    >
      <img
        src={finalSrc}
        alt={photo.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3.5 flex flex-col justify-end gap-1">
        {photo.kategori && (
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
            {KATEGORI_LABELS[photo.kategori] || photo.kategori}
          </span>
        )}
        <h4 className="text-white font-bold text-xs leading-snug drop-shadow">{photo.title}</h4>
        {photo.tanggal && <span className="text-[10px] text-slate-400">{photo.tanggal}</span>}
      </div>
    </div>
  );
});

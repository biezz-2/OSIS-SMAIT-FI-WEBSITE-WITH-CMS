"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
}

// Fallback base photos for OSIS SMAIT Fithrah Insani when Strapi empty
const BASE_PHOTOS: { src: string; title: string; description?: string }[] = [
  {
    src: "https://placehold.co/600x400/185FA5/FFF?text=Media+OSIS",
    title: "Rapat Koordinasi Pengurus OSIS",
    description: "Dokumentasi rapat koordinasi pengurus OSIS SMAIT Fithrah Insani."
  },
  {
    src: "https://placehold.co/600x400/185FA5/FFF?text=Media+OSIS",
    title: "Presentasi Program Kerja Utama",
    description: "Pemaparan proker pengurus harian OSIS."
  },
  {
    src: "https://placehold.co/600x400/185FA5/FFF?text=Media+OSIS",
    title: "Ukhuwah & Kolaborasi Anggota",
    description: "Kegiatan kebersamaan antar sekbid."
  }
];

const INITIAL_PHOTOS: GalleryPhoto[] = BASE_PHOTOS.map((item, index) => ({
  ...item,
  id: index + 1,
  width: 600,
  height: 400
}));

// Layout Grid Constants
const COLUMN_WIDTH = 450;
const NUM_COLUMNS = 8;
const TOTAL_WIDTH = NUM_COLUMNS * COLUMN_WIDTH;

export default function GaleriPreviewInfinityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const columnsRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [photos, setPhotos] = useState<GalleryPhoto[]>(INITIAL_PHOTOS);

  // Active transform variables
  const posRef = useRef<{ x: number; y: number }>({ x: -800, y: -600 });
  const scaleRef = useRef<number>(0.85);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragButton, setDragButton] = useState<number | null>(null);

  // Target positions
  const targetPos = useRef<{ x: number; y: number }>({ x: -800, y: -600 });
  const targetScale = useRef<number>(0.85);

  // Track initial drag position
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: -800,
    initialPosY: -600
  });

  const dragDistanceRef = useRef<number>(0);

  // Inertia physics velocity tracking
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastMouseRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Touch tracking for mobile gestures
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(0.85);

  // Modal active item
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Fetch Galeri Foto from Strapi on mount
  useEffect(() => {
    async function loadGaleri() {
      try {
        const data = await fetchGaleriFotoFromStrapi();
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: GalleryPhoto[] = data.map((item: any) => {
            const attrs = item.attributes || item;
            const fotoObj = attrs.foto?.data?.attributes || attrs.foto?.attributes || attrs.foto;
            const src = getStrapiMediaUrl(fotoObj || attrs.foto, 'https://placehold.co/600x400/185FA5/FFF?text=Media+OSIS');
            const width = fotoObj?.width || 600;
            const height = fotoObj?.height || 400;

            return {
              id: item.id,
              src,
              width,
              height,
              title: attrs.judul || 'Dokumentasi OSIS',
              description: attrs.deskripsi || 'Dokumentasi resmi kegiatan siswa SMAIT Fithrah Insani.'
            };
          });
          setPhotos(mapped);
        }
      } catch (err) {
        console.error("Failed fetching galeri foto from Strapi:", err);
      }
    }
    loadGaleri();
  }, []);

  // Distribute photos into 8 columns with safeguards for empty columns and short column heights
  const columnsData = useMemo(() => {
    return Array.from({ length: NUM_COLUMNS }).map((_, c) => {
      // 1. Get photos belonging to this column index
      let colPhotos = photos.filter((_, idx) => idx % NUM_COLUMNS === c);

      // Safeguard: If the column is empty, backfill it sequentially from the main photos list
      if (colPhotos.length === 0 && photos.length > 0) {
        colPhotos = [photos[c % photos.length]];
      }

      // Helper function to calculate column height in pixels
      const calcHeight = (list: GalleryPhoto[]) => {
        return list.reduce((sum, p) => sum + COLUMN_WIDTH * (p.height / p.width), 0);
      };

      // 2. Safeguard: If the column's total height is less than 2500px, repeat/duplicate its photos
      // so it is tall enough to prevent vertical blanks on zoomed out screen sizes.
      let finalPhotos = [...colPhotos];
      let currentHeight = calcHeight(finalPhotos);
      const MIN_HEIGHT_THRESHOLD = 2500;

      if (currentHeight > 0) {
        let iterations = 0;
        while (currentHeight < MIN_HEIGHT_THRESHOLD && iterations < 10) {
          finalPhotos = [...finalPhotos, ...colPhotos];
          currentHeight = calcHeight(finalPhotos);
          iterations++;
        }
      }

      return {
        photos: finalPhotos,
        height: currentHeight
      };
    });
  }, [photos]);

  // Prevent browser context menu on right click inside canvas
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Continuous iOS-style spring damping animation loop (direct DOM manipulation for 120fps smooth scrolling)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const k = 0.085; // Damping coefficient

      // Interpolate coordinates
      const dx = targetPos.current.x - posRef.current.x;
      const dy = targetPos.current.y - posRef.current.y;
      posRef.current.x = Math.abs(dx) < 0.01 ? targetPos.current.x : posRef.current.x + dx * k;
      posRef.current.y = Math.abs(dy) < 0.01 ? targetPos.current.y : posRef.current.y + dy * k;

      // Interpolate scale
      const ds = targetScale.current - scaleRef.current;
      scaleRef.current = Math.abs(ds) < 0.0005 ? targetScale.current : scaleRef.current + ds * k;

      // Update positions directly via refs for maximum performance
      if (canvasRef.current) {
        const x = posRef.current.x;
        const y = posRef.current.y;
        
        // Wrap horizontal position modulo total grid width
        const wrappedX = ((x % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH - TOTAL_WIDTH;

        // Apply hardware accelerated translation to canvas layer
        canvasRef.current.style.transform = `translate3d(${wrappedX}px, 0px, 0) scale(${scaleRef.current})`;

        // Indepedently wrap each column vertically by its own height (guarantees zero vertical gaps!)
        [-1, 0, 1].forEach((gridX) => {
          columnsData.forEach((col, c) => {
            const key = `${gridX}_${c}`;
            const colEl = columnsRefs.current[key];
            if (colEl) {
              const wrappedY = ((y % col.height) + col.height) % col.height - col.height;
              colEl.style.transform = `translate3d(0px, ${wrappedY}px, 0)`;
            }
          });
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [columnsData]);

  // Handle Mouse Down (Right Click e.button === 2 OR Left Click e.button === 0)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 2 && e.button !== 0 && e.button !== 1) return;

    setIsDragging(true);
    setDragButton(e.button);
    dragDistanceRef.current = 0;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: targetPos.current.x,
      initialPosY: targetPos.current.y
    };

    lastMouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now()
    };

    velocityRef.current = { vx: 0, vy: 0 };
  };

  // Handle Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    dragDistanceRef.current = Math.sqrt(dx * dx + dy * dy);

    const now = performance.now();
    const dt = Math.max(now - lastMouseRef.current.time, 1);

    const vx = (e.clientX - lastMouseRef.current.x) / (dt / 16.6);
    const vy = (e.clientY - lastMouseRef.current.y) / (dt / 16.6);

    velocityRef.current = { vx, vy };
    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };

    targetPos.current = {
      x: dragStartRef.current.initialPosX + dx / scaleRef.current,
      y: dragStartRef.current.initialPosY + dy / scaleRef.current
    };
  };

  // Handle Mouse Up & Mouse Leave
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragButton(null);

    const speed = Math.sqrt(velocityRef.current.vx ** 2 + velocityRef.current.vy ** 2);
    if (speed > 0.1) {
      targetPos.current = {
        x: targetPos.current.x + velocityRef.current.vx * 15,
        y: targetPos.current.y + velocityRef.current.vy * 15
      };
    }
  };

  // Native non-passive Wheel and Touch handling for pan & pinch-to-zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        targetScale.current = Math.min(Math.max(targetScale.current * zoomFactor, 0.60), 2.2);
      } else {
        targetPos.current = {
          x: targetPos.current.x - (e.deltaX * 0.95) / scaleRef.current,
          y: targetPos.current.y - (e.deltaY * 0.95) / scaleRef.current
        };
      }
    };

    // Touch event listeners for smooth mobile touch pan & pinch zoom
    const getTouchDist = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        setIsDragging(true);
        dragStartRef.current = {
          startX: t.clientX,
          startY: t.clientY,
          initialPosX: targetPos.current.x,
          initialPosY: targetPos.current.y
        };
        lastMouseRef.current = { x: t.clientX, y: t.clientY, time: performance.now() };
        velocityRef.current = { vx: 0, vy: 0 };
        initialPinchDistRef.current = null;
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        initialPinchDistRef.current = dist;
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
        const vx = (t.clientX - lastMouseRef.current.x) / (dt / 16.6);
        const vy = (t.clientY - lastMouseRef.current.y) / (dt / 16.6);

        velocityRef.current = { vx, vy };
        lastMouseRef.current = { x: t.clientX, y: t.clientY, time: now };

        targetPos.current = {
          x: dragStartRef.current.initialPosX + dx / scaleRef.current,
          y: dragStartRef.current.initialPosY + dy / scaleRef.current
        };
      } else if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
        const currentDist = getTouchDist(e.touches[0], e.touches[1]);
        if (initialPinchDistRef.current > 0) {
          const ratio = currentDist / initialPinchDistRef.current;
          const newScale = Math.min(Math.max(initialPinchScaleRef.current * ratio, 0.60), 2.2);
          targetScale.current = newScale;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        if (initialPinchDistRef.current === null) {
          const speed = Math.sqrt(velocityRef.current.vx ** 2 + velocityRef.current.vy ** 2);
          if (speed > 0.1) {
            targetPos.current = {
              x: targetPos.current.x + velocityRef.current.vx * 15,
              y: targetPos.current.y + velocityRef.current.vy * 15
            };
          }
        }
        setIsDragging(false);
        initialPinchDistRef.current = null;
      } else if (e.touches.length === 1) {
        // Reset single-finger drag anchor when transitioning from 2 fingers back to 1
        const t = e.touches[0];
        dragStartRef.current = {
          startX: t.clientX,
          startY: t.clientY,
          initialPosX: targetPos.current.x,
          initialPosY: targetPos.current.y
        };
        lastMouseRef.current = { x: t.clientX, y: t.clientY, time: performance.now() };
        initialPinchDistRef.current = null;
      }
    };

    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleNativeWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const handleResetView = () => {
    targetPos.current = { x: -800, y: -600 };
    targetScale.current = 0.85;
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#030712] overflow-hidden select-none font-sans">
      {/* Top Navbar */}
      <div className="z-50 shrink-0 shadow-md">
        <Navbar />
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className={`relative flex-1 w-full overflow-hidden bg-[#030712] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.04) 1.5px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Modern Glassmorphic Floating Header */}
        <div className="absolute top-4 left-4 right-4 z-45 max-w-4xl mx-auto pointer-events-none">
          <div
            className="w-full py-4 px-6 flex flex-col items-center justify-center text-center gap-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-lg bg-[#0b0f19]/70"
            style={{
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            }}
          >
            <h1
              className="font-black tracking-tight uppercase bg-gradient-to-r from-[#2E90FA] via-[#64B5F6] to-[#FA982E] bg-clip-text text-transparent"
              style={{ fontSize: "clamp(20px, 3vw, 32px)", fontFamily: "Poppins, sans-serif", fontWeight: 900 }}
            >
              GALERI KEGIATAN
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[#2E90FA] to-[#FA982E] rounded-full" />
            <p
              className="text-[#F2F5FA]/80 max-w-2xl text-xs sm:text-sm font-normal tracking-wide"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Dokumentasi momen OSIS — kolaborasi, acara, dan kontribusi nyata untuk warga sekolah.
            </p>
          </div>
        </div>

        {/* Transform Canvas Layer */}
        <div
          ref={canvasRef}
          className="absolute inset-0 origin-top-left"
          style={{
            transform: "translate3d(-800px, 0px, 0) scale(0.85)",
            willChange: "transform",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
          }}
        >
          {/* Render 3 horizontal copies of the grid to cover panning bounds */}
          {[-1, 0, 1].map((gridX) => {
            const horizontalOffset = gridX * TOTAL_WIDTH;
            return (
              <div
                key={`col-grid-${gridX}`}
                className="absolute top-0"
                style={{
                  left: `${horizontalOffset}px`,
                  width: `${TOTAL_WIDTH}px`,
                  height: "10000px"
                }}
              >
                {columnsData.map((col, c) => {
                  const initialY = -600;
                  const initialWrappedY = ((initialY % col.height) + col.height) % col.height - col.height;

                  return (
                    <div
                      key={`col-${gridX}-${c}`}
                      className="absolute flex flex-col gap-0"
                      style={{
                        left: `${c * COLUMN_WIDTH}px`,
                        width: `${COLUMN_WIDTH}px`,
                        transform: `translate3d(0px, ${initialWrappedY}px, 0)`
                      }}
                      ref={(el) => {
                        if (columnsRefs.current) {
                          const key = `${gridX}_${c}`;
                          columnsRefs.current[key] = el;
                        }
                      }}
                    >
                      {/* Stacks photos twice vertically for seamless infinite wrap */}
                      {[0, 1].map((copyIdx) => (
                        <div
                          key={`col-copy-${copyIdx}`}
                          className="flex flex-col gap-0 w-full"
                          style={{
                            transform: `translate3d(0, ${copyIdx * col.height}px, 0)`
                          }}
                        >
                          {col.photos.map((photo, photoIdx) => (
                            <PhotoCard
                              key={`photo-${gridX}-${c}-${copyIdx}-${photoIdx}-${photo.id}`}
                              photo={photo}
                              onSelect={setSelectedPhoto}
                              dragDistanceRef={dragDistanceRef}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950/80 rounded-2xl overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center font-semibold text-lg border border-white/10 transition backdrop-blur-md"
            >
              ✕
            </button>

            <div className="md:w-2/3 bg-black/40 flex items-center justify-center min-h-[350px] max-h-[75vh]">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain max-h-[75vh] p-2"
              />
            </div>

            <div className="md:w-1/3 p-6 flex flex-col justify-between text-white bg-white/[0.02] border-l border-white/5 backdrop-blur-md">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#2E90FA]/15 text-[#64B5F6] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#2E90FA]/20">
                  Galeri OSIS
                </span>
                <h3 className="text-xl font-extrabold text-white mb-2 font-sans tracking-tight">
                  {selectedPhoto.title}
                </h3>
                <p className="text-slate-300/80 text-sm leading-relaxed font-light">
                  {selectedPhoto.description || "Dokumentasi resmi kegiatan siswa SMAIT Fithrah Insani — membangun jiwa kepemimpinan, ukhuwah islamiyah, dan kontribusi nyata untuk lingkungan sekolah."}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center text-xs text-slate-400">
                <span className="font-light">Agora Acta OSIS</span>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-5 py-2 bg-gradient-to-r from-[#2E90FA] to-[#185FA5] hover:opacity-90 text-white rounded-lg font-semibold transition shadow-md border border-white/5"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoCard({
  photo,
  onSelect,
  dragDistanceRef
}: {
  photo: GalleryPhoto;
  onSelect: (photo: GalleryPhoto) => void;
  dragDistanceRef: React.RefObject<number>;
}) {
  const { getOptimizedImageUrl } = useImageQuality();
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if ((dragDistanceRef.current ?? 0) < 5) {
          onSelect(photo);
        }
      }}
      className="group relative overflow-hidden bg-white/[0.03] shadow-lg hover:z-20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-[box-shadow,background-color] duration-300 cursor-pointer"
      style={{
        width: "100%",
        aspectRatio: `${photo.width} / ${photo.height}`
      }}
      title="Klik untuk memperbesar"
    >
      {/* Glossy light sweep effect on hover */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      <img
        src={getOptimizedImageUrl(photo.src)}
        alt={photo.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
        <h4 className="text-white font-semibold text-xs sm:text-sm drop-shadow-md">
          {photo.title}
        </h4>
        <span className="text-[10px] text-blue-300 mt-1 font-medium tracking-wide flex items-center gap-1">
          <span>✨</span> Klik untuk perbesar
        </span>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { getEdufestConfig } from "@/lib/edufest-api";

const GlobeToMapTransform = dynamic(
  () => import("@/components/globe/GlobeToMapTransform").then(mod => mod.GlobeToMapTransform),
  { ssr: false }
);

const DEFAULT_MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2984.2941894147434!2d107.52111289259334!3d-6.8650087692923354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e489587729b1%3A0xa3166256027d8007!2sSMA%20dan%20SMK%20Fithrah%20Insani!5e1!3m2!1sid!2sid!4v1767604243358!5m2!1sid!2sid";
const DEFAULT_LOCATION_NAME = "SMA dan SMK Fithrah Insani";

function isSafeMapsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "www.google.com" || parsed.hostname === "maps.google.com") &&
      parsed.pathname.startsWith("/maps/embed")
    );
  } catch {
    return false;
  }
}

export default function LocationPage() {
  const [showMap, setShowMap] = useState(false);
  const [locationName, setLocationName] = useState(DEFAULT_LOCATION_NAME);
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(DEFAULT_MAPS_EMBED_URL);

  useEffect(() => {
    getEdufestConfig().then((cfg) => {
      if (cfg.locationName) setLocationName(cfg.locationName);
      if (cfg.mapsEmbedUrl && isSafeMapsUrl(cfg.mapsEmbedUrl)) {
        setMapsEmbedUrl(cfg.mapsEmbedUrl);
      }
    });
  }, []);

  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Lokasi Edufest
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {locationName}
          </p>
        </div>

        {/* Globe/Map Transform Section */}
        <div className="w-full h-[500px] md:h-[600px] lg:h-[700px]">
          <GlobeToMapTransform />
        </div>

        {/* Get Direction Button */}
        <div className="flex justify-center mt-8 relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMap(true)}
            className="px-8 py-4 bg-white text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Get Direction
          </motion.button>
        </div>

        {/* Google Maps Modal */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setShowMap(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowMap(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-sm">Tutup</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Google Maps iframe */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                  <iframe
                    src={mapsEmbedUrl}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Edufest"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

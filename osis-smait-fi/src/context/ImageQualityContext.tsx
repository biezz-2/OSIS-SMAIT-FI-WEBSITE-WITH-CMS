'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CompressionQuality = 20 | 50 | 75 | 100;

interface ImageQualityContextType {
  quality: number;
  compress: boolean;
  setQuality: (quality: number) => void;
  setCompress: (compress: boolean) => void;
  getOptimizedImageUrl: (originalUrl: string, overrideQuality?: number, overrideCompress?: boolean) => string;
}

const ImageQualityContext = createContext<ImageQualityContextType | undefined>(undefined);

const STORAGE_KEY = 'osis_image_compression_quality';

import { STRAPI_URL } from '@/lib/strapi';

export function ImageQualityProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQualityState] = useState<number>(75);
  const [compress, setCompressState] = useState<boolean>(true);

  useEffect(() => {
    async function fetchQuality() {
      try {
        const res = await fetch(`${STRAPI_URL}/api/halamans?filters[slug][$eq]=home`);
        if (res.ok) {
          const json = await res.json();
          const item = json?.data?.[0];
          const attrs = item?.attributes || item;
          if (attrs) {
            if (attrs.enable_compression !== undefined) {
              setCompressState(attrs.enable_compression);
            }
            if (attrs.compression_quality !== undefined) {
              setQualityState(attrs.compression_quality);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load image quality from Strapi:', err);
      }
    }
    fetchQuality();
  }, []);

  const setQuality = (newQuality: number) => {
    setQualityState(newQuality);
  };

  const setCompress = (newCompress: boolean) => {
    setCompressState(newCompress);
  };

  const getOptimizedImageUrl = (originalUrl: string, overrideQuality?: number, overrideCompress?: boolean): string => {
    if (!originalUrl || originalUrl.trim() === '') return '';
    
    // Enable compression by default unless explicitly disabled (false)
    const activeCompress = overrideCompress !== false && compress !== false;
    if (!activeCompress) return originalUrl;

    const activeQuality = overrideQuality || quality || 75;

    // Check if it's an image URL
    const isImage = /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(originalUrl.split('?')[0]);
    if (!isImage && !originalUrl.includes('/uploads/')) return originalUrl;

    // Route through compress-image API
    return `/api/compress-image?url=${encodeURIComponent(originalUrl)}&q=${activeQuality}&compress=true`;
  };

  return (
    <ImageQualityContext.Provider value={{ quality, compress, setQuality, setCompress, getOptimizedImageUrl }}>
      {children}
    </ImageQualityContext.Provider>
  );
}

export function useImageQuality() {
  const context = useContext(ImageQualityContext);
  if (!context) {
    throw new Error('useImageQuality must be used within an ImageQualityProvider');
  }
  return context;
}

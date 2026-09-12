'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/TickerGallery.module.css';
import { fetchMediaAssetsByCategory, fetchStrapiAPI, getStrapiMediaUrl } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';

type TickerItem = {
    src: string;
    alt: string;
};

export default function TickerGallery() {
    const [tickers, setTickers] = useState<TickerItem[][]>([]);
    const [loading, setLoading] = useState(true);
    const { getOptimizedImageUrl } = useImageQuality();

    useEffect(() => {
        async function loadTickers() {
            try {
                let formatted: TickerItem[] = [];

                // 1. Try fetching from media-assets with category 'ticker'
                const assets = await fetchMediaAssetsByCategory('ticker');
                if (assets && assets.length > 0) {
                    formatted = assets.map(a => ({
                        src: a.src,
                        alt: a.title || 'Gallery Ticker',
                    }));
                } else {
                    // 2. Fallback to galeri-fotos from Strapi
                    const json: any = await fetchStrapiAPI('/api/galeri-fotos?populate=*');
                    const items = json?.data || [];
                    formatted = items.map((item: any) => {
                        const attrs = item.attributes || item;
                        const src = getStrapiMediaUrl(attrs.foto || attrs.gambar, '', 'medium');
                        return {
                            src,
                            alt: attrs.judul || attrs.title || 'Galeri Foto',
                        };
                    }).filter((item: TickerItem) => item.src && item.src.trim() !== '');
                }

                if (formatted.length > 0) {
                    const row1: TickerItem[] = [];
                    const row2: TickerItem[] = [];
                    const row3: TickerItem[] = [];

                    formatted.forEach((item, idx) => {
                        if (idx % 3 === 0) row1.push(item);
                        else if (idx % 3 === 1) row2.push(item);
                        else row3.push(item);
                    });

                    // Ensure every non-empty row has items
                    const newTickers: TickerItem[][] = [];
                    if (row1.length > 0) newTickers.push(row1);
                    if (row2.length > 0) newTickers.push(row2);
                    if (row3.length > 0) newTickers.push(row3);

                    setTickers(newTickers);
                }
            } catch (err) {
                console.warn('[TickerGallery] Failed to load tickers:', err);
            } finally {
                setLoading(false);
            }
        }

        loadTickers();
    }, []);

    if (loading || tickers.length === 0) {
        return null; // Cleanly hide if no media available in Strapi instead of displaying hardcoded placeholders
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                {tickers.map((group, i) => (
                    <div key={i} className={styles.ticker}>
                        <ul className={i === 1 ? styles.tickerTrackReverse : styles.tickerTrack}>
                            {(() => {
                                // Pastikan track cukup panjang untuk animasi loop tak terbatas yang mulus
                                let loopItems = [...group];
                                while (loopItems.length < 4 && loopItems.length > 0) {
                                    loopItems = [...loopItems, ...group];
                                }
                                return [...loopItems, ...loopItems];
                            })().map((item, j) => (
                                <li key={`${i}-${j}`} className={styles.tickerItem}>
                                    <div className={styles.item}>
                                        <Image
                                            src={getOptimizedImageUrl(item.src)}
                                            alt={item.alt}
                                            fill
                                            draggable={false}
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

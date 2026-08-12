'use client';

import Image from 'next/image';
import styles from '../styles/TickerGallery.module.css';

type TickerItem = {
    src: string;
    alt: string;
};

const tickers: TickerItem[][] = [
    [
        { src: '/images/hover-1.JPG', alt: 'Documentation 1' },
        { src: 'https://picsum.photos/seed/edu4/600/800', alt: 'Placeholder 4' },
        { src: 'https://picsum.photos/seed/edu7/600/800', alt: 'Placeholder 7' },
        { src: 'https://picsum.photos/seed/edu10/600/800', alt: 'Placeholder 10' },
    ],
    [
        { src: '/images/hover-2.JPG', alt: 'Documentation 2' },
        { src: 'https://picsum.photos/seed/edu5/600/800', alt: 'Placeholder 5' },
        { src: 'https://picsum.photos/seed/edu8/600/800', alt: 'Placeholder 8' },
        { src: 'https://picsum.photos/seed/edu11/600/800', alt: 'Placeholder 11' },
    ],
    [
        { src: '/images/hover-3.HEIC', alt: 'Documentation 3' },
        { src: 'https://picsum.photos/seed/edu6/600/800', alt: 'Placeholder 6' },
        { src: 'https://picsum.photos/seed/edu9/600/800', alt: 'Placeholder 9' },
        { src: 'https://picsum.photos/seed/edu12/600/800', alt: 'Placeholder 12' },
    ],
];

export default function TickerGallery() {
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                {tickers.map((group, i) => (
                    <div key={i} className={styles.ticker}>
                        <ul className={i === 1 ? styles.tickerTrackReverse : styles.tickerTrack}>
                            {/* Duplicate items for infinite scroll effect */}
                            {[...group, ...group].map((item, j) => (
                                <li key={`${i}-${j}`} className={styles.tickerItem}>
                                    <div className={styles.item}>
                                        <Image
                                            src={item.src}
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

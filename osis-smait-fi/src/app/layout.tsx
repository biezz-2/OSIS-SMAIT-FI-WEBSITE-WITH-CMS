import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Great_Vibes, Inter, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LivePreviewListener from "@/components/LivePreviewListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://osissmaitfi.biezz.my.id"),
  title: {
    default: "OSIS SMAIT FI (Agora Acta) | Portal Resmi OSIS SMA IT Fithrah Insani",
    template: "%s | OSIS SMAIT FI",
  },
  description: "Website Resmi OSIS SMA IT Fithrah Insani (OSIS SMAIT FI / Agora Acta) Kab. Bandung Barat. Wadah aspirasi, informasi program kerja, berita acara, dan kepemimpinan siswa.",
  keywords: [
    "osis sma it fi",
    "osis smait fi",
    "OSIS SMA IT Fithrah Insani",
    "OSIS SMAIT Fithrah Insani",
    "osis smait fithrah insani",
    "SMA IT FI",
    "SMAIT FI",
    "SMA IT Fithrah Insani",
    "SMAIT Fithrah Insani",
    "Agora Acta",
    "OSIS Fithrah Insani",
    "OSIS FI",
    "Kegiatan Siswa SMA IT FI",
    "Sekbid OSIS SMA IT Fithrah Insani",
    "SMA IT Fithrah Insani Bandung Barat"
  ],
  authors: [{ name: "OSIS SMAIT Fithrah Insani" }],
  creator: "OSIS SMAIT Fithrah Insani",
  publisher: "SMAIT Fithrah Insani",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-placeholder",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "bing-verification-placeholder",
    },
  },
  openGraph: {
    title: "OSIS SMA IT FI | Portal Resmi OSIS SMAIT Fithrah Insani",
    description: "Website Resmi OSIS SMA IT Fithrah Insani (OSIS SMAIT FI / Agora Acta) Kab. Bandung Barat.",
    siteName: "OSIS SMAIT FI",
    locale: "id_ID",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://osissmaitfi.biezz.my.id",
    images: [
      {
        url: "/images/logo-osis.jpg",
        width: 800,
        height: 800,
        alt: "Logo OSIS SMAIT Fithrah Insani (Agora Acta)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OSIS SMA IT FI | Portal Resmi OSIS SMAIT Fithrah Insani",
    description: "Website Resmi OSIS SMA IT Fithrah Insani (OSIS SMAIT FI / Agora Acta) Kab. Bandung Barat.",
    images: ["/images/logo-osis.jpg"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Agora Acta",
  },
  other: {
    "theme-color": "#2E90FA",
  },
};

import { ImageQualityProvider } from "@/context/ImageQualityContext";
import { fetchBgTextureConfig } from "@/lib/strapi";
import GlobalBgTexture from "@/components/ui/GlobalBgTexture";
import { ClerkProvider } from "@clerk/nextjs";
import MubesSessionBanner from "@/components/mubes/MubesSessionBanner";
import TelemetryTracker from "@/components/telemetry/TelemetryTracker";
import JsonLd from "@/components/seo/JsonLd";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bgTextureConfig = await fetchBgTextureConfig();

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${greatVibes.variable} ${inter.variable} ${cinzel.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://osisstrapi.biezz.my.id" />
        <link rel="dns-prefetch" href="https://osisstrapi.biezz.my.id" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2E90FA" />
      </head>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <MubesSessionBanner />
          <TelemetryTracker />
          <ImageQualityProvider>
            <LivePreviewListener />
            {bgTextureConfig && <GlobalBgTexture config={bgTextureConfig} />}
            {children}
          </ImageQualityProvider>
        </ClerkProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Great_Vibes, Inter, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LivePreviewListener from "@/components/LivePreviewListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://osissmaitfithrahinsani.sch.id"), // sesuaikan domain utama jika ada
  title: {
    default: "OSIS SMAIT Fithrah Insani | Agora Acta",
    template: "%s | OSIS SMAIT Fithrah Insani",
  },
  description: "Website Resmi OSIS SMAIT Fithrah Insani - Kab. Bandung Barat. Wadah aspirasi, informasi program kerja, berita acara, dan kegiatan siswa SMAIT Fithrah Insani.",
  keywords: [
    "OSIS SMAIT Fithrah Insani",
    "osis smait fithrah insani",
    "SMAIT Fithrah Insani",
    "Agora Acta",
    "OSIS Fithrah Insani",
    "Kegiatan Siswa SMAIT Fithrah Insani",
    "Sekbid OSIS SMAIT Fithrah Insani"
  ],
  authors: [{ name: "OSIS SMAIT Fithrah Insani" }],
  openGraph: {
    title: "OSIS SMAIT Fithrah Insani | Agora Acta",
    description: "Website Resmi OSIS SMAIT Fithrah Insani - Kab. Bandung Barat.",
    siteName: "OSIS SMAIT Fithrah Insani",
    locale: "id_ID",
    type: "website",
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


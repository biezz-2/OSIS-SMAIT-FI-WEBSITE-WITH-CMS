import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi & Kegiatan (Preview) | OSIS SMAIT Fithrah Insani (Agora Acta)",
  description: "Eksplorasi dokumentasi visual interaktif, arsip momen kepengurusan dan kegiatan OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.",
  alternates: {
    canonical: "/galeri/galeri-preview-infinity",
  },
  openGraph: {
    title: "Galeri Dokumentasi & Kegiatan (Preview) | OSIS SMAIT Fithrah Insani (Agora Acta)",
    description: "Eksplorasi dokumentasi visual interaktif, arsip momen kepengurusan dan kegiatan OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.",
    url: "/galeri/galeri-preview-infinity",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Galeri Dokumentasi & Kegiatan (Preview) | OSIS SMAIT Fithrah Insani (Agora Acta)",
    description: "Eksplorasi dokumentasi visual interaktif kegiatan OSIS SMAIT Fithrah Insani (Agora Acta).",
  },
};

export default function GaleriPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

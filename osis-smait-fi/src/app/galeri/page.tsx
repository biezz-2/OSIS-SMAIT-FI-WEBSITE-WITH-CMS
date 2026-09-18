import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi & Kegiatan | OSIS SMAIT Fithrah Insani (Agora Acta)",
  description: "Arsip visual, foto dokumentasi kegiatan siswa, kepengurusan, dan agenda OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.",
  alternates: {
    canonical: "/galeri",
  },
  openGraph: {
    title: "Galeri Dokumentasi & Kegiatan | OSIS SMAIT Fithrah Insani (Agora Acta)",
    description: "Arsip visual, foto dokumentasi kegiatan siswa, kepengurusan, dan agenda OSIS SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat.",
    url: "/galeri",
    type: "website",
  },
};

export default function GaleriPage() {
  redirect("/galeri/galeri-preview-infinity");
}

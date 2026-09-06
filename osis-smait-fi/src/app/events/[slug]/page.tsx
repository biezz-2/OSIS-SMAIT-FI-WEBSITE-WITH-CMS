import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchEventBySlug,
  fetchAllEventsForPage,
  getStrapiMediaUrl,
} from "@/lib/strapi";
import EventDetailClient from "@/components/event-detail/event-detail-client";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "18.08.26 7:00 PM";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year} ALL DAY`;
  } catch {
    return "18.08.26 7:00 PM";
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  const attrs = event?.attributes || event;

  const title = attrs?.nama || attrs?.tema || "Detail Event OSIS";
  const desc = attrs?.deskripsi || attrs?.sub_judul || "Informasi dan rincian lengkap acara OSIS SMAIT Fithrah Insani.";

  return {
    title: `${title} | OSIS SMAIT Fithrah Insani`,
    description: desc,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Khusus edufest-infinity: tetap memiliki subsite khusus tersendiri
  if (slug === "edufest-infinity") {
    // Bisa langsung redirect atau biarkan
  }

  const [eventData, allEvents] = await Promise.all([
    fetchEventBySlug(slug),
    fetchAllEventsForPage(),
  ]);

  const attrs = eventData?.attributes || eventData;

  // Judul & Banner fallback ke desain prototipe jika event belum ada di Strapi atau dibuka langsung
  const title = attrs?.nama || attrs?.tema || slug.replace(/-/g, " ").toUpperCase();
  const bannerMedia = attrs?.banner || attrs?.gambar;
  const bannerUrl = getStrapiMediaUrl(bannerMedia, "/images/hero-photo.png");
  const tagline = attrs?.tagline || attrs?.ringkasan || "Perayaan Semangat Kebangsaan & Kebersamaan Generasi Muda";
  const categoryBanner = attrs?.kategori || "LOMBA & FESTIVAL / PANGGUNG SENI / ALL DAY";
  const dateStr = formatDate(attrs?.tanggal_mulai || attrs?.tanggal);
  const ctaUrl = attrs?.cta_url || "#dome";

  const introText = attrs?.deskripsi || attrs?.sub_judul;

  // Galeri / Dome Images dari dokumentasi atau galeri event
  let domeImages: { src: string; alt: string }[] = [];
  const mediaList = attrs?.dokumentasi?.data || attrs?.galeri?.data || attrs?.dokumentasi || attrs?.galeri;
  if (Array.isArray(mediaList) && mediaList.length > 0) {
    domeImages = mediaList.map((m: any, idx: number) => ({
      src: getStrapiMediaUrl(m, "/images/dome-photo.png"),
      alt: `${title} Galeri ${idx + 1}`,
    }));
  }

  // Other Events list (ambil dari events lain, kecualikan current slug)
  const otherEvents = (allEvents || [])
    .filter((e: any) => {
      const eAttrs = e?.attributes || e;
      const eSlug = eAttrs?.slug || "";
      return eSlug !== slug;
    })
    .slice(0, 4)
    .map((e: any) => {
      const eAttrs = e?.attributes || e;
      const eSlug = eAttrs?.slug || "";
      const eBanner = getStrapiMediaUrl(eAttrs?.banner || eAttrs?.gambar, "/images/event-distance.png");
      const eHref = eSlug === "edufest-infinity" ? "/edufest-infinity" : `/events/${eSlug}`;

      return {
        id: e.id || eSlug,
        title: (eAttrs?.nama || eAttrs?.tema || "EVENT").toUpperCase(),
        description: eAttrs?.deskripsi || eAttrs?.ringkasan || eAttrs?.sub_judul || "Rangkaian agenda dan kegiatan siswa OSIS SMAIT Fithrah Insani.",
        image: eBanner,
        href: eHref,
      };
    });

  return (
    <EventDetailClient
      hero={{
        title,
        tagline,
        categoryBanner,
        dateStr,
        bannerUrl,
        ctaUrl,
      }}
      introText={introText}
      domeHeading={title}
      domeImages={domeImages.length > 0 ? domeImages : undefined}
      otherEvents={otherEvents.length > 0 ? otherEvents : undefined}
    />
  );
}

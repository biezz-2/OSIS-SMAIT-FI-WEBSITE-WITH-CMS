import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PrismaHero } from "@/components/ui/prisma-hero";
import HeroLiquidMetal from "@/components/ui/hero-liquid-metal";
import PartnersShowcase from "@/components/partners/PartnersShowcase";
import { fetchHalamanFromStrapi, fetchPartnersFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await fetchHalamanFromStrapi("partners");
    const attrs = pageData?.attributes || pageData || {};

    return {
        title: attrs.seo_title || attrs.judul_hero || "Partners & Kolaborator - OSIS SMAIT Fithrah Insani",
        description:
            attrs.seo_description ||
            attrs.sub_judul ||
            "Halaman resmi kemitraan, pengembang, dan kolaborator strategis OSIS SMAIT Fithrah Insani.",
    };
}

export default async function PartnersPage() {
    const [pageData, partnersList] = await Promise.all([
        fetchHalamanFromStrapi("partners"),
        fetchPartnersFromStrapi(),
    ]);

    const attrs = pageData?.attributes || pageData || {};
    const metadata = attrs.metadata_json || {};

    // Fully Strapi-driven texts with sensible defaults
    const prismaTitle = attrs.judul_hero || "Partners";
    const prismaDesc =
        attrs.sub_judul ||
        "OSIS SMAIT Fithrah Insani membuka kolaborasi dan kemitraan strategis bersama berbagai lembaga, instansi, dan sponsor untuk mewujudkan inovasi serta dampak positif berkelanjutan.";

    const fallbackVideo = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";
    const resolvedUrl = getStrapiMediaUrl(attrs.banner_image || attrs.background_image, fallbackVideo);
    const videoSrc = resolvedUrl.toLowerCase().includes('.mp4') ? resolvedUrl : fallbackVideo;

    const shaderTitle = metadata.shader_title || "Ekosistem Inovasi";
    const shaderSubtitle = metadata.shader_subtitle || "& Pengembang Partner";
    const shaderDesc =
        metadata.shader_description ||
        attrs.deskripsi ||
        "Sinergi teknologi modern dan dedikasi pengembang independen untuk menghadirkan pengalaman platform OSIS yang responsif, terintegrasi, dan berdampak.";
    const shaderTint = metadata.shader_color_tint || "#FA982E";

    const showcaseTitle = metadata.showcase_title || "Partner & Kontributor Utama";
    const showcaseSubtitle =
        metadata.showcase_subtitle ||
        "Para profesional dan pengembang independen di balik infrastruktur digital OSIS SMAIT Fithrah Insani.";

    return (
        <main className="min-h-screen bg-[#0B0F17] text-white flex flex-col justify-between overflow-x-hidden">
            <div>
                <Navbar />

                {/* Hero Section 1: Prisma Hero Video */}
                <PrismaHero
                    title={prismaTitle}
                    description={prismaDesc}
                    buttonText={metadata.hero_button_text || "Gabung Mitra"}
                    videoSrc={videoSrc}
                />

                {/* Seamless Hero-to-Section Gradient Bridge */}
                <div className="relative h-24 -mt-24 bg-gradient-to-b from-transparent to-[#0B0F17] pointer-events-none z-10" />

                {/* Hero Section 2: Liquid Metal Shader */}
                <HeroLiquidMetal
                    srTitle={metadata.shader_sr_title || "Kemitraan Teknis OSIS SMAIT FI"}
                    title={shaderTitle}
                    subtitle={shaderSubtitle}
                    description={shaderDesc}
                    colorTint={shaderTint}
                    colorBack="#00000000"
                    repetition={metadata.shader_repetition ?? 6}
                    softness={metadata.shader_softness ?? 0.8}
                    distortion={metadata.shader_distortion ?? 0.4}
                    speed={metadata.shader_speed ?? 0.9}
                    showBadges={false}
                    ctaProps={{
                        label: metadata.shader_cta_label || "Jelajahi Partner",
                        href: metadata.shader_cta_href || "#partner-list"
                    }}
                />

                {/* Partners Showcase Section */}
                <PartnersShowcase
                    partners={partnersList}
                    title={showcaseTitle}
                    subtitle={showcaseSubtitle}
                />
            </div>

            <Footer />
        </main>
    );
}

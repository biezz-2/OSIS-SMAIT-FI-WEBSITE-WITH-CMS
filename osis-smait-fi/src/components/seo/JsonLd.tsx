import React from "react";

export default function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://osissmaitfi.biezz.my.id";

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "NGO"],
    "@id": `${siteUrl}/#organization`,
    name: "OSIS SMAIT Fithrah Insani",
    alternateName: ["Agora Acta", "OSIS SMA IT FI", "OSIS SMAIT FI"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/logo-osis.jpg`,
      width: 800,
      height: 800,
      caption: "Logo OSIS SMAIT Fithrah Insani (Agora Acta)",
    },
    image: `${siteUrl}/images/logo-osis.jpg`,
    description:
      "Organisasi Siswa Intra Sekolah (OSIS) SMAIT Fithrah Insani (Agora Acta) Kab. Bandung Barat. Wadah aspirasi, informasi program kerja, berita acara, dan kepemimpinan siswa.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. H. Gofur No. 10 Tanimulya",
      addressLocality: "Ngamprah",
      addressRegion: "Jawa Barat",
      postalCode: "40552",
      addressCountry: "ID",
    },
    telephone: "+62-22-87808984",
    email: "osissmaitfi@gmail.com",
    sameAs: [
      "https://www.instagram.com/osissmaitfi",
      "https://www.youtube.com/@osissmaitfithrahinsani9481",
      "https://www.tiktok.com/@osissmaitfi",
      "https://podcasters.spotify.com/pod/show/radiokesehatan-fi",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "OSIS SMAIT FI (Agora Acta)",
    description: "Portal Resmi OSIS SMA IT Fithrah Insani Kab. Bandung Barat",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/berita?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

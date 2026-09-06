"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, ExternalLink, Code2, Users } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import type { PartnerData } from "@/lib/strapi";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

interface PartnersShowcaseProps {
    partners: PartnerData[];
    title?: string;
    subtitle?: string;
}

export default function PartnersShowcase({
    partners,
    title = "Partner & Kontributor Utama",
    subtitle = "Para profesional dan pengembang independen di balik infrastruktur digital OSIS SMAIT Fithrah Insani.",
}: PartnersShowcaseProps) {
    return (
        <section id="partner-list" className="w-full bg-[#0B0F17] py-20 px-4 sm:px-6 lg:px-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2E90FA]/10 border border-[#2E90FA]/30 text-[#2E90FA] text-xs font-medium uppercase tracking-[0.2em] mb-4 shadow-sm">
                        <Users className="w-3.5 h-3.5 text-[#2E90FA]" />
                        Kolaborator Digital
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        {title}
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>

                {/* Partners Grid with HeroUI Card Structure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={partner.id || partner.nama}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full"
                        >
                            <Card isBlurred isHoverable className="group h-full flex flex-col justify-between border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-[#2E90FA]/50">
                                {/* Top Accent Glow Bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E90FA] via-[#FA982E] to-[#FDB022] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

                                <div>
                                    <CardHeader className="flex flex-row items-start gap-4 sm:gap-6 pt-7 px-7">
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2.5px] bg-gradient-to-br from-[#2E90FA] via-[#FA982E] to-[#2E90FA]/30 shadow-lg shadow-[#2E90FA]/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                                            <img
                                                src={partner.avatar_url}
                                                alt={partner.nama}
                                                className="w-full h-full rounded-full object-cover border-2 border-[#0B0F17]"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#FA982E] transition-colors truncate">
                                                {partner.nama}
                                            </h3>
                                            <p className="text-xs sm:text-sm font-medium text-[#70B4FF] mt-1">
                                                {partner.role}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                                {partner.github_url && (
                                                    <a
                                                        href={partner.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-200 text-xs font-medium transition-colors"
                                                        aria-label={`GitHub Profile for ${partner.nama}`}
                                                    >
                                                        <GithubIcon className="w-3.5 h-3.5 text-white" />
                                                        <span>GitHub</span>
                                                    </a>
                                                )}
                                                {partner.website_url && (
                                                    <a
                                                        href={partner.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E90FA]/10 hover:bg-[#2E90FA]/20 border border-[#2E90FA]/30 text-[#70B4FF] text-xs font-medium transition-colors"
                                                        aria-label={`Website for ${partner.nama}`}
                                                    >
                                                        <Globe className="w-3.5 h-3.5 text-[#2E90FA]" />
                                                        <span>Website</span>
                                                        <ExternalLink className="w-3 h-3 text-[#2E90FA]" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="px-7 py-4">
                                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                            {partner.deskripsi}
                                        </p>
                                    </CardBody>
                                </div>

                                {partner.tags && partner.tags.length > 0 && (
                                    <CardFooter className="px-7 py-4 border-t border-white/10 flex flex-wrap gap-2">
                                        {partner.tags.map((tag, tIdx) => {
                                            const isPrimary = tIdx === 0;
                                            return (
                                                <span
                                                    key={tag}
                                                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-3 py-1 rounded-md transition-colors ${isPrimary
                                                        ? "bg-[#2E90FA]/15 text-[#70B4FF] border border-[#2E90FA]/30 font-semibold"
                                                        : "bg-white/5 text-gray-300 border border-white/10"
                                                        }`}
                                                >
                                                    <Code2 className={`w-3 h-3 ${isPrimary ? "text-[#2E90FA]" : "text-[#FA982E]"}`} />
                                                    {tag}
                                                </span>
                                            );
                                        })}
                                    </CardFooter>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

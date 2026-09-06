"use client";

import React, { createContext, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { LiquidMetal, type LiquidMetalProps } from "@paper-design/shaders-react";
import { ArrowRight, Code, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

export interface HeroLiquidMetalTechItem {
    name: string;
    category?: string;
    href?: string;
}

export interface HeroLiquidMetalCTAProps {
    label: string;
    href?: string;
    onClick?: () => void;
    target?: string;
    rel?: string;
}

export interface HeroLiquidMetalShaderOverrides {
    width?: number | string;
    height?: number | string;
    image?: string;
    shape?: "none" | "circle" | "daisy" | "metaballs";
    colorBack?: string;
    colorTint?: string;
    repetition?: number;
    softness?: number;
    shiftRed?: number;
    shiftBlue?: number;
    distortion?: number;
    contour?: number;
    angle?: number;
    speed?: number;
    frame?: number;
    scale?: number;
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    fit?: "contain" | "cover";
    originX?: number;
    originY?: number;
    minPixelRatio?: number;
    maxPixelCount?: number;
}

export interface HeroLiquidMetalRootProps extends HeroLiquidMetalShaderOverrides {
    children?: React.ReactNode;
    srTitle?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    description?: React.ReactNode;
    showCta?: boolean;
    ctaProps?: Partial<HeroLiquidMetalCTAProps>;
    renderCta?: (defaultCta: React.ReactNode) => React.ReactNode;
    showBadges?: boolean;
    techStack?: HeroLiquidMetalTechItem[];
    renderBadge?: (
        tech: HeroLiquidMetalTechItem,
        index: number,
        defaultBadge: React.ReactNode
    ) => React.ReactNode;
    desktopShaderProps?: Partial<LiquidMetalProps>;
    mobileShaderProps?: Partial<LiquidMetalProps>;
    className?: string;
}

const DEFAULT_DESKTOP_SHADER: Partial<LiquidMetalProps> = {
    width: 1280,
    height: 720,
    colorBack: "#00000000",
    colorTint: "#FA982E",
    repetition: 6,
    softness: 0.8,
    shiftRed: 1,
    shiftBlue: -1,
    distortion: 0.4,
    contour: 0.4,
    angle: 0,
    speed: 1,
    scale: 0.6,
    fit: "contain",
};

const DEFAULT_MOBILE_SHADER: Partial<LiquidMetalProps> = {
    width: 1280,
    height: 720,
    colorBack: "#00000000",
    colorTint: "#2E90FA",
    repetition: 5,
    softness: 0.85,
    shiftRed: 0.8,
    shiftBlue: -0.8,
    distortion: 0.35,
    contour: 0.35,
    angle: 45,
    speed: 0.8,
    scale: 0.75,
    fit: "contain",
};

const DEFAULT_TECH_STACK: HeroLiquidMetalTechItem[] = [
    { name: "Next.js 16", category: "Framework", href: "https://nextjs.org" },
    { name: "Strapi CMS", category: "Backend", href: "https://strapi.io" },
    { name: "Tailwind CSS", category: "Styling", href: "https://tailwindcss.com" },
    { name: "TypeScript", category: "Language", href: "https://typescriptlang.org" },
];

interface HeroLiquidMetalContextValue {
    srTitle: string;
    title: React.ReactNode;
    subtitle: React.ReactNode;
    description: React.ReactNode;
    showCta: boolean;
    ctaProps: HeroLiquidMetalCTAProps;
    renderCta?: (defaultCta: React.ReactNode) => React.ReactNode;
    showBadges: boolean;
    techStack: HeroLiquidMetalTechItem[];
    renderBadge?: (
        tech: HeroLiquidMetalTechItem,
        index: number,
        defaultBadge: React.ReactNode
    ) => React.ReactNode;
    desktopShaderProps: LiquidMetalProps;
    mobileShaderProps: LiquidMetalProps;
}

const HeroLiquidMetalContext = createContext<HeroLiquidMetalContextValue | null>(null);

export function useHeroLiquidMetal() {
    const ctx = useContext(HeroLiquidMetalContext);
    if (!ctx) {
        throw new Error("HeroLiquidMetal components must be used within HeroLiquidMetalRoot");
    }
    return ctx;
}

export const HeroLiquidMetalRoot = ({
    children,
    srTitle = "Kemitraan Teknis OSIS",
    title = "Partner Digital",
    subtitle = "& Pengembang Karya",
    description = "Kolaborasi strategis pengembang independen dan kreator teknologi dalam membangun ekosistem digital OSIS SMAIT Fithrah Insani.",
    showCta = true,
    ctaProps,
    renderCta,
    showBadges = true,
    techStack = DEFAULT_TECH_STACK,
    renderBadge,
    desktopShaderProps: desktopOverride = {},
    mobileShaderProps: mobileOverride = {},
    className = "",
    ...rootShaderOverrides
}: HeroLiquidMetalRootProps) => {
    const mergedDesktopShader = useMemo(() => {
        return {
            ...DEFAULT_DESKTOP_SHADER,
            ...rootShaderOverrides,
            ...desktopOverride,
        } as LiquidMetalProps;
    }, [desktopOverride, rootShaderOverrides]);

    const mergedMobileShader = useMemo(() => {
        return {
            ...DEFAULT_MOBILE_SHADER,
            ...rootShaderOverrides,
            ...mobileOverride,
        } as LiquidMetalProps;
    }, [mobileOverride, rootShaderOverrides]);

    const mergedCtaProps = useMemo<HeroLiquidMetalCTAProps>(() => {
        return {
            label: "Jelajahi Partner",
            href: "#partner-list",
            target: "_self",
            ...ctaProps,
        };
    }, [ctaProps]);

    const contextValue = useMemo<HeroLiquidMetalContextValue>(() => {
        return {
            srTitle,
            title,
            subtitle,
            description,
            showCta,
            ctaProps: mergedCtaProps,
            renderCta,
            showBadges,
            techStack,
            renderBadge,
            desktopShaderProps: mergedDesktopShader,
            mobileShaderProps: mergedMobileShader,
        };
    }, [
        srTitle,
        title,
        subtitle,
        description,
        showCta,
        mergedCtaProps,
        renderCta,
        showBadges,
        techStack,
        renderBadge,
        mergedDesktopShader,
        mergedMobileShader,
    ]);

    return (
        <HeroLiquidMetalContext.Provider value={contextValue}>
            <section className={`relative w-full overflow-hidden bg-[#0B0F17] text-white py-16 px-4 sm:px-6 lg:px-12 ${className}`}>
                {children}
            </section>
        </HeroLiquidMetalContext.Provider>
    );
};

export const HeroLiquidMetalContainer = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 relative z-10 ${className}`}>
            {children}
        </div>
    );
};

export const HeroLiquidMetalContent = ({
    children,
    className = "",
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`lg:col-span-7 flex flex-col justify-center text-center lg:text-left gap-6 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export const HeroLiquidMetalHeading = () => {
    const { srTitle, title, subtitle } = useHeroLiquidMetal();
    return (
        <div>
            <span className="sr-only">{srTitle}</span>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FA982E]/10 border border-[#FA982E]/30 text-[#FA982E] text-xs font-semibold uppercase tracking-wider mb-4 self-center lg:self-start"
            >
                <Sparkles className="w-3.5 h-3.5" />
                Kemitraan & Inovasi
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none"
            >
                <span className="block text-white">{title}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FA982E] via-[#FDB022] to-[#2E90FA]">
                    {subtitle}
                </span>
            </motion.h2>
        </div>
    );
};

export const HeroLiquidMetalDescription = () => {
    const { description } = useHeroLiquidMetal();
    return (
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
        >
            {description}
        </motion.p>
    );
};

export const HeroLiquidMetalActions = () => {
    const { showCta, ctaProps, renderCta } = useHeroLiquidMetal();
    if (!showCta) return null;

    const defaultCtaNode = (
        <a
            href={ctaProps.href || "#partner-list"}
            onClick={ctaProps.onClick}
            target={ctaProps.target}
            rel={ctaProps.rel}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FA982E] hover:bg-[#E8850A] text-black font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-[#FA982E]/20 hover:scale-105 cursor-pointer"
        >
            <span>{ctaProps.label}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
        >
            {renderCta ? renderCta(defaultCtaNode) : defaultCtaNode}
        </motion.div>
    );
};

export const HeroLiquidMetalBadges = () => {
    const { showBadges, techStack, renderBadge } = useHeroLiquidMetal();
    if (!showBadges || !techStack.length) return null;

    return (
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
            {techStack.map((tech, idx) => {
                const defaultBadge = (
                    <a
                        key={tech.name}
                        href={tech.href || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium transition-colors"
                    >
                        <Code className="w-3 h-3 text-[#2E90FA]" />
                        <span>{tech.name}</span>
                        {tech.category && (
                            <span className="text-[10px] text-gray-500 uppercase">({tech.category})</span>
                        )}
                    </a>
                );
                return renderBadge ? renderBadge(tech, idx, defaultBadge) : defaultBadge;
            })}
        </div>
    );
};

export const HeroLiquidMetalVisual = () => {
    const { desktopShaderProps } = useHeroLiquidMetal();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="hidden lg:block lg:col-span-5 relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <LiquidMetal {...desktopShaderProps} />
            </div>
        </motion.div>
    );
};

export const HeroLiquidMetalMobileVisual = () => {
    const { mobileShaderProps } = useHeroLiquidMetal();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="block lg:hidden mt-8 relative w-full h-[260px] rounded-xl overflow-hidden border border-white/10 bg-black/40"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <LiquidMetal {...mobileShaderProps} />
            </div>
        </motion.div>
    );
};

export const HeroLiquidMetal = (props: HeroLiquidMetalRootProps) => {
    return (
        <HeroLiquidMetalRoot {...props}>
            <HeroLiquidMetalContainer>
                <HeroLiquidMetalContent>
                    <HeroLiquidMetalHeading />
                    <HeroLiquidMetalDescription />
                    <HeroLiquidMetalActions />
                    <HeroLiquidMetalBadges />
                </HeroLiquidMetalContent>
                <HeroLiquidMetalVisual />
            </HeroLiquidMetalContainer>
            <HeroLiquidMetalMobileVisual />
        </HeroLiquidMetalRoot>
    );
};

export default HeroLiquidMetal;

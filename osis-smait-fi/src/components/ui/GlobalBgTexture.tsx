"use client";

import { usePathname } from "next/navigation";
import { BackgroundImageTexture, TextureVariant } from "./bg-image-texture";

export interface BgTextureConfigData {
  enabled: boolean;
  variant: TextureVariant;
  opacity: number;
  custom_bg_texture_url?: string;
  applied_routes: string;
}

interface GlobalBgTextureProps {
  config: BgTextureConfigData;
}

export function isRouteMatched(currentPath: string, configuredRoutes: string): boolean {
  if (!configuredRoutes) return false;

  const routes = configuredRoutes
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  return routes.some((pattern) => {
    // If pattern is exactly * or ** or /* or /**, match everything
    if (pattern === "*" || pattern === "/*" || pattern === "**" || pattern === "/**") {
      return true;
    }

    // Normalize path and pattern by stripping trailing slash
    const normPath = currentPath.replace(/\/$/, "") || "/";
    const normPattern = pattern.replace(/\/$/, "") || "/";

    if (normPattern.includes("*")) {
      const regexPattern =
        "^" +
        normPattern
          .replace(/\//g, "\\/")
          .replace(/\*\*/g, ".*")
          .replace(/\*/g, ".*") +
        "$";
      return new RegExp(regexPattern).test(normPath);
    }

    return normPath === normPattern;
  });
}

export default function GlobalBgTexture({ config }: GlobalBgTextureProps) {
  const pathname = usePathname();

  if (!config.enabled) return null;

  const matched = isRouteMatched(pathname, config.applied_routes);
  if (!matched) return null;

  return (
    <BackgroundImageTexture
      variant={config.variant}
      opacity={config.opacity}
      customTextureUrl={config.custom_bg_texture_url}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

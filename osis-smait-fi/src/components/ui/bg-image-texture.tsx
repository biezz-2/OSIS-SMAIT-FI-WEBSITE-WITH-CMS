import * as React from "react"
import { cn } from "@/lib/utils"

export type TextureVariant =
  | "subtle-noise"
  | "dot-matrix"
  | "gradient-glow"
  | "fabric-of-squares"
  | "grid-noise"
  | "inflicted"
  | "debut-light"
  | "groovepaper"
  | "none"

interface BackgroundImageTextureProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TextureVariant
  opacity?: number
  customTextureUrl?: string
  children?: React.ReactNode
}

const SVG_NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"

const textureStyles: Record<Exclude<TextureVariant, "none">, React.CSSProperties> = {
  "subtle-noise": {
    backgroundImage: SVG_NOISE_DATA_URI,
    backgroundRepeat: "repeat",
  },
  "dot-matrix": {
    backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    backgroundRepeat: "repeat",
  },
  "gradient-glow": {
    background:
      "radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(147, 51, 234, 0.08) 0px, transparent 50%)",
  },
  "fabric-of-squares": {
    backgroundImage: "url(https://www.transparenttextures.com/patterns/fabric-of-squares.png)",
    backgroundRepeat: "repeat",
  },
  "grid-noise": {
    backgroundImage: "url(https://www.transparenttextures.com/patterns/grid-noise.png)",
    backgroundRepeat: "repeat",
  },
  "inflicted": {
    backgroundImage: "url(https://www.transparenttextures.com/patterns/inflicted.png)",
    backgroundRepeat: "repeat",
  },
  "debut-light": {
    backgroundImage: "url(https://www.transparenttextures.com/patterns/debut-light.png)",
    backgroundRepeat: "repeat",
  },
  "groovepaper": {
    backgroundImage: "url(https://www.transparenttextures.com/patterns/groovepaper.png)",
    backgroundRepeat: "repeat",
  },
}

export function BackgroundImageTexture({
  variant = "subtle-noise",
  opacity = 0.5,
  customTextureUrl,
  className,
  children,
  ...props
}: BackgroundImageTextureProps) {
  let style: React.CSSProperties | null = null

  if (customTextureUrl) {
    style = {
      backgroundImage: `url(${customTextureUrl})`,
      backgroundRepeat: "repeat",
      opacity,
    }
  } else if (variant !== "none" && textureStyles[variant]) {
    style = {
      ...textureStyles[variant],
      opacity,
    }
  }

  return (
    <div className={cn("relative z-0", className)} {...props}>
      {style && (
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={style}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}

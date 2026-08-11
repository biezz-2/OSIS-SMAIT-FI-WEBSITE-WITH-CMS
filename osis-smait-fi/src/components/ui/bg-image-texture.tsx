import * as React from "react"
import { cn } from "@/lib/utils"

export type TextureVariant =
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

const textureUrls: Record<Exclude<TextureVariant, "none">, string> = {
  "fabric-of-squares": "https://www.transparenttextures.com/patterns/fabric-of-squares.png",
  "grid-noise": "https://www.transparenttextures.com/patterns/grid-noise.png",
  "inflicted": "https://www.transparenttextures.com/patterns/inflicted.png",
  "debut-light": "https://www.transparenttextures.com/patterns/debut-light.png",
  "groovepaper": "https://www.transparenttextures.com/patterns/groovepaper.png",
}

export function BackgroundImageTexture({
  variant = "fabric-of-squares",
  opacity = 0.5,
  customTextureUrl,
  className,
  children,
  ...props
}: BackgroundImageTextureProps) {
  let bgImageUrl = ""

  if (customTextureUrl) {
    bgImageUrl = `url(${customTextureUrl})`
  } else if (variant !== "none") {
    bgImageUrl = `url(${textureUrls[variant]})`
  }

  return (
    <div className={cn("relative z-0", className)} {...props}>
      {bgImageUrl && (
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: bgImageUrl,
            opacity: opacity,
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}

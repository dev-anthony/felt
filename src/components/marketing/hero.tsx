"use client"

import * as React from "react"
import { ArrowRight, Play } from "lucide-react"
import { ArtTile } from "./art-tile"

interface HeroProps {
  onGetStarted: () => void
}

/**
 * Layout inspired by the Qlick reference (large headline, floating artwork,
 * generous whitespace, editorial composition) reinterpreted in FELT's own
 * dark palette rather than copied — "keep FELT branding" per the redesign
 * brief. The floating stack uses the abstract ArtTile gradients (see
 * art-tile.tsx) rather than real screenshots, since no generated-cover assets
 * exist to show honestly.
 */
export function Hero({ onGetStarted }: HeroProps) {
  const stackRef = React.useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stackRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: px * 8, y: py * -8 })
  }
  const resetTilt = () => setTilt({ x: 0, y: 0 })

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Subtle background grid, referenced by both moodboards */}
      <div
        className="absolute inset-0 z-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-accent/10 blur-[160px] rounded-full" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        {/* Copy column */}
        <div className="reveal text-center lg:text-left">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent block mb-6">
            Cover Art, Listened Into Existence
          </span>
          <h1 className="font-display italic font-medium text-5xl sm:text-6xl md:text-7xl leading-[1.03] tracking-wide text-balance mb-8">
            Your music,<br />made visible.
          </h1>
          <p className="max-w-lg mx-auto lg:mx-0 text-muted-foreground text-sm sm:text-base leading-relaxed mb-10">
            Upload a track. FELT listens to its tempo, mood and texture, then builds
            cover art that feels like the record you actually made — not a generic
            prompt guess.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-10">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors cursor-pointer rounded-full"
            >
              Get Started
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>

        {/* Floating artwork stack */}
        <div
          ref={stackRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          className="reveal relative aspect-square w-full max-w-md mx-auto [perspective:1200px]"
          style={{ animationDelay: "150ms" }}
        >
          <div
            className="relative w-full h-full transition-transform duration-300 ease-out"
            style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
          >
            <ArtTile
              palette="nostalgia"
              label="Warm / Nostalgic"
              className="absolute inset-x-8 top-10 bottom-16 shadow-2xl shadow-black/50 -rotate-6"
            />
            <ArtTile
              palette="euphoria"
              label="High Energy"
              className="absolute inset-x-4 top-4 bottom-20 shadow-2xl shadow-black/50 rotate-3 scale-[1.02]"
            />
            <ArtTile
              palette="cerebral"
              label="Cerebral"
              className="absolute inset-x-12 top-16 bottom-8 shadow-2xl shadow-black/60 -rotate-2 translate-y-2"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

/**
 * Abstract, generative-style art tiles used across the marketing pages in
 * place of "real" cover-art screenshots.
 *
 * No product screenshots of generated covers exist as static assets, and
 * fabricating a fake one to pass off as real output would misrepresent what
 * the product does. These tiles are honestly abstract instead: CSS gradients
 * whose palettes are drawn from FELT's own emotional archetypes (see
 * felt-backend/src/engine/emotion/archetypes) plus a cheap SVG grain filter
 * for texture, so they read as "mood," never as a specific rendered cover.
 */

const PALETTES = {
  // Melancholy — cold slate over near-black.
  melancholy: "from-[#1a1d1f] via-[#2b3038] to-[#0a0a0a]",
  // Nostalgia — faded amber and dust.
  nostalgia: "from-[#3a2e22] via-[#6b4f36] to-[#1c1610]",
  // Euphoria — hot magenta/cyan club light.
  euphoria: "from-[#3d1a4a] via-[#a4327a] to-[#0d2b3d]",
  // Cerebral — cool structural grey.
  cerebral: "from-[#232323] via-[#3a3f42] to-[#111214]",
  // Transcendence — warm gold horizon.
  transcendence: "from-[#4a3a1e] via-[#8a6a34] to-[#141210]",
  // Primal — deep earth and fire.
  primal: "from-[#2e160e] via-[#6b3420] to-[#0d0806]",
} as const

export type ArtPalette = keyof typeof PALETTES

interface ArtTileProps {
  palette: ArtPalette
  className?: string
  /** Optional short label rendered in the corner, mono/uppercase. */
  label?: string
}

export function ArtTile({ palette, className = "", label }: ArtTileProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${PALETTES[palette]} ${className}`}
      aria-hidden="true"
    >
      {/* Cheap grain texture via SVG turbulence — no image asset needed. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay" aria-hidden="true">
        <filter id={`grain-${palette}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${palette})`} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />
      {label && (
        <span className="absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/50">
          {label}
        </span>
      )}
    </div>
  )
}

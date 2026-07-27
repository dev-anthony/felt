import { Reveal } from "./reveal"
import { ArtTile, type ArtPalette } from "./art-tile"

interface ShowcaseProps {
  reverse?: boolean
  eyebrow: string
  title: string
  copy: string
  points: string[]
  palette: ArtPalette
  tileLabel: string
}

/** Large alternating editorial section — used for both the Visual DNA Engine
 * and the music-analysis explainer, with the image side flipped between the
 * two so the page doesn't read as one repeating template. */
export function Showcase({ reverse, eyebrow, title, copy, points, palette, tileLabel }: ShowcaseProps) {
  return (
    <section className="py-24 px-6 border-t border-border overflow-hidden">
      <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Reveal className="relative aspect-[4/3] w-full">
          <ArtTile palette={palette} label={tileLabel} className="absolute inset-0 shadow-2xl shadow-black/40" />
        </Reveal>

        <Reveal delayMs={100}>
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight mb-5 text-balance">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">{copy}</p>
          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-xs text-muted-foreground/90">
                <span className="mt-1.5 size-1 rounded-full bg-accent shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

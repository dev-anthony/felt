import { Reveal } from "./reveal"

/**
 * Visual section detailing the research frameworks behind the emotional model.
 * Replaces traditional logo rows with verified research models.
 */
const FOUNDATIONS = [
  { label: "DEAM", detail: "1,802 songs mapped to human valence and arousal ratings" },
  { label: "GEMS", detail: "Geneva Emotional Music Scale framework" },
  { label: "Essentia.js", detail: "In-browser audio feature extraction" },
  { label: "Visual DNA", detail: "144-cell emotional archetype matrix" },
]

export function GroundedIn() {
  return (
    <section className="py-16 px-6 border-t border-border">
      <Reveal className="max-w-5xl mx-auto text-center">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground/70 mb-8">
          Built on music cognition research
        </p>
        <div className="grid grid-cols-2 md:md:grid-cols-4 gap-6">
          {FOUNDATIONS.map((f) => (
            <div key={f.label} className="space-y-1">
              <div className="font-display italic text-lg text-foreground/80">{f.label}</div>
              <div className="font-mono text-[9px] text-muted-foreground/60 leading-snug">{f.detail}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
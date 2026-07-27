import { Reveal } from "./reveal"

/**
 * Honest substitute for a "Trusted By" logo row. FELT has no real customer
 * logos to display yet, and fabricating some would misrepresent the product
 * as more established than it is. What's genuinely true instead: the
 * emotional model is grounded in published research (DEAM, GEMS/BRECVEMA),
 * not vibes — so that's what earns the same visual beat here.
 */
const FOUNDATIONS = [
  { label: "DEAM", detail: "1,802 songs, human valence/arousal ratings" },
  { label: "GEMS", detail: "Geneva Emotional Music Scale" },
  { label: "Essentia.js", detail: "on-device audio feature extraction" },
  { label: "Visual DNA", detail: "144-cell emotional archetype matrix" },
]

export function GroundedIn() {
  return (
    <section className="py-16 px-6 border-t border-border">
      <Reveal className="max-w-5xl mx-auto text-center">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground/70 mb-8">
          Grounded in real research, not guesswork
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

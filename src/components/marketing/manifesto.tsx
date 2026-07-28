import { Reveal } from "./reveal"

/**
 * Occupies the position a "Testimonials" section would in the roadmap's
 * homepage structure. Deliberately not fabricated customer quotes: FELT has
 * no real testimonials yet, and inventing named people with fake avatars and
 * fake endorsements would be fabricated social proof on a real product page,
 * not a mockup. This carries the same emotional weight honestly instead — the
 * platform's own founding thesis, stated plainly.
 */
export function Manifesto() {
  return (
    <section className="py-28 px-6 border-t border-border text-center">
      <Reveal className="max-w-3xl mx-auto space-y-6">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent block">
          The founding idea
        </span>
        <p className="font-display italic font-medium text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-balance">
          Feeling is primary.<br />Sound is the vehicle.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto pt-2">
          Every track feels like something before it means anything. FELT was built to
          catch that feeling directly from the audio — not from a text box asking you
          to describe your own music back to yourself.
        </p>
      </Reveal>
    </section>
  )
}

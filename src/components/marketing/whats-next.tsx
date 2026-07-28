import { Clapperboard, Package } from "lucide-react"
import { Reveal } from "./reveal"

/**
 * Honest home for the two capabilities the roadmap describes but that don't
 * exist yet: beat-synced motion video export (Task 2) and physical album
 * packaging/post-processing (Task 6). Presented plainly as "in development"
 * rather than folded into the feature cards as if shipping — the distinction
 * matters more on a real product page than it does in an internal roadmap.
 */
const UPCOMING = [
  {
    icon: Clapperboard,
    title: "Motion video export",
    copy: "Beat-synced visualisers for YouTube, Reels and TikTok — built from the same audio analysis that drives your cover art.",
  },
  {
    icon: Package,
    title: "Full album packaging",
    copy: "Film grain, print textures, gatefold layouts and back-cover generation — real album production, not just a square image.",
  },
]

export function WhatsNext() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-14 text-center max-w-xl mx-auto">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            In development
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
            Cover art is the beginning, not the ceiling.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {UPCOMING.map((item, i) => (
            <Reveal
              key={item.title}
              delayMs={i * 80}
              className="relative p-8 rounded-2xl border border-dashed border-border bg-foreground/[0.015] space-y-4"
            >
              <item.icon className="size-5 text-muted-foreground/70" strokeWidth={1.5} />
              <h3 className="font-display italic text-lg">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

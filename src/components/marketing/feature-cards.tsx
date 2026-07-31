import { BrainCircuit, Fingerprint, Camera, ImageUp, Shapes, Palette } from "lucide-react"
import { Reveal } from "./reveal"

/**
 * Six real, shipped capabilities. No filler, no vaporware.
 */
const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Sonic analysis",
    copy: "We strip down your audio before touching a prompt, reading everything from vocal tone to spectral texture.",
  },
  {
    icon: Fingerprint,
    title: "Visual DNA engine",
    copy: "Twelve core emotional archetypes mapped against a dataset of 1,802 human-rated tracks. Real music psychology, zero guessing.",
  },
  {
    icon: Camera,
    title: "Photographic direction",
    copy: "Camera setup, lens choice, film stock, and lighting map directly to your track's energy. No generic AI render look.",
  },
  {
    icon: ImageUp,
    title: "Reference images",
    copy: "Drop in a photo, moodboard snippet, or press shot. FELT pulls composition and color without copy-pasting the image.",
  },
  {
    icon: Shapes,
    title: "Symbol library",
    copy: "A targeted vocabulary of visual metaphors that shift and react depending on the underlying mood of your track.",
  },
  {
    icon: Palette,
    title: "Medium routing",
    copy: "Photography, analog illustration, or 3D render. The sound dictates the medium instead of defaulting to one style.",
  },
]

export function FeatureCards() {
  return (
    <section id="features" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 max-w-xl">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
            The tech behind the art
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.title}
              delayMs={i * 60}
              className="group relative p-7 rounded-2xl border border-border bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-accent/40 transition-all duration-300 space-y-4"
            >
              <f.icon className="size-5 text-accent transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
              <h3 className="font-display italic text-lg">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
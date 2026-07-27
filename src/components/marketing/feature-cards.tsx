import { BrainCircuit, Fingerprint, Camera, ImageUp, Shapes, Palette } from "lucide-react"
import { Reveal } from "./reveal"

/**
 * Six real, shipped capabilities — deliberately not eight or ten. Padding this
 * out with the video generator or album packaging would misrepresent features
 * that don't exist yet as live.
 */
const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Sonic analysis",
    copy: "Tempo, energy, valence, brightness and key are extracted directly from the waveform — on-device, before anything is generated.",
  },
  {
    icon: Fingerprint,
    title: "Visual DNA engine",
    copy: "Twelve emotional archetypes, each calibrated against a published dataset of 1,802 human-rated songs — not a hand-tuned guess.",
  },
  {
    icon: Camera,
    title: "Real photographic direction",
    copy: "Camera, lens, film stock and lighting are chosen deterministically from the music, then held to a believability pass that fights the generic-AI-art look.",
  },
  {
    icon: ImageUp,
    title: "Reference images",
    copy: "Upload a photo, moodboard crop or press shot. FELT draws composition and palette from it without simply copying the content.",
  },
  {
    icon: Shapes,
    title: "Symbol library",
    copy: "A researched vocabulary of visual metaphors — not just a colour palette — staged differently depending on the mood of the track.",
  },
  {
    icon: Palette,
    title: "Medium routing",
    copy: "Photography, illustration or CGI — chosen from the track's own texture, not defaulted to one look for everything.",
  },
]

export function FeatureCards() {
  return (
    <section id="features" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 max-w-xl">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            Under the hood
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
            A real engine, not a prompt wrapper.
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

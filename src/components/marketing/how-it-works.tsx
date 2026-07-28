import { Upload, AudioWaveform, Dna, Image as ImageIcon, Video, Download } from "lucide-react"
import { Reveal } from "./reveal"

interface Step {
  icon: typeof Upload
  title: string
  copy: string
  inDevelopment?: boolean
}

const STEPS: Step[] = [
  { icon: Upload, title: "Upload", copy: "Drop an MP3 or WAV — a full song or an instrumental beat." },
  { icon: AudioWaveform, title: "Analyse", copy: "Tempo, energy, key and texture are read directly from the audio." },
  { icon: Dna, title: "Visual DNA", copy: "Those signals route to one of twelve emotional archetypes and a matching photographic direction." },
  { icon: ImageIcon, title: "Artwork", copy: "A cover is generated to match — real photographic language, not a generic AI look." },
  { icon: Video, title: "Motion", copy: "Beat-synced video export.", inDevelopment: true },
  { icon: Download, title: "Export", copy: "Download your cover in the sizes each platform actually needs." },
]

/**
 * Six-step version, not the five the roadmap sketched — the Motion step is
 * kept visible (so the workflow reads honestly, start to finish) but marked
 * "In development" rather than presented as shipping today. See
 * FRONTEND-ROADMAP.md Task 2, deferred pending a real rendering pipeline.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 text-center">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            How FELT works
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
            From a track to a cover, in one pass.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delayMs={i * 60}
              className={`relative p-8 bg-background flex flex-col gap-4 ${step.inDevelopment ? "opacity-70" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground/50">0{i + 1}</span>
                {step.inDevelopment && (
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-accent/80 border border-accent/30 rounded-full px-2 py-0.5">
                    In development
                  </span>
                )}
              </div>
              <step.icon className="size-5 text-accent" strokeWidth={1.5} />
              <h3 className="font-display italic text-xl">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

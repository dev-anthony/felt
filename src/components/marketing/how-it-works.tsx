import { Upload, AudioWaveform, Dna, Image as ImageIcon, Video, Download } from "lucide-react"
import { Reveal } from "./reveal"

interface Step {
  icon: typeof Upload
  title: string
  copy: string
  inDevelopment?: boolean
}

const STEPS: Step[] = [
  { icon: Upload, title: "Upload", copy: "Drop in an MP3 or WAV file, whether it's a finished mix or a raw instrumental beat." },
  { icon: AudioWaveform, title: "Analyse", copy: "Essentia extracts tempo, key signature, dynamic energy, and frequency balance straight from the waveform." },
  { icon: Dna, title: "Visual DNA", copy: "Those metrics route into one of twelve emotional archetypes to set the camera and lighting parameters." },
  { icon: ImageIcon, title: "Artwork", copy: "Your cover generates using real photographic rules, avoiding that washed-out AI look entirely." },
  { icon: Video, title: "Motion", copy: "Beat-synced video loops for visualizers and canvas.", inDevelopment: true },
  { icon: Download, title: "Export", copy: "Grab your artwork ready-formatted for Spotify, Apple Music, and social feeds." },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 text-center">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            How FELT works
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
            From audio track to album art in one pass
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
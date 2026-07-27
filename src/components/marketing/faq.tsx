"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Reveal } from "./reveal"

const FAQS = [
  {
    q: "What audio formats does FELT accept?",
    a: "MP3 and WAV, up to 20MB per track. Both full songs with vocals and instrumental beats are supported through separate pipelines.",
  },
  {
    q: "Does FELT use my lyrics?",
    a: "For vocal tracks, yes — FELT looks up the lyrics first, transcribing directly from the audio only if that lookup fails. Lyric meaning is combined with the audio's emotional read, and if the two genuinely disagree, both are held in tension rather than one silently overriding the other.",
  },
  {
    q: "Can I guide the result?",
    a: "Yes. Beyond the one-sentence description every upload includes, you can optionally select a specific feeling from a researched vocabulary of over a hundred emotions, and/or upload a reference image for the cover to draw its composition and palette from.",
  },
  {
    q: "Is every cover actually different, or just recoloured?",
    a: "Different. The camera, lens, lighting, composition and technique are all selected from the track's own measured features — two songs in the same genre with different tempo or brightness resolve to different visual decisions, not the same template restyled.",
  },
  {
    q: "What does the ₦2,000 plan include?",
    a: "Unlimited generations, the full emotional analysis engine, reference-image conditioning and lyric-aware generation for vocal tracks. There are no separate tiers to choose between.",
  },
]

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <section id="faq" className="py-24 px-6 border-t border-border">
      <div className="max-w-2xl mx-auto">
        <Reveal className="mb-12 text-center">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            Questions
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
            Frequently asked.
          </h2>
        </Reveal>

        <div className="divide-y divide-border border-t border-b border-border">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="font-display italic text-base sm:text-lg group-hover:text-accent transition-colors">
                    {item.q}
                  </span>
                  <Plus
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-45 text-accent" : ""}`}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground leading-relaxed pb-5 pr-8">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

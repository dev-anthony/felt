"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Reveal } from "./reveal"

const FAQS = [
  {
    q: "What audio formats can I upload?",
    a: "We accept MP3 and WAV files up to 20MB. Full vocal tracks and instrumental beats both work using dedicated processing pipelines.",
  },
  {
    q: "How are lyrics used during generation?",
    a: "For tracks with vocals, the system transcribes the lyrics directly from the audio. We combine lyric themes with the audio's emotional profile so both influence the final image.",
  },
  {
    q: "Can I guide the visual direction?",
    a: "Yes. You can add a short context note, select specific emotions from our vocabulary list, or upload a reference image to steer color and composition.",
  },
  {
    q: "Does each track get a unique artwork layout?",
    a: "Yes. Camera selection, lens choices, lighting, and composition derive straight from your track's audio profile. Two songs in the same genre will resolve to different visual parameters.",
  },
  {
    q: "What is included in the ₦2,000 monthly plan?",
    a: "You get unlimited generation runs, full audio analysis access, reference image uploading, and lyric processing on vocal tracks.",
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
            Frequently asked questions
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
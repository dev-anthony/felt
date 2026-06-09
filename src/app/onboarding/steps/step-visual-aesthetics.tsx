"use client"

import * as React from "react"
import { Check, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

const ONBOARDING_AESTHETICS = [
  { id: "a-1", name: "GOLDEN", style: "bg-gradient-to-tr from-amber-950 via-orange-800 to-yellow-400", label: "Blown-out overexposed sunset warmth" },
  { id: "a-2", name: "MIDNIGHT", style: "bg-gradient-to-tr from-neutral-950 via-indigo-950 to-stone-800", label: "Deep ambient late twilight profiles" },
  { id: "a-3", name: "RAW", style: "bg-gradient-to-tr from-zinc-900 via-neutral-800 to-stone-500", label: "Granular unrefined real-world textures" },
  { id: "a-4", name: "SOFT", style: "bg-gradient-to-tr from-stone-800 via-zinc-700/50 to-zinc-200", label: "Muted cinematic low-contrast diffusion" },
  { id: "a-5", name: "FILM", style: "bg-gradient-to-tr from-emerald-950 via-stone-900 to-amber-600/60", label: "Analog organic vintage color shifts" },
  { id: "a-6", name: "COLD", style: "bg-gradient-to-tr from-sky-950 via-slate-900 to-zinc-400", label: "Late-night frozen analytical tones" },
  { id: "a-7", name: "NEON", style: "bg-gradient-to-tr from-purple-950 via-fuchsia-900 to-cyan-400", label: "Cybernetic high-saturation glowing vectors" },
  { id: "a-8", name: "DUST", style: "bg-gradient-to-tr from-amber-950 via-stone-800 to-neutral-400", label: "Lo-fi historical air pocket artifacts" },
  { id: "a-9", name: "CINEMATIC", style: "bg-gradient-to-tr from-neutral-900 via-emerald-950 to-stone-300", label: "Anamorphic wide-gate architectural layout" },
]

interface StepVisualAestheticProps {
  initialValue: string
  onComplete: (data: { defaultAestheticId: string }) => void
  onBack: () => void
}

export function StepVisualAesthetic({ initialValue, onComplete, onBack }: StepVisualAestheticProps) {
  const [selected, setSelected] = React.useState(
    ONBOARDING_AESTHETICS.find((a) => a.id === initialValue) || ONBOARDING_AESTHETICS[0]
  )
  const [currentPage, setCurrentPage] = React.useState(1)

  const itemsPerPage = 3
  const totalPages = Math.ceil(ONBOARDING_AESTHETICS.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAesthetics = ONBOARDING_AESTHETICS.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="min-w-0">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">// Phase 04</span>
        <h3 className="font-display italic text-2xl text-foreground">Visual Signal</h3>
        <p className="font-sans text-xs text-muted-foreground mt-0.5">What does your sound look like? Select a core default profile style matrix.</p>
      </div>

      {/* 16:9 Isolated Preview Canvas Frame */}
      <div className="w-full border border-border/40 relative flex flex-col items-center justify-center overflow-hidden bg-background min-w-0" style={{ aspectRatio: "16/9", maxHeight: "155px" }}>
        <div className={`absolute inset-0 opacity-40 blur-xl scale-110 transition-all duration-500 ${selected.style}`} />
        <div className="relative z-10 text-center space-y-1.5 p-3 w-full max-w-xs mx-auto min-w-0">
          <div className="size-8 mx-auto rounded-none border border-foreground/20 flex items-center justify-center bg-[#0d0d0d] shadow-2xl shrink-0">
            <ImageIcon className="size-3.5 text-muted-foreground stroke-[1.25px]" />
          </div>
          <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 bg-foreground text-background font-bold inline-block max-w-full truncate">
            AESTHETIC: {selected.name}
          </span>
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none gap-4 min-w-0">
          <span className="font-mono text-[8px] text-muted-foreground/60 tracking-wider shrink-0">DESCRIPTOR:</span>
          <span className="font-mono text-[8px] text-accent/80 tracking-wider uppercase truncate text-right block w-full">{selected.label}</span>
        </div>
      </div>

      {/* 3 Column Grid Selection Layer */}
      <div className="space-y-3 min-w-0">
        <div className="grid grid-cols-3 gap-2 w-full min-w-0">
          {paginatedAesthetics.map((item) => {
            const isCurrent = selected.id === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className={`flex flex-col items-center p-1.5 border transition-all relative group min-w-0 w-full ${
                  isCurrent ? "border-accent bg-foreground/[0.02]" : "border-border/30 hover:border-border/80 bg-background"
                }`}
              >
                <div className={`aspect-square w-full relative overflow-hidden mb-1 border border-border/20 shrink-0 ${item.style}`}>
                  {isCurrent && (
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-xs flex items-center justify-center">
                      <Check className="size-4 text-foreground stroke-[3px]" />
                    </div>
                  )}
                </div>
                <span className="font-mono text-[8px] font-bold tracking-wide text-center block truncate w-full">
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Carousel Pagination Hooks */}
        <Pagination className="pt-0.5">
          <PaginationContent className="justify-center gap-1">
            <PaginationItem>
              <Button
                type="button"
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="disabled:opacity-20 border border-border/20 rounded-none h-6 w-6 p-0 text-xs"
              >
                ←
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="font-mono text-[10px] text-muted-foreground px-3 select-none">
                {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                type="button"
                variant="ghost"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="disabled:opacity-20 border border-border/20 rounded-none h-6 w-6 p-0 text-xs"
              >
                →
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Control Action Toolbar */}
      <div className="pt-3.5 flex items-center justify-between gap-3 border-t border-border/20 min-w-0">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4"
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={() => onComplete({ defaultAestheticId: selected.id })}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-5 bg-foreground text-background hover:bg-foreground/90 shrink-0"
        >
          Generate Profile Vector →
        </Button>
      </div>
    </div>
  )
}
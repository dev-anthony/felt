"use client"

import * as React from "react"
import { Check, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

const MOCK_VARIANTS = [
  { id: "v-1", title: "Variant Alpha", details: "Emphasis on dark sub-bass frequencies and structural gloom architecture.", style: "bg-gradient-to-br from-neutral-950 via-stone-900 to-zinc-800" },
  { id: "v-2", title: "Variant Beta", details: "Captures ambient mid-range synth warmth with light film-grain elements.", style: "bg-gradient-to-tr from-neutral-900 via-stone-800 to-neutral-700" },
  { id: "v-3", title: "Variant Gamma", details: "High-contrast geometric focus representing rapid vocal transient shifts.", style: "bg-gradient-to-b from-stone-900 via-zinc-900 to-stone-950" },
]

interface VariantResultsViewProps {
  trackTitle: string
  onSave: (variantId: string) => void
  onRegenerate: () => void
}

export function VariantResultsView({ trackTitle, onSave, onRegenerate }: VariantResultsViewProps) {
  const [selectedVariant, setSelectedVariant] = React.useState(MOCK_VARIANTS[0])
  const [currentPage, setCurrentPage] = React.useState(1)

  // 3 variants per page matching the grid structure of the filter carousel
  const variantsPerPage = 3
  const totalPages = Math.ceil(MOCK_VARIANTS.length / variantsPerPage)
  const startIndex = (currentPage - 1) * variantsPerPage
  const paginatedVariants = MOCK_VARIANTS.slice(startIndex, startIndex + variantsPerPage)

  return (
    <div className="w-full flex flex-col justify-center py-2 bg-transparent min-w-0">
      <div className="w-full max-w-md mx-auto space-y-4 flex flex-col min-w-0">

        <div className="min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Neural Engine Complete
          </span>
          <h3 className="font-display italic text-2xl text-foreground">Select Cover Concept</h3>
        </div>

        {/* Preview frame — Identical layout, scales background styles according to active selection */}
        <div className="w-full border border-border/40 relative flex flex-col items-center justify-center overflow-hidden bg-background min-w-0" style={{ aspectRatio: "16/9", maxHeight: "170px" }}>
          <div className={`absolute inset-0 opacity-40 blur-xl scale-110 transition-all duration-500 ${selectedVariant.style}`} />
          
          <div className="relative z-10 text-center space-y-1.5 p-3 w-full max-w-xs mx-auto min-w-0">
            <div className="size-8 mx-auto rounded-none border border-foreground/20 flex items-center justify-center bg-[#0d0d0d] shadow-2xl shrink-0">
              <Layers className="size-3.5 text-muted-foreground stroke-[1.25px]" />
            </div>
            <p className="font-display italic text-base text-foreground truncate w-full px-2">{trackTitle}</p>
            <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 bg-foreground text-background font-bold inline-block max-w-full truncate">
              Active: {selectedVariant.title}
            </span>
          </div>
          
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none gap-4 min-w-0">
            <span className="font-mono text-[8px] text-muted-foreground/60 tracking-wider shrink-0">DESCRIPTOR:</span>
            <span className="font-mono text-[8px] text-accent/80 tracking-wider uppercase truncate text-right block w-full">{selectedVariant.details}</span>
          </div>
        </div>

        {/* Variant Carousel — 3 column setup exact match */}
        <div className="space-y-3 min-w-0">
          <div className="grid grid-cols-3 gap-2 w-full min-w-0">
            {paginatedVariants.map((variant) => {
              const isCurrent = selectedVariant.id === variant.id
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex flex-col items-center p-1.5 border transition-all relative group min-w-0 w-full ${
                    isCurrent ? "border-accent bg-foreground/[0.02]" : "border-border/30 hover:border-border/80 bg-background"
                  }`}
                >
                  <div className={`aspect-square w-full relative overflow-hidden mb-1 border border-border/20 shrink-0 ${variant.style}`}>
                    {isCurrent && (
                      <div className="absolute inset-0 bg-background/20 backdrop-blur-xs flex items-center justify-center">
                        <Check className="size-4 text-foreground stroke-[3px]" />
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[8px] font-bold tracking-wide text-center block truncate w-full">
                    {variant.title.replace("Variant ", "")} {/* Clean display to keep titles compact like filter items */}
                  </span>
                </button>
              )
            })}
          </div>

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

        {/* Footer actions toolbar matching structural specifications */}
        <div className="pt-3.5 flex items-center justify-end gap-3 border-t border-border/20 min-w-0">
          <span className="font-mono text-[9px] text-muted-foreground mr-auto hidden sm:inline-block truncate">
            * Selected variant concept applied
          </span>
          <Button
            type="button"
            onClick={() => onSave(selectedVariant.id)}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-5 bg-foreground text-background hover:bg-foreground/90 w-full sm:w-auto shrink-0"
          >
            <Layers className="mr-1.5 size-3.5 shrink-0" /> Save To Collection
          </Button>
        </div>

      </div>
    </div>
  )
}
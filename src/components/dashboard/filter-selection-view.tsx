"use client"

import * as React from "react"
import { Check, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

const MOCK_FILTERS = [
  { id: "f-1", name: "NOIR", style: "bg-gradient-to-tr from-neutral-900 via-neutral-700 to-stone-500", label: "High-contrast granular monochrome" },
  { id: "f-2", name: "CHROMA", style: "bg-gradient-to-tr from-purple-900 via-rose-800 to-amber-500", label: "Over-saturated rich thermal tones" },
  { id: "f-3", name: "NEON MINT", style: "bg-gradient-to-tr from-emerald-950 via-teal-800 to-cyan-400", label: "Late-night cybernetic glow profile" },
  { id: "f-4", name: "MUTED SAGE", style: "bg-gradient-to-tr from-zinc-800 via-emerald-900/40 to-stone-300", label: "Organic cinematic lo-fi undertones" },
  { id: "f-5", name: "VELVET DUSK", style: "bg-gradient-to-tr from-indigo-950 via-fuchsia-900 to-orange-400", label: "Deep ambient twilight gradient" },
  { id: "f-6", name: "SOLARIS", style: "bg-gradient-to-tr from-amber-950 via-orange-700 to-yellow-200", label: "Blown-out overexposed warmth" },
]

interface FilterSelectionViewProps {
  trackTitle: string
  onProceed: (filterId: string) => void
}

export function FilterSelectionView({ trackTitle, onProceed }: FilterSelectionViewProps) {
  const [selectedFilter, setSelectedFilter] = React.useState(MOCK_FILTERS[0])
  const [currentPage, setCurrentPage] = React.useState(1)

  const filtersPerPage = 3
  const totalPages = Math.ceil(MOCK_FILTERS.length / filtersPerPage)
  const startIndex = (currentPage - 1) * filtersPerPage
  const paginatedFilters = MOCK_FILTERS.slice(startIndex, startIndex + filtersPerPage)

  return (
    <div className="w-full flex flex-col justify-center py-2 bg-transparent min-w-0">
      <div className="w-full max-w-md mx-auto space-y-4 flex flex-col min-w-0">

        <div className="min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Target Aesthetic Lock
          </span>
          <h3 className="font-display italic text-2xl text-foreground">Select Style Filter</h3>
        </div>

        {/* Preview frame — Added min-w-0 protections and text layout constraints */}
        <div className="w-full border border-border/40 relative flex flex-col items-center justify-center overflow-hidden bg-background min-w-0" style={{ aspectRatio: "16/9", maxHeight: "170px" }}>
          <div className={`absolute inset-0 opacity-40 blur-xl scale-110 transition-all duration-500 ${selectedFilter.style}`} />
          
          <div className="relative z-10 text-center space-y-1.5 p-3 w-full max-w-xs mx-auto min-w-0">
            <div className="size-8 mx-auto rounded-none border border-foreground/20 flex items-center justify-center bg-[#0d0d0d] shadow-2xl shrink-0">
              <ImageIcon className="size-3.5 text-muted-foreground stroke-[1.25px]" />
            </div>
            <p className="font-display italic text-base text-foreground truncate w-full px-2">{trackTitle}</p>
            <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 bg-foreground text-background font-bold inline-block max-w-full truncate">
              Active: {selectedFilter.name}
            </span>
          </div>
          
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none gap-4 min-w-0">
            <span className="font-mono text-[8px] text-muted-foreground/60 tracking-wider shrink-0">DESCRIPTOR:</span>
            <span className="font-mono text-[8px] text-accent/80 tracking-wider uppercase truncate text-right block w-full">{selectedFilter.label}</span>
          </div>
        </div>

        {/* Filter carousel */}
        <div className="space-y-3 min-w-0">
          <div className="grid grid-cols-3 gap-2 w-full min-w-0">
            {paginatedFilters.map((filter) => {
              const isCurrent = selectedFilter.id === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`flex flex-col items-center p-1.5 border transition-all relative group min-w-0 w-full ${
                    isCurrent ? "border-accent bg-foreground/[0.02]" : "border-border/30 hover:border-border/80 bg-background"
                  }`}
                >
                  <div className={`aspect-square w-full relative overflow-hidden mb-1 border border-border/20 shrink-0 ${filter.style}`}>
                    {isCurrent && (
                      <div className="absolute inset-0 bg-background/20 backdrop-blur-xs flex items-center justify-center">
                        <Check className="size-4 text-foreground stroke-[3px]" />
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[8px] font-bold tracking-wide text-center block truncate w-full">
                    {filter.name}
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

        {/* Footer actions toolbar */}
        <div className="pt-3.5 flex items-center justify-end gap-3 border-t border-border/20 min-w-0">
          <span className="font-mono text-[9px] text-muted-foreground mr-auto hidden sm:inline-block truncate">
            * Pre-selected match applied
          </span>
          <Button
            type="button"
            onClick={() => onProceed(selectedFilter.id)}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-5 bg-foreground text-background hover:bg-foreground/90 w-full sm:w-auto shrink-0"
          >
            Looks Right → Proceed
          </Button>
        </div>

      </div>
    </div>
  )
}
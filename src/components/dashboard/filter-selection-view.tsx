"use client"

import * as React from "react"
import { Check, Image as ImageIcon, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// High-fidelity aesthetic style variants mirroring real phone filters
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
  // Pre-select the default filter (NOIR) matching the system audio analysis profile
  const [selectedFilter, setSelectedFilter] = React.useState(MOCK_FILTERS[0])
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const filtersPerPage = 3
  const totalPages = Math.ceil(MOCK_FILTERS.length / filtersPerPage)
  
  // Calculate window segment for pagination page
  const startIndex = (currentPage - 1) * filtersPerPage
  const paginatedFilters = MOCK_FILTERS.slice(startIndex, startIndex + filtersPerPage)

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-h-[520px]">
      
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Target Aesthetic Lock
          </span>
          <h3 className="font-display italic text-2xl text-foreground">Select Style Filter</h3>
        </div>

        {/* Dynamic Upper Layout Frame: Large Phone-Style Image Canvas Window */}
        <div className="aspect-[16/10] w-full border border-border/40 relative flex flex-col items-center justify-center overflow-hidden bg-background">
          {/* Active Background preview simulation wrapper */}
          <div className={`absolute inset-0 opacity-40 blur-xl scale-110 transition-all duration-500 ${selectedFilter.style}`} />
          
          <div className="relative z-10 text-center space-y-2 p-4">
            <div className={`size-12 mx-auto rounded-none border border-foreground/20 flex items-center justify-center bg-[#0d0d0d] shadow-2xl`}>
              <ImageIcon className="size-5 text-muted-foreground stroke-[1.25px]" />
            </div>
            <p className="font-display italic text-lg text-foreground truncate max-w-[320px]">{trackTitle}</p>
            <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 bg-foreground text-background font-bold">
              Active: {selectedFilter.name}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="font-mono text-[8px] text-muted-foreground/60 tracking-wider">AESTHETIC DESCRIPTOR:</span>
            <span className="font-mono text-[8px] text-accent/80 tracking-wider uppercase">{selectedFilter.label}</span>
          </div>
        </div>

        {/* Horizontal Phone-Style Camera Filter Carousel Row */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {paginatedFilters.map((filter) => {
              const isCurrent = selectedFilter.id === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`flex flex-col items-center p-1.5 border transition-all relative group ${
                    isCurrent ? "border-accent bg-foreground/[0.02]" : "border-border/30 hover:border-border/80 bg-background"
                  }`}
                >
                  {/* Thumbnail Thumbnail Box mimicking hardware glass viewports */}
                  <div className={`aspect-square w-full relative overflow-hidden mb-1.5 border border-border/20 ${filter.style}`}>
                    {isCurrent && (
                      <div className="absolute inset-0 bg-background/20 backdrop-blur-xs flex items-center justify-center">
                        <Check className="size-4 text-foreground stroke-[3px]" />
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[9px] font-bold tracking-wide text-center block truncate w-full">
                    {filter.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Custom shadcn Pagination Layout Section */}
          <Pagination className="pt-1">
            <PaginationContent className="justify-center gap-1">
              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="disabled:opacity-20 border border-border/20 rounded-none"
                >
                  ←
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="font-mono text-[10px] text-muted-foreground px-3">
                  {currentPage} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="disabled:opacity-20 border border-border/20 rounded-none"
                >
                  →
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

      </div>

      {/* Persistent Wizard Navigation Control Bar Footer */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20 mt-4">
        <span className="font-mono text-[9px] text-muted-foreground mr-auto hidden sm:inline-block">
          * Pre-selected match applied successfully
        </span>
        <Button
          type="button"
          onClick={() => onProceed(selectedFilter.id)}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 bg-foreground text-background hover:bg-foreground/90"
        >
          Looks Right → Proceed
        </Button>
      </div>

    </div>
  )
}
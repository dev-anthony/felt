"use client"

import * as React from "react"
import { Check, Image as ImageIcon, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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

const AVAILABLE_VARIANTS = [
  { id: "v-1", name: "Variant Alpha", description: "Standard atmospheric distribution" },
  { id: "v-2", name: "Variant Beta", description: "Enhanced micro-detail geometry profile" },
  { id: "v-3", name: "Variant Gamma", description: "Abstract high-contrast generation variant" },
  { id: "v-4", name: "Variant Delta", description: "Subdued organic lighting layout" },
]

interface TuningWorkspaceViewProps {
  trackTitle: string
  initialFilterId: string
  initialVariant: string
  onClose: () => void
  onSaveUpdates: (filterId: string, variantName: string) => void
}

export function TuningWorkspaceView({
  trackTitle,
  initialFilterId,
  initialVariant,
  onClose,
  onSaveUpdates,
}: TuningWorkspaceViewProps) {
  const [selectedFilter, setSelectedFilter] = React.useState(
    MOCK_FILTERS.find((f) => f.id === initialFilterId) || MOCK_FILTERS[0]
  )
  const [selectedVariant, setSelectedVariant] = React.useState(
    AVAILABLE_VARIANTS.find((v) => v.name === initialVariant) || AVAILABLE_VARIANTS[0]
  )

  const [currentPage, setCurrentPage] = React.useState(1)
  const filtersPerPage = 3
  const totalPages = Math.ceil(MOCK_FILTERS.length / filtersPerPage)
  const startIndex = (currentPage - 1) * filtersPerPage
  const paginatedFilters = MOCK_FILTERS.slice(startIndex, startIndex + filtersPerPage)

  const handleApplyChanges = () => {
    onSaveUpdates(selectedFilter.id, selectedVariant.name)
  }

  return (
    /* Removed layout-breaking min-h limits and let layout breathe naturally inside parent dialog bounding boxes */
    <div className="w-full bg-[#121212] flex flex-col p-5 sm:p-6 min-w-0 overflow-hidden">
      <div className="w-full max-w-md mx-auto flex flex-col space-y-4 min-w-0">
        
        {/* Upper Identity Panel */}
        <div className="flex items-center justify-between border-b border-border/20 pb-3 min-w-0 shrink-0">
          <div className="min-w-0 pr-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-0.5">
              // Matrix Alignment Tuner
            </span>
            <h3 className="font-display italic text-xl text-foreground truncate w-full">
              {trackTitle}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none text-muted-foreground hover:text-foreground size-8 shrink-0">
            <X className="size-4" />
          </Button>
        </div>

        {/* Unified Layout Interface Tabs */}
        <Tabs defaultValue="filter" className="w-full flex flex-col min-w-0">
          <TabsList variant="line" className="w-full border-b border-border/20 justify-start rounded-none h-9 p-0 mb-4 shrink-0">
            <TabsTrigger value="filter" className="font-mono text-[10px] tracking-widest uppercase px-4 rounded-none h-full">
              1. Edit Filter
            </TabsTrigger>
            <TabsTrigger value="variant" className="font-mono text-[10px] tracking-widest uppercase px-4 rounded-none h-full">
              2. Edit Variant
            </TabsTrigger>
          </TabsList>

          {/* TAB SEGMENT ONE: STYLE FILTERS */}
          <TabsContent value="filter" className="space-y-4 focus-visible:outline-none mt-0 w-full min-w-0">
            
            {/* Capped Preview Frame displaying layout style definitions explicitly */}
            <div className="w-full border border-border/40 relative flex flex-col items-center justify-center overflow-hidden bg-background min-w-0" style={{ aspectRatio: "16/9", maxHeight: "160px" }}>
              <div className={`absolute inset-0 opacity-40 blur-xl scale-110 transition-all duration-500 ${selectedFilter.style}`} />
              <div className="relative z-10 text-center space-y-1.5 p-3 w-full min-w-0">
                <div className="size-8 mx-auto rounded-none border border-foreground/20 flex items-center justify-center bg-[#0d0d0d] shadow-2xl shrink-0">
                  <ImageIcon className="size-3.5 text-muted-foreground stroke-[1.25px]" />
                </div>
                <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 bg-foreground text-background font-bold inline-block max-w-full truncate">
                  Active Filter: {selectedFilter.name}
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none gap-4 min-w-0">
                <span className="font-mono text-[8px] text-muted-foreground/60 tracking-wider shrink-0">DESCRIPTOR:</span>
                <span className="font-mono text-[8px] text-accent/80 tracking-wider uppercase truncate text-right block w-full">{selectedFilter.label}</span>
              </div>
            </div>

            {/* Selection Carousel Grid Layout */}
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

              {/* Pagination elements layout wrappers */}
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
          </TabsContent>

          {/* TAB SEGMENT TWO: MODEL VARIANTS PICKER */}
          <TabsContent value="variant" className="space-y-2 focus-visible:outline-none mt-0 w-full min-w-0">
            <div className="space-y-1 mb-1 min-w-0">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                Select Render Layout Variant
              </label>
            </div>
            <div className="grid grid-cols-1 gap-1.5 max-h-[240px] overflow-y-auto pr-1">
              {AVAILABLE_VARIANTS.map((variant) => {
                const isSelected = selectedVariant.id === variant.id
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-2.5 text-left border transition-all rounded-none flex items-center justify-between gap-3 min-w-0 w-full ${
                      isSelected
                        ? "bg-[#161616] border-accent text-foreground"
                        : "bg-background border-border/30 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className={`font-mono text-[10px] uppercase tracking-wider block font-bold truncate ${isSelected ? "text-accent" : "text-foreground"}`}>
                        {variant.name}
                      </span>
                      <span className="font-sans text-[11px] text-muted-foreground block truncate">
                        {variant.description}
                      </span>
                    </div>
                    {isSelected && <Check className="size-3.5 text-accent stroke-[2.5px] shrink-0" />}
                  </button>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action ribbon footer toolbar options */}
        <div className="pt-3.5 flex items-center justify-end gap-3 border-t border-border/20 min-w-0 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-9 px-4"
          >
            Discard
          </Button>
          <Button
            type="button"
            onClick={handleApplyChanges}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-9 px-5 bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 shrink-0"
          >
            <Save className="size-3.5" /> Save Configuration
          </Button>
        </div>

      </div>
    </div>
  )
}
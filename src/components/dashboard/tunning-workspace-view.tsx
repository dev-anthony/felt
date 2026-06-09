"use client"

import * as React from "react"
import { Check, Image as ImageIcon, Save } from "lucide-react"
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
  { id: "v-1", name: "Variant Alpha", description: "Standard atmospheric distribution", style: "bg-gradient-to-br from-neutral-950 via-stone-900 to-zinc-800" },
  { id: "v-2", name: "Variant Beta", description: "Enhanced micro-detail geometry profile", style: "bg-gradient-to-tr from-neutral-900 via-stone-800 to-neutral-700" },
  { id: "v-3", name: "Variant Gamma", description: "Abstract high-contrast generation variant", style: "bg-gradient-to-b from-stone-900 via-zinc-900 to-stone-950" },
  { id: "v-4", name: "Variant Delta", description: "Subdued organic lighting layout", style: "bg-gradient-to-br from-zinc-900 via-neutral-950 to-stone-900" },
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

  // Isolated pagination systems to prevent container expanding/collapsing layout shifts
  const [currentFilterPage, setCurrentFilterPage] = React.useState(1)
  const [currentVariantPage, setCurrentVariantPage] = React.useState(1)
  
  const itemsPerPage = 3

  // Filter computations
  const totalFilterPages = Math.ceil(MOCK_FILTERS.length / itemsPerPage)
  const filterStartIndex = (currentFilterPage - 1) * itemsPerPage
  const paginatedFilters = MOCK_FILTERS.slice(filterStartIndex, filterStartIndex + itemsPerPage)

  // Variant computations
  const totalVariantPages = Math.ceil(AVAILABLE_VARIANTS.length / itemsPerPage)
  const variantStartIndex = (currentVariantPage - 1) * itemsPerPage
  const paginatedVariants = AVAILABLE_VARIANTS.slice(variantStartIndex, variantStartIndex + itemsPerPage)

  const handleApplyChanges = () => {
    onSaveUpdates(selectedFilter.id, selectedVariant.name)
  }

  return (
    <div className="w-full bg-[#121212] flex flex-col  px-4 py-2 min-w-0 overflow-hidden">
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
            {/* Filter Frame Preview */}
            <div className="w-full border border-border/40 relative flex flex-col items-center justify-center overflow-hidden bg-background min-w-0" style={{ aspectRatio: "16/9", maxHeight: "160px" }}>
              <div className={`absolute inset-0 opacity-40 blur-xl scale-110 transition-all duration-500 ${selectedFilter.style}`} />
              <div className="relative z-10 text-center space-y-1.5 p-3 w-full max-w-xs mx-auto min-w-0">
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

              {/* Filter Pagination Controls */}
              <Pagination className="pt-0.5">
                <PaginationContent className="justify-center gap-1">
                  <PaginationItem>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={currentFilterPage === 1}
                      onClick={() => setCurrentFilterPage(prev => Math.max(prev - 1, 1))}
                      className="disabled:opacity-20 border border-border/20 rounded-none h-6 w-6 p-0 text-xs"
                    >
                      ←
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="font-mono text-[10px] text-muted-foreground px-3 select-none">
                      {currentFilterPage} / {totalFilterPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={currentFilterPage === totalFilterPages}
                      onClick={() => setCurrentFilterPage(prev => Math.min(prev + 1, totalFilterPages))}
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
          <TabsContent value="variant" className="space-y-4 focus-visible:outline-none mt-0 w-full min-w-0">
            {/* Variant Frame Preview — Exactly mirroring the aspect ratios and styling of the filter view */}
            <div className="w-full border border-border/40 relative flex flex-col items-center justify-center overflow-hidden bg-background min-w-0" style={{ aspectRatio: "16/9", maxHeight: "160px" }}>
              <div className={`absolute inset-0 opacity-40 blur-xl scale-110 transition-all duration-500 ${selectedVariant.style || 'bg-neutral-900'}`} />
              <div className="relative z-10 text-center space-y-1.5 p-3 w-full max-w-xs mx-auto min-w-0">
                <div className="size-8 mx-auto rounded-none border border-foreground/20 flex items-center justify-center bg-[#0d0d0d] shadow-2xl shrink-0">
                  <ImageIcon className="size-3.5 text-muted-foreground stroke-[1.25px]" />
                </div>
                <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 bg-foreground text-background font-bold inline-block max-w-full truncate">
                  Active Variant: {selectedVariant.name}
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none gap-4 min-w-0">
                <span className="font-mono text-[8px] text-muted-foreground/60 tracking-wider shrink-0">DESCRIPTOR:</span>
                <span className="font-mono text-[8px] text-accent/80 tracking-wider uppercase truncate text-right block w-full">{selectedVariant.description}</span>
              </div>
            </div>

            {/* Variant Selection Carousel — Identical 3 column setup */}
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
                      <div className={`aspect-square w-full relative overflow-hidden mb-1 border border-border/20 shrink-0 ${variant.style || 'bg-neutral-800'}`}>
                        {isCurrent && (
                          <div className="absolute inset-0 bg-background/20 backdrop-blur-xs flex items-center justify-center">
                            <Check className="size-4 text-foreground stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[8px] font-bold tracking-wide text-center block truncate w-full">
                        {variant.name.replace("Variant ", "")}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Variant Pagination Controls */}
              <Pagination className="pt-0.5">
                <PaginationContent className="justify-center gap-1">
                  <PaginationItem>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={currentVariantPage === 1}
                      onClick={() => setCurrentVariantPage(prev => Math.max(prev - 1, 1))}
                      className="disabled:opacity-20 border border-border/20 rounded-none h-6 w-6 p-0 text-xs"
                    >
                      ←
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="font-mono text-[10px] text-muted-foreground px-3 select-none">
                      {currentVariantPage} / {totalVariantPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={currentVariantPage === totalVariantPages}
                      onClick={() => setCurrentVariantPage(prev => Math.min(prev + 1, totalVariantPages))}
                      className="disabled:opacity-20 border border-border/20 rounded-none h-6 w-6 p-0 text-xs"
                    >
                      →
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action ribbon footer toolbar */}
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
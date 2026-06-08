"use client"

import * as React from "react"
import { Check, Download, RefreshCw, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

// High-fidelity conceptual artwork variations matched to user's track signature
const MOCK_VARIANTS = [
  { id: "v-1", title: "Variant Alpha", details: "Emphasis on dark sub-bass frequencies and structural gloom architecture.", style: "bg-gradient-to-br from-neutral-950 via-stone-900 to-zinc-800" },
  { id: "v-2", title: "Variant Beta", details: "Captures ambient mid-range synth warmth with light film-grain elements.", style: "bg-gradient-to-tr from-neutral-900 via-stone-800 to-neutral-700" },
  { id: "v-3", title: "Variant Gamma", details: "High-contrast geometric focus representing rapid vocal transient shifts.", style: "bg-gradient-to-b from-stone-900 via-zinc-900 to-stone-950" },
]

interface VariantResultsViewProps {
  onSave: (variantId: string) => void
  onRegenerate: () => void
}

export function VariantResultsView({ onSave, onRegenerate }: VariantResultsViewProps) {
  const [selectedVariantId, setSelectedVariantId] = React.useState(MOCK_VARIANTS[0].id)

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-h-[500px]">
      
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Neural Engine Complete
          </span>
          <h3 className="font-display italic text-2xl text-foreground">Select Cover Concept</h3>
        </div>

        {/* 3-Card Interactive Image Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_VARIANTS.map((variant) => {
            const isSelected = selectedVariantId === variant.id
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={`flex flex-col text-left p-2 border transition-all duration-200 relative group rounded-none bg-background ${
                  isSelected ? "border-accent ring-1 ring-accent/30" : "border-border/40 hover:border-border"
                }`}
              >
                {/* Simulated Image Display Frame */}
                <div className={`aspect-square w-full relative overflow-hidden mb-3 border border-border/10 ${variant.style}`}>
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[8px] text-white/80">
                    FLUX_V1
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 size-5 bg-accent text-background flex items-center justify-center rounded-none shadow-md">
                      <Check className="size-3.5 stroke-[3px]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 px-1">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-foreground">
                    {variant.title}
                  </p>
                  <p className="font-sans text-[11px] text-muted-foreground/80 leading-normal line-clamp-2">
                    {variant.details}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Primary Action Command Ribbon Footer */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/20 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onRegenerate}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4 w-full sm:w-auto border-border/40"
        >
          <RefreshCw className="mr-1.5 size-3" /> Re-roll Variants
        </Button>

        <Button
          type="button"
          onClick={() => onSave(selectedVariantId)}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90"
        >
          <Layers className="mr-1.5 size-3.5" /> Save To Collection
        </Button>
      </div>

    </div>
  )
}
"use client"

import * as React from "react"
import { Loader2, Sparkles } from "lucide-react"

interface ArtGenerationViewProps {
  onComplete: () => void
}

export function ArtGenerationView({ onComplete }: ArtGenerationViewProps) {
  React.useEffect(() => {
    // Simulate generation latency (e.g. 5 seconds for UI demonstration)
    const timeout = setTimeout(() => {
      onComplete()
    }, 5000)
    return () => clearTimeout(timeout)
  }, [onComplete])

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 min-h-[450px] text-center space-y-4">
      <div className="relative size-14 flex items-center justify-center">
        <div className="absolute inset-0 rounded-none border border-accent/30 animate-spin [animation-duration:3s]" />
        <Sparkles className="size-6 text-accent animate-pulse" />
      </div>
      
      <div className="space-y-1 max-w-xs">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent block">
          [ Generating Manifestations ]
        </span>
        <h4 className="font-sans text-sm text-foreground font-medium">
          Flux model rendering image variants...
        </h4>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
          Synthesizing sonic textures into 3 custom canvas structures
        </p>
      </div>

      {/* Simulated Matrix Progress Line */}
      <div className="w-48 h-[2px] bg-foreground/5 relative overflow-hidden border border-border/10">
        <div className="absolute top-0 bottom-0 left-0 bg-accent w-full animate-progress-loading origin-left" />
      </div>
    </div>
  )
}
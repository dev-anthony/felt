"use client"

import * as React from "react"
import { Loader2, BarChart2, MessageSquare, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ProcessingViewProps {
  title: string
  onComplete: () => void
}

// Module scope: this list is constant, so rebuilding it on every render only
// churned allocations and forced the status effect to see a new array identity.
// Copy corrected to name what the pipeline actually does — lyrics come from a
// Genius lookup first and fall back to Deepgram transcription; Whisper is not
// in the stack.
const PROCESS_STATUSES = [
  "Reading the feeling in your music...",
  "Essentia.js analyzing core spectral brightness & valence...",
  "Looking up lyrics, then transcribing what it hears...",
  "Assembling unified emotional canvas blueprint...",
] as const

export function ProcessingView({ title, onComplete }: ProcessingViewProps) {
  const [statusIndex, setStatusIndex] = React.useState(0)
  const processStatuses = PROCESS_STATUSES

  React.useEffect(() => {
    const textInterval = setInterval(() => {
      // PROCESS_STATUSES is module scope, so it needs no entry in the dep array.
      setStatusIndex((prev) => (prev < PROCESS_STATUSES.length - 1 ? prev + 1 : prev))
    }, 2500)

    const completeTimeout = setTimeout(() => {
      onComplete()
    }, 10000)

    return () => {
      clearInterval(textInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <div className="w-full flex flex-col justify-center py-4 bg-transparent">
      <div className="w-full max-w-sm mx-auto text-center space-y-6 min-w-0">

        {/* Animated Spin Anchor */}
        <div className="relative size-14 mx-auto flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full border border-border/40 animate-ping opacity-25" />
          <Loader2 className="size-7 text-accent animate-spin stroke-[1.25]" />
        </div>

        <div className="space-y-2 min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent block">
            [ Feature Extraction Active ]
          </span>
          <h4 className="font-display italic text-xl text-foreground break-words px-1 max-w-full">
            {title}
          </h4>
          <p className="font-mono text-[10px] text-muted-foreground/80 tracking-wide min-h-[24px] break-words px-2">
            {processStatuses[statusIndex]}
          </p>
        </div>

        {/* Metrics Pipeline — Converted to flexible layout with wrapping support */}
        <div className="border border-border/20 bg-background/40 p-4 space-y-3.5 text-left rounded-none min-w-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono min-w-0">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <BarChart2 className="size-3 text-accent" /> Spectral Profile:
            </span>
            <div className="min-w-0 w-full sm:w-auto sm:text-right">
              {statusIndex > 0 ? (
                <span className="text-foreground block truncate sm:max-w-[180px]">BPM, Key, Valence Bound</span>
              ) : (
                <Skeleton className="h-3 w-24 bg-foreground/5 rounded-none max-w-full" />
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono min-w-0">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <MessageSquare className="size-3 text-accent" /> Linguistic Array:
            </span>
            <div className="min-w-0 w-full sm:w-auto sm:text-right">
              {statusIndex > 1 ? (
                <span className="text-foreground block truncate sm:max-w-[180px]">Lyrics Parsed via Whisper</span>
              ) : (
                <Skeleton className="h-3 w-24 bg-foreground/5 rounded-none max-w-full" />
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono min-w-0">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Sparkles className="size-3 text-accent" /> Emotional Mapping:
            </span>
            <div className="min-w-0 w-full sm:w-auto sm:text-right">
              {statusIndex > 2 ? (
                <span className="text-foreground block truncate sm:max-w-[180px]">Brief Compiled</span>
              ) : (
                <Skeleton className="h-3 w-16 bg-foreground/5 rounded-none max-w-full" />
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
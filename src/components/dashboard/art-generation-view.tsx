
"use client"

import * as React from "react"
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react"
import { generationApi } from "@/lib/api"

interface ArtGenerationViewProps {
  uploadId: string
  lyricContext: string
  onComplete: (imageUrl: string) => void
}

export function ArtGenerationView({ uploadId, lyricContext, onComplete }: ArtGenerationViewProps) {
  const [status, setStatus] = React.useState<"idle" | "generating" | "success" | "error">("idle")
  const [generatedImageUrl, setGeneratedImageUrl] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  
  // Track execution states locally to bypass strict-mode double-rendering loops
  const hasFired = React.useRef(false)

  const executeGeneration = React.useCallback(async () => {
    setStatus("generating")
    setErrorMessage(null)

    try {
      // The backend reuses the technique it already matched and stored during
      // /expand or /transcribe, so only the scene context is sent here.
      const response = await generationApi.generate({
        upload_id: uploadId,
        lyric_context: lyricContext,
      })

      if (response && response.image_url) {
        setGeneratedImageUrl(response.image_url)
        setStatus("success")
      } else {
        throw new Error("No image canvas URL returned from server infrastructure.")
      }
    } catch (err: any) {
      console.error("[GENERATION WORKFLOW FAULT]:", err)
      setErrorMessage(err?.message || "Failed to finalize sync rendering pipeline.")
      setStatus("error")
    }
  }, [uploadId, lyricContext])

  // Single invocation mount lifecycle check
  React.useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true
    
    executeGeneration()
  }, [executeGeneration])

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 min-h-[450px] text-center space-y-6">
      
      {/* ─── State Layer: Generating / Processing ─── */}
      {status === "generating" && (
        <div className="space-y-4 flex flex-col items-center">
          <div className="relative size-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-none border border-accent/30 animate-spin [animation-duration:3s]" />
            <Sparkles className="size-6 text-accent animate-pulse" />
          </div>
          
          <div className="space-y-1 max-w-xs">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent block animate-pulse">
              [ Generating Manifestations ]
            </span>
            <h4 className="font-sans text-sm text-foreground font-medium tracking-tight">
              Flux Model Rendering Image...
            </h4>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider leading-relaxed">
              Synthesizing sonic metrics into custom canvas structures
            </p>
          </div>

          <div className="w-48 h-[2px] bg-foreground/5 relative overflow-hidden border border-border/10">
            <div className="absolute top-0 bottom-0 left-0 bg-accent w-1/2 animate-pulse rounded-none" />
          </div>
        </div>
      )}

      {/* ─── State Layer: Error Catch ─── */}
      {status === "error" && (
        <div className="space-y-4 max-w-sm flex flex-col items-center">
          <div className="size-10 bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sans text-sm font-medium text-foreground">Pipeline Execution Failed</h4>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-tight line-clamp-2">
              {errorMessage}
            </p>
          </div>
          <button 
            onClick={() => {
              // Manual execution override should reset execution parameters cleanly
              hasFired.current = true
              executeGeneration()
            }}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-all border border-transparent rounded-none"
          >
            <RefreshCw className="size-3" />
            Restart Pipeline
          </button>
        </div>
      )}

      {/* ─── State Layer: Success / Artwork Display ─── */}
      {status === "success" && generatedImageUrl && (
        <div className="space-y-4 max-w-md flex flex-col items-center">
          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-500 block">
              [ SYNTHESIS COMPLETE ]
            </span>
            <h4 className="font-sans text-sm text-foreground font-medium tracking-tight">
              Externalized Visual Art Document
            </h4>
          </div>

          <div className="relative aspect-square size-64 bg-neutral-900 border border-border/40 shadow-2xl overflow-hidden group rounded-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={generatedImageUrl} 
              alt="Felt Sound Manifestation Art"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <button 
            onClick={() => onComplete(generatedImageUrl)}
            className="font-mono text-[10px] uppercase tracking-[0.25em] bg-accent/10 text-accent border border-accent/20 px-6 py-2.5 hover:bg-accent/20 transition-all rounded-none"
          >
            Accept Manifestation
          </button>
        </div>
      )}
    </div>
  )
}
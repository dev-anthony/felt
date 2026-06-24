"use client"

import * as React from "react"
import { Image as ImageIcon, Sparkles, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// Import your centralized API module layers
import { generationApi } from "@/lib/api" 

interface TuningWorkspaceViewProps {
  uploadId: string
  trackTitle: string
  currentImageUrl: string | null
  originalPrompt: string   
  onClose: () => void
  onRegenerate: (uploadId: string, updatedPrompt: string, expandedBrief?: string) => Promise<void>
}

export function TuningWorkspaceView({
  uploadId,
  trackTitle,
  currentImageUrl,
  originalPrompt,
  onClose,
  onRegenerate,
}: TuningWorkspaceViewProps) {
  const [editedPrompt, setEditedPrompt] = React.useState(originalPrompt)
  const [liveExpandedFeeling, setLiveExpandedFeeling] = React.useState<string>("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState("")

  React.useEffect(() => {
    setEditedPrompt(originalPrompt)
  }, [originalPrompt, uploadId])

  const handleRegenerateClick = async () => {
    if (!editedPrompt.trim() || isProcessing) return
    
    try {
      setIsProcessing(true)
      
      // ─── STEP 1: RUN LAYER 2 EXPANSION VIA API ABSTRACT WRAPPER ───
      setStatusMessage("Expanding synesthetic parameters...")
      
      const expandData = await generationApi.expand({
        upload_id: uploadId,
        basic_input: editedPrompt.trim()
      })
      
      // Update UI preview state seamlessly using the custom request wrapper values
      setLiveExpandedFeeling(expandData.expanded)

      // ─── STEP 2: TRIGGER NEXT PIPELINE SEGMENT ───
      setStatusMessage("Reflushing Flux Engine...")
      await onRegenerate(uploadId, editedPrompt.trim(), expandData.expanded)
      
    } catch (err: any) {
      console.error("Regeneration sequence failure:", err)
      setStatusMessage(err.message || "Sequence broken.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full bg-[#121212] flex flex-col px-4 py-4 min-w-0 overflow-hidden text-foreground">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-5 min-w-0">
        
        {/* Upper Identity Panel */}
        <div className="flex items-center justify-between border-b border-border/20 pb-3 min-w-0 shrink-0">
          <div className="min-w-0 pr-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-0.5">
              // Synesthetic Matrix Refiner
            </span>
            <h3 className="font-display italic text-xl text-foreground truncate w-full">
              Editing: {trackTitle}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none hover:bg-neutral-900 size-8">
            <X className="size-4" />
          </Button>
        </div>

        {/* Editor Content Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-w-0 items-start">
          
          {/* Image Preview */}
          <div className="space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
              Current Generation Layer
            </span>
            <div className="w-full border border-border/40 relative aspect-square bg-[#0d0d0d] overflow-hidden flex items-center justify-center">
              {currentImageUrl ? (
                <img 
                  src={currentImageUrl} 
                  alt={trackTitle} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isProcessing ? "opacity-30" : "opacity-100"}`}
                />
              ) : (
                <div className="text-center space-y-2 p-4">
                  <ImageIcon className="size-6 mx-auto text-muted-foreground stroke-[1.25px]" />
                  <span className="font-mono text-[10px] text-muted-foreground block">No cover art generated yet</span>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/40 backdrop-blur-xs">
                  <RefreshCw className="size-6 text-foreground animate-spin" />
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-foreground text-background font-bold px-2 py-0.5">
                    {statusMessage}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Context Blocks & Editor Box */}
          <div className="space-y-4 min-w-0">
            {/* Live Gemini Expanded Preview Display */}
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent block">
                Gemini Expanded Sensory Brief
              </span>
              <div className="w-full bg-[#181818] border border-border/10 p-2.5 max-h-[120px] min-h-[70px] overflow-y-auto rounded-none">
                <p className="font-mono text-[11px] leading-relaxed text-neutral-400">
                  {liveExpandedFeeling || "Awaiting structural modifications. Hit regenerate to re-compile layout properties."}
                </p>
              </div>
            </div>

            {/* Editable Input */}
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
                Modify Original Intent Blueprint
              </span>
              <Textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                disabled={isProcessing}
                className="font-mono text-xs bg-background border-border/40 rounded-none min-h-[110px] resize-none focus-visible:ring-1 focus-visible:ring-accent leading-relaxed"
                placeholder="Alter what this music feels like..."
              />
            </div>
          </div>

        </div>

        {/* Footer Action Ribbon */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20 min-w-0 shrink-0">
          <Button
            type="button"
            variant="ghost"
            disabled={isProcessing}
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-9 px-4 disabled:opacity-20"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isProcessing || !editedPrompt.trim()}
            onClick={handleRegenerateClick}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-9 px-5 bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2"
          >
            <Sparkles className={`size-3.5 ${isProcessing ? "animate-pulse" : ""}`} /> 
            {isProcessing ? "Processing..." : "Regenerate Art"}
          </Button>
        </div>

      </div>
    </div>
  )
}
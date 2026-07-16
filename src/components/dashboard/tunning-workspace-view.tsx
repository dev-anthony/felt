"use client"

import * as React from "react"
import { Image as ImageIcon, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generationApi } from "@/lib/api" 

interface TuningWorkspaceViewProps {
  uploadId: string
  trackTitle: string
  currentImageUrl: string | null
  originalPrompt: string   
  onClose: () => void
  onRegenerate: (uploadId: string, updatedPrompt: string, expandedBrief?: string) => Promise<void>
  // Added an explicit onRevert handler to safely clean the cache when backing out
  onRevertToInitial?: (trackTitle: string, initialUrl: string | null) => void
  onAcceptChange?: () => void
}

export function TuningWorkspaceView({
  uploadId,
  trackTitle,
  currentImageUrl,
  originalPrompt,
  onClose,
  onRegenerate,
  onRevertToInitial,
  onAcceptChange
}: TuningWorkspaceViewProps) {
  const [editedPrompt, setEditedPrompt] = React.useState(originalPrompt)
  const [liveExpandedFeeling, setLiveExpandedFeeling] = React.useState<string>("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState("")
  
  // Cache the exact starting state asset pointer when the modal mounts
  const [initialImageUrl] = React.useState(currentImageUrl)

  React.useEffect(() => {
    setEditedPrompt(originalPrompt)
  }, [originalPrompt, uploadId])

  const handleRegenerateClick = async () => {
    if (!editedPrompt.trim() || isProcessing) return
    
    try {
      setIsProcessing(true)
      setStatusMessage("Expanding layout descriptions...")
      
      let finalDescription = ""
      
      try {
        const expandData = await generationApi.expand({
          upload_id: uploadId,
          basic_input: editedPrompt.trim()
        })
        
        finalDescription = expandData.expanded
        setLiveExpandedFeeling(finalDescription)
      } catch (expandErr: unknown) {
        console.warn("Expansion framework busy. Activating fallback parameters.", expandErr)
        setLiveExpandedFeeling("Aesthetic Expansion Layer busy. Flux will fallback directly to your raw blueprint.")
        finalDescription = ""
      }

      setStatusMessage("Reflushing Flux Engine...")
      await onRegenerate(uploadId, editedPrompt.trim(), finalDescription || undefined)
      
    } catch (err: unknown) {
      console.error("Regeneration failure:", err)
      setStatusMessage(err instanceof Error ? err.message : "Sequence broken.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelClick = () => {
    // FIX: Instead of calling an API that generates a NEW image, 
    // tell the dashboard state to restore the cached initial URL.
    if (currentImageUrl !== initialImageUrl && onRevertToInitial) {
      onRevertToInitial(trackTitle, initialImageUrl)
    }
    onClose()
  }

  const handleAcceptClick = () => {
  if (onAcceptChange) onAcceptChange()
  onClose()
}

  const hasGeneratedNewArt = currentImageUrl !== initialImageUrl

  return (
    <div className="w-full max-w-full bg-[#121212] p-4 sm:p-6 text-foreground box-border overflow-x-hidden">
      <div className="w-full flex flex-col space-y-6 min-w-0">
        
        {/* Upper Identity Panel */}
        <div className="flex items-center justify-between border-b border-border/20 pb-3 min-w-0">
          <div className="min-w-0 pr-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-0.5">
              // Aesthetic Matrix Refiner
            </span>
            <h3 className="font-display italic text-xl text-foreground truncate max-w-full">
              Editing: {trackTitle}
            </h3>
          </div>
        </div>

        {/* Editor Main Content Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-w-0 items-start">
          
          {/* Left Column: Image Preview */}
          <div className="space-y-2 w-full min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
              Current Generation Layer
            </span>
            <div className="w-full border border-border/40 relative aspect-square bg-[#0d0d0d] overflow-hidden flex items-center justify-center box-border">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/40 backdrop-blur-xs p-4 box-border">
                  <RefreshCw className="size-6 text-foreground animate-spin" />
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-foreground text-background font-bold px-2 py-0.5 text-center max-w-full truncate">
                    {statusMessage}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Live Prompt Context Box */}
          <div className="space-y-4 w-full min-w-0">
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent block">
                Aesthetic Expanded Visual Description
              </span>
              <div className="w-full bg-[#181818] border border-border/10 p-3 max-h-[150px] md:max-h-[220px] min-h-[100px] overflow-y-auto rounded-none box-border">
                <p className="font-mono text-[11px] leading-relaxed text-neutral-400 select-text break-words">
                  {liveExpandedFeeling || "Awaiting structural modifications. Hit regenerate to re-compile layout properties."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Full-width Textarea Block */}
        <div className="w-full min-w-0 block clear-both">
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block mb-1.5">
            Modify Original Intent Blueprint
          </span>
          <div className="w-full min-w-0">
            <Textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              disabled={isProcessing}
              rows={3}
              className="font-mono w-full text-xs bg-background border border-border/40 rounded-none resize-none focus-visible:ring-1 focus-visible:ring-accent leading-relaxed box-border block"
              placeholder="Alter what this music feels like..."
            />
          </div>
        </div>

        {/* Footer Action Ribbon */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t border-border/20 w-full min-w-0 box-border">
          
          {/* Left Action: Revert Backwards */}
          <Button
            type="button"
            variant="ghost"
            disabled={isProcessing}
            onClick={handleCancelClick}
            className="w-full sm:w-auto shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4 disabled:opacity-20 hover:bg-red-950/20 hover:text-red-400 text-neutral-400 transition-colors order-3 sm:order-1"
          >
            Cancel Changes
          </Button>

          {/* Right Actions Block */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-3 order-1 sm:order-2">
            <Button
              type="button"
              disabled={isProcessing || !editedPrompt.trim()}
              onClick={handleRegenerateClick}
              className="w-full sm:w-auto shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4 bg-transparent border border-border/80 text-foreground hover:bg-neutral-900 flex items-center justify-center gap-2 box-border"
            >
              <RefreshCw className={`size-3 shrink-0 ${isProcessing ? "animate-spin" : ""}`} />
              {/* Fixed min-width stops the row reflowing when the label swaps to
                  the longer "Tuning Layout…" and squeezes the sibling button. */}
              <span className="sm:min-w-[6.5rem]">{isProcessing ? "Tuning Layout..." : "Regenerate"}</span>
            </Button>

            <Button
              type="button"
              disabled={isProcessing || (!hasGeneratedNewArt && editedPrompt === originalPrompt)}
              onClick={handleAcceptClick}
              className="w-full sm:w-auto shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-5 bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2 disabled:opacity-40 box-border"
            >
              <Check className="size-3.5 stroke-[2.5px] shrink-0" />
              Keep Artwork
            </Button>
          </div>

        </div>

      </div>
    </div>
  )
}
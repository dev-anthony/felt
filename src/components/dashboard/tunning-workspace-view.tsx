"use client"

import * as React from "react"
import { Image as ImageIcon, Sparkles, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TuningWorkspaceViewProps {
  uploadId: string
  trackTitle: string
  currentImageUrl: string | null
  expandedFeeling: string // The feeling that was expanded by Gemini
  originalPrompt: string   // The user input prompt of that particular art
  onClose: () => void
  onRegenerate: (uploadId: string, updatedPrompt: string) => Promise<void>
}

export function TuningWorkspaceView({
  uploadId,
  trackTitle,
  currentImageUrl,
  expandedFeeling,
  originalPrompt,
  onClose,
  onRegenerate,
}: TuningWorkspaceViewProps) {
  const [editedPrompt, setEditedPrompt] = React.useState(originalPrompt)
  const [isRegenerating, setIsRegenerating] = React.useState(false)

  const handleRegenerateClick = async () => {
    if (!editedPrompt.trim() || isRegenerating) return
    
    try {
      setIsRegenerating(true)
      // Call the parent handler which hits POST /api/generations with the modifications
      await onRegenerate(uploadId, editedPrompt)
    } catch (err) {
      console.error("Regeneration failed:", err)
    } finally {
      setIsRegenerating(false)
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-none hover:bg-neutral-900 size-8"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Editor Main Content Workspace Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-w-0 items-start">
          
          {/* Left Column: Image Preview View Frame */}
          <div className="space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
              Current Generation Layer
            </span>
            <div className="w-full border border-border/40 relative aspect-square bg-[#0d0d0d] overflow-hidden flex items-center justify-center group">
              {currentImageUrl ? (
                <img 
                  src={currentImageUrl} 
                  alt={trackTitle} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isRegenerating ? "opacity-30" : "opacity-100"}`}
                />
              ) : (
                <div className="text-center space-y-2 p-4">
                  <ImageIcon className="size-6 mx-auto text-muted-foreground stroke-[1.25px]" />
                  <span className="font-mono text-[10px] text-muted-foreground block">No cover art generated yet</span>
                </div>
              )}
              
              {isRegenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/40 backdrop-blur-xs">
                  <RefreshCw className="size-6 text-foreground animate-spin" />
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-foreground text-background font-bold px-2 py-0.5">
                    Reflushing Flux Engine...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Context Parameters & Form Input Box */}
          <div className="space-y-4 min-w-0">
            {/* Display Read-Only Extracted Feeling */}
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent block">
                Gemini Expanded Feeling Context
              </span>
              <div className="w-full bg-[#181818] border border-border/10 p-2.5 max-h-[100px] overflow-y-auto rounded-none">
                <p className="font-mono text-[11px] leading-relaxed text-neutral-400">
                  {expandedFeeling || "No expanded feeling data structure mapped."}
                </p>
              </div>
            </div>

            {/* Editable Primary User Prompt Input Box */}
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
                Modify Original Intent Blueprint
              </span>
              <Textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                disabled={isRegenerating}
                className="font-mono text-xs bg-background border-border/40 rounded-none min-h-[110px] resize-none focus-visible:ring-1 focus-visible:ring-accent leading-relaxed"
                placeholder="Alter what this music feels like..."
              />
            </div>
          </div>

        </div>

        {/* Action Ribbon Footer Toolbar */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20 min-w-0 shrink-0">
          <Button
            type="button"
            variant="ghost"
            disabled={isRegenerating}
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-9 px-4 disabled:opacity-20"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isRegenerating || !editedPrompt.trim()}
            onClick={handleRegenerateClick}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-9 px-5 bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 shrink-0 disabled:opacity-40"
          >
            <Sparkles className={`size-3.5 ${isRegenerating ? "animate-pulse" : ""}`} /> 
            {isRegenerating ? "Regenerating..." : "Regenerate Art"}
          </Button>
        </div>

      </div>
    </div>
  )
}
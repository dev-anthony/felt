"use client"

import * as React from "react"
import { Sparkles, Edit3, RotateCcw, Check, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FeelingExpanderViewProps {
  userPrompt: string
  onApprove: (expandedText: string) => void
  onStartOver: () => void
}

export function FeelingExpanderView({
  userPrompt,
  onApprove,
  onStartOver
}: FeelingExpanderViewProps) {
  // Initialize with your default 3am descriptive text expansion
  const [isEditing, setIsEditing] = React.useState(false)
  const [expandedText, setExpandedText] = React.useState(
    "3am in a city that never fully sleeps. The kind of night where streetlights reflect on wet concrete and everything feels heavier than it did during the day. Not dangerous — purposeful. Like someone who came out knowing exactly who they are."
  )

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-h-[480px]">
      
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Neural Synergy Expander
          </span>
          <h3 className="font-display italic text-2xl text-foreground">Aesthetic Synthesis</h3>
        </div>

        {/* Dynamic Card Container changing states contextually */}
        <div className="border border-border/40 bg-background/50 p-5 space-y-4 relative rounded-none">
          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
              You said:
            </span>
            <p className="font-sans text-sm font-medium text-foreground italic">
              "{userPrompt}"
            </p>
          </div>

          <div className="h-px bg-border/20 w-full" />

          <div className="space-y-1.5 flex-1 flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Sparkles className="size-3" /> Expanded Context Description:
            </span>
            
            {isEditing ? (
              <div className="space-y-3 pt-1 flex-1 flex flex-col">
                <Textarea
                  value={expandedText}
                  onChange={(e) => setExpandedText(e.target.value)}
                  className="min-h-[120px] flex-1 w-full bg-background/80 border border-accent/40 focus-visible:border-accent p-3 font-sans text-xs text-foreground leading-relaxed rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="font-mono text-[9px] uppercase tracking-widest rounded-none h-8 px-3 self-end bg-accent text-background hover:bg-accent/90"
                >
                  <Save className="mr-1 size-3" /> Save Changes
                </Button>
              </div>
            ) : (
              <p className="font-sans text-xs text-muted-foreground/90 leading-relaxed bg-foreground/[0.01] p-3 border border-border/10 font-light">
                {expandedText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Interactive Command Ribbon */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/20 mt-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onStartOver}
            disabled={isEditing}
            className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-3 flex-1 sm:flex-none border-border/40 disabled:opacity-30"
          >
            <RotateCcw className="mr-1.5 size-3" /> Start Over
          </Button>
          
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-3 flex-1 sm:flex-none border-border/40"
            >
              <Edit3 className="mr-1.5 size-3" /> Edit Context
            </Button>
          )}
        </div>

        <Button
          type="button"
          disabled={isEditing}
          onClick={() => onApprove(expandedText)}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-5 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30"
        >
          <Check className="mr-1.5 size-3.5 stroke-[2.5px]" /> Looks Right — Continue
        </Button>
      </div>

    </div>
  )
}
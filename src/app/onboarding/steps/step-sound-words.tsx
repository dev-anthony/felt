"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StepSoundWordsProps {
  initialValues: string[]
  onProceed: (data: { soundWords: string[] }) => void
  onBack: () => void
}

export function StepSoundWords({ initialValues, onProceed, onBack }: StepSoundWordsProps) {
  const [words, setWords] = React.useState<string[]>(initialValues)

  const handleInputChange = (index: number, val: string) => {
    const updated = [...words]
    updated[index] = val.toUpperCase().replace(/[^A-Z0-9-]/g, "") // Enforce alphanumeric clean layout properties
    setWords(updated)
  }

  const isValid = words.every(w => w.trim().length >= 2)

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">{"// Phase 02"}</span>
        <h3 className="font-display italic text-2xl text-foreground">Acoustic Profiles</h3>
        <p className="font-sans text-xs text-muted-foreground mt-1">Isolate three explicit keywords that describe your sonic footprint. No constraints.</p>
      </div>

      <div className="space-y-3 min-w-0">
        {words.map((word, i) => (
          <div key={i} className="flex items-center space-x-3 min-w-0">
            <span className="font-mono text-[10px] text-muted-foreground/60 w-6">[{i + 1}]</span>
            <Input
              placeholder={`VECTOR_ALPHA_0${i + 1}...`}
              value={word}
              onChange={(e) => handleInputChange(i, e.target.value)}
              maxLength={18}
              className="rounded-none bg-background border-border/40 text-sm font-mono tracking-wider focus-visible:border-accent uppercase h-10"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border/20 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4"
        >
          ← Back
        </Button>
        <Button
          type="button"
          disabled={!isValid}
          onClick={() => onProceed({ soundWords: words })}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-20 transition-all"
        >
          Map Coordinates →
        </Button>
      </div>
    </div>
  )
}
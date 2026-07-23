"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StepCityInfluenceProps {
  initialValue: string
  onProceed: (data: { city: string }) => void
  onBack: () => void
}

export function StepCityInfluence({ initialValue, onProceed, onBack }: StepCityInfluenceProps) {
  const [city, setCity] = React.useState(initialValue)

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">{"// Phase 03"}</span>
        <h3 className="font-display italic text-2xl text-foreground">Spatial Foundation</h3>
        <p className="font-sans text-xs text-muted-foreground mt-1">Which geographic ecosystem or city structure engineered your current musical direction?</p>
      </div>

      <div className="relative min-w-0">
        <Input
          placeholder="e.g., LONDON, TOKYO, LAGOS..."
          value={city}
          onChange={(e) => setCity(e.target.value.toUpperCase())}
          maxLength={32}
          className="rounded-none bg-background border-border/40 text-sm font-mono tracking-widest pl-10 h-11 focus-visible:border-accent"
        />
        <Globe className="absolute left-3.5 top-3.5 size-4 text-muted-foreground/60 stroke-[1.5px]" />
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
          disabled={city.trim().length < 2}
          onClick={() => onProceed({ city })}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-20 transition-all"
        >
          Lock Origin →
        </Button>
      </div>
    </div>
  )
}
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { onboardingApi, type ProfileOption } from "@/lib/api"

interface StepGenreProps {
  initialValue: string
  onProceed: (data: { genre: string }) => void
  onBack: () => void
}

/**
 * The artist declares their lane. This is NOT decoration: Essentia reads math,
 * not culture, and mislabels culturally-specific music (an Afrobeats track gets
 * stored as "hip-hop"). This choice overrides that guess when the scene prompt
 * is built, while Essentia's numbers still drive the Visual DNA.
 */
export function StepGenre({ initialValue, onProceed, onBack }: StepGenreProps) {
  const [genre, setGenre] = React.useState(initialValue)
  const [options, setOptions] = React.useState<ProfileOption[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    onboardingApi
      .getOptions()
      .then((data) => {
        if (cancelled) return
        setOptions(data.genres)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Could not load genres")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-5 min-w-0">
      <div className="space-y-1">
        <h3 className="font-display italic text-2xl text-foreground">Your Lane</h3>
        <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground leading-relaxed">
          What do you make? This grounds your covers culturally — the analyser hears tempo and
          texture, not where your sound comes from.
        </p>
      </div>

      {error && <p className="font-mono text-[10px] text-red-400 tracking-wide">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-11 border border-border/20 bg-foreground/[0.02] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 min-w-0">
          {options.map((opt) => {
            const active = genre === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setGenre(opt.id)}
                className={`h-11 px-3 border font-mono text-[10px] uppercase tracking-widest truncate transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border/40 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      <div className="pt-4 border-t border-border/20 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4 text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Button>
        <Button
          type="button"
          disabled={!genre}
          onClick={() => onProceed({ genre })}
          className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-20 transition-all"
        >
          Lock Lane →
        </Button>
      </div>
    </div>
  )
}

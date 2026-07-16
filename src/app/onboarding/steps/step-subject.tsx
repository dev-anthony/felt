"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { onboardingApi, type ProfileOption } from "@/lib/api"

interface StepSubjectProps {
  initialValue: string
  onComplete: (data: { subjectMode: string }) => void
  onBack: () => void
  submitting?: boolean
}

// Plain-language explanation of what each choice actually does downstream.
const HINTS: Record<string, string> = {
  auto: "The song decides. Some covers get a person, some get a place or an object.",
  figure: "Every cover is built around a person, cast to fit the track.",
  no_people: "Never a person. Covers carry the feeling through place, objects, light and atmosphere.",
}

/**
 * Final step: whether a human appears on this artist's covers at all.
 * Feeds a hard constraint into both the scene generator and the Reality Engine.
 */
export function StepSubject({ initialValue, onComplete, onBack, submitting }: StepSubjectProps) {
  const [mode, setMode] = React.useState(initialValue)
  const [options, setOptions] = React.useState<ProfileOption[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    onboardingApi
      .getOptions()
      .then((data) => {
        if (!cancelled) setOptions(data.subjectModes)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load options")
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
        <h3 className="font-display italic text-2xl text-foreground">Who&apos;s On The Cover</h3>
        <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground leading-relaxed">
          Your default. You can change it per release later.
        </p>
      </div>

      {error && <p className="font-mono text-[10px] text-red-400 tracking-wide">{error}</p>}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 border border-border/20 bg-foreground/[0.02] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2 min-w-0">
          {options.map((opt) => {
            const active = mode === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMode(opt.id)}
                className={`w-full text-left p-3 border transition-colors min-w-0 ${
                  active
                    ? "border-accent bg-accent/10"
                    : "border-border/40 hover:bg-foreground/5"
                }`}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest block ${
                    active ? "text-accent" : "text-foreground"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground leading-relaxed block mt-1">
                  {HINTS[opt.id]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div className="pt-4 border-t border-border/20 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={submitting}
          onClick={onBack}
          className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4 text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Button>
        <Button
          type="button"
          disabled={!mode || submitting}
          onClick={() => onComplete({ subjectMode: mode })}
          className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-20 transition-all"
        >
          {submitting ? "Saving…" : "Enter FELT →"}
        </Button>
      </div>
    </div>
  )
}

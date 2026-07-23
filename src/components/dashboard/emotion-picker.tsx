"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { emotionApi, type EmotionFamily, type EmotionOption } from "@/lib/api"

interface EmotionPickerProps {
  value: string | null
  onChange: (id: string | null) => void
  disabled?: boolean
}

/**
 * The artist's feeling, as a coordinate rather than a string.
 *
 * Grouped into the 12 archetype families instead of a flat list — 104 options
 * with hover tooltips is unusable, and the families are the same ones the engine
 * reasons in, so the grouping is real structure rather than tidy-up.
 *
 * The definition is shown inline under the selection, not only on hover: many
 * of these are near-synonyms on purpose (saudade / sehnsucht / hiraeth /
 * yearning), and the artist has to be able to tell them apart before choosing.
 * Hover alone fails on touch devices, where most of this will happen.
 *
 * Optional by design. It supplements the free-text sentence, never replaces it:
 * a label carries the feeling, only a sentence carries the episode.
 */
export function EmotionPicker({ value, onChange, disabled }: EmotionPickerProps) {
  const [families, setFamilies] = React.useState<EmotionFamily[]>([])
  const [loadError, setLoadError] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    emotionApi
      .list()
      .then((d) => { if (!cancelled) setFamilies(d.families) })
      .catch(() => { if (!cancelled) setLoadError(true) })
    return () => { cancelled = true }
  }, [])

  const allEmotions = React.useMemo(
    () => families.flatMap((f) => f.emotions.map((e) => ({ ...e, family: f.label }))),
    [families],
  )
  const selected = React.useMemo(
    () => allEmotions.find((e) => e.id === value) || null,
    [allEmotions, value],
  )

  const q = query.trim().toLowerCase()
  const filtered = React.useMemo(() => {
    if (!q) return families
    return families
      .map((f) => ({
        ...f,
        emotions: f.emotions.filter(
          (e) =>
            e.label.toLowerCase().includes(q) ||
            e.definition.toLowerCase().includes(q) ||
            f.label.toLowerCase().includes(q),
        ),
      }))
      .filter((f) => f.emotions.length > 0)
  }, [families, q])

  // The picker adds nothing if the taxonomy could not be fetched, and the
  // sentence field alone is still a complete brief — so fail quiet.
  if (loadError) return null

  const pick = (e: EmotionOption) => {
    onChange(e.id)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className="w-full min-w-0">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
          {"// What does it feel like"}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">optional</span>
      </div>

      {selected ? (
        <div className="w-full border border-border/40 bg-foreground/[0.02] p-3 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm text-foreground">
              {selected.label}
              {selected.origin && (
                <span className="font-mono text-[10px] text-muted-foreground ml-2">
                  {selected.origin}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled}
              aria-label="Clear selected feeling"
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            {selected.definition}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={disabled || families.length === 0}
          className="w-full border border-border/40 bg-transparent px-3 h-10 text-left text-sm text-muted-foreground hover:border-accent/50 transition-colors disabled:opacity-50"
        >
          {families.length === 0 ? "Loading feelings..." : "Choose a feeling..."}
        </button>
      )}

      {open && !selected && (
        <div className="mt-1.5 border border-border/40 bg-[#101010]">
          <div className="flex items-center gap-2 px-3 border-b border-border/20 h-9">
            <Search className="size-3.5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 100+ feelings..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="max-h-[280px] overflow-y-auto overscroll-contain">
            {filtered.length === 0 && (
              <p className="font-mono text-[11px] text-muted-foreground p-3">
                Nothing matches that. Try a broader word.
              </p>
            )}
            {filtered.map((f) => (
              <div key={f.archetype}>
                <div className="sticky top-0 bg-[#101010] px-3 py-1.5 border-b border-border/10">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                    {f.label}
                  </span>
                </div>
                {f.emotions.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => pick(e)}
                    title={e.definition}
                    className="w-full text-left px-3 py-2 hover:bg-foreground/[0.04] transition-colors block"
                  >
                    <span className="text-sm text-foreground">{e.label}</span>
                    {e.origin && (
                      <span className="font-mono text-[9px] text-muted-foreground ml-2">
                        {e.origin}
                      </span>
                    )}
                    <span className="block font-mono text-[10px] leading-relaxed text-muted-foreground mt-0.5">
                      {e.definition}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

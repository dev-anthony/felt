"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { uploadApi, type UploadRecord, type Generation } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, ImageOff, RefreshCw, Trash2, X } from "lucide-react"

const PAGE_SIZE = 12

/** Flattened artwork row — one card per generated image. */
type ArtworkItem = {
  generation: Generation
  track: UploadRecord
}

/** "MOTION_BLUR_STROBE" → "Motion Blur Strobe" */
const prettyTechnique = (t?: string) =>
  t ? t.toLowerCase().split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : null

export default function GalleryPage() {
  const router = useRouter()
  const [items, setItems] = React.useState<ArtworkItem[]>([])
  const [total, setTotal] = React.useState(0)
  const [offset, setOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [active, setActive] = React.useState<ArtworkItem | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const load = React.useCallback(async (nextOffset: number, replace: boolean) => {
    if (replace) setLoading(true)
    else setLoadingMore(true)
    setError(null)
    try {
      const data = await uploadApi.getUploads(PAGE_SIZE, nextOffset)
      // Only tracks that actually produced a complete image belong in a gallery.
      const flattened: ArtworkItem[] = (data.uploads || []).flatMap((track) =>
        (track.generations || [])
          .filter((g) => g.image_url && g.status === "complete")
          .map((generation) => ({ generation, track }))
      )
      setTotal(data.total ?? 0)
      setOffset(nextOffset)
      setItems((prev) => (replace ? flattened : [...prev, ...flattened]))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your gallery")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  React.useEffect(() => {
    // fetch-on-mount.
    // The request IS the external system this effect synchronises with; the
    // setState it triggers happens in the async resolution, not in this body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(0, true)
  }, [load])

  const handleDelete = async (track: UploadRecord) => {
    if (!confirm(`Delete "${track.title}" and its artwork? This cannot be undone.`)) return
    setDeletingId(track.id)
    try {
      await uploadApi.deleteTrack(track.id)
      setItems((prev) => prev.filter((i) => i.track.id !== track.id))
      setActive(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete track")
    } finally {
      setDeletingId(null)
    }
  }

  const hasMore = offset + PAGE_SIZE < total

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div className="min-w-0">
          <h1 className="font-display italic text-3xl sm:text-4xl tracking-tight text-foreground">Gallery</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
            {loading ? "Loading archive…" : `${items.length} artwork${items.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          onClick={() => load(0, true)}
          disabled={loading}
          className="shrink-0 whitespace-nowrap flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest border border-border/80 px-4 h-10 text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`size-3 shrink-0 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="font-mono text-[10px] text-red-400 tracking-wide mt-6">{error}</p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-none" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
          <ImageOff className="size-8 text-muted-foreground/50" />
          <div className="space-y-1">
            <h2 className="font-sans text-sm text-foreground">No artwork yet</h2>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Generate your first cover to fill this space
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="font-mono text-[10px] uppercase tracking-widest bg-foreground text-background px-5 h-10 hover:bg-foreground/90 transition-colors"
          >
            Go to workspace
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && items.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {items.map(({ generation, track }) => (
              <button
                key={generation.id}
                onClick={() => setActive({ generation, track })}
                className="group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 border border-border/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generation.image_url}
                    alt={track.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 min-w-0">
                  <p className="font-sans text-xs text-foreground truncate">{track.title}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground truncate">
                    {prettyTechnique(generation.technique) || track.track_type}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => load(offset + PAGE_SIZE, false)}
                disabled={loadingMore}
                className="font-mono text-[10px] uppercase tracking-widest border border-border/80 px-6 h-10 text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto bg-popover border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.generation.image_url}
              alt={active.track.title}
              className="w-full object-contain bg-neutral-950"
            />

            <div className="p-5 sm:p-6 space-y-4">
              <div className="min-w-0">
                <h3 className="font-display italic text-2xl text-foreground truncate">{active.track.title}</h3>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                  {prettyTechnique(active.generation.technique) || "—"} · {active.track.track_type} ·{" "}
                  {new Date(active.generation.created_at).toLocaleDateString()}
                </p>
              </div>

              {active.track.audio_features && (
                <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  <span>{active.track.audio_features.bpm} BPM</span>
                  <span>{active.track.audio_features.key} {active.track.audio_features.scale}</span>
                  <span>Energy {active.track.audio_features.energy}</span>
                  <span>Valence {active.track.audio_features.valence}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/30">
                <a
                  href={active.generation.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 whitespace-nowrap flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest bg-foreground text-background px-4 h-10 hover:bg-foreground/90 transition-colors"
                >
                  <Download className="size-3 shrink-0" />
                  Open full size
                </a>
                <button
                  onClick={() => handleDelete(active.track)}
                  disabled={deletingId === active.track.id}
                  className="shrink-0 whitespace-nowrap flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest border border-border/80 px-4 h-10 text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="size-3 shrink-0" />
                  {deletingId === active.track.id ? "Deleting…" : "Delete track"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

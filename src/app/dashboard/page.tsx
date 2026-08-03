"use client"

/* eslint-disable @next/next/no-img-element -- The generated-cover host is not
   fixed. The backend uploads to Cloudinary but falls back to the raw provider URL
   (Pollinations / Together / Replicate / HuggingFace) when that upload fails, so no
   finite next/image `remotePatterns` list can cover every case. next/image would
   throw "hostname is not configured" precisely when generation is already
   degraded, turning a soft failure into a broken page. A plain <img> is correct
   here. */

import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { Plus, ArrowUpRight, Sliders, Loader2, Music4, Download, Trash2, AlertTriangle, Sparkles, Mic2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useUser } from "@/context/userContext"
import { uploadApi, UploadRecord, generationApi } from "@/lib/api"

// Both are only mounted once a Dialog is opened, never for the initial
// dashboard paint — code-split so their weight (DSP pass, emotion/reference
// pickers) isn't in the route's first-load bundle.
const WorkspaceWizard = dynamic(
  () => import("@/components/dashboard/workspace-wizard").then((m) => m.WorkspaceWizard),
  { loading: () => <DialogLoadingFallback /> }
)
const TuningWorkspaceView = dynamic(
  () => import("@/components/dashboard/tunning-workspace-view").then((m) => m.TuningWorkspaceView),
  { loading: () => <DialogLoadingFallback /> }
)

function DialogLoadingFallback() {
  return (
    <div className="h-[300px] w-full flex items-center justify-center gap-2 text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
      <Loader2 className="size-4 animate-spin text-accent" />
      Loading…
    </div>
  )
}
interface EditingTrackState {
  id: string
  title: string
  currentImageUrl: string | null
  expandedFeeling: string
  originalPrompt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()

  const [uploads, setUploads] = React.useState<UploadRecord[]>([])
  const [loadingUploads, setLoadingUploads] = React.useState(true)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [isTuneOpen, setIsTuneOpen] = React.useState(false)
  const [trackToDelete, setTrackToDelete] = React.useState<{ id: string; title: string } | null>(null)
  const [deletingTrackId, setDeletingTrackId] = React.useState<string | null>(null)
  const [sessionCoverCache, setSessionCoverCache] = React.useState<Record<string, string>>({})
  const [editingTrack, setEditingTrack] = React.useState<EditingTrackState | null>(null)
  const [dashboardError, setDashboardError] = React.useState<string | null>(null)
  const [deleteError, setDeleteError] = React.useState<string | null>(null)


  const fetchDashboardData = React.useCallback(async () => {
    try {
      const data = await uploadApi.getUploads(20, 0)
      setUploads(data.uploads || [])
      setDashboardError(null)
    } catch (err) {
      console.error("Failed to parse real upload streams:", err)
      setDashboardError(err instanceof Error ? err.message : "Failed to load your studio data.")
    } finally {
      setLoadingUploads(false)
    }
  }, [])

  React.useEffect(() => {
    if (!userLoading && user) {
      // fetch-on-mount.
      // The request IS the external system this effect synchronises with.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDashboardData()
    }
  }, [userLoading, user, fetchDashboardData])

  const executeTrackPurge = async () => {
    if (!trackToDelete) return

    try {
      setDeletingTrackId(trackToDelete.id)
      setDeleteError(null)
      await uploadApi.deleteTrack(trackToDelete.id)
      setUploads(prev => prev.filter(track => track.id !== trackToDelete.id))
      setTrackToDelete(null)
    } catch (err) {
      console.error("Critical failure during backend detachment cleanup cycle:", err)
      setDeleteError(err instanceof Error ? err.message : "Failed to delete asset. Please try again.")
    } finally {
      setDeletingTrackId(null)
    }
  }

  const handleFreshGenerationComplete = (title: string, type: string, filterId: string, imageUrl?: string) => {
    if (imageUrl) {
      setSessionCoverCache(prev => ({ ...prev, [title]: imageUrl }))
    }
    fetchDashboardData()
    setIsUploadOpen(false)
  }

  const handleRegenerateArt = async (
    uploadId: string,
    updatedPrompt: string,
    expandedDescription?: string,
    referenceImageB64?: string | null,
    creativeStrength?: number,
  ) => {
    try {
      const result = await generationApi.refine({
        upload_id: uploadId,
        lyric_context: expandedDescription && expandedDescription.trim() !== "" ? expandedDescription : updatedPrompt,
        image_url: editingTrack?.currentImageUrl,
        reference_image_b64: referenceImageB64 || undefined,
        creative_strength: referenceImageB64 ? creativeStrength : undefined,
      });

      setUploads((prev) =>
        prev.map((upload) => {
          if (upload.id === uploadId) {
            return {
              ...upload,
              sentence_prompt: updatedPrompt,
              generations: [
                {
                  id: result.generation_id,
                  upload_id: uploadId,
                  user_id: "",
                  image_url: result.image_url,
                  status: "complete",
                  created_at: new Date().toISOString(),
                  prompt_used: expandedDescription || updatedPrompt,
                },
                ...(upload.generations || []),
              ],
            };
          }
          return upload;
        })
      );

      if (editingTrack) {
        setSessionCoverCache(prev => ({ ...prev, [editingTrack.title]: result.image_url }))
      }
      setEditingTrack((prev) => (prev ? { ...prev, currentImageUrl: result.image_url } : null));

    } catch (err) {
      console.error("[REGEN HANDLER EXCEPTION]:", err);
      throw err;
    }
  };

  const handleDownloadImage = async (e: React.MouseEvent, imageUrl: string, trackTitle: string) => {
    e.stopPropagation();
    try {
      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${trackTitle.toLowerCase().replace(/\s+/g, '_')}_cover.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      const response = await fetch(imageUrl, { method: 'GET', mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${trackTitle.toLowerCase().replace(/\s+/g, '_')}_cover.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download image file asset stream cleanly:", err);
      window.open(imageUrl, '_blank');
    }
  };

  if (userLoading || loadingUploads) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-2 text-muted-foreground font-mono text-[11px] uppercase tracking-widest">
        <Loader2 className="size-5 animate-spin text-accent" />
        Synchronizing Matrix Stream...
      </div>
    )
  }

  // Real counts only, from the data already on the page — no fabricated
  // "streaks" or vanity metrics that don't come from anywhere.
  const totalCovers = uploads.reduce((n, u) => n + (u.generations?.length || 0), 0)
  const vocalCount = uploads.filter((u) => u.track_type === "vocal").length
  const beatCount = uploads.length - vocalCount

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            {"// Operational Matrix — Welcome "}{user?.name || "Creator"}
          </span>
          <h1 className="font-display italic text-4xl tracking-tight">Artist Studio</h1>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-foreground text-background hover:bg-accent font-mono text-[10px] tracking-widest uppercase h-11 px-6">
              <Plus className="mr-2 size-4" /> New Upload
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="w-[calc(100vw-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto scrollbar-custom bg-[#141414] border border-border/40 text-foreground p-0 rounded-3xl shadow-2xl shadow-black/50 sm:w-full"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Acoustic Synthesis Canvas</DialogTitle>
              <DialogDescription>Generation profile pipeline layout wrapper context</DialogDescription>
            </DialogHeader>
            <WorkspaceWizard
              onClose={() => setIsUploadOpen(false)}
              onCompleteGeneration={handleFreshGenerationComplete}
            />
          </DialogContent>
        </Dialog>
      </div>

      {dashboardError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-destructive tracking-wide">{dashboardError}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => { setLoadingUploads(true); fetchDashboardData() }}
            className="shrink-0 rounded-full h-8 px-4 font-mono text-[9px] uppercase tracking-widest"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Quick stats — every number here reads directly off `uploads`, nothing
          invented for the sake of filling a row. */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tracks uploaded", value: uploads.length, icon: Music4 },
          { label: "Covers generated", value: totalCovers, icon: Sparkles },
          { label: "Vocal / Beat", value: `${vocalCount} / ${beatCount}`, icon: Mic2 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/30 bg-foreground/[0.015] p-5 flex items-center gap-4">
            <stat.icon className="size-5 text-accent shrink-0" strokeWidth={1.5} />
            <div className="min-w-0">
              <div className="font-display italic text-2xl leading-none mb-1">{stat.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 truncate">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Recent Generations ({uploads.length})
          </h2>
          {uploads.length > 0 && (
            <Button
              variant="link"
              onClick={() => router.push("/dashboard/gallery")}
              className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-foreground p-0 h-auto"
            >
              View Full Gallery <ArrowUpRight className="ml-1 size-3.5" />
            </Button>
          )}
        </div>

        {uploads.length === 0 ? (
          <div className="w-full min-h-[350px] rounded-2xl border border-dashed border-border/30 flex flex-col items-center justify-center p-8 text-center bg-foreground/[0.01]">
            <Music4 className="size-8 text-muted-foreground/20 stroke-[1px] mb-4" />
            <p className="font-display italic text-xl text-foreground mb-1">The canvas is silent.</p>
            <p className="font-sans text-xs text-muted-foreground max-w-xs mx-auto mb-6">
              You haven&apos;t uploaded any sounds yet. Initiate your first acoustic analysis blueprint to manifest artwork.
            </p>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="rounded-full border border-border bg-transparent text-foreground hover:bg-foreground/5 font-mono text-[9px] tracking-widest uppercase h-9 px-5"
            >
              Initiate First Upload
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {uploads.map((track) => {
              const dbImage = track.generations?.[0]?.image_url
              const cachedImage = sessionCoverCache[track.title]
              const finalImageUrl = dbImage || cachedImage
              const isComplete = track.status === "complete" && !!finalImageUrl

              const displayDate = new Date(track.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric',
              })

              const isDeletingThis = deletingTrackId === track.id

              return (
                <div key={track.id} className="group min-w-0">
                  {/* Artwork — the image itself is the only chrome. No card,
                      no border at rest; a plain frame on a wall, not a UI
                      panel. */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0c0c0c]">
                    {finalImageUrl ? (
                      <img
                        src={finalImageUrl}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-border/25">
                        <Loader2
                          className={`size-6 text-muted-foreground/30 stroke-[1.25px] ${track.status === "generating" ? "animate-spin [animation-duration:2.5s]" : ""}`}
                        />
                        <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted-foreground/40">
                          {track.status === "generating" ? "Generating" : "No cover yet"}
                        </span>
                      </div>
                    )}

                    {/* Hover scrim + floating actions — invisible until touched,
                        exactly like approaching a piece on a gallery wall. */}
                    {finalImageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      {finalImageUrl && !isDeletingThis && (
                        <button
                          type="button"
                          onClick={(e) => handleDownloadImage(e, finalImageUrl, track.title)}
                          className="p-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white transition-colors"
                          title="Download cover"
                        >
                          <Download className="size-3.5" />
                        </button>
                      )}
                      {!isDeletingThis && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTrack({
                              id: track.id,
                              title: track.title,
                              currentImageUrl: finalImageUrl || null,
                              expandedFeeling: track.generations?.[0]?.prompt_used || "Audio structural profile analysis established.",
                              originalPrompt: track.sentence_prompt || ""
                            });
                            setIsTuneOpen(true);
                          }}
                          className="p-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white transition-colors"
                          title="Tune this cover"
                        >
                          <Sliders className="size-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isDeletingThis}
                        onClick={(e) => {
                          e.stopPropagation()
                          setTrackToDelete({ id: track.id, title: track.title })
                        }}
                        className="p-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white/80 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Delete track"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Caption — a museum label, not a dashboard row. */}
                  <div className="mt-2.5 min-w-0">
                    <p className="font-display italic text-base text-foreground truncate">{track.title}</p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 truncate mt-0.5">
                      {isComplete
                        ? `${track.track_type === "vocal" ? "Vocal" : "Beat"} · ${displayDate}`
                        : `${track.status}…`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* DIALOG TWO: Tune Workspace */}
      <Dialog open={isTuneOpen} onOpenChange={(open) => { setIsTuneOpen(open); if (!open) setEditingTrack(null) }}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="w-[calc(100vw-2rem)] max-w-5xl max-h-[90dvh] overflow-y-auto scrollbar-custom bg-[#121212] border border-border/40 text-foreground p-0 rounded-3xl sm:w-full"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Tune Track Aesthetics</DialogTitle>
            <DialogDescription>Modify blueprint context parameters to regenerate active canvas art</DialogDescription>
          </DialogHeader>
          {editingTrack && (
            <TuningWorkspaceView
              uploadId={editingTrack.id}
              trackTitle={editingTrack.title}
              currentImageUrl={editingTrack.currentImageUrl}
              originalPrompt={editingTrack.originalPrompt}
              onClose={() => {
                setIsTuneOpen(false)
                setEditingTrack(null)
              }}
              onRegenerate={handleRegenerateArt}
              onRevertToInitial={(title, initialUrl) => {
                setSessionCoverCache(prev => ({ ...prev, [title]: initialUrl || "" }))
                setUploads(prev => prev.map(u => {
                  if (u.title === title) {
                    return { ...u, generations: u.generations ? u.generations.slice(1) : [] }
                  }
                  return u
                }))
              }}
              onAcceptChange={() => {
                fetchDashboardData()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* NEW CUSTOM CONFIRMATION MODAL*/}
      <Dialog open={trackToDelete !== null} onOpenChange={(open) => { if (!open) { setTrackToDelete(null); setDeleteError(null) } }}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md bg-[#161616] border border-border/60 text-foreground p-6 rounded-3xl sm:w-full font-sans">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-500">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="font-display italic text-2xl tracking-tight text-foreground">
              Purge Track Blueprint?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Are you sure you want to permanently delete <span className="text-foreground font-semibold italic">&quot;{trackToDelete?.title}&quot;</span>? This will instantly destroy the database row, its fine-art cover layers, and the audio binaries off the storage cluster.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 mt-2">
              <p className="font-mono text-[9px] text-destructive tracking-wide text-center">{deleteError}</p>
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              disabled={deletingTrackId !== null}
              onClick={() => { setTrackToDelete(null); setDeleteError(null) }}
              className="rounded-full border-border/60 hover:bg-foreground/5 font-mono text-[9px] uppercase tracking-widest h-10 w-full sm:w-28"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deletingTrackId !== null}
              onClick={executeTrackPurge}
              className="rounded-full bg-red-500 hover:bg-red-600 text-white font-mono text-[9px] uppercase tracking-widest h-10 w-full sm:w-32 flex items-center justify-center gap-1.5"
            >
              {deletingTrackId !== null ? (
                <>
                  <Loader2 className="size-3 animate-spin" /> Purging...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

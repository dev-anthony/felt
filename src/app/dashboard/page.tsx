"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Plus, ArrowUpRight, Image as ImageIcon, Sliders, Loader2, Music4, Download, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { WorkspaceWizard } from "@/components/dashboard/workspace-wizard"
import { TuningWorkspaceView } from "@/components/dashboard/tunning-workspace-view"
import { useUser } from "@/context/userContext" 
import { uploadApi, UploadRecord, generationApi } from "@/lib/api"
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
  
  
  const fetchDashboardData = React.useCallback(async () => {
    try {
      const data = await uploadApi.getUploads(20, 0)
      setUploads(data.uploads || [])
    } catch (err) {
      console.error("Failed to parse real upload streams:", err)
    } finally {
      setLoadingUploads(false)
    }
  }, [])

  React.useEffect(() => {
    if (!userLoading && user) {
      fetchDashboardData()
    }
  }, [userLoading, user, fetchDashboardData])

  const executeTrackPurge = async () => {
    if (!trackToDelete) return

    try {
      setDeletingTrackId(trackToDelete.id)
      await uploadApi.deleteTrack(trackToDelete.id)
      setUploads(prev => prev.filter(track => track.id !== trackToDelete.id))
      console.log(`[DASHBOARD CORE] Track ${trackToDelete.id} purged successfully via backend trigger hook.`)
      setTrackToDelete(null)
    } catch (err) {
      console.error("Critical failure during backend detachment cleanup cycle:", err)
      alert("Failed to delete asset. Please try again.")
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

  const handleRegenerateArt = async (uploadId: string, updatedPrompt: string, expandedDescription?: string) => {
    try {
      const result = await generationApi.refine({
        upload_id: uploadId,
        lyric_context: expandedDescription && expandedDescription.trim() !== "" ? expandedDescription : updatedPrompt, 
        image_url: editingTrack?.currentImageUrl 
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

    } catch (err: any) {
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

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Operational Matrix — Welcome {user?.name || "Creator"}
          </span>
          <h1 className="font-display italic text-4xl tracking-tight">Artist Studio</h1>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-widest uppercase h-11 px-6">
              <Plus className="mr-2 size-4" /> New Upload
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="w-[calc(100vw-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-border/40 text-foreground p-0 rounded-none sm:w-full"
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

      {/* History grid */}
      <div className="space-y-4">
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
          <div className="w-full min-h-[350px] border border-dashed border-border/20 flex flex-col items-center justify-center p-8 text-center bg-foreground/[0.01]">
            <Music4 className="size-8 text-muted-foreground/20 stroke-[1px] mb-4" />
            <p className="font-display italic text-xl text-foreground mb-1">The canvas is silent.</p>
            <p className="font-sans text-xs text-muted-foreground max-w-xs mx-auto mb-6">
              You haven't uploaded any sounds yet. Initiate your first acoustic analysis blueprint to manifest artwork.
            </p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="rounded-none border border-border bg-transparent text-foreground hover:bg-foreground/5 font-mono text-[9px] tracking-widest uppercase h-9 px-4"
            >
              Initiate First Upload
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uploads.map((track) => {
              const dbImage = track.generations?.[0]?.image_url
              const cachedImage = sessionCoverCache[track.title]
              const finalImageUrl = dbImage || cachedImage
              
              const displayDate = new Date(track.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
              })

              const isDeletingThis = deletingTrackId === track.id

              return (
                <Card
                  key={track.id}
                  className="bg-[#0e0e0e] border border-border/20 rounded-none group hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase px-1.5 py-0.5 bg-foreground/5">
                        {track.track_type === 'vocal' ? 'Vocal' : 'Beat'}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">{displayDate}</span>
                    </div>
                    <CardTitle className="font-display italic text-xl text-foreground group-hover:text-accent transition-colors truncate">
                      {track.title}
                    </CardTitle>
                    <div className="flex items-center justify-between mt-1">
                      <CardDescription className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground/70">
                        Status: <span className="text-accent">{track.status}</span>
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <div className="aspect-square w-full bg-foreground/[0.02] border border-border/20 flex flex-col items-center justify-center relative group-hover:bg-foreground/[0.04] transition-all">
                      {finalImageUrl ? (
                        <img 
                          src={finalImageUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <>
                          <ImageIcon className="size-8 text-muted-foreground/30 stroke-[1px] mb-2" />
                          <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50">No Cover Bound</span>
                        </>
                      )}

                      {/* Floating Control Toolkit (Top-Right Stack) */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {/* Download Trigger Action */}
                        {finalImageUrl && !isDeletingThis && (
                          <button
                            type="button"
                            onClick={(e) => handleDownloadImage(e, finalImageUrl, track.title)}
                            className="p-1.5 bg-[#080808]/90 backdrop-blur-xs border border-border/40 text-muted-foreground hover:text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            title="Download Fine-Art Cover Layer"
                          >
                            <Download className="size-3.5" />
                          </button>
                        )}

                        {/* Adjust Matrix Settings Slider */}
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
                            className="p-1.5 bg-[#080808]/90 backdrop-blur-xs border border-border/40 text-muted-foreground hover:text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            title="Tune Generation Prompt & Matrix Blueprint"
                          >
                            <Sliders className="size-3.5" />
                          </button>
                        )}

                        {/* Custom Trigger: Stages the Track inside state to trigger dialogue hook */}
                        <button
                          type="button"
                          disabled={isDeletingThis}
                          onClick={(e) => {
                            e.stopPropagation()
                            setTrackToDelete({ id: track.id, title: track.title })
                          }}
                          className="p-1.5 bg-[#080808]/90 backdrop-blur-xs border border-border/40 text-muted-foreground hover:text-red-500 hover:border-red-500/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          title="Purge Track Matrix & Audio From Server"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
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
          className="w-[calc(100vw-2rem)] max-w-4xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-border/40 text-foreground p-0 rounded-none sm:w-full"
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
      <Dialog open={trackToDelete !== null} onOpenChange={(open) => { if (!open) setTrackToDelete(null) }}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md bg-[#161616] border border-border/60 text-foreground p-6 rounded-none sm:w-full font-sans">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-none text-red-500">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="font-display italic text-2xl tracking-tight text-foreground">
              Purge Track Blueprint?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Are you sure you want to permanently delete <span className="text-foreground font-semibold italic">"{trackToDelete?.title}"</span>? This will instantly destroy the database row, its fine-art cover layers, and the audio binaries off the storage cluster.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              disabled={deletingTrackId !== null}
              onClick={() => setTrackToDelete(null)}
              className="rounded-none border-border/60 hover:bg-foreground/5 font-mono text-[9px] uppercase tracking-widest h-10 w-full sm:w-28"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deletingTrackId !== null}
              onClick={executeTrackPurge}
              className="rounded-none bg-red-500 hover:bg-red-600 text-white font-mono text-[9px] uppercase tracking-widest h-10 w-full sm:w-32 flex items-center justify-center gap-1.5"
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
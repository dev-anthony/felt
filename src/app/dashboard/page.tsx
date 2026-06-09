"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, ArrowUpRight, Image as ImageIcon, Sliders } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { WorkspaceWizard } from "@/components/dashboard/workspace-wizard"
import { TuningWorkspaceView } from "@/components/dashboard/tunning-workspace-view"

const INITIAL_MOCK_HISTORY = [
  { id: "1", title: "Midnight Solitude", type: "Vocal", date: "2 hours ago", img: null, filter: "Noir", filterId: "f-1", variant: "Variant Alpha" },
  { id: "2", title: "Neon Skyline", type: "Beat", date: "Yesterday", img: null, filter: "Chroma", filterId: "f-2", variant: "Variant Beta" },
  { id: "3", title: "Ethereal Echoes", type: "Vocal", date: "3 days ago", img: null, filter: "Muted Sage", filterId: "f-3", variant: "Variant Alpha" },
]

export default function DashboardPage() {
  const router = useRouter()

  const [history, setHistory] = React.useState(INITIAL_MOCK_HISTORY)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [isTuneOpen, setIsTuneOpen] = React.useState(false)

  const [editingTrack, setEditingTrack] = React.useState<{
    id: string
    title: string
    filterId: string
    variant: string
  } | null>(null)

  const handleFreshGenerationComplete = (title: string, trackType: string, filterId: string) => {
    const formattedFilter = filterId === "f-2" ? "Chroma" : filterId === "f-3" ? "Muted Sage" : "Noir"
    const newRecord = {
      id: String(Date.now()),
      title: title || "Untitled Concept",
      type: trackType === "vocal" ? "Vocal" : "Beat",
      date: "Just now",
      img: null,
      filter: formattedFilter,
      filterId: filterId,
      variant: "Variant Alpha",
    }
    setHistory((prev) => [newRecord, ...prev])
    setIsUploadOpen(false)
  }

  const handleSaveTunedUpdates = (filterId: string, variantName: string) => {
    if (!editingTrack) return

    const filterNames: Record<string, string> = {
      "f-1": "Noir", "f-2": "Chroma", "f-3": "NEON MINT",
      "f-4": "MUTED SAGE", "f-5": "VELVET DUSK", "f-6": "SOLARIS",
    }

    setHistory(prev => prev.map(item =>
      item.id === editingTrack.id
        ? { ...item, filterId, filter: filterNames[filterId] || "Noir", variant: variantName, date: "Edited just now" }
        : item
    ))
    setIsTuneOpen(false)
    setEditingTrack(null)
  }

  const handleOpenFilterEdit = (trackId: string) => {
    const track = history.find(t => t.id === trackId)
    if (track) {
      setEditingTrack({ id: track.id, title: track.title, filterId: track.filterId || "f-1", variant: track.variant || "Variant Alpha" })
      setIsTuneOpen(true)
    }
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Operational Matrix
          </span>
          <h1 className="font-display italic text-4xl tracking-tight">Artist Studio</h1>
        </div>

        {/* DIALOG ONE: Upload */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-widest uppercase h-11 px-6">
              <Plus className="mr-2 size-4" /> New Upload
            </Button>
          </DialogTrigger>
          <DialogContent
           onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="
            w-[calc(100vw-2rem)] max-w-xl
            max-h-[90dvh] overflow-y-auto
            bg-[#121212] border border-border/40 text-foreground
            p-0 rounded-none
            sm:w-full
          ">
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
            Recent Generations ({history.length})
          </h2>
          <Button
            variant="link"
            onClick={() => router.push("/dashboard/gallery")}
            className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-foreground p-0 h-auto"
          >
            View Full Gallery <ArrowUpRight className="ml-1 size-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {history.map((track) => (
            <Card
              key={track.id}
              className="bg-[#0e0e0e] border border-border/20 rounded-none group hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase px-1.5 py-0.5 bg-foreground/5">
                    {track.type}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground">{track.date}</span>
                </div>
                <CardTitle className="font-display italic text-xl text-foreground group-hover:text-accent transition-colors">
                  {track.title}
                </CardTitle>
                <div className="flex items-center justify-between mt-1">
                  <CardDescription className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground/70">
                    Style: {track.filter}
                  </CardDescription>
                  <span className="font-mono text-[8px] text-accent border border-accent/20 px-1 uppercase tracking-tighter">
                    {track.variant}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="aspect-square w-full bg-foreground/[0.02] border border-border/20 flex flex-col items-center justify-center relative group-hover:bg-foreground/[0.04] transition-all">
                  <ImageIcon className="size-8 text-muted-foreground/30 stroke-[1px] mb-2" />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50">No Cover Bound</span>

                  {/* Refactored button classes: Visible natively on mobile, deferred via md: properties on desktops */}
                  <button
                    onClick={() => handleOpenFilterEdit(track.id)}
                    className="absolute top-3 right-3 p-1.5 bg-[#080808] border border-border/40 text-muted-foreground hover:text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    title="Tune Style & Model Variant"
                  >
                    <Sliders className="size-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* DIALOG TWO: Tune */}
      <Dialog open={isTuneOpen} onOpenChange={(open) => { setIsTuneOpen(open); if (!open) setEditingTrack(null) }}>
        <DialogContent 
         onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        className="
          w-[calc(100vw-2rem)] max-w-md
          max-h-[90dvh] overflow-y-auto
          bg-[#121212] border border-border/40 text-foreground
          p-0 rounded-none
          sm:w-full
        ">
          <DialogHeader className="sr-only">
            <DialogTitle>Tune Track Aesthetics</DialogTitle>
            <DialogDescription>Modify filter values or switch active style generation layer variants</DialogDescription>
          </DialogHeader>
          {editingTrack && (
            <TuningWorkspaceView
              trackTitle={editingTrack.title}
              initialFilterId={editingTrack.filterId}
              initialVariant={editingTrack.variant}
              onClose={() => { setIsTuneOpen(false); setEditingTrack(null) }}
              onSaveUpdates={handleSaveTunedUpdates}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, ArrowUpRight, Music, Image as ImageIcon, Sliders } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Internal wizard element
import { WorkspaceWizard } from "@/components/dashboard/workspace-wizard"

// Simulated static history data matching returning artist requirements
const INITIAL_MOCK_HISTORY = [
  { id: "1", title: "Midnight Solitude", type: "Vocal", date: "2 hours ago", img: null, filter: "Noir" },
  { id: "2", title: "Neon Skyline", type: "Beat", date: "Yesterday", img: null, filter: "Chroma" },
  { id: "3", title: "Ethereal Echoes", type: "Vocal", date: "3 days ago", img: null, filter: "Muted Sage" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [history, setHistory] = React.useState(INITIAL_MOCK_HISTORY)

  // Injects generated data fields cleanly into local list layout matrices on complete
  const handleGenerationComplete = (title: string, trackType: string, filterId: string) => {
    const formattedFilter = filterId === "f-1" ? "Noir" : filterId === "f-2" ? "Chroma" : "Custom Filter"
    const newRecord = {
      id: String(Date.now()),
      title: title || "Untitled Concept",
      type: trackType === "vocal" ? "Vocal" : "Beat",
      date: "Just now",
      img: null,
      filter: formattedFilter
    }
    setHistory((prev) => [newRecord, ...prev])
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Dynamic Upper Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Operational Matrix
          </span>
          <h1 className="font-display italic text-4xl tracking-tight">Artist Studio</h1>
        </div>

        {/* Global Action Modal Core Controller */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-widest uppercase h-11 px-6">
              <Plus className="mr-2 size-4" /> New Upload
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="sm:max-w-xl bg-[#121212] border border-border/40 text-foreground p-0 rounded-none overflow-hidden"
            // Block accidental mouse or touch pointer backdrop clicks from destroying wizard state progress
            onInteractOutside={(event) => event.preventDefault()}
            // Optional: Prevent the escape key from accidentally closing it mid-generation
            onEscapeKeyDown={(event) => event.preventDefault()}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Create New Audio Generation Canvas</DialogTitle>
              <DialogDescription>
                Upload tracks or instrumentals to analyze acoustic signatures and craft custom artwork variants.
              </DialogDescription>
            </DialogHeader>
            <WorkspaceWizard 
              onClose={() => setIsModalOpen(false)} 
              onCompleteGeneration={handleGenerationComplete}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Historical Generation Canvas Container */}
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

        {/* Dashboard Grid Frame Component Layout */}
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
                <CardDescription className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground/70">
                  Style Template: {track.filter}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                {/* Visual Thumbnail Placeholder Frame with Trigger Hook */}
                <div className="aspect-square w-full bg-foreground/[0.02] border border-border/20 flex flex-col items-center justify-center relative group-hover:bg-foreground/[0.04] transition-all">
                  <ImageIcon className="size-8 text-muted-foreground/30 stroke-[1px] mb-2" />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50">No Cover Bound</span>
                  
                  {/* Direct Action Link Triggering Re-Steer Window Edit Context */}
                  <button 
                    onClick={() => {
                      setIsModalOpen(true)
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-[#080808] border border-border/40 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Re-steer parameters"
                  >
                    <Sliders className="size-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}
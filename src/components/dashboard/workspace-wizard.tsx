"use client"

import * as React from "react"
import { Upload, Music, Disc, Loader2 } from "lucide-react"
import { GenerationStep, TrackMetadata, TrackType } from "@/types/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProcessingView } from "@/components/dashboard/processing-view"
import { FeelingExpanderView } from "@/components/dashboard/feeling-expander-view"
import { FilterSelectionView } from "@/components/dashboard/filter-selection-view"
import { ArtGenerationView } from "@/components/dashboard/art-generation-view"
import { VariantResultsView } from "@/components/dashboard/variant-results-view"
import { uploadApi } from "@/lib/api" // Imported network tier

interface WorkspaceWizardProps {
  onClose: () => void
  onCompleteGeneration: (title: string, type: string, filterId: string, variantId?: string) => void
  editTrack?: {
    id: string
    title: string
    type: "vocal" | "instrumental"
    filterId: string
    variant: string
  }
}

export function WorkspaceWizard({ onClose, onCompleteGeneration, editTrack }: WorkspaceWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<GenerationStep>(
    editTrack ? "FILTER_SELECTION" : "UPLOAD"
  )
  
  const [trackType, setTrackType] = React.useState<TrackType>(editTrack?.type || "vocal")
  const [title, setTitle] = React.useState(editTrack?.title || "")
  const [prompt, setPrompt] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false) // Core loading lock
  const [errorMessage, setErrorMessage] = React.useState("")
  
  const [activeTrackId, setActiveTrackId] = React.useState<string | null>(null)
  const [metadata, setMetadata] = React.useState<TrackMetadata>({
    title: editTrack?.title || "",
    type: editTrack?.type || "vocal",
    sentencePrompt: "",
    selectedFilterId: editTrack?.filterId || ""
  })

  const processAudioFile = (selectedFile: File) => {
    setErrorMessage("")
    const isValidType = selectedFile.type === "audio/mpeg" || selectedFile.type === "audio/wav" || selectedFile.name.endsWith(".mp3") || selectedFile.name.endsWith(".wav")
    if (!isValidType) {
      setErrorMessage("Unsupported format. Please upload an MP3 or WAV file.")
      return
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setErrorMessage("File exceeds the 20MB tier limitation.")
      return
    }
    setFile(selectedFile)
    if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
  }

  // Submit Handler connected to the live endpoint
  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !prompt || isUploading) return

    setIsUploading(true)
    setErrorMessage("")

    try {
      const response = await uploadApi.uploadTrack(file, title, prompt, trackType)
      setActiveTrackId(response.track.id)
      
      // Update metadata tracking tree state variables
      setMetadata({
        title,
        type: trackType,
        sentencePrompt: prompt,
        selectedFilterId: ""
      })

      if (trackType === "instrumental") {
        setCurrentStep("FEELING_EXPANDER")
      } else {
        setCurrentStep("PROCESSING")
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Audio analysis uplink failed.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full bg-[#121212] flex flex-col relative overflow-x-hidden min-w-0">
      <div className="h-1 bg-foreground/5 w-full relative overflow-hidden shrink-0">
        <div 
          className="h-full bg-accent transition-all duration-300" 
          style={{ 
            width: currentStep === "UPLOAD" ? "20%" : 
                   currentStep === "FILTER_SELECTION" ? "60%" : 
                   currentStep === "RESULTS" ? "100%" : "40%" 
          }}
        />
      </div>

      <form onSubmit={handleProceed} className="p-5 sm:p-6 flex-1 flex flex-col justify-center min-w-0 w-full overflow-x-hidden">
        {currentStep === "UPLOAD" && (
          <div className="space-y-4 w-full min-w-0">
            <div className="grid grid-cols-2 gap-2 p-1 bg-background border border-border/40 shrink-0">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setTrackType("vocal")}
                className={`flex items-center justify-center gap-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                  trackType === "vocal" ? "bg-[#1c1c1c] text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Music className="size-3.5" /> Vocals / Song
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setTrackType("instrumental")}
                className={`flex items-center justify-center gap-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                  trackType === "instrumental" ? "bg-[#1c1c1c] text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Disc className="size-3.5" /> Beat
              </button>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); if (!isUploading) setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (!isUploading && e.dataTransfer.files?.[0]) processAudioFile(e.dataTransfer.files[0]); }}
              className={`border border-dashed p-6 text-center flex flex-col items-center justify-center relative min-h-[140px] min-w-0 w-full ${
                isDragging ? "border-accent bg-foreground/[0.02]" : "border-border/60"
              }`}
            >
              <input type="file" id="audio-upload-input" accept=".mp3,.wav" disabled={isUploading} className="hidden" onChange={(e) => { if (e.target.files?.[0]) processAudioFile(e.target.files[0]); }} />
              <label htmlFor="audio-upload-input" className="cursor-pointer w-full h-full flex flex-col items-center justify-center min-w-0">
                <Upload className={`size-6 mb-2.5 ${file ? "text-accent" : "text-muted-foreground/60"}`} />
                {file ? (
                  <div className="space-y-1 w-full min-w-0 px-2">
                    <p className="font-sans text-xs text-foreground font-medium max-w-full truncate mx-auto">{file.name}</p>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-foreground">Drag & drop your file or <span className="text-accent underline">browse</span></p>
                )}
              </label>
            </div>

            {errorMessage && <p className="font-mono text-[10px] text-destructive text-center break-words">{errorMessage}</p>}

            <div className="space-y-3 pt-1 min-w-0">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Track Title</label>
                <Input placeholder="Title..." value={title} disabled={isUploading} onChange={(e) => setTitle(e.target.value)} required className="rounded-none bg-background border-border/40 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Prompt Description</label>
                <Input placeholder="Vibes..." value={prompt} disabled={isUploading} onChange={(e) => setPrompt(e.target.value)} required className="rounded-none bg-background border-border/40 text-sm" />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20 mt-2 shrink-0">
              <Button type="button" variant="ghost" disabled={isUploading} onClick={onClose} className="font-mono text-[10px] tracking-widest uppercase rounded-none h-9 px-4">Cancel</Button>
              <Button type="submit" disabled={!file || !title || !prompt || isUploading} className="font-mono text-[10px] tracking-widest uppercase rounded-none bg-foreground text-background h-9 px-4">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 size-3 animate-spin" /> Analyzing...
                  </>
                ) : (
                  "Analyze Track"
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === "PROCESSING" && (
          <ProcessingView title={title} onComplete={() => setCurrentStep("FILTER_SELECTION")} />
        )}

        {currentStep === "FEELING_EXPANDER" && (
          <FeelingExpanderView
            userPrompt={prompt}
            onApprove={(expandedBrief) => {
              setMetadata(prev => ({ ...prev, expandedBrief }))
              setCurrentStep("PROCESSING")
            }}
            onStartOver={() => { setTitle(""); setPrompt(""); setFile(null); setCurrentStep("UPLOAD"); }}
          />
        )}

        {currentStep === "FILTER_SELECTION" && (
          <FilterSelectionView
            trackTitle={title}
            onProceed={(filterId) => {
              setMetadata(prev => ({ ...prev, selectedFilterId: filterId }))
              setCurrentStep("GENERATING_ART")
            }}
          />
        )}

        {currentStep === "GENERATING_ART" && (
          <ArtGenerationView onComplete={() => setCurrentStep("RESULTS")} />
        )}

        {currentStep === "RESULTS" && (
          <VariantResultsView
            trackTitle={title}
            onRegenerate={() => setCurrentStep("GENERATING_ART")}
            onSave={(variantId) => {
              onCompleteGeneration(title, trackType, metadata.selectedFilterId || "f-1", variantId)
            }}
          />
        )}
      </form>
    </div>
  )
}
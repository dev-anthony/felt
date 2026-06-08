"use client"

import * as React from "react"
import { Upload, Music, Disc } from "lucide-react"
import { GenerationStep, TrackMetadata, TrackType } from "@/types/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProcessingView } from "@/components/dashboard/processing-view"
import { FeelingExpanderView } from "@/components/dashboard/feeling-expander-view"
import { FilterSelectionView } from "@/components/dashboard/filter-selection-view"
import { ArtGenerationView } from "@/components/dashboard/art-generation-view"
import { VariantResultsView } from "@/components/dashboard/variant-results-view"

interface WorkspaceWizardProps {
  onClose: () => void
  onCompleteGeneration: (title: string, type: string, filterId: string) => void
}

export function WorkspaceWizard({ onClose, onCompleteGeneration }: WorkspaceWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<GenerationStep>("UPLOAD")
  const [metadata, setMetadata] = React.useState<TrackMetadata>({
    title: "",
    type: "vocal",
    sentencePrompt: "",
  })
  const [trackType, setTrackType] = React.useState<TrackType>("vocal")
  const [title, setTitle] = React.useState("")
  const [prompt, setPrompt] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  
  // Drag state boundary variables
  const [isDragging, setIsDragging] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  // Validate and bind files dropped/selected
  const processAudioFile = (selectedFile: File) => {
    setErrorMessage("")
    
    const isValidType = selectedFile.type === "audio/mpeg" || selectedFile.type === "audio/wav" || selectedFile.name.endsWith(".mp3") || selectedFile.name.endsWith(".wav")
    if (!isValidType) {
      setErrorMessage("Unsupported format. Please upload an MP3 or WAV file.")
      return
    }

    const isUnderLimit = selectedFile.size <= 20 * 1024 * 1024 // 20 Megabytes
    if (!isUnderLimit) {
      setErrorMessage("File exceeds the 20MB free tier upload limitation.")
      return
    }

    setFile(selectedFile)
    if (!title) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "") // Remove extensions
      setTitle(cleanName)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAudioFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAudioFile(e.target.files[0])
    }
  }

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !prompt) return

    if (trackType === "instrumental") {
      setCurrentStep("FEELING_EXPANDER")
    } else {
      setCurrentStep("PROCESSING")
    }
  }

  return (
    <div className="w-full bg-[#121212] flex flex-col min-h-[500px]">
      
      {/* Visual Context State Tracker */}
      <div className="h-1 bg-foreground/5 w-full relative overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-300" 
          style={{ width: currentStep === "UPLOAD" ? "20%" : currentStep === "FEELING_EXPANDER" ? "40%" : "35%" }}
        />
      </div>

      <form onSubmit={handleProceed} className="p-6 flex-1 flex flex-col justify-between space-y-6">
        
        {currentStep === "UPLOAD" && (
          <>
            <div className="space-y-4">
              {/* Context Selector Tab Buttons */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-background border border-border/40">
                <button
                  type="button"
                  onClick={() => setTrackType("vocal")}
                  className={`flex items-center justify-center gap-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                    trackType === "vocal" ? "bg-[#1c1c1c] text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Music className="size-3.5" /> Full Vocal Track
                </button>
                <button
                  type="button"
                  onClick={() => setTrackType("instrumental")}
                  className={`flex items-center justify-center gap-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                    trackType === "instrumental" ? "bg-[#1c1c1c] text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Disc className="size-3.5" /> Instrumental / Beat
                </button>
              </div>

              {/* Drag and Drop Zone Canvas Frame */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border border-dashed p-8 text-center flex flex-col items-center justify-center relative min-h-[160px] transition-colors duration-200 ${
                  isDragging ? "border-accent bg-foreground/[0.02]" : "border-border/60 hover:border-border"
                } ${file ? "border-solid border-accent/40 bg-accent/[0.01]" : ""}`}
              >
                <input
                  type="file"
                  id="audio-upload-input"
                  accept=".mp3,.wav,audio/mpeg,audio/wav"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <label htmlFor="audio-upload-input" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                  <Upload className={`size-7 mb-3 stroke-[1.25px] ${file ? "text-accent" : "text-muted-foreground/60"}`} />
                  {file ? (
                    <div className="space-y-1">
                      <p className="font-sans text-sm text-foreground font-medium max-w-[280px] truncate mx-auto">{file.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wide">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Change File
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-sans text-sm text-foreground">Drag & drop your file or <span className="text-accent underline underline-offset-2">browse</span></p>
                      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">MP3, WAV • Max 20MB</p>
                    </div>
                  )}
                </label>
              </div>

              {errorMessage && (
                <p className="font-mono text-[10px] text-destructive tracking-wide text-center bg-destructive/5 py-1.5 border border-destructive/20">
                  {errorMessage}
                </p>
              )}

              {/* Text Input Metadata Parameters */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Track Title</label>
                  <Input 
                    placeholder="Enter production title..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="rounded-none bg-background border-border/40 focus-visible:border-border h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {trackType === "vocal" ? "What is this song about in one sentence?" : "What does this beat feel like? Who is it for?"}
                  </label>
                  <Input 
                    placeholder={trackType === "vocal" ? "e.g., A bittersweet parting under city neon lights" : "e.g., late night hard vibes for driving solo"} 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    className="rounded-none bg-background border-border/40 focus-visible:border-border h-10"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar Sub-block */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-4"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!file || !title || !prompt}
                className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30"
              >
                Analyze Track
              </Button>
            </div>
          </>
        )}

        {currentStep === "PROCESSING" && (
          <ProcessingView 
            title={title} 
            onComplete={() => setCurrentStep("FILTER_SELECTION")} 
          />
        )}

        {currentStep === "FEELING_EXPANDER" && (
          <FeelingExpanderView
            userPrompt={prompt}
            onApprove={(expandedBrief) => {
              setMetadata(prev => ({ ...prev, expandedBrief }))
              setCurrentStep("PROCESSING")
            }}
            // Instead of wiping files and forcing a full step back, 
            // the edit handling is managed locally inline inside FeelingExpanderView now!
            onStartOver={() => {
              setTitle("")
              setPrompt("")
              setFile(null)
              setCurrentStep("UPLOAD")
            }}
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
          <ArtGenerationView 
            onComplete={() => setCurrentStep("RESULTS")} 
          />
        )}

        {currentStep === "RESULTS" && (
          <VariantResultsView
            onRegenerate={() => setCurrentStep("GENERATING_ART")}
            onSave={(variantId) => {
              console.log("Saving chosen artwork instance anchor:", variantId)
              onCompleteGeneration(title, trackType, metadata.selectedFilterId || "f-1")
            }}
          />
        )}

      </form>
    </div>
  )
}
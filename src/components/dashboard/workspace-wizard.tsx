// "use client"

// import * as React from "react"
// import { Upload, Music, Disc } from "lucide-react"
// import { GenerationStep, TrackMetadata, TrackType } from "@/types/dashboard"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ProcessingView } from "@/components/dashboard/processing-view"
// import { FeelingExpanderView } from "@/components/dashboard/feeling-expander-view"
// import { FilterSelectionView } from "@/components/dashboard/filter-selection-view"
// import { ArtGenerationView } from "@/components/dashboard/art-generation-view"
// import { VariantResultsView } from "@/components/dashboard/variant-results-view"

// interface WorkspaceWizardProps {
//   onClose: () => void
//   onCompleteGeneration: (title: string, type: string, filterId: string, variantId?: string) => void
//   editTrack?: {
//     id: string
//     title: string
//     type: "vocal" | "instrumental"
//     filterId: string
//     variant: string
//   }
// }

// export function WorkspaceWizard({ onClose, onCompleteGeneration, editTrack }: WorkspaceWizardProps) {
//   // If editing, skip straight to filter parameters selection mode config steps
//   const [currentStep, setCurrentStep] = React.useState<GenerationStep>(
//     editTrack ? "FILTER_SELECTION" : "UPLOAD"
//   )
  
//   const [metadata, setMetadata] = React.useState<TrackMetadata>({
//     title: editTrack?.title || "",
//     type: editTrack?.type || "vocal",
//     sentencePrompt: "",
//     selectedFilterId: editTrack?.filterId || ""
//   })
  
//   const [trackType, setTrackType] = React.useState<TrackType>(editTrack?.type || "vocal")
//   const [title, setTitle] = React.useState(editTrack?.title || "")
//   const [prompt, setPrompt] = React.useState("")
//   const [file, setFile] = React.useState<File | null>(null)
  
//   const [isDragging, setIsDragging] = React.useState(false)
//   const [errorMessage, setErrorMessage] = React.useState("")

//   const processAudioFile = (selectedFile: File) => {
//     setErrorMessage("")
//     const isValidType = selectedFile.type === "audio/mpeg" || selectedFile.type === "audio/wav" || selectedFile.name.endsWith(".mp3") || selectedFile.name.endsWith(".wav")
//     if (!isValidType) {
//       setErrorMessage("Unsupported format. Please upload an MP3 or WAV file.")
//       return
//     }
//     if (selectedFile.size > 20 * 1024 * 1024) {
//       setErrorMessage("File exceeds the 20MB free tier upload limitation.")
//       return
//     }
//     setFile(selectedFile)
//     if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
//   }

//   const handleProceed = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!file || !title || !prompt) return

//     if (trackType === "instrumental") {
//       setCurrentStep("FEELING_EXPANDER")
//     } else {
//       setCurrentStep("PROCESSING")
//     }
//   }

//   return (
//     <div className="w-full bg-[#121212] flex flex-col min-h-[500px]">
      
//       {/* Visual Context State Progress Tracker Indicator */}
//       <div className="h-1 bg-foreground/5 w-full relative overflow-hidden">
//         <div 
//           className="h-full bg-accent transition-all duration-300" 
//           style={{ 
//             width: currentStep === "UPLOAD" ? "20%" : 
//                    currentStep === "FILTER_SELECTION" ? "60%" : 
//                    currentStep === "RESULTS" ? "100%" : "40%" 
//           }}
//         />
//       </div>

//       <form onSubmit={handleProceed} className="p-6 flex-1 flex flex-col justify-between space-y-6">
        
//         {currentStep === "UPLOAD" && (
//           <>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-2 p-1 bg-background border border-border/40">
//                 <button
//                   type="button"
//                   onClick={() => setTrackType("vocal")}
//                   className={`flex items-center justify-center gap-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
//                     trackType === "vocal" ? "bg-[#1c1c1c] text-foreground" : "text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   <Music className="size-3.5" /> Full Vocal Track
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setTrackType("instrumental")}
//                   className={`flex items-center justify-center gap-2 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
//                     trackType === "instrumental" ? "bg-[#1c1c1c] text-foreground" : "text-muted-foreground hover:text-foreground"
//                   }`}
//                 >
//                   <Disc className="size-3.5" /> Instrumental / Beat
//                 </button>
//               </div>

//               <div
//                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//                 onDragLeave={() => setIsDragging(false)}
//                 onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) processAudioFile(e.dataTransfer.files[0]); }}
//                 className={`border border-dashed p-8 text-center flex flex-col items-center justify-center relative min-h-[160px] ${
//                   isDragging ? "border-accent bg-foreground/[0.02]" : "border-border/60"
//                 }`}
//               >
//                 <input type="file" id="audio-upload-input" accept=".mp3,.wav" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processAudioFile(e.target.files[0]); }} />
//                 <label htmlFor="audio-upload-input" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
//                   <Upload className={`size-7 mb-3 ${file ? "text-accent" : "text-muted-foreground/60"}`} />
//                   {file ? (
//                     <div className="space-y-1">
//                       <p className="font-sans text-sm text-foreground font-medium max-w-[280px] truncate mx-auto">{file.name}</p>
//                     </div>
//                   ) : (
//                     <p className="font-sans text-sm text-foreground">Drag & drop your file or <span className="text-accent underline">browse</span></p>
//                   )}
//                 </label>
//               </div>

//               {errorMessage && <p className="font-mono text-[10px] text-destructive text-center">{errorMessage}</p>}

//               <div className="space-y-3 pt-2">
//                 <div className="space-y-1.5">
//                   <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Track Title</label>
//                   <Input placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-none bg-background border-border/40" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Prompt Description</label>
//                   <Input placeholder="Vibes..." value={prompt} onChange={(e) => setPrompt(e.target.value)} required className="rounded-none bg-background border-border/40" />
//                 </div>
//               </div>
//             </div>

//             <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20">
//               <Button type="button" variant="ghost" onClick={onClose} className="font-mono text-[10px] tracking-widest uppercase rounded-none">Cancel</Button>
//               <Button type="submit" disabled={!file || !title || !prompt} className="font-mono text-[10px] tracking-widest uppercase rounded-none bg-foreground text-background">Analyze Track</Button>
//             </div>
//           </>
//         )}

//         {currentStep === "PROCESSING" && (
//           <ProcessingView title={title} onComplete={() => setCurrentStep("FILTER_SELECTION")} />
//         )}

//         {currentStep === "FEELING_EXPANDER" && (
//           <FeelingExpanderView
//             userPrompt={prompt}
//             onApprove={(expandedBrief) => {
//               setMetadata(prev => ({ ...prev, expandedBrief }))
//               setCurrentStep("PROCESSING")
//             }}
//             onStartOver={() => { setTitle(""); setPrompt(""); setFile(null); setCurrentStep("UPLOAD"); }}
//           />
//         )}

//         {currentStep === "FILTER_SELECTION" && (
//           <FilterSelectionView
//             trackTitle={title}
//             onProceed={(filterId) => {
//               setMetadata(prev => ({ ...prev, selectedFilterId: filterId }))
//               setCurrentStep("GENERATING_ART")
//             }}
//           />
//         )}

//         {currentStep === "GENERATING_ART" && (
//           <ArtGenerationView onComplete={() => setCurrentStep("RESULTS")} />
//         )}

//         {currentStep === "RESULTS" && (
//           <VariantResultsView
//             onRegenerate={() => setCurrentStep("GENERATING_ART")}
//             onSave={(variantId) => {
//               // Safely pipe back state updates using current context configuration parameters
//               onCompleteGeneration(title, trackType, metadata.selectedFilterId || "f-1", variantId)
//             }}
//           />
//         )}

//       </form>
//     </div>
//   )
// }
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
  
  const [metadata, setMetadata] = React.useState<TrackMetadata>({
    title: editTrack?.title || "",
    type: editTrack?.type || "vocal",
    sentencePrompt: "",
    selectedFilterId: editTrack?.filterId || ""
  })
  
  const [trackType, setTrackType] = React.useState<TrackType>(editTrack?.type || "vocal")
  const [title, setTitle] = React.useState(editTrack?.title || "")
  const [prompt, setPrompt] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  
  const [isDragging, setIsDragging] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const processAudioFile = (selectedFile: File) => {
    setErrorMessage("")
    const isValidType = selectedFile.type === "audio/mpeg" || selectedFile.type === "audio/wav" || selectedFile.name.endsWith(".mp3") || selectedFile.name.endsWith(".wav")
    if (!isValidType) {
      setErrorMessage("Unsupported format. Please upload an MP3 or WAV file.")
      return
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setErrorMessage("File exceeds the 20MB free tier upload limitation.")
      return
    }
    setFile(selectedFile)
    if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
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
    /* Removed min-h fixed constraints; structured layout definitions to secure bounds */
    <div className="w-full bg-[#121212] flex flex-col relative overflow-hidden min-w-0">
      
      {/* Visual Context State Progress Tracker Indicator */}
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

      {/* Structured layout content window section container */}
      <form onSubmit={handleProceed} className="p-5 sm:p-6 flex-1 flex flex-col justify-center min-w-0 w-full overflow-hidden">
        
        {currentStep === "UPLOAD" && (
          <div className="space-y-4 w-full min-w-0">
            <div className="grid grid-cols-2 gap-2 p-1 bg-background border border-border/40 shrink-0">
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

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) processAudioFile(e.dataTransfer.files[0]); }}
              className={`border border-dashed p-6 text-center flex flex-col items-center justify-center relative min-h-[140px] min-w-0 w-full ${
                isDragging ? "border-accent bg-foreground/[0.02]" : "border-border/60"
              }`}
            >
              <input type="file" id="audio-upload-input" accept=".mp3,.wav" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processAudioFile(e.target.files[0]); }} />
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
                <Input placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-none bg-background border-border/40 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Prompt Description</label>
                <Input placeholder="Vibes..." value={prompt} onChange={(e) => setPrompt(e.target.value)} required className="rounded-none bg-background border-border/40 text-sm" />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20 mt-2 shrink-0">
              <Button type="button" variant="ghost" onClick={onClose} className="font-mono text-[10px] tracking-widest uppercase rounded-none h-9 px-4">Cancel</Button>
              <Button type="submit" disabled={!file || !title || !prompt} className="font-mono text-[10px] tracking-widest uppercase rounded-none bg-foreground text-background h-9 px-4">Analyze Track</Button>
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
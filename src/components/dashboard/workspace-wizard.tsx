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
import { uploadApi } from "@/lib/api"

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
  const [isUploading, setIsUploading] = React.useState(false)
  const [analysisStatus, setAnalysisStatus] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  
  const [activeTrackId, setActiveTrackId] = React.useState<string | null>(editTrack?.id || null)
  const [metadata, setMetadata] = React.useState<TrackMetadata>({
    title: editTrack?.title || "",
    type: editTrack?.type || "vocal",
    sentencePrompt: "",
    selectedFilterId: ""
  })

  const processAudioFile = (selectedFile: File) => {
    setErrorMessage("")
    const isValidType =
      selectedFile.type === "audio/mpeg" ||
      selectedFile.type === "audio/wav" ||
      selectedFile.name.endsWith(".mp3") ||
      selectedFile.name.endsWith(".wav")
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

  /**
   * Decodes an audio file and extracts features strictly via core native Essentia.js algorithms.
   */
  const extractAudioFeatures = async (audioFile: File) => {
    console.log("==================================================")
    console.log("[FELT ENGINE] INITIALIZING CORE AUDIO DSP PIPELINE")
    console.log(`[FELT ENGINE] Target File: ${audioFile.name}`)
    console.log("==================================================")

    setAnalysisStatus("Decoding audio channels...")

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
    const channelData = audioBuffer.getChannelData(0)

    setAnalysisStatus("Extracting tempo and acoustic profiles...")

    const targetWindow = window as any
    const EssentiaClass = targetWindow.Essentia
    const EssentiaWASMModule = targetWindow.EssentiaWASM

    if (!EssentiaClass || !EssentiaWASMModule) {
      throw new Error(
        "Audio engine components are still initializing onto the client window context. Please try again in a moment."
      )
    }

    const essentiaWASM = await EssentiaWASMModule()
    const essentia = new EssentiaClass(essentiaWASM)
    const vectorData = essentia.arrayToVector(channelData)

    // 1. Run Native Foundational DSP Extractors
    const rhythmResult = essentia.RhythmExtractor2013(vectorData)
    const keyResult = essentia.KeyExtractor(vectorData)
    const danceabilityResult = essentia.Danceability(vectorData)
    const dynamicComplexityResult = essentia.DynamicComplexity(vectorData)
    const loudnessResult = essentia.Loudness(vectorData)
    const spectralCentroidResult = essentia.SpectralCentroidTime(vectorData)
    const zcrResult = essentia.ZeroCrossingRate(vectorData)

    // 2. Parse Validated Core Values Natively
    const calculatedBpm = Math.round(rhythmResult.bpm || 120)
    const detectedKey = keyResult?.key ? String(keyResult.key).trim() : "C"
    const detectedScale = keyResult?.scale ? String(keyResult.scale).trim() : "major"
    const computedLoudness = Math.round(loudnessResult.loudness ?? -10)

    // Dynamic Complexity maps closely to general tracking energy
    const dynamicVal = dynamicComplexityResult.dynamicComplexity || 0
    const computedEnergy = Math.max(10, Math.min(100, Math.round(dynamicVal * 15)))

    // Danceability scaling (Essentia maps up to roughly 3.0)
    const computedDanceability = Math.max(0, Math.min(100, Math.round((danceabilityResult.danceability || 0) * 33.3)))

    // Acousticness using Spectral Centroid as a direct architectural proxy 
    // Higher centroid means brighter, sharper, more electronic textures; lower is warmer and more acoustic
    const centroid = spectralCentroidResult.centroid || 0
    const computedAcousticness = Math.max(5, Math.min(100, Math.round(100 - (centroid / 60))))
    const computedSpectralBrightness = Math.max(0, Math.min(100, Math.round(centroid / 50)))

    // Speechiness calculated from Zero Crossing Rate (vocal/sharp high transients vs harmonic tones)
    const rawZcr = zcrResult.zeroCrossingRate || 0
    const computedSpeechiness = Math.max(0, Math.min(100, Math.round(rawZcr * 800)))

    // 3. Derive Synesthetic & Emotional Metadata 
    // Valence (Emotional Positivity): Major scale anchors positive emotional DNA, while High Energy expands it
    let computedValence = detectedScale === "major" ? 60 : 35
    if (computedEnergy > 60) {
      computedValence = Math.min(100, computedValence + 15)
    } else if (computedEnergy < 40) {
      computedValence = Math.max(0, computedValence - 15)
    }

    // Explicit Feel-Vibe Track Mood Matrix Mapping
    let trackMood = "relaxed"
    if (computedEnergy > 65 && computedValence < 50) {
      trackMood = "aggressive"
    } else if (computedEnergy > 50 && computedValence >= 50) {
      trackMood = "happy"
    } else if (computedEnergy <= 40 && computedValence < 45) {
      trackMood = "sad"
    }

    // 4. Safely Clear Emscripten Allocation Memory Heaps
    if (vectorData && typeof vectorData.delete === "function") vectorData.delete()
    if (essentia && typeof essentia.delete === "function") essentia.delete()

    const finalizedPayload = {
      bpm: calculatedBpm > 0 ? calculatedBpm : 115,
      key: detectedKey,
      scale: detectedScale,
      energy: computedEnergy,
      valence: computedValence,
      danceability: computedDanceability,
      acousticness: computedAcousticness,
      spectral_brightness: computedSpectralBrightness,
      loudness: computedLoudness,
      mood: trackMood,
      speechiness: computedSpeechiness,
    }

    console.log('[FELT ENGINE] DSP Features Extracted Natively:', finalizedPayload)
    return finalizedPayload
  }

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!file || !title || !prompt || isUploading) return

    setIsUploading(true)
    setErrorMessage("")
    setAnalysisStatus("Uploading file asset to workspace storage...")

    try {
      // 1. Storage Upload
      const uploadResponse = await uploadApi.uploadTrack(file, title, prompt, trackType)
      const trackId = uploadResponse.track.id
      setActiveTrackId(trackId)

      setMetadata({
        title,
        type: trackType,
        sentencePrompt: prompt,
        selectedFilterId: "",
      })

      // 2. Compute Audio Analytics Natively
      const features = await extractAudioFeatures(file)

      // 3. Sync data payload to backend architecture
      setAnalysisStatus("Finalizing feature alignment maps...")
      await uploadApi.submitAnalysis(trackId, features)

      // 4. Step Transition Routing
      if (trackType === "instrumental") {
        setCurrentStep("FEELING_EXPANDER")
      } else {
        setCurrentStep("PROCESSING")
      }
    } catch (err: any) {
      console.error("Pipeline failure:", err)
      setErrorMessage(err?.message || "Audio mapping and analysis pipeline execution failed.")
    } finally {
      setIsUploading(false)
      setAnalysisStatus("")
    }
  }

  return (
    <div className="w-full bg-[#121212] flex flex-col relative overflow-x-hidden min-w-0">
      <div className="h-1 bg-foreground/5 w-full relative overflow-hidden shrink-0">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{
            width:
              currentStep === "UPLOAD" ? "20%" :
              currentStep === "FILTER_SELECTION" ? "60%" :
              currentStep === "RESULTS" ? "100%" : "40%",
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
              onDragOver={(e) => { e.preventDefault(); if (!isUploading) setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                if (!isUploading && e.dataTransfer.files?.[0]) processAudioFile(e.dataTransfer.files[0])
              }}
              className={`border border-dashed p-6 text-center flex flex-col items-center justify-center relative min-h-[140px] min-w-0 w-full ${
                isDragging ? "border-accent bg-foreground/[0.02]" : "border-border/60"
              }`}
            >
              <input
                type="file"
                id="audio-upload-input"
                accept=".mp3,.wav"
                disabled={isUploading}
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) processAudioFile(e.target.files[0]) }}
              />
              <label htmlFor="audio-upload-input" className="cursor-pointer w-full h-full flex flex-col items-center justify-center min-w-0">
                <Upload className={`size-6 mb-2.5 ${file ? "text-accent" : "text-muted-foreground/60"}`} />
                {file ? (
                  <div className="space-y-1 w-full min-w-0 px-2">
                    <p className="font-sans text-xs text-foreground font-medium max-w-full truncate mx-auto">{file.name}</p>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-foreground">
                    Drag & drop your file or <span className="text-accent underline">browse</span>
                  </p>
                )}
              </label>
            </div>

            {errorMessage && (
              <p className="font-mono text-[10px] text-destructive text-center break-words">{errorMessage}</p>
            )}

            <div className="space-y-3 pt-1 min-w-0">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Track Title</label>
                <Input
                  placeholder="Title..."
                  value={title}
                  disabled={isUploading}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-none bg-background border-border/40 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Prompt Description / Core Vibe</label>
                <Input
                  placeholder="E.g., dark alternative moody R&B synth structures..."
                  value={prompt}
                  disabled={isUploading}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  className="rounded-none bg-background border-border/40 text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20 mt-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                disabled={isUploading}
                onClick={onClose}
                className="font-mono text-[10px] tracking-widest uppercase rounded-none h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || !title || !prompt || isUploading}
                className="font-mono text-[10px] tracking-widest uppercase rounded-none bg-foreground text-background h-9 px-4"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 size-3 animate-spin" />
                    <span className="animate-pulse">{analysisStatus || "Analyzing..."}</span>
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
            trackId={activeTrackId!}
            onApprove={(expandedBrief) => {
              setMetadata(prev => ({ ...prev, expandedBrief }))
              setCurrentStep("PROCESSING")
            }}
            onStartOver={() => {
              setTitle("")
              setPrompt("")
              setFile(null)
              setActiveTrackId(null)
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
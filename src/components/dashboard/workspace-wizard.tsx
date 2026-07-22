
"use client"

import * as React from "react"
import { Upload, Music, Disc, Loader2 } from "lucide-react"
import { GenerationStep, TrackMetadata, TrackType } from "@/types/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProcessingView } from "@/components/dashboard/processing-view"
import { FeelingExpanderView } from "@/components/dashboard/feeling-expander-view"
import { ArtGenerationView } from "@/components/dashboard/art-generation-view"
import { uploadApi } from "@/lib/api"
import { getErrorMessage } from "@/lib/errors"

/**
 * The minimal Essentia surface the DSP pass touches.
 *
 * essentia.js declares every algorithm as returning `any` in its own
 * core_api.d.ts, so there is nothing to import. Narrowing it here to exactly
 * the calls we make means a typo in an algorithm name or output field is a
 * compile error instead of a silent `undefined` at upload time — which is how
 * a DSP feature would otherwise go quietly missing in production.
 *
 * Every handle is a WASM object that must be released via `delete()`.
 */
type EssentiaVector = { delete?: () => void }

interface EssentiaDsp {
  arrayToVector(input: Float32Array): EssentiaVector
  vectorToArray(vector: EssentiaVector): Float32Array
  FrameGenerator(
    input: Float32Array,
    frameSize?: number,
    hopSize?: number,
  ): { size(): number; get(i: number): EssentiaVector; delete?: () => void }
  Windowing(
    frame: EssentiaVector,
    normalized?: boolean,
    size?: number,
    type?: string,
  ): { frame: EssentiaVector }
  Spectrum(frame: EssentiaVector, size?: number): { spectrum: EssentiaVector }
  OnsetRate(signal: EssentiaVector): { onsetRate?: number; onsets?: EssentiaVector }
  // High-level extractors used for the baseline feature set.
  RhythmExtractor2013(signal: EssentiaVector): { bpm?: number }
  KeyExtractor(signal: EssentiaVector): { key?: string; scale?: string }
  Danceability(signal: EssentiaVector): { danceability?: number }
  DynamicComplexity(signal: EssentiaVector): { dynamicComplexity?: number }
  SpectralCentroidTime(signal: EssentiaVector): { centroid?: number }
  ZeroCrossingRate(signal: EssentiaVector): { zeroCrossingRate?: number }
  delete?: () => void
}

declare global {
  interface Window {
    /** Safari's prefixed AudioContext, still required on older iOS WebKit. */
    webkitAudioContext?: typeof AudioContext
    /** essentia.js UMD globals, loaded from a <script> tag rather than imported. */
    Essentia?: new (wasm: unknown) => EssentiaDsp
    EssentiaWASM?: () => Promise<unknown>
  }
}

interface WorkspaceWizardProps {
  onClose: () => void
  onCompleteGeneration: (title: string, type: string, filterId: string, imageUrl?: string) => void
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
    editTrack ? "GENERATING_ART" : "UPLOAD"
  )
  
  const [trackType, setTrackType] = React.useState<TrackType>(editTrack?.type || "vocal")
  const [title, setTitle] = React.useState(editTrack?.title || "")
  const [artistName, setArtistName] = React.useState("") 
  const [prompt, setPrompt] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [currentBriefOverride, setCurrentBriefOverride] = React.useState<string>("")
  
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [analysisStatus, setAnalysisStatus] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  
  const [activeTrackId, setActiveTrackId] = React.useState<string | null>(editTrack?.id || null)
  
  const [metadata, setMetadata] = React.useState<TrackMetadata & { lyricTranscript?: string }>({
    title: editTrack?.title || "",
    type: editTrack?.type || "vocal",
    sentencePrompt: "",
    selectedFilterId: "default-felt-dna",
    expandedBrief: ""
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
  }

  // ── Research Module 3: DSP feature expansion ─────────────────────────────
  // Five timbral/rhythmic signals Essentia's high-level algorithms do not
  // expose, all computed from ONE shared frame loop so the cost is paid once.
  //
  // Analysed over a SAMPLED WINDOW (centred, capped at DSP_WINDOW_SECONDS)
  // rather than the whole file: this runs in the artist's browser during
  // upload, and full-track framing on a long file is the difference between a
  // responsive step and a visibly frozen one. The centre of a track is also
  // more representative than an intro or a fade-out.
  //
  // Only OnsetRate uses a WASM algorithm. Flux, Flatness and Sub-Bass Ratio are
  // computed in plain JS from the magnitude spectrum we already hold,
  // deliberately:
  //   - Essentia's Flux keeps internal state between invocations, so calling it
  //     per frame from JS does not yield a true frame-to-frame delta;
  //   - Flatness and Sub-Bass are short formulas, and computing them here
  //     avoids thousands of extra WASM allocations inside the loop.
  //
  // Best-effort by design: any failure returns nulls and the pipeline continues
  // on the existing feature set. A DSP problem must never fail an upload.
  const DSP_WINDOW_SECONDS = 60
  const DSP_FRAME_SIZE = 2048
  const DSP_HOP_SIZE = 2048 // no overlap — halves the loop cost, ample for means

  const extractDspFeatures = (
    essentia: EssentiaDsp,
    channelData: Float32Array,
    sampleRate: number,
  ) => {
    // NOTE: MFCC1 is deliberately NOT extracted. Module 3 presents it as a
    // "vocal presence" metric (">40.0 indicates upfront vocal intimacy"), but
    // MFCC coefficient 0 is the log-energy of the mel spectrum — an overall
    // loudness descriptor, not a vocal detector. We already measure loudness,
    // and we know vocal-vs-instrumental for certain from the upload form
    // (trackType), which beats any DSP proxy. Dropping it also removes a WASM
    // call per frame.
    const empty = {
      spectral_flux: null as number | null,
      spectral_flatness: null as number | null,
      sub_bass_ratio: null as number | null,
      onset_rate: null as number | null,
    }

    let windowVector: EssentiaVector | null = null
    let frames: ReturnType<EssentiaDsp['FrameGenerator']> | null = null

    try {
      // Centred sample window.
      const maxSamples = Math.floor(DSP_WINDOW_SECONDS * sampleRate)
      const windowData =
        channelData.length > maxSamples
          ? channelData.subarray(
              Math.floor((channelData.length - maxSamples) / 2),
              Math.floor((channelData.length - maxSamples) / 2) + maxSamples,
            )
          : channelData

      if (windowData.length < DSP_FRAME_SIZE * 2) return empty

      windowVector = essentia.arrayToVector(windowData)

      // Track-level: onsets per second. No frame loop — Essentia does its own.
      let onsetRate: number | null = null
      try {
        const r = essentia.OnsetRate(windowVector)
        const v = r?.onsetRate
        // `typeof` first: Number.isFinite is typed (value: unknown) => boolean,
        // so it does not narrow `number | undefined` on its own.
        if (typeof v === 'number' && Number.isFinite(v)) onsetRate = v
        if (r?.onsets?.delete) r.onsets.delete()
      } catch {
        // OnsetRate is the most expensive call here; losing it alone is fine.
      }

      frames = essentia.FrameGenerator(windowData, DSP_FRAME_SIZE, DSP_HOP_SIZE)
      const frameCount = frames.size()
      if (!frameCount) return { ...empty, onset_rate: onsetRate }

      // Spectrum bin → Hz. Spectrum length is frameSize/2 + 1 spanning 0..Nyquist.
      const nyquist = sampleRate / 2
      // Module 3 defines sub-bass as 20–60 Hz over a 20 Hz–Nyquist denominator.
      // 60 Hz (not 120) is the correct boundary: 808 fundamentals sit at 30–60 Hz,
      // and everything above is "bass", which would dilute the discriminator.
      const SUB_BASS_LO_HZ = 20
      const SUB_BASS_HI_HZ = 60

      let fluxSum = 0
      let fluxCount = 0
      let flatnessSum = 0
      let subBassSum = 0
      let specCount = 0
      let prevSpec: Float32Array | null = null

      for (let i = 0; i < frameCount; i++) {
        const frame = frames.get(i)
        let windowed: ReturnType<EssentiaDsp['Windowing']> | null = null
        let spec: ReturnType<EssentiaDsp['Spectrum']> | null = null
        try {
          windowed = essentia.Windowing(frame, true, DSP_FRAME_SIZE, "hann")
          spec = essentia.Spectrum(windowed.frame, DSP_FRAME_SIZE)
          const mags: Float32Array = essentia.vectorToArray(spec.spectrum)
          if (!mags || mags.length < 4) continue

          // ---- Spectral Flatness: geometric mean / arithmetic mean.
          // 1.0 = flat/noise-like (distortion, percussion, noise floors),
          // → 0 = tonal/peaky (clean synthesis, sustained pitched material).
          let logSum = 0
          let linSum = 0
          const EPS = 1e-10
          for (let b = 0; b < mags.length; b++) {
            const m = mags[b] + EPS
            logSum += Math.log(m)
            linSum += m
          }
          const geoMean = Math.exp(logSum / mags.length)
          const arithMean = linSum / mags.length
          if (arithMean > EPS) flatnessSum += geoMean / arithMean

          // ---- Sub-Bass Ratio (Module 3): POWER (|X|², not magnitude) in
          // 20–60 Hz over total power from 20 Hz up, per the research equation.
          const hzToBin = (hz: number) =>
            Math.round((hz / nyquist) * (mags.length - 1))
          const loBin = Math.max(1, hzToBin(SUB_BASS_LO_HZ))
          const hiBin = Math.max(loBin, hzToBin(SUB_BASS_HI_HZ))
          let subPower = 0
          let totalPower = 0
          for (let b = loBin; b < mags.length; b++) {
            const p = mags[b] * mags[b]
            totalPower += p
            if (b <= hiBin) subPower += p
          }
          if (totalPower > EPS) subBassSum += subPower / totalPower

          specCount++

          // ---- Spectral Flux.
          // Module 3 gives SF = Σ(|X(t,f)| − |X(t−1,f)|)² and claims a 0..1
          // range. That claim does not hold: a sum of squared differences is
          // unbounded and scales with absolute spectrum magnitude, so a loud
          // master would read as "volatile" purely for being loud.
          //
          // Rectified flux on L1-NORMALISED spectra instead. L1 (divide by the
          // sum, so each frame sums to 1) is the choice that actually bounds the
          // result: with Σa = Σb = 1 we have Σ(a−b) = 0, so the positive part is
          // exactly half the L1 distance and therefore ≤ 1 — a true 0..1 with no
          // fudge factor. (L2 normalising does NOT bound this sum: for a unit-L2
          // vector spread over N bins the positive-difference sum can reach √N.)
          const specSum = linSum - mags.length * EPS || 1
          const cur = new Float32Array(mags.length)
          for (let b = 0; b < mags.length; b++) cur[b] = mags[b] / specSum
          if (prevSpec && prevSpec.length === cur.length) {
            let d = 0
            for (let b = 0; b < cur.length; b++) {
              const diff = cur[b] - prevSpec[b]
              if (diff > 0) d += diff
            }
            fluxSum += Math.min(1, d)
            fluxCount++
          }
          prevSpec = cur

        } finally {
          if (windowed?.frame?.delete) windowed.frame.delete()
          if (spec?.spectrum?.delete) spec.spectrum.delete()
        }
      }

      return {
        spectral_flux: fluxCount ? fluxSum / fluxCount : null,
        spectral_flatness: specCount ? flatnessSum / specCount : null,
        sub_bass_ratio: specCount ? subBassSum / specCount : null,
        onset_rate: onsetRate,
      }
    } catch (err) {
      console.warn("[DSP] extraction failed, continuing without it:", err)
      return empty
    } finally {
      if (frames?.delete) frames.delete()
      if (windowVector?.delete) windowVector.delete()
    }
  }

  const extractAudioFeatures = async (audioFile: File) => {
    setAnalysisStatus("Decoding audio channels...")
    const AudioCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioCtor) throw new Error("Web Audio API is unavailable in this browser.")
    const audioCtx = new AudioCtor()
    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
    const channelData = audioBuffer.getChannelData(0)

    setAnalysisStatus("Extracting core multi-dimensional profiles...")
    const EssentiaClass = window.Essentia
    const EssentiaWASMModule = window.EssentiaWASM

    if (!EssentiaClass || !EssentiaWASMModule) {
      throw new Error("Audio engine components are still initializing onto the client window context.")
    }

    const essentiaWASM = await EssentiaWASMModule()
    const essentia = new EssentiaClass(essentiaWASM)
    const vectorData = essentia.arrayToVector(channelData)

    const rhythmResult = essentia.RhythmExtractor2013(vectorData)
    const keyResult = essentia.KeyExtractor(vectorData)
    const danceabilityResult = essentia.Danceability(vectorData)
    const dynamicComplexityResult = essentia.DynamicComplexity(vectorData)
    const spectralCentroidResult = essentia.SpectralCentroidTime(vectorData)
    const zcrResult = essentia.ZeroCrossingRate(vectorData)

    const rawBpm = rhythmResult.bpm
    const rawCentroid = spectralCentroidResult.centroid || 1500
    const rawComplexity = dynamicComplexityResult.dynamicComplexity
    const rawDanceability = danceabilityResult.danceability
    const rawZcr = zcrResult.zeroCrossingRate

    // Essentia's Loudness algorithm does NOT return dBFS — it returns an
    // unbounded power figure (real tracks were storing values like 9988 and
    // 14545). Downstream that was normalised as (loudness + 60) / 60 and clamped,
    // so it pinned to 1.0 on every track and carried no information at all.
    // Compute true RMS dBFS from the PCM samples instead.
    let sumSquares = 0
    for (let i = 0; i < channelData.length; i++) sumSquares += channelData[i] * channelData[i]
    const rmsAmplitude = Math.sqrt(sumSquares / Math.max(1, channelData.length))
    const rawLoudness = rmsAmplitude > 0
      ? Math.max(-60, Math.min(0, 20 * Math.log10(rmsAmplitude)))
      : -60

    const currentVector: Record<string, number | null> = {
      bpm: (rawBpm && rawBpm > 0) ? Math.max(0, Math.min(1, (rawBpm - 60) / 105)) : null, 
      energy: (rawComplexity && rawComplexity > 0) ? Math.max(0, Math.min(1, rawComplexity * 0.15)) : null,
      danceability: (rawDanceability && rawDanceability > 0) ? Math.max(0, Math.min(1, rawDanceability)) : null,
      brightness: rawCentroid ? Math.max(0, Math.min(1, rawCentroid / 4000)) : null,
      loudness: Math.max(0, Math.min(1, (rawLoudness + 60) / 60)), 
      speechiness: (rawZcr && rawZcr > 0) ? Math.max(0, Math.min(1, rawZcr * 2.0)) : null
    }

    const VECTOR_CLUSTERS = {
      HIGH_ENERGY_POSITIVE: { id: "HIGH_ENERGY_POSITIVE", mood: "happy", scale: "major", centers: { bpm: 0.61, energy: 0.82, danceability: 0.72, brightness: 0.75, loudness: 0.92, speechiness: 0.12 }, ranges: { bpm: [115, 140], energy: [0.70, 0.95], valence: [0.65, 0.95], danceability: [0.60, 0.85], acousticness: [0.01, 0.20], brightness: [0.60, 0.90], speechiness: [0.03, 0.12] } },
      HIGH_ENERGY_NEGATIVE: { id: "HIGH_ENERGY_NEGATIVE", mood: "aggressive", scale: "minor", centers: { bpm: 0.76, energy: 0.88, danceability: 0.68, brightness: 0.80, loudness: 0.93, speechiness: 0.48 }, ranges: { bpm: [130, 165], energy: [0.75, 0.99], valence: [0.05, 0.35], danceability: [0.55, 0.80], acousticness: [0.00, 0.15], brightness: [0.65, 0.95], speechiness: [0.08, 0.45] } },
      LOW_ENERGY_POSITIVE: { id: "LOW_ENERGY_POSITIVE", mood: "relaxed", scale: "major", centers: { bpm: 0.23, energy: 0.35, danceability: 0.58, brightness: 0.35, loudness: 0.84, speechiness: 0.08 }, ranges: { bpm: [70, 100], energy: [0.15, 0.50], valence: [0.45, 0.75], danceability: [0.40, 0.70], acousticness: [0.40, 0.90], brightness: [0.20, 0.50], speechiness: [0.02, 0.08] } },
      LOW_ENERGY_NEGATIVE: { id: "LOW_ENERGY_NEGATIVE", mood: "sad", scale: "minor", centers: { bpm: 0.17, energy: 0.28, danceability: 0.48, brightness: 0.25, loudness: 0.81, speechiness: 0.10 }, ranges: { bpm: [60, 95], energy: [0.10, 0.45], valence: [0.02, 0.30], danceability: [0.30, 0.65], acousticness: [0.45, 0.95], brightness: [0.10, 0.40], speechiness: [0.03, 0.10] } },
      DARK_TENSION: { id: "DARK_TENSION", mood: "anxious", scale: "minor", centers: { bpm: 0.42, energy: 0.62, danceability: 0.52, brightness: 0.48, loudness: 0.88, speechiness: 0.14 }, ranges: { bpm: [80, 125], energy: [0.45, 0.80], valence: [0.05, 0.30], danceability: [0.35, 0.68], acousticness: [0.05, 0.55], brightness: [0.30, 0.70], speechiness: [0.03, 0.15] } },
      LOVE_INTIMACY: { id: "LOVE_INTIMACY", mood: "romantic", scale: "major", centers: { bpm: 0.30, energy: 0.48, danceability: 0.66, brightness: 0.45, loudness: 0.87, speechiness: 0.16 }, ranges: { bpm: [80, 110], energy: [0.35, 0.65], valence: [0.38, 0.68], danceability: [0.55, 0.78], acousticness: [0.15, 0.60], brightness: [0.30, 0.60], speechiness: [0.04, 0.18] } }
    }

    let targetCluster = VECTOR_CLUSTERS.LOW_ENERGY_POSITIVE
    let shortestDistance = Infinity

    Object.values(VECTOR_CLUSTERS).forEach((cluster) => {
      let sumOfSquares = 0
      let activeDimensionsCount = 0
      Object.keys(currentVector).forEach((key) => {
        const currentVal = currentVector[key]
        if (currentVal !== null && !isNaN(currentVal)) {
          const targetCenter = (cluster.centers as Record<string, number>)[key]
          sumOfSquares += Math.pow(currentVal - targetCenter, 2)
          activeDimensionsCount++
        }
      })
      const distance = activeDimensionsCount > 0 ? Math.sqrt(sumOfSquares) : Infinity
      if (distance < shortestDistance) {
        shortestDistance = distance
        targetCluster = cluster
      }
    })

    let totalNormalizedWeight = 0
    let validFeaturesCount = 0
    Object.values(currentVector).forEach(val => {
      if (val !== null && !isNaN(val)) {
        totalNormalizedWeight += val
        validFeaturesCount++
      }
    })
    const unifiedProgressFactor = validFeaturesCount > 0 ? (totalNormalizedWeight / validFeaturesCount) : 0.5

    const resolveMetric = (rawVal: number | null | undefined, key: string, multiplier = 1) => {
      if (rawVal !== null && rawVal !== undefined && rawVal > 0 && !isNaN(rawVal)) return Math.round(rawVal * multiplier)
      const range = (targetCluster.ranges as Record<string, number[]>)[key]
      if (!range) return Math.round(unifiedProgressFactor * multiplier)
      return Math.round((range[0] + (range[1] - range[0]) * unifiedProgressFactor) * multiplier)
    }

    const finalBpm = resolveMetric(rawBpm, "bpm", 1)
    const rawKey = keyResult?.key ? String(keyResult.key).trim() : (targetCluster.scale === "major" ? "C" : "A")
    const rawScale = keyResult?.scale ? String(keyResult.scale).trim() : targetCluster.scale
    const finalEnergy = resolveMetric(rawComplexity ? (rawComplexity * 15) : null, "energy", 1)
    const finalDanceability = resolveMetric(rawDanceability ? (rawDanceability * 33.3) : null, "danceability", 1)

    // VALENCE — musical positivity.
    // Previously this was ONLY the mode (major = 65, minor = 25), which meant
    // every minor-key track scored 25 ("grief") no matter how joyful it sounded.
    // Most Afrobeats, hip-hop and R&B sit in minor keys, so upbeat dance records
    // were being read as despair and rendered as still, mournful covers.
    // Mode still matters most, but tempo, groove and brightness now carry real
    // weight — a fast, bright, highly danceable minor track reads as positive.
    const modeScore = rawScale === "major" ? 0.72 : 0.34
    const grooveScore = currentVector.danceability ?? 0.5
    const tempoScore = currentVector.bpm ?? 0.5
    const brightScore = currentVector.brightness ?? 0.5
    const valence01 = Math.max(0, Math.min(1,
      (0.42 * modeScore) + (0.24 * grooveScore) + (0.19 * tempoScore) + (0.15 * brightScore)
    ))
    const finalValence = Math.round(valence01 * 100)

    // ACOUSTICNESS — likelihood the record is acoustic rather than electronic.
    // Previously `100 - (centroid / 4000 * 100)`, i.e. just inverse brightness,
    // and gated on `rawDanceability` (an unrelated variable). Any dark-sounding
    // electronic track therefore scored as highly "acoustic".
    // Acoustic recordings retain wide dynamics (high dynamic complexity) and have
    // less synthetic high-frequency buzz (lower ZCR), so use those instead.
    const dynamicsScore = Math.max(0, Math.min(1, (rawComplexity || 0) * 0.15))
    const buzzScore = currentVector.speechiness ?? 0.5
    const acoustic01 = Math.max(0, Math.min(1,
      (0.45 * dynamicsScore) + (0.30 * (1 - buzzScore)) + (0.25 * (1 - brightScore))
    ))
    const finalAcousticness = Math.round(acoustic01 * 100)
    const finalBrightness = Math.max(0, Math.min(100, Math.round((currentVector.brightness || unifiedProgressFactor) * 100)))
    const finalSpeechiness = resolveMetric(rawZcr ? (rawZcr * 800) : null, "speechiness", 1)

    // GENRE — a mathematical guess only. Essentia reads tempo and texture, not
    // culture, so this is deliberately treated as a weak signal: the artist's
    // declared genre overrides it downstream.
    // The afrobeat branch previously required `finalValence > 55`, which was
    // unreachable for minor-key tracks under the old mode-only valence — so
    // Afrobeats records always fell through to the "hip-hop" default.
    let finalGenre = "hip-hop"
    if (currentVector.speechiness && currentVector.speechiness > 0.35 && finalBpm >= 120) finalGenre = "trap / drill"
    else if (currentVector.speechiness && currentVector.speechiness > 0.25 && finalBpm < 115) finalGenre = "boom bap / retro rap"
    else if (currentVector.brightness && currentVector.brightness > 0.65 && finalEnergy > 70) finalGenre = "electronic / dance"
    else if (finalAcousticness > 65 && finalEnergy < 45) finalGenre = "acoustic / neo-soul"
    // Afrobeats/amapiano signature: mid-tempo, groove-forward, not speech-heavy.
    else if (finalDanceability > 60 && finalBpm >= 95 && finalBpm <= 130 && finalSpeechiness < 35) finalGenre = "pop / afrobeat"

    // Research Module 3 DSP pass — runs on the same Essentia instance, before
    // teardown. Additive: every field is nullable and nothing above depends on
    // it, so a failure here cannot change any existing feature.
    setAnalysisStatus("Reading timbral texture and rhythmic density...")
    const dsp = extractDspFeatures(essentia, channelData, audioBuffer.sampleRate)

    if (vectorData && typeof vectorData.delete === "function") vectorData.delete()
    if (essentia && typeof essentia.delete === "function") essentia.delete()

    return {
      ...dsp,
      bpm: finalBpm, key: rawKey, scale: rawScale,
      energy: Math.max(10, Math.min(100, finalEnergy)),
      valence: Math.max(0, Math.min(100, finalValence)),
      danceability: Math.max(0, Math.min(100, finalDanceability)),
      acousticness: Math.max(5, Math.min(100, finalAcousticness)),
      spectral_brightness: finalBrightness, loudness: Math.round(rawLoudness),
      mood: targetCluster.mood, speechiness: Math.max(0, Math.min(100, finalSpeechiness)),
      genre: finalGenre
    }
  }


 const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !prompt || isUploading) return

    setIsUploading(true)
    setErrorMessage("")
    setAnalysisStatus("Uploading audio track parameters...")

    try {
      // 1. Core upload execution
      const uploadResponse = await uploadApi.uploadTrack(file, title, prompt, trackType)
      const trackId = uploadResponse.track.id
      setActiveTrackId(trackId)

      setMetadata({
        title,
        type: trackType,
        sentencePrompt: prompt,
        selectedFilterId: "default-felt-dna",
        expandedBrief: ""
      })

      // 2. Extract DSP maps via native Essentia execution loop
      const features = await extractAudioFeatures(file)

      setAnalysisStatus("Aligning sonic profiling features...")
      await uploadApi.submitAnalysis(trackId, features)

      // 3. Conditional Routing Logic Pipeline
      if (trackType === "instrumental") {
        setCurrentBriefOverride(prompt)
        setCurrentStep("FEELING_EXPANDER")
        setIsUploading(false)
      } else {
  // Direct route for vocal files: Genius → Deepgram fallback → Gemini scene synthesis, all server-side
  setAnalysisStatus("Looking up lyrics online...")
  const transcribeResponse = await uploadApi.transcribeTrack(trackId, artistName.trim() || undefined)

  if (transcribeResponse.source === 'genius') {
    setAnalysisStatus(`Found lyrics for "${transcribeResponse.matched?.title}" by ${transcribeResponse.matched?.artist}`)
  } else if (transcribeResponse.source === 'deepgram') {
    setAnalysisStatus(transcribeResponse.transcript ? "Transcribed lyrics from your audio..." : "Continuing without lyrics...")
  }

  // Server already synthesized the scene brief — same shape as the instrumental FEELING_EXPANDER flow
  const contextualBrief = transcribeResponse.expanded || prompt

  setCurrentBriefOverride(contextualBrief)

  setMetadata(prev => ({
    ...prev,
    lyricTranscript: transcribeResponse.transcript,
    expandedBrief: contextualBrief
  }))

  setCurrentStep("PROCESSING")
  setIsUploading(false)
}
    } catch (err) {
      console.error("Vocal synthesis pipeline crash:", err)
      setErrorMessage(getErrorMessage(err, "Audio vocal tracking synthesis chain failed."))
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full bg-[#121212] flex flex-col relative overflow-x-hidden min-w-0">
      <div className="h-1 bg-foreground/5 w-full relative overflow-hidden shrink-0">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{
            width:
              currentStep === "UPLOAD" ? "25%" :
              currentStep === "FEELING_EXPANDER" ? "50%" :
              currentStep === "PROCESSING" ? "75%" : "100%",
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
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Artist Name <span className="normal-case text-muted-foreground/50">(optional — helps us find lyrics for covers/released songs)</span>
                  </label>
                  <Input
                    placeholder="e.g. The Weeknd"
                    value={artistName}
                    disabled={isUploading}
                    onChange={(e) => setArtistName(e.target.value)}
                    className="rounded-none bg-background border-border/40 text-sm"
                  />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">What is this song about in one sentence?</label>
                <Input
                  placeholder="E.g., an existential confession about running out of time over neon synths..."
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
          <ProcessingView title={title} onComplete={() => setCurrentStep("GENERATING_ART")} />
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
          setArtistName("")
          setPrompt("")
          setFile(null)
          setActiveTrackId(null)
          setCurrentStep("UPLOAD")
}}
          />
        )}

       {currentStep === "GENERATING_ART" && (
          <ArtGenerationView 
            uploadId={activeTrackId || ""}
            // Prioritizes immediate override string context over potentially laggy state records
            lyricContext={currentBriefOverride || metadata.expandedBrief || prompt}
            onComplete={(imageUrl) => {
              onCompleteGeneration(
                metadata.title, 
                metadata.type, 
                metadata.selectedFilterId || "default-felt-dna", 
                imageUrl
              )
            }}
          />
        )}
      </form>
    </div>
  )
}
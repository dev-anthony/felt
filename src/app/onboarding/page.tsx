"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { StepArtistPhoto } from "./steps/step-artist-photo"
import { StepSoundWords } from "./steps/step-sound-words"
import { StepCityInfluence } from "./steps/step-city-influence"
import { StepGenre } from "./steps/step-genre"
import { StepSubject } from "./steps/step-subject"
import { onboardingApi } from "@/lib/api"

export type OnboardingData = {
  photo: File | null
  avatarUrl: string | null   // set after upload-avatar succeeds
  soundWords: string[]
  city: string
  /** Artist's declared lane — corrects Essentia's culture-blind genre guess. */
  genre: string
  /** Whether a person appears on their covers: 'auto' | 'figure' | 'no_people'. */
  subjectMode: string
}

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState<OnboardingData>({
    photo: null,
    avatarUrl: null,
    soundWords: ["", "", ""],
    city: "",
    genre: "",
    subjectMode: "auto",
  })

  const handleNext = async (updatedData: Partial<OnboardingData>) => {
    setError(null)
    const merged = { ...formData, ...updatedData }

    // Step 1 — upload the photo immediately so we have the URL ready for the final submit
    if (currentStep === 1 && merged.photo) {
      try {
        const { avatarUrl } = await onboardingApi.uploadAvatar(merged.photo)
        merged.avatarUrl = avatarUrl
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Photo upload failed")
        return // don't advance if upload failed
      }
    }

    setFormData(merged)
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = async (finalData: Partial<OnboardingData>) => {
    setError(null)
    setSubmitting(true)
    const completePayload = { ...formData, ...finalData }

    try {
      await onboardingApi.complete({
        soundWords: completePayload.soundWords,
        city: completePayload.city,
        genre: completePayload.genre,
        subjectMode: completePayload.subjectMode,
        avatarUrl: completePayload.avatarUrl,
      })
      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
      setSubmitting(false)
    }
  }

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen w-full bg-[#121212] flex flex-col items-center justify-center p-4 min-w-0 selection:bg-accent/30">

      {/* Top Fixed Matrix Indicator */}
      <div className="w-full max-w-md mb-6 min-w-0">
        <div className="h-1 bg-foreground/5 w-full relative overflow-hidden mb-2">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center px-0.5 gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground truncate">
            {"// VIBE CHECK INITIALIZATION"}
          </span>
          <span className="font-mono text-[9px] text-accent tracking-widest font-bold shrink-0">
            0{currentStep} / 0{TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="w-full max-w-md mb-3">
          <p className="font-mono text-[10px] text-red-400 tracking-wide text-center">{error}</p>
        </div>
      )}

      {/* Dynamic Content Frame Card */}
      <div className="w-full max-w-md border border-border/40 bg-[#0d0d0d]/40 backdrop-blur-md p-6 relative flex flex-col min-w-0">
        {currentStep === 1 && (
          <StepArtistPhoto
            initialValue={formData.photo}
            onProceed={handleNext}
          />
        )}
        {currentStep === 2 && (
          <StepSoundWords
            initialValues={formData.soundWords}
            onProceed={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <StepCityInfluence
            initialValue={formData.city}
            onProceed={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <StepGenre
            initialValue={formData.genre}
            onProceed={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 5 && (
          <StepSubject
            initialValue={formData.subjectMode}
            onComplete={handleComplete}
            onBack={handleBack}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}

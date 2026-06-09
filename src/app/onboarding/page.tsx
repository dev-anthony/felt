"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { StepArtistPhoto } from "./steps/step-artist-photo"
import { StepSoundWords } from "./steps/step-sound-words"
import { StepCityInfluence } from "./steps/step-city-influence"
import { StepVisualAesthetic } from "./steps/step-visual-aesthetics"

export type OnboardingData = {
  photo: File | null
  soundWords: string[]
  city: string
  defaultAestheticId: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState<OnboardingData>({
    photo: null,
    soundWords: ["", "", ""],
    city: "",
    defaultAestheticId: "f-1",
  })

  const handleNext = (updatedData: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...updatedData }))
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = async (finalData: Partial<OnboardingData>) => {
    const completePayload = { ...formData, ...finalData }
    
    // Simulate Backend API Sync
    console.log("// Submitting Artist Vibe Profile Matrix...", completePayload)
    
    // Redirect to main workspace interface
    router.push("/dashboard")
  }

  const totalSteps = 4
  const progressPercentage = (currentStep / totalSteps) * 100

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
        <div className="flex justify-between items-center px-0.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            // VIBE CHECK INITIALIZATION
          </span>
          <span className="font-mono text-[9px] text-accent tracking-widest font-bold">
            0{currentStep} / 0{totalSteps}
          </span>
        </div>
      </div>

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
          <StepVisualAesthetic 
            initialValue={formData.defaultAestheticId} 
            onComplete={handleComplete} 
            onBack={handleBack} 
          />
        )}
      </div>
    </div>
  )
}
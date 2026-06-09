"use client"

import * as React from "react"
import { Upload, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepArtistPhotoProps {
  initialValue: File | null
  onProceed: (data: { photo: File | null }) => void
}

export function StepArtistPhoto({ initialValue, onProceed }: StepArtistPhotoProps) {
  const [file, setFile] = React.useState<File | null>(initialValue)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [file])

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
    }
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="min-w-0">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">// Phase 01</span>
        <h3 className="font-display italic text-2xl text-foreground">Identity Capture</h3>
        <p className="font-sans text-xs text-muted-foreground mt-1">Upload an image configuration that matches your structural profile as an artist.</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
        className={`border border-dashed relative flex flex-col items-center justify-center transition-all bg-background/50 min-w-0 w-full overflow-hidden ${
          isDragging ? "border-accent bg-foreground/[0.02]" : "border-border/60"
        }`}
        style={{ aspectRatio: "16/9", maxHeight: "170px" }}
      >
        <input 
          type="file" 
          id="photo-upload" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} 
        />
        
        <label htmlFor="photo-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 absolute inset-0 z-10">
          {previewUrl ? (
            <div className="absolute inset-0 w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Identity preview" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 font-mono text-[8px] tracking-wider text-accent uppercase">
                <Camera className="size-3" /> Change Configuration Spec
              </div>
            </div>
          ) : (
            <>
              <Upload className={`size-6 mb-2.5 ${isDragging ? "text-accent" : "text-muted-foreground/60"}`} />
              <p className="font-sans text-xs text-foreground">Drag identity image here or <span className="text-accent underline">browse</span></p>
              <span className="font-mono text-[8px] text-muted-foreground/40 mt-1 uppercase tracking-widest">JPG, PNG, WEBP // MAX 5MB</span>
            </>
          )}
        </label>
      </div>

      <div className="pt-4 border-t border-border/20 flex justify-end">
        <Button
          type="button"
          disabled={!file}
          onClick={() => onProceed({ photo: file })}
          className="font-mono text-[10px] uppercase tracking-widest rounded-none h-10 px-6 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-20 transition-all w-full sm:w-auto"
        >
          Lock Profile & Continue →
        </Button>
      </div>
    </div>
  )
}
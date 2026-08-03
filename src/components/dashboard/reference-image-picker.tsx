"use client"

import * as React from "react"
import { ImagePlus, X, SlidersHorizontal } from "lucide-react"

interface ReferenceImagePickerProps {
  value: string | null // base64, no data: prefix
  onChange: (base64: string | null) => void
  creativeStrength: number
  onCreativeStrengthChange: (v: number) => void
  disabled?: boolean
}

// Matches the backend's clamp range (imageProvider.js REFERENCE_STRENGTH_RANGE)
// so the slider can never submit a value the server would silently reclamp.
const STRENGTH_MIN = 0.3
const STRENGTH_MAX = 0.95
const STRENGTH_DEFAULT = 0.82

/**
 * Resizes an image to at most `maxDim` on its longest side and re-encodes it
 * as JPEG, before it ever becomes base64.
 *
 * A phone photo can be 8-12MB; base64 inflates that by another third. Sending
 * that inline in a JSON body is slow on a mobile upload connection and pushes
 * against server body-size limits for no real benefit — the reference only
 * needs to convey composition and palette, not print resolution.
 */
function resizeToBase64(file: File, maxDim = 1024, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas 2D context unavailable"))
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL("image/jpeg", quality)
      resolve(dataUrl.split(",")[1] || "")
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read the selected image"))
    }
    img.src = url
  })
}

/**
 * Optional reference-image upload for the generation form. Wired to the
 * backend's Cloudflare img2img path (imageProvider.js viaCloudflare) — the
 * only provider that genuinely accepts a reference. On any other active
 * provider the backend logs a warning and generates without it, so this never
 * silently fails; see generateImage()'s REFERENCE_CAPABLE gate.
 */
export function ReferenceImagePicker({
  value, onChange, creativeStrength, onCreativeStrengthChange, disabled,
}: ReferenceImagePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }
    setError(null)
    setBusy(true)
    try {
      const b64 = await resizeToBase64(file)
      onChange(b64)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that image.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
          {"// Reference image"}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">optional</span>
      </div>

      {value ? (
        <div className="relative w-full overflow-hidden rounded-xl border border-border/40">
          {/* eslint-disable-next-line @next/next/no-img-element -- local base64 preview, never a remote host */}
          <img src={`data:image/jpeg;base64,${value}`} alt="Reference" className="w-full h-32 object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Remove reference image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || busy}
          className="w-full flex items-center justify-center gap-2 h-20 rounded-xl border border-dashed border-border/50 text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-50"
        >
          <ImagePlus className="size-4" />
          <span className="text-xs">{busy ? "Processing image..." : "Upload a photo or moodboard"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="font-mono text-[10px] text-destructive">{error}</p>}

      {value && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal className="size-3" />
              Creative freedom
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              {creativeStrength < 0.55 ? "Close to reference" : creativeStrength > 0.85 ? "Loosely inspired" : "Balanced"}
            </span>
          </div>
          <input
            type="range"
            min={STRENGTH_MIN}
            max={STRENGTH_MAX}
            step={0.01}
            value={creativeStrength}
            disabled={disabled}
            onChange={(e) => onCreativeStrengthChange(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
      )}
    </div>
  )
}

export { STRENGTH_DEFAULT }

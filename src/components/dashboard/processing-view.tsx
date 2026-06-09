// "use client"

// import * as React from "react"
// import { Loader2, Music, BarChart2, MessageSquare, Sparkles } from "lucide-react"
// import { Skeleton } from "@/components/ui/skeleton"

// interface ProcessingViewProps {
//   title: string
//   onComplete: () => void
// }

// export function ProcessingView({ title, onComplete }: ProcessingViewProps) {
//   const [statusIndex, setStatusIndex] = React.useState(0)
  
//   const processStatuses = [
//     "Reading the feeling in your music...",
//     "Essentia.js analyzing core spectral brightness & valence...",
//     "Whisper API transcribing vocal signature contours...",
//     "Assembling unified emotional canvas blueprint..."
//   ]

//   React.useEffect(() => {
//     // Rotate text updates over the simulation window
//     const textInterval = setInterval(() => {
//       setStatusIndex((prev) => (prev < processStatuses.length - 1 ? prev + 1 : prev))
//     }, 2500)

//     // Trigger next layout state after a total of 10 seconds simulation
//     const completeTimeout = setTimeout(() => {
//       onComplete()
//     }, 10000)

//     return () => {
//       clearInterval(textInterval)
//       clearTimeout(completeTimeout)
//     }
//   }, [onComplete])

//   return (
//     <div className="flex-1 flex flex-col justify-between p-6 min-h-[450px]">
//       <div className="space-y-6 my-auto max-w-sm mx-auto w-full text-center">
        
//         {/* Animated Spin Anchor */}
//         <div className="relative size-16 mx-auto flex items-center justify-center">
//           <div className="absolute inset-0 rounded-full border border-border/40 animate-ping opacity-25" />
//           <Loader2 className="size-8 text-accent animate-spin stroke-[1.25]" />
//         </div>

//         <div className="space-y-2">
//           <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent block">
//             [ Feature Extraction Active ]
//           </span>
//           <h4 className="font-display italic text-2xl text-foreground truncate px-4">{title}</h4>
//           <p className="font-mono text-[10px] text-muted-foreground/80 tracking-wide h-4">
//             {processStatuses[statusIndex]}
//           </p>
//         </div>

//         {/* Simulated Metrics Pipeline Grid */}
//         <div className="border border-border/20 bg-background/40 p-4 space-y-3 text-left rounded-none">
//           <div className="flex items-center justify-between text-[10px] font-mono">
//             <span className="text-muted-foreground flex items-center gap-1.5">
//               <BarChart2 className="size-3 text-accent" /> Spectral Profile:
//             </span>
//             {statusIndex > 0 ? (
//               <span className="text-foreground text-right animate-fade-in">BPM, Key, Valence Bound</span>
//             ) : (
//               <Skeleton className="h-3 w-28 bg-foreground/5 rounded-none" />
//             )}
//           </div>

//           <div className="flex items-center justify-between text-[10px] font-mono">
//             <span className="text-muted-foreground flex items-center gap-1.5">
//               <MessageSquare className="size-3 text-accent" /> Linguistic Array:
//             </span>
//             {statusIndex > 1 ? (
//               <span className="text-foreground text-right">Lyrics Parsed via Whisper</span>
//             ) : (
//               <Skeleton className="h-3 w-36 bg-foreground/5 rounded-none" />
//             )}
//           </div>

//           <div className="flex items-center justify-between text-[10px] font-mono">
//             <span className="text-muted-foreground flex items-center gap-1.5">
//               <Sparkles className="size-3 text-accent" /> Emotional Mapping:
//             </span>
//             {statusIndex > 2 ? (
//               <span className="text-foreground text-right">Brief Compiled</span>
//             ) : (
//               <Skeleton className="h-3 w-20 bg-foreground/5 rounded-none" />
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }
"use client"

import * as React from "react"
import { Loader2, BarChart2, MessageSquare, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ProcessingViewProps {
  title: string
  onComplete: () => void
}

export function ProcessingView({ title, onComplete }: ProcessingViewProps) {
  const [statusIndex, setStatusIndex] = React.useState(0)

  const processStatuses = [
    "Reading the feeling in your music...",
    "Essentia.js analyzing core spectral brightness & valence...",
    "Whisper API transcribing vocal signature contours...",
    "Assembling unified emotional canvas blueprint...",
  ]

  React.useEffect(() => {
    const textInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < processStatuses.length - 1 ? prev + 1 : prev))
    }, 2500)

    const completeTimeout = setTimeout(() => {
      onComplete()
    }, 10000)

    return () => {
      clearInterval(textInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-6 min-h-[450px]">
      <div className="space-y-6 w-full max-w-sm text-center">

        {/* Animated Spin Anchor */}
        <div className="relative size-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-border/40 animate-ping opacity-25" />
          <Loader2 className="size-8 text-accent animate-spin stroke-[1.25]" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent block">
            [ Feature Extraction Active ]
          </span>
          <h4 className="font-display italic text-2xl text-foreground truncate px-4">{title}</h4>
          <p className="font-mono text-[10px] text-muted-foreground/80 tracking-wide h-4">
            {processStatuses[statusIndex]}
          </p>
        </div>

        {/* Simulated Metrics Pipeline Grid */}
        <div className="border border-border/20 bg-background/40 p-4 space-y-3 text-left rounded-none">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <BarChart2 className="size-3 text-accent" /> Spectral Profile:
            </span>
            {statusIndex > 0 ? (
              <span className="text-foreground text-right animate-fade-in">BPM, Key, Valence Bound</span>
            ) : (
              <Skeleton className="h-3 w-28 bg-foreground/5 rounded-none" />
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="size-3 text-accent" /> Linguistic Array:
            </span>
            {statusIndex > 1 ? (
              <span className="text-foreground text-right">Lyrics Parsed via Whisper</span>
            ) : (
              <Skeleton className="h-3 w-36 bg-foreground/5 rounded-none" />
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3 text-accent" /> Emotional Mapping:
            </span>
            {statusIndex > 2 ? (
              <span className="text-foreground text-right">Brief Compiled</span>
            ) : (
              <Skeleton className="h-3 w-20 bg-foreground/5 rounded-none" />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
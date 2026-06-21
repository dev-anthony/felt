
// "use client"

// import * as React from "react"
// import { Sparkles, Edit3, RotateCcw, Check, Save, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { generationApi } from "@/lib/api"

// interface FeelingExpanderViewProps {
//   userPrompt: string
//   trackId: string
//   onApprove: (expandedText: string) => void
//   onStartOver: () => void
// }

// export function FeelingExpanderView({
//   userPrompt,
//   trackId,
//   onApprove,
//   onStartOver
// }: FeelingExpanderViewProps) {
//   const [isEditing, setIsEditing] = React.useState(false)
//   const [expandedText, setExpandedText] = React.useState("")
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [error, setError] = React.useState<string | null>(null)

//   // Call the Feeling Expander as soon as this view mounts
//   const fetchExpansion = React.useCallback(async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const data = await generationApi.expand({
//         upload_id: trackId,
//         basic_input: userPrompt,
//       })
//       setExpandedText(data.expanded)
//     } catch (err: any) {
//       console.error("Feeling Expander error:", err)
//       setError(err?.message || "Something went wrong. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }, [trackId, userPrompt])

//   React.useEffect(() => {
//     fetchExpansion()
//   }, [fetchExpansion])

//   // "Start over" should reset and re-call the expander with a fresh request
//   const handleStartOver = () => {
//     onStartOver()
//   }

//   return (
//     <>
//       {/* Custom Ultra-Slim Scrollbar: Slate thumb, Black track, Rounded corners */}
//       <style jsx global>{`
//         .scrollbar-custom::-webkit-scrollbar {
//           width: 4px;
//         }
//         .scrollbar-custom::-webkit-scrollbar-track {
//           background: #555;
//           border-radius: 10px;
//         }
//         .scrollbar-custom::-webkit-scrollbar-thumb {
//           background: #000000; 
//           border-radius: 10px;
//         }
        
//         /* Hide scrollbar buttons (arrows) */
//         .scrollbar-custom::-webkit-scrollbar-button {
//           display: none;
//           width: 0;
//           height: 0;
//         }
//       `}</style>

//       <div className="w-full max-w-full min-w-0 space-y-4 flex-1 flex flex-col justify-center">
//         <div className="w-full min-w-0">
//           <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
//             // Neural Synergy Expander
//           </span>
//           <h3 className="font-display italic text-xl sm:text-2xl text-foreground truncate w-full">Aesthetic Synthesis</h3>
//         </div>

//         <div className="w-full max-w-full min-w-0 border border-border/40 bg-background/50 p-3 space-y-3 relative rounded-none box-border">
//           <div className="w-full min-w-0">
//             <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
//               You said:
//             </span>
//             <p className="font-sans text-xs sm:text-sm font-medium text-foreground italic break-words whitespace-normal">
//               "{userPrompt}"
//             </p>
//           </div>

//           <div className="h-px bg-border/20 w-full" />

//           <div className="w-full max-w-full min-w-0 space-y-1.5 flex-1 flex flex-col">
//             <span className="font-mono text-[9px] uppercase tracking-wider text-accent flex items-center gap-1.5 min-w-0 truncate">
//               <Sparkles className="size-3 shrink-0" /> Expanded Context Description:
//             </span>

//             {isLoading ? (
//               <div className="w-full bg-foreground/[0.01] border border-border/10 p-3 flex items-center justify-center gap-2 min-h-[100px]">
//                 <Loader2 className="size-3.5 animate-spin text-accent" />
//                 <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">
//                   Feeling the music...
//                 </span>
//               </div>
//             ) : error ? (
//               <div className="w-full bg-foreground/[0.01] border border-destructive/30 p-3 space-y-2">
//                 <p className="font-mono text-[10px] text-destructive">{error}</p>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={fetchExpansion}
//                   className="font-mono text-[9px] uppercase tracking-widest rounded-none h-8 px-3 border-border/40"
//                 >
//                   <RotateCcw className="mr-1 size-3" /> Try again
//                 </Button>
//               </div>
//             ) : isEditing ? (
//               <div className="w-full max-w-full min-w-0 space-y-3 pt-1 flex-1 flex flex-col">
//                 <Textarea
//                   value={expandedText}
//                   onChange={(e) => setExpandedText(e.target.value)}
//                   className="h-[120px] sm:h-[140px] w-full bg-background/80 border border-accent/40 focus-visible:border-accent p-3 font-sans text-xs text-foreground leading-relaxed rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 box-border overflow-y-auto scrollbar-custom"
//                 />
//                 <Button
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                   className="font-mono text-[9px] uppercase tracking-widest rounded-none h-8 px-3 self-end bg-accent text-background hover:bg-accent/90 shrink-0"
//                 >
//                   <Save className="mr-1 size-3" /> Save Changes
//                 </Button>
//               </div>
//             ) : (
//               <div className="w-full max-w-full min-w-0 bg-foreground/[0.01] border border-border/10 font-light box-border p-3">
//                 <p className="font-sans text-xs text-muted-foreground/90 leading-relaxed break-words whitespace-normal max-h-[120px] sm:max-h-[140px] overflow-y-auto scrollbar-custom">
//                   {expandedText}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="w-full max-w-full min-w-0 flex flex-col gap-2 sm:flex-row items-center justify-between border-t border-border/20 mt-5 sm:mt-6 shrink-0 box-border pt-4">
//         <div className="flex items-center w-full sm:w-auto min-w-0 shrink-0 gap-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleStartOver}
//             disabled={isLoading}
//             className="font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase rounded-none h-9 sm:h-10 px-4 sm:px-5 w-full sm:w-auto border-border/40 truncate flex items-center justify-center shrink-0 text-center whitespace-nowrap"
//           >
//             <RotateCcw className="mr-1.5 size-3 shrink-0" /> Start Over
//           </Button>

//           {!isEditing && !isLoading && !error && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsEditing(true)}
//               className="font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase rounded-none h-9 sm:h-10 px-4 sm:px-5 w-full sm:w-auto border-border/40 truncate flex items-center justify-center shrink-0 text-center whitespace-nowrap"
//             >
//               <Edit3 className="mr-1.5 size-3 shrink-0" /> Edit
//             </Button>
//           )}
//         </div>

//         <Button
//           type="button"
//           disabled={isEditing || isLoading || !!error}
//           onClick={() => onApprove(expandedText)}
//           className="font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase rounded-none h-9 sm:h-10 px-4 sm:px-5 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 flex items-center justify-center shrink-0 text-center whitespace-nowrap"
//         >
//           <Check className="mr-1.5 size-3.5 stroke-[2.5px] shrink-0" /> Continue
//         </Button>
//       </div>
//     </>
//   )
// }
"use client"

import * as React from "react"
import { Sparkles, Edit3, RotateCcw, Check, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generationApi } from "@/lib/api"

interface FeelingExpanderViewProps {
  userPrompt: string
  trackId: string
  onApprove: (expandedText: string) => void
  onStartOver: () => void
}

export function FeelingExpanderView({
  userPrompt,
  trackId,
  onApprove,
  onStartOver
}: FeelingExpanderViewProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [expandedText, setExpandedText] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Guard reference tracking network execution state
  const hasFetched = React.useRef<string | null>(null)

  // Call the Feeling Expander safely
  const fetchExpansion = React.useCallback(async (force = false) => {
    // Prevent double invocation if already executing or completed for this trackId
    if (!force && hasFetched.current === trackId) return
    
    hasFetched.current = trackId
    setIsLoading(true)
    setError(null)

    try {
      const data = await generationApi.expand({
        upload_id: trackId,
        basic_input: userPrompt,
      })
      setExpandedText(data.expanded)
    } catch (err: any) {
      console.error("Feeling Expander error:", err)
      // Clear guard pointer on error so retry functions can run cleanly
      hasFetched.current = null
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [trackId, userPrompt])

  React.useEffect(() => {
    fetchExpansion()
  }, [fetchExpansion])

  const handleStartOver = () => {
    hasFetched.current = null
    onStartOver()
  }

  return (
    <>
      {/* Custom Ultra-Slim Scrollbar: Slate thumb, Black track, Rounded corners */}
      <style jsx global>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #555;
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #000000; 
          border-radius: 10px;
        }
        
        /* Hide scrollbar buttons (arrows) */
        .scrollbar-custom::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <div className="w-full max-w-full min-w-0 space-y-4 flex-1 flex flex-col justify-center">
        <div className="w-full min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Neural Synergy Expander
          </span>
          <h3 className="font-display italic text-xl sm:text-2xl text-foreground truncate w-full">Aesthetic Synthesis</h3>
        </div>

        <div className="w-full max-w-full min-w-0 border border-border/40 bg-background/50 p-3 space-y-3 relative rounded-none box-border">
          <div className="w-full min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
              You said:
            </span>
            <p className="font-sans text-xs sm:text-sm font-medium text-foreground italic break-words whitespace-normal">
              "{userPrompt}"
            </p>
          </div>

          <div className="h-px bg-border/20 w-full" />

          <div className="w-full max-w-full min-w-0 space-y-1.5 flex-1 flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent flex items-center gap-1.5 min-w-0 truncate">
              <Sparkles className="size-3 shrink-0" /> Expanded Context Description:
            </span>

            { isLoading ? (
              <div className="w-full bg-foreground/[0.01] border border-border/10 p-3 flex items-center justify-center gap-2 min-h-[100px]">
                <Loader2 className="size-3.5 animate-spin text-accent" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">
                  Feeling the music...
                </span>
              </div>
            ) : error ? (
              <div className="w-full bg-foreground/[0.01] border border-destructive/30 p-3 space-y-2">
                <p className="font-mono text-[10px] text-destructive">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchExpansion(true)}
                  className="font-mono text-[9px] uppercase tracking-widest rounded-none h-8 px-3 border-border/40"
                >
                  <RotateCcw className="mr-1 size-3" /> Try again
                </Button>
              </div>
            ) : isEditing ? (
              <div className="w-full max-w-full min-w-0 space-y-3 pt-1 flex-1 flex flex-col">
                <Textarea
                  value={expandedText}
                  onChange={(e) => setExpandedText(e.target.value)}
                  className="h-[120px] sm:h-[140px] w-full bg-background/80 border border-accent/40 focus-visible:border-accent p-3 font-sans text-xs text-foreground leading-relaxed rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 box-border overflow-y-auto scrollbar-custom"
                />
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="font-mono text-[9px] uppercase tracking-widest rounded-none h-8 px-3 self-end bg-accent text-background hover:bg-accent/90 shrink-0"
                >
                  <Save className="mr-1 size-3" /> Save Changes
                </Button>
              </div>
            ) : (
              <div className="w-full max-w-full min-w-0 bg-foreground/[0.01] border border-border/10 font-light box-border p-3">
                <p className="font-sans text-xs text-muted-foreground/90 leading-relaxed break-words whitespace-normal max-h-[120px] sm:max-h-[140px] overflow-y-auto scrollbar-custom">
                  {expandedText}
                </p>
              </div>
            )
          }
          </div>
        </div>
      </div>

      <div className="w-full max-w-full min-w-0 flex flex-col gap-2 sm:flex-row items-center justify-between border-t border-border/20 mt-5 sm:mt-6 shrink-0 box-border pt-4">
        <div className="flex items-center w-full sm:w-auto min-w-0 shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleStartOver}
            disabled={isLoading}
            className="font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase rounded-none h-9 sm:h-10 px-4 sm:px-5 w-full sm:w-auto border-border/40 truncate flex items-center justify-center shrink-0 text-center whitespace-nowrap"
          >
            <RotateCcw className="mr-1.5 size-3 shrink-0" /> Start Over
          </Button>

          {!isEditing && !isLoading && !error && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase rounded-none h-9 sm:h-10 px-4 sm:px-5 w-full sm:w-auto border-border/40 truncate flex items-center justify-center shrink-0 text-center whitespace-nowrap"
            >
              <Edit3 className="mr-1.5 size-3 shrink-0" /> Edit
            </Button>
          )}
        </div>

        <Button
          type="button"
          disabled={isEditing || isLoading || !!error}
          onClick={() => onApprove(expandedText)}
          className="font-mono text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase rounded-none h-9 sm:h-10 px-4 sm:px-5 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 flex items-center justify-center shrink-0 text-center whitespace-nowrap"
        >
          <Check className="mr-1.5 size-3.5 stroke-[2.5px] shrink-0" /> Continue
        </Button>
      </div>
    </>
  )
}
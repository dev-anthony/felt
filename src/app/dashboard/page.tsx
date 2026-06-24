// "use client"

// import * as React from "react"
// import { useRouter } from "next/navigation"

// import { Plus, ArrowUpRight, Image as ImageIcon, Sliders, Loader2, Music4 } from "lucide-react"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { WorkspaceWizard } from "@/components/dashboard/workspace-wizard"
// import { TuningWorkspaceView } from "@/components/dashboard/tunning-workspace-view"
// import { useUser } from "@/context/userContext" 
// import { uploadApi, UploadRecord } from "@/lib/api"

// export default function DashboardPage() {
//   const router = useRouter()
//   const { user, loading: userLoading } = useUser()

//   const [uploads, setUploads] = React.useState<UploadRecord[]>([])
//   const [loadingUploads, setLoadingUploads] = React.useState(true)
//   const [isUploadOpen, setIsUploadOpen] = React.useState(false)
//   const [isTuneOpen, setIsTuneOpen] = React.useState(false)
  
//   // 🛠️ Bulletproof local session cache to map image URLs cleanly by track title
//   const [sessionCoverCache, setSessionCoverCache] = React.useState<Record<string, string>>({})

//   const [editingTrack, setEditingTrack] = React.useState<{
//     id: string
//     title: string
//     filterId: string
//     variant: string
//   } | null>(null)

//   // Fetch true database uploads stream on mount
//   const fetchDashboardData = React.useCallback(async () => {
//     try {
//       const data = await uploadApi.getUploads(20, 0)
//       setUploads(data.uploads || [])
//     } catch (err) {
//       console.error("Failed to parse real upload streams:", err)
//     } finally {
//       setLoadingUploads(false)
//     }
//   }, [])

//   React.useEffect(() => {
//     if (!userLoading && user) {
//       fetchDashboardData()
//     }
//   }, [userLoading, user, fetchDashboardData])

//   // 🛠️ Capture image url straight out of ArtGenerationView workflow
//   const handleFreshGenerationComplete = (title: string, type: string, filterId: string, imageUrl?: string) => {
//     console.log(`[DASHBOARD ROOT] Generation finalized asset caught:`, { title, type, filterId, imageUrl })
    
//     if (imageUrl) {
//       setSessionCoverCache(prev => ({
//         ...prev,
//         [title]: imageUrl
//       }))
//     }
    
//     // Refresh core layout cleanly
//     fetchDashboardData()
//     setIsUploadOpen(false)
//   }

//   if (userLoading || loadingUploads) {
//     return (
//       <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-2 text-muted-foreground font-mono text-[11px] uppercase tracking-widest">
//         <Loader2 className="size-5 animate-spin text-accent" />
//         Synchronizing Matrix Stream...
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-10 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
//         <div>
//           <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
//             // Operational Matrix — Welcome {user?.name || "Creator"}
//           </span>
//           <h1 className="font-display italic text-4xl tracking-tight">Artist Studio</h1>
//         </div>

//         <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
//           <DialogTrigger asChild>
//             <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-widest uppercase h-11 px-6">
//               <Plus className="mr-2 size-4" /> New Upload
//             </Button>
//           </DialogTrigger>
//           <DialogContent
//             onInteractOutside={(e) => e.preventDefault()}
//             onEscapeKeyDown={(e) => e.preventDefault()}
//             className="w-[calc(100vw-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-border/40 text-foreground p-0 rounded-none sm:w-full"
//           >
//             <DialogHeader className="sr-only">
//               <DialogTitle>Acoustic Synthesis Canvas</DialogTitle>
//               <DialogDescription>Generation profile pipeline layout wrapper context</DialogDescription>
//             </DialogHeader>
//             <WorkspaceWizard
//               onClose={() => setIsUploadOpen(false)}
//               onCompleteGeneration={handleFreshGenerationComplete}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* History grid / Empty State Manager */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
//             Recent Generations ({uploads.length})
//           </h2>
//           {uploads.length > 0 && (
//             <Button
//               variant="link"
//               onClick={() => router.push("/dashboard/gallery")}
//               className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-foreground p-0 h-auto"
//             >
//               View Full Gallery <ArrowUpRight className="ml-1 size-3.5" />
//             </Button>
//           )}
//         </div>

//         {uploads.length === 0 ? (
//           <div className="w-full min-h-[350px] border border-dashed border-border/20 flex flex-col items-center justify-center p-8 text-center bg-foreground/[0.01]">
//             <Music4 className="size-8 text-muted-foreground/20 stroke-[1px] mb-4" />
//             <p className="font-display italic text-xl text-foreground mb-1">The canvas is silent.</p>
//             <p className="font-sans text-xs text-muted-foreground max-w-xs mx-auto mb-6">
//               You haven't uploaded any sounds yet. Initiate your first acoustic analysis blueprint to manifest artwork.
//             </p>
//             <Button 
//               onClick={() => setIsUploadOpen(true)}
//               className="rounded-none border border-border bg-transparent text-foreground hover:bg-foreground/5 font-mono text-[9px] tracking-widest uppercase h-9 px-4"
//             >
//               Initiative First Upload
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {uploads.map((track) => {
//               // 🛠️ Read database embed array first, fall back safely to local session cache if empty
//               const dbImage = track.generations?.[0]?.image_url
//               const cachedImage = sessionCoverCache[track.title]
//               const finalImageUrl = dbImage || cachedImage
              
//               const displayDate = new Date(track.created_at).toLocaleDateString('en-US', {
//                 month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
//               })

//               return (
//                 <Card
//                   key={track.id}
//                   className="bg-[#0e0e0e] border border-border/20 rounded-none group hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
//                 >
//                   <CardHeader className="p-4 pb-2">
//                     <div className="flex items-center justify-between mb-1">
//                       <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase px-1.5 py-0.5 bg-foreground/5">
//                         {track.track_type === 'vocal' ? 'Vocal' : 'Beat'}
//                       </span>
//                       <span className="font-mono text-[9px] text-muted-foreground">{displayDate}</span>
//                     </div>
//                     <CardTitle className="font-display italic text-xl text-foreground group-hover:text-accent transition-colors truncate">
//                       {track.title}
//                     </CardTitle>
//                     <div className="flex items-center justify-between mt-1">
//                       <CardDescription className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground/70">
//                         Status: <span className="text-accent">{track.status}</span>
//                       </CardDescription>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="p-4 pt-0">
//                     <div className="aspect-square w-full bg-foreground/[0.02] border border-border/20 flex flex-col items-center justify-center relative group-hover:bg-foreground/[0.04] transition-all">
//                       {finalImageUrl ? (
//                         <img 
//                           src={finalImageUrl} 
//                           alt={track.title} 
//                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
//                         />
//                       ) : (
//                         <>
//                           <ImageIcon className="size-8 text-muted-foreground/30 stroke-[1px] mb-2" />
//                           <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50">No Cover Bound</span>
//                         </>
//                       )}

//                       <button
//                         className="absolute top-3 right-3 p-1.5 bg-[#080808] border border-border/40 text-muted-foreground hover:text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
//                         title="Tune Style & Model Variant"
//                       >
//                         <Sliders className="size-3.5" />
//                       </button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>
//         )}
//       </div>

//       {/* DIALOG TWO: Tune */}
//       <Dialog open={isTuneOpen} onOpenChange={(open) => { setIsTuneOpen(open); if (!open) setEditingTrack(null) }}>
//         <DialogContent 
//           onInteractOutside={(e) => e.preventDefault()}
//           onEscapeKeyDown={(e) => e.preventDefault()}
//           className="w-[calc(100vw-2rem)] max-w-md max-h-[90dvh] overflow-y-auto bg-[#121212] border border-border/40 text-foreground p-0 rounded-none sm:w-full"
//         >
//           <DialogHeader className="sr-only">
//             <DialogTitle>Tune Track Aesthetics</DialogTitle>
//             <DialogDescription>Modify filter values or switch active style generation layer variants</DialogDescription>
//           </DialogHeader>
//           {editingTrack && (
//             <TuningWorkspaceView
//               trackTitle={editingTrack.title}
//               initialFilterId={editingTrack.filterId}
//               initialVariant={editingTrack.variant}
//               onClose={() => { setIsTuneOpen(false); setEditingTrack(null) }}
//               onSaveUpdates={() => {}} 
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Plus, ArrowUpRight, Image as ImageIcon, Sliders, Loader2, Music4 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { WorkspaceWizard } from "@/components/dashboard/workspace-wizard"
import { TuningWorkspaceView } from "@/components/dashboard/tunning-workspace-view"
import { useUser } from "@/context/userContext" 
import { uploadApi, UploadRecord, generationApi } from "@/lib/api"

// Define modern structure matching revamped TuningWorkspace requirements
interface EditingTrackState {
  id: string
  title: string
  currentImageUrl: string | null
  expandedFeeling: string
  originalPrompt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()

  const [uploads, setUploads] = React.useState<UploadRecord[]>([])
  const [loadingUploads, setLoadingUploads] = React.useState(true)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [isTuneOpen, setIsTuneOpen] = React.useState(false)
  
  // Bulletproof local session cache to map image URLs cleanly by track title
  const [sessionCoverCache, setSessionCoverCache] = React.useState<Record<string, string>>({})

  // Swapped structure to store text blueprints and contextual feeling arrays
  const [editingTrack, setEditingTrack] = React.useState<EditingTrackState | null>(null)

  // Fetch true database uploads stream on mount
  const fetchDashboardData = React.useCallback(async () => {
    try {
      const data = await uploadApi.getUploads(20, 0)
      setUploads(data.uploads || [])
    } catch (err) {
      console.error("Failed to parse real upload streams:", err)
    } finally {
      setLoadingUploads(false)
    }
  }, [])

  React.useEffect(() => {
    if (!userLoading && user) {
      fetchDashboardData()
    }
  }, [userLoading, user, fetchDashboardData])

  // Capture image url straight out of ArtGenerationView workflow
  const handleFreshGenerationComplete = (title: string, type: string, filterId: string, imageUrl?: string) => {
    console.log(`[DASHBOARD ROOT] Generation finalized asset caught:`, { title, type, filterId, imageUrl })
    
    if (imageUrl) {
      setSessionCoverCache(prev => ({
        ...prev,
        [title]: imageUrl
      }))
    }
    
    // Refresh core layout cleanly
    fetchDashboardData()
    setIsUploadOpen(false)
  }

// Inside Dashboard page.tsx container view
const handleRegenerateArt = async (uploadId: string, updatedPrompt: string, expandedDescription?: string) => {
  try {
    // ─── RUN NATIVE WRAPPER PIPELINE REFINE ENGINE ───
    const result = await generationApi.refine({
      upload_id: uploadId,
      // Pass the high-aesthetic descriptive block returned from Gemini!
      lyric_context: expandedDescription || updatedPrompt, 
      image_url: editingTrack?.currentImageUrl 
    });

    // Update state layers perfectly across components
    setUploads((prev) =>
      prev.map((upload) => {
        if (upload.id === uploadId) {
          return {
            ...upload,
            sentence_prompt: updatedPrompt, // Cache their raw input text base
            generations: [
              {
                id: result.generation_id,
                upload_id: uploadId,
                user_id: "", 
                image_url: result.image_url,
                status: "complete",
                created_at: new Date().toISOString(),
                prompt_used: expandedDescription || updatedPrompt,
              },
              ...(upload.generations || []),
            ],
          };
        }
        return upload;
      })
    );

    // Update active editor image state instantly
    setEditingTrack((prev) => (prev ? { ...prev, currentImageUrl: result.image_url } : null));

  } catch (err: any) {
    console.error("❌ [REGEN HANDLER EXCEPTION]:", err);
    throw err; // Escapes directly back to clear workspace loaders seamlessly
  }
};

  if (userLoading || loadingUploads) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-2 text-muted-foreground font-mono text-[11px] uppercase tracking-widest">
        <Loader2 className="size-5 animate-spin text-accent" />
        Synchronizing Matrix Stream...
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent block mb-1">
            // Operational Matrix — Welcome {user?.name || "Creator"}
          </span>
          <h1 className="font-display italic text-4xl tracking-tight">Artist Studio</h1>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] tracking-widest uppercase h-11 px-6">
              <Plus className="mr-2 size-4" /> New Upload
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="w-[calc(100vw-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-border/40 text-foreground p-0 rounded-none sm:w-full"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Acoustic Synthesis Canvas</DialogTitle>
              <DialogDescription>Generation profile pipeline layout wrapper context</DialogDescription>
            </DialogHeader>
            <WorkspaceWizard
              onClose={() => setIsUploadOpen(false)}
              onCompleteGeneration={handleFreshGenerationComplete}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* History grid / Empty State Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Recent Generations ({uploads.length})
          </h2>
          {uploads.length > 0 && (
            <Button
              variant="link"
              onClick={() => router.push("/dashboard/gallery")}
              className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-foreground p-0 h-auto"
            >
              View Full Gallery <ArrowUpRight className="ml-1 size-3.5" />
            </Button>
          )}
        </div>

        {uploads.length === 0 ? (
          <div className="w-full min-h-[350px] border border-dashed border-border/20 flex flex-col items-center justify-center p-8 text-center bg-foreground/[0.01]">
            <Music4 className="size-8 text-muted-foreground/20 stroke-[1px] mb-4" />
            <p className="font-display italic text-xl text-foreground mb-1">The canvas is silent.</p>
            <p className="font-sans text-xs text-muted-foreground max-w-xs mx-auto mb-6">
              You haven't uploaded any sounds yet. Initiate your first acoustic analysis blueprint to manifest artwork.
            </p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="rounded-none border border-border bg-transparent text-foreground hover:bg-foreground/5 font-mono text-[9px] tracking-widest uppercase h-9 px-4"
            >
              Initiative First Upload
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uploads.map((track) => {
              // Read database embed array first, fall back safely to local session cache if empty
              const dbImage = track.generations?.[0]?.image_url
              const cachedImage = sessionCoverCache[track.title]
              const finalImageUrl = dbImage || cachedImage
              
              const displayDate = new Date(track.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
              })

              return (
                <Card
                  key={track.id}
                  className="bg-[#0e0e0e] border border-border/20 rounded-none group hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase px-1.5 py-0.5 bg-foreground/5">
                        {track.track_type === 'vocal' ? 'Vocal' : 'Beat'}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">{displayDate}</span>
                    </div>
                    <CardTitle className="font-display italic text-xl text-foreground group-hover:text-accent transition-colors truncate">
                      {track.title}
                    </CardTitle>
                    <div className="flex items-center justify-between mt-1">
                      <CardDescription className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground/70">
                        Status: <span className="text-accent">{track.status}</span>
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <div className="aspect-square w-full bg-foreground/[0.02] border border-border/20 flex flex-col items-center justify-center relative group-hover:bg-foreground/[0.04] transition-all">
                      {finalImageUrl ? (
                        <img 
                          src={finalImageUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <>
                          <ImageIcon className="size-8 text-muted-foreground/30 stroke-[1px] mb-2" />
                          <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50">No Cover Bound</span>
                        </>
                      )}

                      {/* ─── 🛠️ FIXED: TRIGGER EDIT TUNING MODAL ON CLICK ─── */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTrack({
                            id: track.id,
                            title: track.title,
                            currentImageUrl: finalImageUrl || null,
                            // Extracted matching generation prompt rules setup fallback:
                            expandedFeeling: track.generations?.[0]?.prompt_used || "Audio structural profile analysis established.",
                            originalPrompt: track.sentence_prompt || ""
                          });
                          setIsTuneOpen(true);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-[#080808] border border-border/40 text-muted-foreground hover:text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        title="Tune Generation Prompt & Matrix Blueprint"
                      >
                        <Sliders className="size-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* DIALOG TWO: Tune Workspace */}
      <Dialog open={isTuneOpen} onOpenChange={(open) => { setIsTuneOpen(open); if (!open) setEditingTrack(null) }}>
        <DialogContent 
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="w-[calc(100vw-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-border/40 text-foreground p-0 rounded-none sm:w-full"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Tune Track Aesthetics</DialogTitle>
            <DialogDescription>Modify blueprint context parameters to regenerate active canvas art</DialogDescription>
          </DialogHeader>
          {editingTrack && (
            <TuningWorkspaceView
              uploadId={editingTrack.id}
              trackTitle={editingTrack.title}
              currentImageUrl={editingTrack.currentImageUrl}
              originalPrompt={editingTrack.originalPrompt}
              onClose={() => { 
                setIsTuneOpen(false); 
                setEditingTrack(null); 
              }}
              // Maps cleanly to your updated handleRegenerateArt function
              onRegenerate={handleRegenerateArt} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
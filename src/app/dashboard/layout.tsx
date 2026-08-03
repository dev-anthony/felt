import Script from "next/script"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { UserProvider } from "@/context/userContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      {/* Essentia.js only powers the client-side DSP pass in workspace-wizard.tsx
          (the upload flow). Scoped to the dashboard layout instead of the root
          layout so marketing/auth pages don't pay for a WASM audio-analysis
          engine they never touch. */}
      <Script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.web.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-models.js" strategy="afterInteractive" />
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full bg-[#080808] text-foreground font-sans">
            <AppSidebar />
            
            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
              <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-border/40 bg-[#000000] fixed top-0 w-full z-40">
                <span className="font-display italic text-xl tracking-tight">FELT</span>
                <SidebarTrigger className="rounded-full border border-border/40 p-2 text-foreground hover:bg-foreground/5" />
              </header>

              <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto scrollbar-custom bg-[#080808]">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </UserProvider>
  )
}
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
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full bg-[#080808] text-foreground font-sans">
            <AppSidebar />
            
            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
              <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-border/40 bg-[#000000] fixed top-0 w-full z-40">
                <span className="font-display italic text-xl tracking-tight">FELT</span>
                <SidebarTrigger className="rounded-none border border-border/40 p-2 text-foreground hover:bg-foreground/5" />
              </header>

              <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto bg-[#080808]">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </UserProvider>
  )
}
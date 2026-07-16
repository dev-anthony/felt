
"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Image as GalleryIcon, 
  User as UserIcon, 
  LogOut, 
  ChevronLeft
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavStore } from "@/store/useNavStore"
import { useUser } from "@/context/userContext" // Attached context

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setContext } = useNavStore()
  const { state, isMobile, toggleSidebar } = useSidebar()
  const { user, logout } = useUser() // Active layout actions hooks

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Gallery",
      url: "/dashboard/gallery",
      icon: GalleryIcon,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: UserIcon,
    },
  ]

  const handleLogout = async () => {
    setContext("landing")
    await logout() // Hits backend, wipes token cookies, and routes to home "/"
  }

  return (
    <Sidebar 
      collapsible="icon" 
      className="bg-[#080808] border-r border-border/40 text-foreground"
    >
      {/* Brand Header Section */}
      <SidebarHeader className="h-20 flex flex-row items-center justify-between px-4 border-b border-border/40 bg-[#080808]">
        {state === "expanded" && (
          <div className="flex flex-col reveal min-w-0">
            {/* h-6 ≈ the old `text-2xl` (24px) text logo this replaced. */}
            <Image
              src="/felt_logo.png"
              alt="FELT"
              width={96}
              height={39}
              priority
              className="h-6 w-auto select-none"
            />
            {user?.email && (
              <span className="font-mono text-[8px] text-muted-foreground max-w-[140px] truncate mt-1">
                {user.email}
              </span>
            )}
          </div>
        )}
        
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all duration-300 border border-border/40 bg-transparent rounded-none ml-auto"
            style={{
              transform: state === "collapsed" ? "rotate(180deg)" : "rotate(0deg)",
            }}
            title={state === "expanded" ? "Collapse panel" : "Expand panel"}
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
      </SidebarHeader>

      {/* Main Core Links Framework */}
      <SidebarContent className="bg-[#000000] pt-6 px-2 space-y-1">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => router.push(item.url)}
                  tooltip={item.title}
                  className={`w-full hover:bg-foreground/5 font-mono text-[10px] tracking-[0.2em] uppercase rounded-none h-11 px-3 transition-colors ${
                    isActive 
                      ? "bg-foreground/10 text-accent font-medium border-l border-accent" 
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <item.icon className="size-4 shrink-0" />
                  {state === "expanded" && (
                    <span className="reveal text-[11px] cursor-pointer ml-1 hover:bg-foreground/5 rounded-2xl p-2 transition-colors duration-100">{item.title}</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Functional Action Footer Block */}
      <SidebarFooter className="bg-[#080808] p-2 border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout Session"
              className="w-full font-mono text-[10px] tracking-[0.2em] uppercase rounded-none h-11 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 bg-transparent transition-colors"
            >
              <LogOut className="size-4 shrink-0" />
              {state === "expanded" && (
                <span className="reveal ml-1">Logout</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
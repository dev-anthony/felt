"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNavStore } from "@/store/useNavStore";
import { AuthDialog } from "@/components/auth-dialog";
import { authApi, handleGracefulFailoverLogout } from "@/lib/api";
import { Archive, Home, Sparkles, Layers, Ticket, ArrowUpRight, LayoutDashboard, LogOut } from "lucide-react";

export function Navigation() {
  const { context, setContext } = useNavStore();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleNav = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  const handleLogout = async () => {
    setIsOpen(false);
    setContext('landing');
    try {
      await authApi.logout();
    } catch {
      handleGracefulFailoverLogout();
    }
  };

  const linkClass = "text-foreground hover:text-accent transition-colors p-3 rounded-lg hover:bg-foreground/10 flex items-center justify-center";

  return (
    <>
      {/* Desktop Navigation — main background removed, pill links with background kept, explore button hidden on mobile */}
      <div className="fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center px-6">
        <nav
          className={`w-full max-w-6xl flex items-center justify-between px-6 py-3 transition-all duration-500 ${
            scrolled || context !== "landing"
              ? "border border-border/60 rounded-full"
              : "border border-transparent "
          }`}
        >
          {/* Logo on the far left */}
          <Link href="/" aria-label="FELT home" className="flex items-center shrink-0">
            <Image
              src="/felt_logo.png"
              alt="FELT"
              width={120}
              height={49}
              priority
              className="h-7 w-auto select-none"
            />
          </Link>

          {/* Centered pill nav links with background */}
          <div className="hidden md:flex items-center border border-border/50 rounded-full px-4 py-1.5 gap-1 text-[11px] font-mono tracking-[0.2em] uppercase backdrop-blur-md">
            {context === 'landing' ? (
              <>
                <a href="#" className="px-4 py-2 rounded-full hover:bg-foreground/10 hover:text-accent transition-colors">Home</a>
                <a href="#how-it-works" className="px-4 py-2 rounded-full hover:bg-foreground/10 hover:text-accent transition-colors">How it works</a>
                <a href="#features" className="px-4 py-2 rounded-full hover:bg-foreground/10 hover:text-accent transition-colors">Features</a>
                <a href="#pricing" className="px-4 py-2 rounded-full hover:bg-foreground/10 hover:text-accent transition-colors">Pricing</a>
                <a href="#faq" className="px-4 py-2 rounded-full hover:bg-foreground/10 hover:text-accent transition-colors">FAQ</a>
              </>
            ) : (
              <>
                <a href="/dashboard" className="px-4 py-2 rounded-full bg-foreground text-background font-medium shadow-sm transition-colors">Overview</a>
                <a href="/dashboard/gallery" className="px-4 py-2 rounded-full hover:bg-foreground/10 hover:text-accent transition-colors">My Art</a>
              </>
            )}
          </div>

          {/* Action button on the far right (Hidden on mobile so only the logo displays) */}
          <div className="hidden md:flex items-center">
            {context === 'landing' ? (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-6 py-2.5 bg-foreground text-background rounded-full font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-accent transition-colors cursor-pointer shadow-md"
              >
                Explore
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-5 py-2 border border-border rounded-full font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-destructive hover:text-white hover:border-destructive transition-colors cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Floating Action & Slide Panel */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleNav}
          className="w-14 h-14 rounded-full bg-foreground/10 dark:bg-foreground/20 border border-foreground/20 dark:border-foreground/30 flex items-center justify-center text-foreground hover:bg-foreground/20 dark:hover:bg-foreground/30 transition-all duration-300 backdrop-blur-md hover:scale-110"
          style={{
            transform: isOpen ? 'rotate(449deg)' : 'rotate(0deg)',
            transition: 'transform 300ms ease-out'
          }}
          aria-label="Toggle navigation"
        >
          <Archive className="w-6 h-6" />
        </button>

        <nav 
          className={`fixed bottom-24 right-6 z-40 bg-foreground/[0.03] dark:bg-foreground/[0.05] backdrop-blur-2xl border border-foreground/20 dark:border-foreground/30 rounded-3xl p-4 transition-all duration-300 shadow-lg ${
            isOpen 
              ? 'opacity-100 scale-100 pointer-events-auto' 
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className='flex flex-col gap-3'>
            {context === 'landing' ? (
              <>
                <a href="#" onClick={handleLinkClick} className={linkClass} title="Home">
                  <Home className="w-5 h-5"/>
                </a>
                <a href="#summary" onClick={handleLinkClick} className={linkClass} title="Summary">
                  <Sparkles className="w-5 h-5"/>
                </a>
                <a href="#features" onClick={handleLinkClick} className={linkClass} title="Features">
                  <Layers className="w-5 h-5"/>
                </a>
                <a href="#pricing" onClick={handleLinkClick} className={linkClass} title="Pricing">
                  <Ticket className="w-5 h-5"/>
                </a>
                <button 
                  onClick={() => { handleLinkClick(); setAuthOpen(true); }} 
                  className={linkClass} 
                  title="Explore"
                >
                  <ArrowUpRight className="w-5 h-5"/>
                </button>
              </>
            ) : (
              <>
                <a href="/dashboard" onClick={handleLinkClick} className={linkClass} title="Dashboard Home">
                  <LayoutDashboard className="w-5 h-5"/>
                </a>
                <a href="/dashboard/gallery" onClick={handleLinkClick} className={linkClass} title="Archive">
                  <Archive className="w-5 h-5"/>
                </a>
                <button 
                  onClick={handleLogout} 
                  className={`${linkClass} text-destructive hover:bg-destructive/15`} 
                  title="Logout"
                >
                  <LogOut className="w-5 h-5"/>
                </button>
              </>
            )}
          </div>
        </nav>

        {isOpen && (
          <div 
            onClick={toggleNav}
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          />
        )}
      </div>

      {/* Global Auth Dialog Frame */}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
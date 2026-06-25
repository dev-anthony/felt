'use client';

import { useState } from "react";
import { useNavStore } from "@/store/useNavStore";
import { AuthDialog } from "@/components/auth-dialog";
import { Archive, Home, Sparkles, Layers, Ticket, ArrowUpRight, LayoutDashboard, LogOut } from "lucide-react";

export function Navigation() {
  const { context, setContext } = useNavStore();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  // Mock function: Connect this to your auth hook / route pusher
  const handleLogout = () => {
    setIsOpen(false);
    setContext('landing');
  };

  const linkClass = "text-foreground hover:text-accent transition-colors p-3 rounded-lg hover:bg-foreground/10 flex items-center justify-center";

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-7 mix-blend-difference">
        <div className="font-display italic text-3xl tracking-tight">FELT</div>
        <div className="hidden md:flex gap-12 text-[11px] font-mono tracking-[0.25em] uppercase items-center">
          {context === 'landing' ? (
            <>
              <a href="#features" className="hover:text-accent transition-colors">Features</a>
              <a href="#pricing" className="hover:text-accent transition-colors">Pricing</a>
              <button 
                onClick={() => setAuthOpen(true)}
                className="px-4 py-2 border border-border rounded-full font-mono text-[12px] tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors cursor-pointer"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <a href="/dashboard" className="hover:text-accent transition-colors">Overview</a>
              <a href="/dashboard/archive" className="hover:text-accent transition-colors">My Art</a>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 border border-border rounded-full font-mono text-[12px] tracking-[0.2em] uppercase hover:bg-destructive hover:text-white transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

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
                  title="Get Started"
                >
                  <ArrowUpRight className="w-5 h-5"/>
                </button>
              </>
            ) : (
              <>
                <a href="/dashboard" onClick={handleLinkClick} className={linkClass} title="Dashboard Home">
                  <LayoutDashboard className="w-5 h-5"/>
                </a>
                <a href="/dashboard/archive" onClick={handleLinkClick} className={linkClass} title="Archive">
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
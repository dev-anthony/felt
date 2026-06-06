
'use client';

import Image from "next/image";
import { Archive, Home, Sparkles, Layers, Ticket, ArrowUpRight, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { AuthDialog } from "@/components/auth-dialog";

export default function Index() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);
  const toggleDarkMode = () => setIsDark(!isDark);

  const linkClass = "text-foreground hover:text-accent transition-colors p-3 rounded-lg hover:bg-foreground/10";

  return (
    <main className="bg-background text-foreground selection:bg-accent selection:text-background">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-7 mix-blend-difference">
        <div className="font-display italic text-3xl tracking-tight">FELT</div>
        <div className="hidden md:flex gap-12 text-[11px] font-mono tracking-[0.25em] uppercase items-center">
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#pricing" className="hover:text-accent transition-colors">Pricing</a>
          <button 
            onClick={() => setAuthOpen(true)}
            className="px-4 py-2 border border-border rounded-full font-mono text-[12px] tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-flowers.jpg"
            alt="White flower-grass meeting an overcast sky"
            width={1920}
            height={1080}
            priority 
            className="w-full h-full object-cover opacity-40 grayscale brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
          <div className="absolute top-0 left-0 w-full h-[35vh] bg-accent/10 blur-[140px] -translate-y-1/2" />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="animate-scan h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-30" />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl reveal">
          <span className="font-display text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-wide uppercase text-accent block mb-6 sm:mb-8">
            Cover Art, Listened Into Existence
          </span>
          <h1 className="font-display italic font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] leading-[1.05] sm:leading-[0.95] tracking-wide text-balance mb-8 sm:mb-10">
            Your music<br className="hidden sm:inline" /> made visible
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed font-display px-2 sm:px-0">
            FELT is an AI-powered cover art generation platform that allows artists and producers anywhere to upload their music or beats and instantly receive visual artwork that expresses exactly what the sound feels like.
          </p>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleNav}
            className="w-14 h-14 rounded-full bg-foreground/10 dark:bg-foreground/20 border border-foreground/20 dark:border-foreground/30 flex items-center justify-center text-foreground hover:bg-foreground/20 dark:hover:bg-foreground/30 transition-all duration-300 backdrop-blur-md hover:scale-110"
            style={{
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
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
              
            </div>
          </nav>

          {isOpen && (
            <div 
              onClick={toggleNav}
              className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
            />
          )}
        </div>
      </section>

      {/* Captivating Aesthetic Summary Block */}
      <section id="summary" className="py-12 px-4 border-border text-center bg-foreground/[0.005]">
        <div className="max-w-3xl mx-auto space-y-4 reveal">
          <p className="font-display italic text-xl md:text-2xl tracking-tight leading-relaxed max-w-2xl mx-auto">
            We give your music the cover art it deserves.<br />
            One that feels the way your music feels.<br />
            <span className="text-muted-foreground/80 font-light text-lg md:text-xl block mt-2">Discovered within the music itself.</span>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 reveal">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
              Core Features
            </span>
            <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
              A cohesive visual ecosystem.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal">
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Audio Analysis Engine</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Accepts MP3/WAV tracks across any genre. The system analyzes key sensory metrics—tempo, valence, and key fingerprints—to build your art.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "50ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Dual Context Processing</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Whisper transcription extracts structural storytelling from vocal lines, while an internal Feeling Expander shapes abstract producer ideas into pristine design blueprints.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "100ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Intuitive Curation Controls</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Select visual presets via a mood-based Filter Picker. Fine-tune your output variants smoothly with intuitive, simple style steering sliders.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "150ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Simultaneous Generation</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Every generation process outputs three separate, high-fidelity creative directions instantly, giving you immediate artistic choices.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "200ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Evolving Identity Archives</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                A localized history blueprint that logs city origin data, essential sound attributes, and visual generation patterns as your record catalog expands.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.02] border-dashed space-y-2 reveal" style={{ animationDelay: "250ms" }}>
              <h4 className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">System Focus Overview</h4>
              <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                Dedicated exclusively to high-fidelity visual translation. Not an interactive discovery platform or standard streaming medium.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-border">
        <div className="max-w-sm mx-auto text-center border border-border p-10 bg-background">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent block mb-3">The Pass</span>
          <h2 className="font-display text-3xl italic font-medium mb-2">Unlimited Plan</h2>
          <div className="my-4">
            <span className="font-display text-4xl font-medium tracking-tight">₦2,000</span>
            <span className="font-mono text-xs text-muted-foreground uppercase"> / month</span>
          </div>
          <p className="text-muted-foreground text-xs font-light leading-relaxed mb-8">
            Access unlimited aesthetic variations, deep narrative transcriptions, and intuitive helper tools.
          </p>
          <button 
            onClick={() => setAuthOpen(true)}
            className="w-full py-3.5 bg-foreground text-background font-mono text-[9px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            Subscribe Now
          </button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="py-24 px-6 border-t border-border text-center">
        <div className="max-w-3xl mx-auto space-y-8 reveal">
          <div className="font-display italic font-medium text-4xl md:text-6xl tracking-tighter text-balance max-w-2xl mx-auto leading-tight">
            Your music. Its feeling, made visible.
          </div>
          <div className="pt-2">
            <button 
              onClick={() => setAuthOpen(true)}
              className="px-10 py-4 bg-foreground text-background font-mono text-[9px] tracking-[0.25em] uppercase hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 border-t border-border flex flex-col items-center gap-6 text-center">
  <div className="font-display italic text-2xl tracking-tight">FELT</div>
  <div className="flex flex-wrap justify-center gap-6 font-mono text-[8px] tracking-[0.3em] uppercase text-muted-foreground/60">
    <span>Felt</span>
    <span className="flex items-center gap-1.5 normal-case tracking-normal text-[8px]">
      Built with (x² + y² - 1)³ = x²y³ in
      <svg
        width="14" height="10"
        viewBox="0 0 3 2"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Nigeria"
        className="inline-block rounded-[1px] overflow-hidden flex-shrink-0"
      >
        <rect width="1" height="2" fill="#008751"/>
        <rect x="1" width="1" height="2" fill="#ffffff"/>
        <rect x="2" width="1" height="2" fill="#008751"/>
      </svg>
    </span>
    <span>All wrongs reserved.</span>
    <span>© 2026 Music Tech &amp; Arts</span>
  </div>
</footer>

      {/* Global Auth Trigger Instance */}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  );
}
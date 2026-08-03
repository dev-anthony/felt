"use client";

import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuthDialog } from "@/components/auth-dialog";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SubPageHeader } from "@/components/SubpageHeader";
import { FloatingImageStack } from "@/components/marketing/floating-image-stack";

const HERO_STACK_ITEMS = [
  { label: "Primal", imageUrl: "/download (10).jpg" },
  { label: "Nostalgic", imageUrl: "/download (17).jpg" },
  { label: "Euphoric", imageUrl: "/image.png" },
  { label: "Cerebral", imageUrl: "/tems.jpg" },
];

// Live UTC clock ticker component
function LiveClock() {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().slice(11, 19) + " UTC");
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
      {time || "00:00:00 UTC"}
    </span>
  );
}

export default function AboutPage() {
  const [authOpen, setAuthOpen] = React.useState(false);
  const openAuth = () => setAuthOpen(true);

  return (
    <main className="min-h-screen bg-background pt-24 pb-24 px-4 sm:px-6 overflow-hidden">
      
      
      <SubPageHeader />
      {/* Keyframe animation injected inline for continuous floating motion */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(29deg); }
          50% { transform: translateY(-12px) rotate(27deg); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* ==========================================
            HERO SECTION: Water-Glass Floating Stage
           ========================================== */}
        <section className="relative pt-6">
          
          {/* Literal Water-Glass Container (Sharp specular borders, pure transparency, zero filter blur) */}
          <div className="relative rounded-[2.5rem] border border-foreground/15 bg-gradient-to-b from-foreground/[0.04] via-foreground/[0.01] to-transparent p-6 sm:p-14 text-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_20px_50px_rgba(0,0,0,0.1)]">
            
            {/* Top Specular Edge Highlight */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-foreground/40 to-transparent pointer-events-none" />



            {/* Small operational status line — built earlier but never mounted
                anywhere on the page. */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex size-1.5 rounded-full bg-accent animate-pulse-bar" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                System online ·
              </span>
              <LiveClock />
            </div>

            {/* Main Headline */}
            <h1 className="font-display italic font-medium text-4xl sm:text-6xl md:text-7xl leading-[1.08] text-foreground tracking-wide max-w-3xl mx-auto mb-6">
              About Us. <br />
              <span className="text-muted-foreground"></span>
            </h1>

            {/* Copy text */}
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-8 font-normal">
              FELT is an instant cover art platform built for musicians, producers, and independent artists. You bring the music, we handle the visual identity no design skills or complex setup required.
            </p>

            {/* CTA Trigger */}
            <div className="flex justify-center mb-10">
              <button
                onClick={openAuth}
                className="group relative inline-flex items-center gap-2.5 px-9 py-4 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-all cursor-pointer rounded-full shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="size-3.5" />
                <span>Get Started</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Continuous Floating Tilted Stack */}
            <div className="pt-2">
              <FloatingImageStack items={HERO_STACK_ITEMS} />
            </div>

          </div>
        </section>


        {/* ==========================================
            CONCEPT & VISION (Literal Glass Staggered Cards)
           ========================================== */}
        <section className="py-2">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Card 1: The Idea */}
            <div className="relative rounded-3xl border border-foreground/15 bg-gradient-to-b from-foreground/[0.03] to-transparent p-8 sm:p-10 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  01 / Concept
                </span>
                <span className="text-xs font-mono text-muted-foreground/60">[ Sound Driven ]</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground tracking-wide pt-2">
                The Idea
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Every track carries its own distinct atmosphere—whether it is a bedroom demo, a beat, or a fully mixed single.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Traditional artwork tools force you to become a designer or wrestle with artificial text prompts. FELT lets your music directly drive the visual outcome, creating cover art that fits the exact mood of your record.
              </p>
            </div>

            {/* Card 2: The Vision (Staggered Shift Down) */}
            <div className="relative rounded-3xl border border-foreground/15 bg-gradient-to-b from-foreground/[0.03] to-transparent p-8 sm:p-10 space-y-4 md:translate-y-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  02 / Purpose
                </span>
                <span className="text-xs font-mono text-muted-foreground/60">[ For Artists ]</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground tracking-wide pt-2">
                The Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We believe every creator deserves artwork that feels like a natural extension of their sound, regardless of their budget or design background.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Our vision is to give independent musicians worldwide seamless access to release-ready visual direction the moment a track is finished.
              </p>
            </div>

          </div>
        </section>


        {/* ==========================================
            HOW IT WORKS (Built for Releases)
           ========================================== */}
        <section className="space-y-12 pt-10">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground border border-foreground/15 px-3 py-1 rounded-full bg-foreground/[0.02]">
              Workflow
            </span>
            <h2 className="text-3xl font-semibold text-foreground tracking-tight pt-2">
              Built for Releases
            </h2>
            <p className="text-muted-foreground text-sm">
              A streamlined workflow engineered to get your tracks streaming-ready fast.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-stretch">
            {/* Step 1 */}
            <div className="rounded-2xl border border-foreground/15 bg-gradient-to-b from-foreground/[0.03] to-transparent p-6 space-y-4 flex flex-col justify-between sm:translate-y-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <div className="w-9 h-9 rounded-xl border border-foreground/20 bg-background/50 flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                01
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-base">Share Sound</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drop in your audio file or sound clip so the platform can interpret the vibe, tempo, and texture of your track.
                </p>
              </div>
            </div>

            {/* Step 2 (Elevated Center Card) */}
            <div className="rounded-2xl border border-foreground/20 bg-gradient-to-b from-foreground/[0.05] to-transparent p-6 space-y-4 flex flex-col justify-between sm:-translate-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
              <div className="w-9 h-9 rounded-xl border border-foreground/20 bg-background/50 flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                02
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-base">Match Vibe</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The generator translates the energy of your audio directly into an aesthetic, high-quality cover art direction.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-foreground/15 bg-gradient-to-b from-foreground/[0.03] to-transparent p-6 space-y-4 flex flex-col justify-between sm:translate-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <div className="w-9 h-9 rounded-xl border border-foreground/20 bg-background/50 flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                03
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-base">Export & Release</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Download high-resolution artwork ready for Spotify, Apple Music, and all major distribution platforms.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ==========================================
            CREATIVE CLOSING CTA SECTION
           ========================================== */}
        <section className="pt-12">
          <div className="relative rounded-[2.5rem] border border-foreground/15 bg-gradient-to-b from-foreground/[0.04] via-background to-background p-8 sm:p-16 text-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-display italic text-3xl sm:text-5xl font-medium text-foreground leading-[1.15] tracking-wide">
                Ready to make your sound visible?
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Stop guessing prompts and wasting hours setting up designs. Translate the feeling of your next record into artwork today.
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={openAuth}
                  className="group inline-flex items-center gap-2.5 px-9 py-4 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-all cursor-pointer rounded-full shadow-lg hover:scale-105 active:scale-95"
                >
                  <span>Start Generating</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* Auth Modal Handler */}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      <div className="mt-10">
                <SiteFooter/>
                </div>
    </main>
  );
}
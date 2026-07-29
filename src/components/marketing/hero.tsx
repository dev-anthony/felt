"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

interface HeroProps {
  onGetStarted: () => void
}

const HERO_STACK_ITEMS = [
  { label: "Primal", imageUrl: "/download (10).jpg" },
  { label: "Nostalgic", imageUrl: "/download (17).jpg" },
  { label: "Euphoric", imageUrl: "/image.png" },
  { label: "Cerebral", gradient: "imageUrl: /tems.jpg" },
]

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden pt-16 sm:pt-24 pb-8">
  

      {/* Centered Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center h-full justify-center">
        
        <h1 className="font-display italic font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-wide text-balance mb-4 sm:mb-6 mt-auto pt-10">
          Your music, made visible.
        </h1>
        
        <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
        FELT is an AI-powered cover art generation platform for musicians and producers.  
        It analyzes the emotional DNA of your sound, energy, valence, spectral texture, cultural genre, etc. It translates that feeling into a visual. Your music made visible.
        </p>

        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-2 px-8 py-3.5 sm:py-4 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors cursor-pointer rounded-full mb-12 sm:mb-16"
        >
          Get Started
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Artwork stack forming a straight horizontal line of diamonds */}
        <div className="reveal w-full flex justify-center mt-auto pb-10" style={{ animationDelay: "150ms" }}>
          <TiltedImageStack items={HERO_STACK_ITEMS} />
        </div>

      </div>
    </section>
  )
}

export interface StackItem {
  label: string;
  imageUrl?: string;
  gradient?: string; 
}

export function TiltedImageStack({ items }: { items: StackItem[] }) {
  return (
    // Increased gap between cards to give them more breathing room
    <div className="flex items-center justify-center space-x-6 sm:space-x-6 px-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`
            group
            relative aspect-square w-20 sm:w-28 md:w-36 lg:w-44
            rounded-xl sm:rounded-2xl overflow-hidden
            bg-card border-[5px] border-black
            shadow-2xl shadow-black/50
            transition-all duration-500 ease-out
            rotate-29
            hover:-translate-y-4 hover:z-50
          `}
          style={{ 
            animationDelay: `${i * 90}ms`,
            zIndex: i 
          }}
        >
          {/* 
            Inner container counter-rotates by -35deg to match the card rotation,
            keeping the image upright, scaled to fill the diamond shape seamlessly.
          */}
          <div className="absolute inset-0 w-full h-full -rotate-29 scale-[1.35]">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div
                className={`w-full h-full ${item.gradient ?? "bg-gradient-to-br from-accent/40 via-muted to-secondary"}`}
                aria-label={item.label}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
"use client";

import Image from "next/image";
import { Navigation } from "@/components/Navigation";

export default function Index() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FELT",
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
    "description": "An intelligent generative design ecosystem converting specific acoustic audio frequencies into production-ready cover art assets.",
    "offers": {
      "@type": "Offer",
      "price": "2000",
      "priceCurrency": "NGN",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "2000",
        "priceCurrency": "NGN",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": "1",
          "unitCode": "MON"
        }
      }
    }
  };

  return (
    <main className="bg-background text-foreground selection:bg-accent selection:text-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />
      
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-flowers.jpg"
            alt="White flower-grass meeting an overcast sky - FELT Generative Backdrop Artwork"
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
      </section>

      <section id="summary" className="py-12 px-4 border-border text-center bg-foreground/[0.005]">
        <div className="max-w-3xl mx-auto space-y-4 reveal">
          <p className="font-display italic text-xl md:text-2xl tracking-tight leading-relaxed max-w-2xl mx-auto">
            We give your music the cover art it deserves.<br />
            One that feels the way your music feels.<br />
            <span className="text-muted-foreground/80 font-light text-lg md:text-xl block mt-2">Discovered within the music itself.</span>
          </p>
        </div>
      </section>

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
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">{"// Audio Analysis Engine"}</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Accepts MP3/WAV tracks across any genre. The system analyzes key sensory metrics—tempo, valence, and key fingerprints—to build your art.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "50ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">{"// Dual Context Processing"}</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Whisper transcription extracts structural storytelling from vocal lines, while an internal Feeling Expander shapes abstract producer ideas into pristine design blueprints.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "100ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">{"// Intuitive Curation Controls"}</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Select visual presets via a mood-based Filter Picker. Fine-tune your output variants smoothly with intuitive, simple style steering sliders.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "150ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">{"// Simultaneous Generation"}</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Every generation process outputs three separate, high-fidelity creative directions instantly, giving you immediate artistic choices.
              </p>
            </div>

            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "200ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">{"// Evolving Identity Archives"}</h3>
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
            onClick={() => {}}
            className="w-full py-3.5 bg-foreground text-background font-mono text-[9px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            Subscribe Now
          </button>
        </div>
      </section>

      <section id="cta" className="py-24 px-6 border-t border-border text-center">
        <div className="max-w-3xl mx-auto space-y-8 reveal">
          <div className="font-display italic font-medium text-4xl md:text-6xl tracking-tighter text-balance max-w-2xl mx-auto leading-tight">
            Your music. Its feeling, made visible.
          </div>
          <div className="pt-2">
            <button 
              onClick={() => {}}
              className="px-10 py-4 bg-foreground text-background font-mono text-[9px] tracking-[0.25em] uppercase hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 border-t border-border flex flex-col items-center gap-6 text-center">
        {/* Render branding logo asset in place of text. Uses the cropped 540x220
            wordmark — felt_logo_white.png is an 800x800 square whose padding made
            the glyph render tiny inside a fixed box. */}
        <Image
          src="/felt_logo.png"
          alt="FELT"
          width={120}
          height={49}
          className="h-8 w-auto select-none"
        />
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
    </main>
  );
}
"use client";
// "use client"; 

// import Image from "next/image";


// export default function Index() {
//   return (
//     <main className="bg-background text-foreground font-sans selection:bg-accent selection:text-background">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-7 mix-blend-difference">
//         <div className="font-display italic text-2xl tracking-tight">FELT</div>
//         <div className="hidden md:flex gap-12 text-[10px] font-mono tracking-[0.25em] uppercase">
//           <a href="#process" className="hover:text-accent transition-colors">The Process</a>
//           <a href="#gallery" className="hover:text-accent transition-colors">Gallery</a>
//           <a href="#upload" className="hover:text-accent transition-colors">Upload</a>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/hero-flowers.jpg"
//             alt="White flower-grass meeting an overcast sky"
//             width={1920}
//             height={1080}
//             priority // Critical above-the-fold content optimization
//             className="w-full h-full object-cover opacity-40 grayscale brightness-75"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
//           <div className="absolute top-0 left-0 w-full h-[35vh] bg-accent/10 blur-[140px] -translate-y-1/2" />
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="animate-scan h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-30" />
//           </div>
//         </div>

//         <div className="relative z-10 text-center max-w-4xl reveal">
//           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent block mb-8">
//             v1.0 — Cover Art, Listened Into Existence
//           </span>
//           <h1 className="font-display italic font-medium text-7xl md:text-[10rem] leading-[0.92] tracking-tighter text-balance mb-10">
//             Your music<br />made visible
//           </h1>
//           <p className="max-w-xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light mb-12">
//             FELT analyzes the emotional DNA of your sound — tempo, valence, spectral texture — and translates that feeling into a visual. No prompts. Just listening.
//           </p>

//           <div id="upload" className="inline-block">
//             <div className="p-1 bg-border rounded-full hover:bg-accent/20 transition-colors group">
//               <button className="px-8 py-4 bg-background border border-border rounded-full hover:border-accent transition-all cursor-pointer flex items-center gap-4">
//                 <span className="size-2 bg-accent rounded-full group-hover:animate-pulse" />
//                 <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
//                   Drop your stems or mp3 to begin analysis
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 reveal" style={{ animationDelay: "400ms" }}>
//           <div className="flex flex-col items-center gap-2">
//             <div className="w-px h-12 bg-border" />
//             <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-muted-foreground/60">Scroll</span>
//           </div>
//         </div>
//       </section>

//       {/* How FELT Listens */}
//       <section id="process" className="py-32 px-6 border-t border-border">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
//           <div className="space-y-12">
//             <div className="reveal">
//               <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent mb-4 block">
//                 Analysis Engine / 01
//               </span>
//               <h2 className="font-display text-5xl md:text-6xl italic font-medium leading-[1.05] mb-6">
//                 Beyond the waveform.
//               </h2>
//               <p className="text-muted-foreground max-w-md leading-relaxed font-light">
//                 FELT doesn't just scan amplitude. It decodes spectral texture, valence, key, and the rhythmic fingerprints that define a sound's emotional DNA — via Essentia.js pre-trained models.
//               </p>
//             </div>

//             <div className="p-8 border border-border bg-foreground/[0.02] space-y-8 reveal" style={{ animationDelay: "200ms" }}>
//               <div className="flex justify-between items-end h-20 gap-1.5">
//                 {[30, 60, 45, 90, 20, 70, 55, 38, 82, 48, 26, 65].map((h, i) => (
//                   <div
//                     key={i}
//                     className="w-full bg-accent/40 animate-pulse-bar"
//                     style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
//                   />
//                 ))}
//               </div>
//               <div className="grid grid-cols-2 gap-4 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
//                 <div className="border-t border-border pt-3">Spectral Center / <span className="text-accent">4.2kHz</span></div>
//                 <div className="border-t border-border pt-3">Rhythmic Density / <span className="text-accent">Med-High</span></div>
//                 <div className="border-t border-border pt-3">Valence / <span className="text-accent">0.21 Melancholic</span></div>
//                 <div className="border-t border-border pt-3">Key / <span className="text-accent">F# Minor</span></div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-12 reveal" style={{ animationDelay: "400ms" }}>
//             <div className="aspect-square bg-foreground/[0.03] border border-border p-4 relative flex flex-col justify-end overflow-hidden">
//               <span className="absolute top-4 left-4 font-mono text-[9px] text-accent uppercase tracking-[0.25em] z-10">
//                 Feeling Expander / 02
//               </span>
//               <Image
//                 src="/charcoal-texture.jpg"
//                 alt="Charcoal texture meeting blurred light"
//                 width={1024}
//                 height={1024}
//                 className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover opacity-60 grayscale"
//               />
//               <div className="relative z-10 p-6 bg-background/85 backdrop-blur-sm border border-border">
//                 <p className="font-display italic text-2xl md:text-3xl mb-4 leading-snug text-balance">
//                   "Heavy, industrial yet fragile — like rusted iron in a cathedral."
//                 </p>
//                 <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.25em]">
//                   Expansion generated for Beat 04
//                 </p>
//               </div>
//             </div>
//             <p className="text-muted-foreground leading-relaxed font-light max-w-md">
//               For instrumentals, the Feeling Expander takes a producer's fragment and grows it into a sensory brief — approved before generation, never assumed.
//             </p>
//           </div>
//         </div>
//       </section>

//            {/* Steering Controls */}
//       <section className="py-32 px-6 bg-foreground/[0.015] border-y border-border">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-20 reveal">
//             <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent mb-4 block">
//               Steering Controls / 03
//             </span>
//             <h2 className="font-display text-5xl md:text-7xl italic font-medium leading-[1.05]">
//               Artist as Director.
//             </h2>
//           </div>

//           <div className="space-y-14 reveal">
//             {[
//               { left: "Darker", mid: "Luminosity Index", right: "Brighter", pos: 30 },
//               { left: "Raw", mid: "Fidelity Bias", right: "Polished", pos: 70 },
//               { left: "Abstract", mid: "Semantic Depth", right: "Realistic", pos: 18 },
//             ].map((s) => (
//               <div key={s.mid} className="group">
//                 <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] mb-5 text-muted-foreground">
//                   <span>{s.left}</span>
//                   <span className="text-accent">{s.mid}</span>
//                   <span>{s.right}</span>
//                 </div>
//                 <div className="h-px w-full bg-border relative">
//                   <div
//                     className="absolute top-1/2 -translate-y-1/2 size-3 bg-accent rounded-full shadow-[0_0_20px_rgba(160,160,144,0.5)] transition-all group-hover:size-4"
//                     style={{ left: `${s.pos}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Variants Grid */}
//       <section id="gallery" className="py-32 px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
//             <div className="reveal">
//               <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent mb-4 block">
//                 Three Variants / 04
//               </span>
//               <h2 className="font-display text-5xl md:text-6xl italic font-medium leading-[1.05] max-w-xl">
//                 Every generation returns three.
//               </h2>
//             </div>
//             <p className="text-muted-foreground max-w-sm font-light leading-relaxed">
//               Flux 1.1 Pro renders three photorealistic options simultaneously. Pick one, refine, regenerate.
//             </p>
//           </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {[
//             { img: "/variant-alpha.jpg", name: "Variant Alpha", note: "Atmospheric Noir" },
//             { img: "/variant-beta.jpg", name: "Variant Beta", note: "Structural Bone" },
//             { img: "/variant-gamma.jpg", name: "Variant Gamma", note: "Distant Echo" },
//           ].map((v, i) => (
//             <div key={v.name} className="space-y-4 reveal group" style={{ animationDelay: `${i * 120}ms` }}>
//               <div className="aspect-square bg-foreground/[0.02] border border-border overflow-hidden relative">
//                 <Image
//                   src={v.img}
//                   alt={`${v.name} — generated cover art`}
//                   fill // Automatically scales to fill the square container
//                   sizes="(max-w-768px) 100vw, 33vw" // Optimizes performance for screen sizes
//                   className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
//                 />
//               </div>
//               <div className="flex items-baseline justify-between font-mono text-[9px] uppercase tracking-[0.25em]">
//                 <span className="text-muted-foreground italic">{v.name}</span>
//                 <span className="text-accent">{v.note}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         </div>
//       </section>

//       {/* Artist Profile */}
//       <section className="py-32 px-6 border-t border-border">
//         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
//           <div className="reveal">
//             <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent mb-4 block">
//               Artist Profile / 05
//             </span>
//             <h2 className="font-display text-4xl md:text-5xl italic font-medium leading-tight mb-6">
//               A visual history that builds with every sound.
//             </h2>
//             <p className="text-muted-foreground max-w-md leading-relaxed font-light">
//               Your city, three words for your sound, your photo. Every generation deepens the archive — until the catalog feels like you, not like an algorithm.
//             </p>
//           </div>
//           <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground space-y-3 md:text-right">
//             <div>City / <span className="text-foreground">Berlin</span></div>
//             <div>Sound / <span className="text-foreground">Dim · Iron · Slow</span></div>
//             <div>Works / <span className="text-accent">24</span></div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-24 px-6 border-t border-border flex flex-col items-center gap-12 text-center">
//         <div className="font-display italic font-medium text-6xl md:text-8xl tracking-tighter reveal text-balance max-w-3xl leading-[0.95]">
//           Capture the sound.
//         </div>
//         <div className="flex flex-col items-center gap-12 reveal" style={{ animationDelay: "200ms" }}>
//           <button className="px-12 py-5 bg-foreground text-background font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-accent transition-colors cursor-pointer">
//             Launch Studio
//           </button>
//           <div className="flex flex-wrap justify-center gap-8 font-mono text-[8px] tracking-[0.3em] uppercase text-muted-foreground/60">
//             <span>v1.0 POC</span>
//             <span>Berlin / Tokyo</span>
//             <span>© 2026 FELT Studio</span>
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// }

import Image from "next/image";

export default function Index() {
  return (
    <main className="bg-background text-foreground font-sans selection:bg-accent selection:text-background">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-7 mix-blend-difference">
        <div className="font-display italic text-2xl tracking-tight">FELT</div>
        <div className="hidden md:flex gap-12 text-[10px] font-mono tracking-[0.25em] uppercase items-center">
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#pricing" className="hover:text-accent transition-colors">Pricing</a>
          <button className="px-4 py-2 border border-border rounded-full font-mono text-[8px] tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors cursor-pointer">
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
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-accent block mb-8">
            v1.0 — Cover Art, Listened Into Existence
          </span>
          <h1 className="font-display italic font-medium text-5xl md:text-[7rem] leading-[0.95] tracking-tighter text-balance mb-10">
            Your music<br />made visible.
          </h1>
          <p className="max-w-lg mx-auto text-muted-foreground text-sm md:text-base leading-relaxed font-light mb-12">
            FELT is an AI-powered cover art generation platform for musicians and producers. It doesn't ask you to describe your music in words. It listens. It analyzes the emotional DNA of your sound and translates that feeling into a visual.
          </p>

          <div className="inline-block">
            <a href="#features" className="p-1 inline-block bg-border rounded-full hover:bg-accent/20 transition-colors group">
              <button className="px-6 py-3.5 bg-background border border-border rounded-full hover:border-accent transition-all cursor-pointer flex items-center gap-3">
                <span className="size-1.5 bg-accent rounded-full group-hover:animate-pulse" />
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase">
                  Explore Features
                </span>
              </button>
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 reveal" style={{ animationDelay: "400ms" }}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-border" />
            <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-muted-foreground/60">Scroll</span>
          </div>
        </div>
      </section>

      {/* Captivating Aesthetic Summary Block */}
    {/* Captivating Aesthetic Summary Block */}
      <section className="py-12 px-4 border-t border-border text-center bg-foreground/[0.005]">
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
            
            {/* Feature 1 */}
            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal">
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Audio Analysis Engine</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Accepts MP3/WAV tracks across any genre. The system analyzes key sensory metrics—tempo, valence, and key fingerprints—to build your art.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "50ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Dual Context Processing</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Whisper transcription extracts structural storytelling from vocal lines, while an internal Feeling Expander shapes abstract producer ideas into pristine design blueprints.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "100ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Intuitive Curation Controls</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Select visual presets via a mood-based Filter Picker. Fine-tune your output variants smoothly with intuitive, simple style steering sliders.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "150ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Simultaneous Generation</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                Every generation process outputs three separate, high-fidelity creative directions instantly, giving you immediate artistic choices.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 border border-border bg-foreground/[0.01] space-y-3 reveal" style={{ animationDelay: "200ms" }}>
              <h3 className="font-mono text-[10px] tracking-wider uppercase text-accent">// Evolving Identity Archives</h3>
              <p className="text-muted-foreground font-light text-xs leading-relaxed">
                A localized history blueprint that logs city origin data, essential sound attributes, and visual generation patterns as your record catalog expands.
              </p>
            </div>

            {/* Feature 6 / Product Scope Disclaimer */}
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
          <button className="w-full py-3.5 bg-foreground text-background font-mono text-[9px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
            Subscribe Now
          </button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 border-t border-border text-center">
        <div className="max-w-3xl mx-auto space-y-8 reveal">
          <div className="font-display italic font-medium text-4xl md:text-6xl tracking-tighter text-balance max-w-2xl mx-auto leading-tight">
            Your music. Its feeling, made visible.
          </div>
          <div className="pt-2">
            <button className="px-10 py-4 bg-foreground text-background font-mono text-[9px] tracking-[0.25em] uppercase hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border flex flex-col items-center gap-6 text-center">
        <div className="font-display italic text-2xl tracking-tight">FELT</div>
        <div className="flex gap-8 font-mono text-[8px] tracking-[0.3em] uppercase text-muted-foreground/60">
          <span>v1.0 Felt</span>
          <span>© 2026 Music Tech & Arts</span>
        </div>
      </footer>
    </main>
  );
}

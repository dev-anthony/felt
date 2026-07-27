import { Check } from "lucide-react"
import { Reveal } from "./reveal"

interface PricingProps {
  onGetStarted: () => void
}

const INCLUDED = [
  "Unlimited cover art generations",
  "Full Visual DNA emotional analysis",
  "Reference image conditioning",
  "Lyric-aware generation for vocal tracks",
]

/**
 * The price point (₦2,000/month) matches what was already published in this
 * page's SoftwareApplication structured-data JSON-LD before this redesign —
 * carried forward, not newly invented. There is no real payment integration
 * in the backend yet, so the CTA opens the same sign-up flow as everywhere
 * else rather than a "Subscribe" button that silently does nothing.
 */
export function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-border">
      <div className="max-w-md mx-auto text-center">
        <Reveal className="mb-10">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent mb-3 block">
            Pricing
          </span>
          <h2 className="font-display text-3xl md:text-4xl italic font-medium tracking-tight">
            One plan. No tiers to compare.
          </h2>
        </Reveal>

        <Reveal delayMs={100} className="rounded-2xl border border-border bg-foreground/[0.02] p-10">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-accent block mb-3">
            The Pass
          </span>
          <div className="mb-1">
            <span className="font-display text-5xl font-medium tracking-tight">₦2,000</span>
            <span className="font-mono text-xs text-muted-foreground uppercase"> / month</span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed mb-8 mt-4">
            Everything FELT does today, unlimited.
          </p>
          <ul className="space-y-3 text-left mb-8">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <Check className="size-3.5 text-accent mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={onGetStarted}
            className="w-full py-3.5 rounded-full bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </Reveal>
      </div>
    </section>
  )
}

import Image from "next/image"
import Link from "next/link"

/**
 * No contact email or social links are included: none exist anywhere else in
 * the codebase, and inventing plausible-looking ones (hello@usefelt.online,
 * fake X/Instagram handles) would present unverified, possibly-unmonitored
 * channels as real. Add real ones here once they exist.
 */
const QUICK_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

const EXPLORE_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Gallery", href: "/dashboard/gallery" },
]

export function SiteFooter() {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Image src="/felt_logo.png" alt="FELT" width={120} height={49} className="h-8 w-auto select-none" />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Cover art that feels like the music it represents — built from the
              audio itself, not a text prompt guessing at it.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs text-muted-foreground hover:text-accent transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-muted-foreground hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
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
                <rect width="1" height="2" fill="#008751" />
                <rect x="1" width="1" height="2" fill="#ffffff" />
                <rect x="2" width="1" height="2" fill="#008751" />
              </svg>
            </span>
            <span>All wrongs reserved.</span>
            <span>© 2026 Music Tech &amp; Arts</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

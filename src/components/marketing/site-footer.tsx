import Image from "next/image"
import Link from "next/link"

const SOCIAL_LINKS = [
  { 
    label: "X (Twitter)", 
    href: "https://x.com",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  { 
    label: "Instagram", 
    href: "https://instagram.com",
    icon: (
      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
]

export function SiteFooter() {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Image 
              src="/felt_logo.png" 
              alt="FELT" 
              width={120} 
              height={49} 
              className="h-8 w-auto select-none" 
            />
            <p className="font-display italic text-xs text-muted-foreground leading-relaxed max-w-xs">
            Your music made visible
            </p>
          </div>

          {/* Column 2: Support & Contact */}
          <div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
              Support
            </h4>
            <div className="space-y-2.5">
              <a 
                href="mailto:support@mail.usefelt.online" 
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors break-all"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@mail.usefelt.online
              </a>
              <p className="text-[11px] text-muted-foreground/60">
                Response time: Within 24 hours
              </p>
            </div>
          </div>

          {/* Column 3: Socials */}
          <div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a 
                    href={s.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    {s.icon}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
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
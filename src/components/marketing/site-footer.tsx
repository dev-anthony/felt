import Image from "next/image"
import Link from "next/link"

const SOCIAL_LINKS = [
  { 
    label: "X (Twitter)", 
    href: "https://x.com/__anthonydev___",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  { 
    label: "Instagram", 
    href: "https://www.instagram.com/anthony.dev_?igsh=MWN3ampvdGhhMXRoNA==",
    icon: (
      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  { 
    label: "Facebook", 
    href: "https://www.facebook.com/share/163SpgMoxS6/", 
    icon: (
      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    )
  },
  { 
    label: "LinkedIn", 
    href: "https://www.linkedin.com/in/anthony-joseph-51b69a328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    icon: (
      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    )
  }
]

export function SiteFooter() {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        
        {/* 5-Column Grid for Brand, Links, Support, Legal, Socials */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Image 
              src="/felt_logo.png" 
              alt="FELT" 
              width={120} 
              height={79} 
              className="h-8 w-auto select-none" 
            />
            <p className="font-display italic text-[16px] text-muted-foreground leading-relaxed max-w-xs">
            Your music made visible
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
              Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#features" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  Pricing
                </Link>
                
              </li>
              <li>
<Link href="/#how-it-works" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                 How it Works
                </Link>

              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="mailto:support@mail.usefelt.online" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/donate" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
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

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
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
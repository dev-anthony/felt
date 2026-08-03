"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function SubPageHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const subNavLinks = [
    { name: "About", href: "/about" },
    { name: "Donate", href: "/donate" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  return (
    <div className="fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center px-6">
      <header
        className={`w-full max-w-6xl flex items-center justify-between px-6 py-3 transition-all duration-500 backdrop-blur-md ${
          scrolled
            ? "border border-border/60 rounded-full bg-background/60 shadow-lg"
            : "border border-border/40 rounded-full bg-background/30"
        }`}
      >
        {/* Logo on the far left */}
        <Link href="/" aria-label="FELT home" className="flex items-center shrink-0">
          <Image
            src="/felt_logo.png"
            alt="FELT"
            width={120}
            height={49}
            priority
            className="h-7 w-auto select-none"
          />
        </Link>

        {/* Centered pill sub-nav links */}
        <div className="hidden md:flex items-center border border-border/50 rounded-full px-4 py-1.5 gap-1 text-[11px] font-mono tracking-[0.2em] uppercase bg-foreground/[0.02]">
          {subNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full hover:bg-foreground/10 hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Action Button (Matches Navigation's Primary Action) */}
        <div className="flex items-center">
          <Link
            href="/"
            className="group px-5 py-2.5 bg-foreground text-background rounded-full font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Home</span>
          </Link>
        </div>
      </header>
    </div>
  );
}
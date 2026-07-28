"use client"

import * as React from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Stagger multiple Reveal siblings by passing an increasing index. */
  delayMs?: number
}

/** Thin wrapper around useScrollReveal for markup-heavy sections. */
export function Reveal({ children, delayMs = 0, className = "", style, ...rest }: RevealProps) {
  const { ref, className: revealClass } = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`${revealClass} ${className}`}
      style={{ transitionDelay: delayMs ? `${delayMs}ms` : undefined, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

"use client"

import * as React from "react"

/**
 * Fires an entrance animation the first time an element scrolls into view,
 * rather than the moment it mounts.
 *
 * The existing `.reveal` CSS utility (globals.css) animates on mount, which is
 * correct for above-the-fold hero content but wrong for anything further down
 * the page: a section 3000px below the fold has already finished its fade-up
 * before the visitor ever scrolls far enough to see it happen. This hook
 * drives the same visual language (opacity + translateY, see the returned
 * className) but gates it on IntersectionObserver instead of mount time.
 *
 * Returns a ref to attach and a boolean for whether the element has become
 * visible at least once (it only ever flips false -> true, so scrolling back
 * up does not replay the animation).
 */
export function useScrollReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T>(null)
  // Reduced-motion is read as a LAZY INITIAL state, not set from inside the
  // effect below: setting it there was a synchronous setState-in-effect (React
  // flags this because it forces an extra render on every mount), and it also
  // meant a reduced-motion visitor saw one frame of the hidden pre-reveal state
  // before the effect had a chance to run. Computing it up front avoids both.
  const [visible, setVisible] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  React.useEffect(() => {
    if (visible) return // already revealed (reduced-motion, or a fast re-mount)
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px", ...options },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [options, visible])

  return {
    ref,
    className: visible
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      : "opacity-0 translate-y-3",
  }
}

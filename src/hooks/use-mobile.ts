import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/**
 * Subscribes to the viewport breakpoint via useSyncExternalStore.
 *
 * matchMedia is an external store, which is exactly what this hook is for. The
 * previous useEffect + setState version had two problems this solves:
 *   - it wrote state synchronously inside the effect, forcing a second render
 *     on every mount (React 19 flags this as cascading renders);
 *   - it returned `false` on the first client render regardless of viewport, so
 *     mobile users briefly saw the desktop layout before it corrected.
 *
 * getServerSnapshot returns false so the server renders the desktop-first
 * layout and hydration stays consistent.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}

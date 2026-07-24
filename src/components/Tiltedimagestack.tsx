/**
 * TiltedImageStack
 * ------------------------------------------------------------------
 * Reusable across the app (Home hero today; Gallery/onboarding later)
 * wherever a set of 3–5 visuals should read as a fanned stack rather
 * than a plain row. Each item can be a real image URL or, when no
 * asset exists yet, a CSS gradient "swatch" — used here on Home since
 * we don't have real generated-cover assets to point at.
 *
 * Design notes:
 * - Alternating vertical offset + small rotation mirrors Reference 1's
 *   fanned photo row.
 * - rounded-3xl / shadow-soft-lg come straight from the new token
 *   scale in globals.css, so this stays in sync with every other
 *   themed component automatically.
 */

export interface StackItem {
  label: string;
  imageUrl?: string;
  gradient?: string; // Tailwind gradient classes, used as placeholder art
}

const OFFSETS = [
  "translate-y-6 -rotate-6",
  "-translate-y-2 -rotate-2",
  "-translate-y-4 rotate-2",
  "translate-y-8 rotate-6",
];

export function TiltedImageStack({ items }: { items: StackItem[] }) {
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4 md:gap-5 px-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`
            relative w-20 h-28 sm:w-28 sm:h-40 md:w-36 md:h-48 lg:w-44 lg:h-60
            rounded-2xl sm:rounded-3xl overflow-hidden
            border border-border bg-card
            shadow-soft-lg
            transition-transform duration-500 ease-out
            hover:-translate-y-3 hover:rotate-0
            ${OFFSETS[i % OFFSETS.length]}
            reveal
          `}
          style={{ animationDelay: `${i * 90}ms` }}
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full ${item.gradient ?? "bg-gradient-to-br from-accent/40 via-muted to-secondary"}`}
              aria-label={item.label}
            />
          )}
        </div>
      ))}
    </div>
  );
}
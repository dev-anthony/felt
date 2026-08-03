"use client";

import Image from "next/image";

interface FloatingStackItem {
  label: string;
  imageUrl: string;
}

/** Animated tilted image stack with continuous liquid floating movement. */
export function FloatingImageStack({ items }: { items: FloatingStackItem[] }) {
  return (
    <div className="flex items-center justify-center -space-x-16 sm:-space-x-12 px-4 w-full pt-8 pb-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="group relative aspect-square shrink-0 w-28 sm:w-36 lg:w-44 rounded-2xl overflow-hidden bg-card border-[4px] border-black shadow-2xl transition-all duration-700 ease-out rotate-29 hover:-translate-y-6 hover:rotate-12 hover:!z-50 animate-float"
          style={{
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${4 + i * 0.5}s`,
            zIndex: items.length - i
          }}
        >
          {/* Glass specular sheen on card top */}
          <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Inner counter-rotation */}
          <div className="absolute inset-0 w-full h-full -rotate-29 scale-[1.35]">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.label}
                fill
                sizes="(min-width: 1024px) 176px, (min-width: 640px) 144px, 112px"
                priority={i === 0}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-accent/40 via-muted to-secondary"
                aria-label={item.label}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

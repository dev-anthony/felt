// // src/app/layout.tsx
// import type { Metadata } from "next";
// import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
// import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// const jetbrainsMono = JetBrains_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// });

// const cormorantGaramond = Cormorant_Garamond({
//   subsets: ["latin"],
//   style: ["italic"],
//   weight: ["400", "500"],
//   variable: "--font-display",
// });

// export const metadata: Metadata = {
//   title: "FELT — Your music made visible",
//   description: "FELT listens to the emotional DNA of your sound and translates it into photorealistic cover art.",
//   openGraph: {
//     title: "FELT — Your music made visible",
//     description: "AI cover art that actually feels like the music it represents.",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${inter.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProviderWrapper} from "@/components/providers/app-provider-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-display",
  preload: false,
});

export const metadata: Metadata = {
  title: "FELT — Your music made visible",
  description: "FELT listens to the emotional DNA of your sound and translates it into photorealistic cover art.",
  openGraph: {
    title: "FELT — Your music made visible",
    description: "AI cover art that actually feels like the music it represents.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* NATIVE SEQUENCE PRELOADING: Guarantees zero race conditions on mount */}
        <script 
          src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.js" 
          defer
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.web.js" 
          defer
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-models.js" 
          defer
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
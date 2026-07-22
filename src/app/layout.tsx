import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Self-hosted via next/font instead of a Google Fonts <link>. Identical
 * typefaces and weights - this only changes HOW they load: the files are served
 * from our own origin at build time, which removes two preconnects plus a
 * render-blocking stylesheet round-trip, and eliminates the flash of unstyled
 * text. `display: swap` matches the previous &display=swap.
 */
const inter = Inter({
  subsets: ["latin"], weight: ["300", "400", "600", "700"],
  variable: "--font-inter", display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"], weight: ["400", "500"], style: ["italic"],
  variable: "--font-cormorant", display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"], weight: ["300", "400", "700"],
  variable: "--font-jetbrains", display: "swap",
});
import { AuthProviderWrapper } from "@/components/providers/app-provider-wrapper";

export const metadata: Metadata = {
  title: "FELT — Your Music Made Visible | AI Album Cover Art Generator",
  description: "FELT analyzes the emotional DNA of your audio tracks and translates acoustic characteristics into photorealistic, high-resolution custom cover art.",
  keywords: ["AI cover art", "music technology", "album art generator", "music production tools", "visualize audio", "Nigeria music tech"],
  authors: [{ name: "Music Tech & Arts" }],
  metadataBase: new URL("https://www.usefelt.online"),

  // Dynamic App Icon assignment
  icons: {
    icon: "/favicon-32.png",
    apple: "/favicon-32.png",
  },

  alternates: {
    canonical: "https://www.usefelt.online",
  },

  openGraph: {
    title: "FELT — Your Music Made Visible",
    description: "AI cover art that actually feels like the music it represents.",
    url: "https://www.usefelt.online",
    siteName: "FELT",
    images: [
      {
        url: "/felt_logo.png",
        width: 32,
        height: 32,
        alt: "FELT — Audio to Generative Cover Art Workspace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "FELT — Your Music Made Visible",
    description: "AI cover art that actually feels like the music it represents.",
    images: ["/felt_logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.js" defer />
        <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.web.js" defer />
        <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-models.js" defer />
      </head>
      {/*
        suppressHydrationWarning is scoped to <body>'s OWN attributes, one level
        deep — it does not silence mismatches in any child, so real hydration
        bugs still surface.

        It is needed because browser extensions mutate <body> before React
        hydrates: ColorZilla adds cz-shortcut-listen="true", Grammarly adds
        data-gr-* / data-new-gr-*. React then compares its server HTML against a
        DOM a third party already edited and reports a mismatch we neither
        caused nor can prevent. See vercel/next.js#72031.
      */}
      <body className="antialiased" suppressHydrationWarning>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
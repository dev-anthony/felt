import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@300;400;700&display=swap" 
          rel="stylesheet" 
        />
        <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.js" defer />
        <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.web.js" defer />
        <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-models.js" defer />
      </head>
      <body className="antialiased">
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
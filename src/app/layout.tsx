import type { Metadata } from "next";
import "./globals.css";
import { AuthProviderWrapper } from "@/components/providers/app-provider-wrapper";

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
        {/* Preconnect to Google Font Servers */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Standard Google Font Package matching your precise weights and variants */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@300;400;700&display=swap" 
          rel="stylesheet" 
        />

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
      <body className="antialiased">
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
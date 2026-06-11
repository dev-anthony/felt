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
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-display",
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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable} antialiased`}
      >
        {/* We wrap the children inside a dynamic provider that listens to the URL state */}
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}

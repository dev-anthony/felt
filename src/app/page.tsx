"use client";

import * as React from "react";
import { Navigation } from "@/components/Navigation";
import { AuthDialog } from "@/components/auth-dialog";
import { Hero } from "@/components/marketing/hero";
import { GroundedIn } from "@/components/marketing/grounded-in";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeatureCards } from "@/components/marketing/feature-cards";
import { Showcase } from "@/components/marketing/showcase";
import { WhatsNext } from "@/components/marketing/whats-next";
import { Manifesto } from "@/components/marketing/manifesto";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function Index() {
  // Owned at the page level so both the Hero and Pricing CTAs can open the
  // same dialog instance. Navigation keeps its own separate instance for its
  // own "Get Started" button, exactly as it already did before this redesign.
  const [authOpen, setAuthOpen] = React.useState(false);
  const openAuth = () => setAuthOpen(true);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FELT",
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
    "description": "An intelligent generative design ecosystem converting specific acoustic audio frequencies into production-ready cover art assets.",
    "offers": {
      "@type": "Offer",
      "price": "2000",
      "priceCurrency": "NGN",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "2000",
        "priceCurrency": "NGN",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": "1",
          "unitCode": "MON"
        }
      }
    }
  };

  return (
    <main className="bg-background text-foreground selection:bg-accent selection:text-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />

      <Hero onGetStarted={openAuth} />
      <FeatureCards />
      <HowItWorks />
      

      <Manifesto />
      <Pricing onGetStarted={openAuth} />
      <FAQ />
      <SiteFooter />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  );
}

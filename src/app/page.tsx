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
      <GroundedIn />
      <HowItWorks />
      <FeatureCards />

      <Showcase
        eyebrow="The Visual DNA Engine"
        title="Twelve emotional archetypes, not one generic mood."
        copy="Every track is scored against twelve distinct emotional archetypes — from euphoria to melancholy to cerebral detachment — each calibrated against real, published listener data rather than an intuitive guess."
        points={[
          "Anchors calibrated against DEAM's 1,802 human-rated songs",
          "Aesthetic state (Normal / Luxury / Gritty) read from the track's own texture",
          "A visual direction distilled from the archetype, not chosen at random",
        ]}
        palette="cerebral"
        tileLabel="Visual DNA"
      />

      <Showcase
        reverse
        eyebrow="Music analysis"
        title="Reads the track. Doesn't ask you to describe it."
        copy="Tempo, energy, brightness, key and texture are extracted directly from the audio waveform. An artist's own words still matter — they correct the read when the two genuinely disagree, rather than being ignored."
        points={[
          "On-device feature extraction — nothing about your unreleased track leaves silently",
          "Lyrics factored in for vocal tracks, with lyric meaning and audio mood held in tension rather than one overriding the other",
          "An optional reference image lets you steer composition and palette directly",
        ]}
        palette="nostalgia"
        tileLabel="Sonic Analysis"
      />

      <WhatsNext />
      <Manifesto />
      <Pricing onGetStarted={openAuth} />
      <FAQ />
      <SiteFooter />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  );
}

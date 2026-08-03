"use client";

import React from "react";
import { SubPageHeader } from "@/components/SubpageHeader";
import { SiteFooter } from "@/components/marketing/site-footer";
import { FileText, CheckCircle2, Award, HelpCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
      <SubPageHeader />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Hero Container */}
        <div className="relative rounded-[2.5rem] border border-foreground/15 bg-gradient-to-b from-foreground/[0.04] via-foreground/[0.01] to-transparent p-8 sm:p-12 text-center space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/15 bg-foreground/[0.03]">
            <FileText className="w-3.5 h-3.5 text-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Agreement
            </span>
          </div>

          <h1 className="font-display italic text-4xl sm:text-6xl font-medium text-foreground leading-tight">
            Terms of Service.
          </h1>

          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Last updated: July 2026
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="relative rounded-3xl border border-foreground/15 bg-gradient-to-b from-foreground/[0.03] to-transparent p-6 sm:p-8 space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
              <div className="w-8 h-8 rounded-xl border border-foreground/20 bg-background/50 flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                01
              </div>
              <h2 className="text-lg font-semibold text-foreground tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                Acceptable Use
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed pt-2">
              By accessing FELT, you agree to generate assets only for media you have ownership of or valid licenses to distribute.
            </p>
          </section>

          {/* Section 2 */}
          <section className="relative rounded-3xl border border-foreground/15 bg-gradient-to-b from-foreground/[0.03] to-transparent p-6 sm:p-8 space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
              <div className="w-8 h-8 rounded-xl border border-foreground/20 bg-background/50 flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                02
              </div>
              <h2 className="text-lg font-semibold text-foreground tracking-wide flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                Ownership & Rights
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed pt-2">
              You retain commercial and copyright ownership of all album artwork successfully generated through your paid credits on FELT.
            </p>
          </section>

          {/* Section 3 */}
          <section className="relative rounded-3xl border border-foreground/15 bg-gradient-to-b from-foreground/[0.03] to-transparent p-6 sm:p-8 space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
              <div className="w-8 h-8 rounded-xl border border-foreground/20 bg-background/50 flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                03
              </div>
              <h2 className="text-lg font-semibold text-foreground tracking-wide flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                Support
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed pt-2">
              For account or billing inquiries, reach out to{" "}
              <a href="mailto:support@mail.usefelt.online" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">
                support@mail.usefelt.online
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <div className="pt-20">
        <SiteFooter />
      </div>
    </main>
  );
}
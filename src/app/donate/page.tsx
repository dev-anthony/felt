"use client";

import React, { useState } from "react";
import { SubPageHeader } from "@/components/SubpageHeader";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Gift, Heart, Copy, Check, ArrowRight, X, Loader2 } from "lucide-react";

export default function DonatePage() {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportEmail = "support@mail.usefelt.online";

  const handleCopy = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate server processing before refreshing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      window.location.reload();
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
      <SubPageHeader />

      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Main Glass Hero Stage */}
        <section className="relative rounded-[2.5rem] border border-foreground/15 bg-gradient-to-b from-foreground/[0.04] via-foreground/[0.01] to-transparent p-8 sm:p-14 text-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_20px_50px_rgba(0,0,0,0.1)] space-y-6">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-foreground/40 to-transparent pointer-events-none" />

          <h1 className="font-display italic text-4xl sm:text-6xl font-medium text-foreground leading-[1.1] max-w-2xl mx-auto">
            Support us financially. <br />
            <span className="text-muted-foreground"></span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            FELT was born out of a quest to solve problems and a burning passion for making a difference. Your financial support drives our commitment to enhancing the FELT experience for all. Your donation, regardless of size, fuels our ongoing efforts to develop innovative generative audio features, uphold platform stability, and expand our reach to creators worldwide.
          </p>

          {/* Primary Donation CTA */}
          <div className="pt-4 pb-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-2.5 px-9 py-4 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-all cursor-pointer rounded-full shadow-xl hover:scale-[1.02] active:scale-95"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Make a Donation</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Action Trigger Card */}
          <div className="pt-8 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Direct Contributions & Inquiries
              </span>
              <p className="text-sm text-foreground font-medium">
                Reach out directly to arrange custom support or grants.
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/15 bg-foreground text-background font-mono text-[10px] tracking-widest uppercase hover:bg-accent transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Email Copied!" : "Copy Support Email"}</span>
            </button>
          </div>
        </section>

      </div>

      <div className="pt-20">
        <SiteFooter />
      </div>

      {/* Literal Glass Donation Modal (No blur filters to preserve glass transparency) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-md rounded-[2rem] border border-foreground/15 bg-background shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Specular Edge Highlight */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-foreground/40 to-transparent pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-foreground/10 bg-gradient-to-b from-foreground/[0.04] to-transparent">
              <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <Gift className="w-4 h-4" /> 
                Support FELT
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleDonationSubmit} className="p-6 space-y-5 bg-gradient-to-b from-transparent to-foreground/[0.02]">
              
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Full Name
                </label>
                <input 
                  id="fullName"
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-foreground/[0.03] border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Email Address
                </label>
                <input 
                  id="email"
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full bg-foreground/[0.03] border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Amount (NGN)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                    ₦
                  </span>
                  <input 
                    id="amount"
                    type="number" 
                    min="100"
                    required
                    placeholder="5000"
                    className="w-full bg-foreground/[0.03] border border-foreground/15 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative inline-flex justify-center items-center gap-2.5 px-6 py-4 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-all cursor-pointer rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Pay</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}
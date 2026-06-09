"use client";

import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthView = "sign-in" | "create-account" | "email-verification";

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [view, setView] = React.useState<AuthView>("sign-in");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const router = useRouter();

  // Reset view state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => setView("sign-in"), 200);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === "sign-in") {
      // Direct login path
      router.push("/dashboard");
      onOpenChange(false);
    } else if (view === "create-account") {
      // Advance to verification checkpoint
      setView("email-verification");
    } else if (view === "email-verification") {
      // Final confirmation step
      router.push("/onboarding");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border border-border bg-popover max-w-sm sm:max-w-md p-8 gap-6">
        
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="font-display italic text-3xl font-medium tracking-tight text-foreground">
            {view === "sign-in" && "Welcome back"}
            {view === "create-account" && "Create your account"}
            {view === "email-verification" && "Verify your identity"}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-muted-foreground tracking-wide">
            {view === "sign-in" && "Enter your credentials to enter the gallery workspace."}
            {view === "create-account" && "Sign up to start translating sound characteristics into art."}
            {view === "email-verification" && `We have sent a 6-digit passcode to ${email || "your email"}.`}
          </DialogDescription>
        </DialogHeader>

        {view !== "email-verification" ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              {view === "create-account" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input 
                    type="text" 
                    required
                    placeholder="Name" 
                    className="rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Email address</label>
                <Input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com" 
                  className="rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Password</label>
                <Input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-none h-10 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors mt-2"
              >
                {view === "sign-in" ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            <div className="relative font-sans my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest">
                <span className="bg-popover px-3 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-none h-10 border-border bg-transparent text-foreground font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-foreground/5 transition-colors"
            >
              <svg className="mr-2 h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>

            <div className="text-center font-sans text-xs text-muted-foreground mt-2">
              {view === "sign-in" ? (
                <>
                  New to the platform?{" "}
                  <button 
                    onClick={() => setView("create-account")}
                    className="text-accent underline underline-offset-2 hover:text-foreground font-medium"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setView("sign-in")}
                    className="text-accent underline underline-offset-2 hover:text-foreground font-medium"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          /* Email Verification State Block */
          <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block text-center">
                Enter Verification Passcode
              </label>
              <Input 
                type="text" 
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000" 
                className="rounded-none border-input bg-transparent text-center text-xl tracking-[0.5em] font-mono focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/20 h-12"
              />
            </div>

            <div className="space-y-2">
              <Button 
                type="submit" 
                disabled={otp.length !== 6}
                className="w-full rounded-none h-10 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40"
              >
                Verify & Launch
              </Button>

              <button 
                type="button"
                onClick={() => setView("create-account")}
                className="w-full text-center text-[10px] uppercase font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors pt-2 block"
              >
                ← Back to sign up
              </button>
            </div>
          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}
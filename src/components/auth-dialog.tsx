
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
import { authApi } from "@/lib/api";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthView = "sign-in" | "create-account" | "email-verification";

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [view, setView] = React.useState<AuthView>("sign-in");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  // Reset all state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setView("sign-in");
        setName("");
        setEmail("");
        setPassword("");
        setOtp("");
        setError(null);
      }, 200);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === "sign-in") {
        await authApi.login({ email, password });
        onOpenChange(false);
        router.push("/dashboard");

      } else if (view === "create-account") {
        await authApi.signup({ email, password, name });
        setView("email-verification");

      } else if (view === "email-verification") {
        await authApi.verifyOtp({ email, otp, name });
        onOpenChange(false);
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    try {
      await authApi.resendOtp({ email });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Responsive: never wider than the viewport on small phones, and scrolls
          internally on short screens instead of overflowing off-screen. */}
      <DialogContent className="rounded-none border border-border bg-popover w-[calc(100vw-2rem)] max-w-sm sm:max-w-md p-6 sm:p-8 gap-5 sm:gap-6 max-h-[calc(100dvh-2rem)] overflow-y-auto">
        
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

        {/* Error message */}
        {error && (
          <p className="font-mono text-[10px] text-red-400 tracking-wide -mt-2">
            {error}
          </p>
        )}

        {view !== "email-verification" ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              {view === "create-account" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full rounded-none h-10 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors mt-2 disabled:opacity-50"
              >
                {loading ? "Please wait..." : view === "sign-in" ? "Sign In" : "Sign Up"}
              </Button>
            </form>

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
                disabled={otp.length !== 6 || loading}
                className="w-full rounded-none h-10 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40"
              >
                {loading ? "Verifying..." : "Verify & Launch"}
              </Button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full text-center text-[10px] uppercase font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors pt-1 block"
              >
                Resend code
              </button>

              <button 
                type="button"
                onClick={() => setView("create-account")}
                className="w-full text-center text-[10px] uppercase font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors pt-1 block"
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
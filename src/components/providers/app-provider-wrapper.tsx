"use client";
// src/components/providers/auth-provider-wrapper.tsx
import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuthDialog } from "@/components/auth-dialog";
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const triggerAuth = searchParams.get("auth") === "true";
  React.useEffect(() => {
    if (triggerAuth) {
      setIsAuthOpen(true);
    } else {
      setIsAuthOpen(false);
    }
  }, [triggerAuth]);
  const handleOpenChange = (open: boolean) => {
    setIsAuthOpen(open);
    
    // If they cancel out of the modal manually while sitting on a protected route,
    // safely bounce them back to the landing page.
    if (!open && pathname !== "/") {
      router.push("/");
    }
  };
  return (
    <>
      <div className={triggerAuth ? "pointer-events-none blur-sm opacity-30 select-none transition-all duration-300" : ""}>
        {children}
      </div>
      <AuthDialog open={isAuthOpen} onOpenChange={handleOpenChange} />
    </>
  );
}
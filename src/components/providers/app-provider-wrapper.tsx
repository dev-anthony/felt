"use client";
// src/components/providers/auth-provider-wrapper.tsx

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuthDialog } from "@/components/auth-dialog";

function AuthProviderInner({ children }: { children: React.ReactNode }) {
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

  // THE FIX: Automatically scrub the ?auth=true parameter if we land on a secure route successfully
  React.useEffect(() => {
    if (triggerAuth && pathname !== "/") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("auth");
      const query = params.toString();
      
      // Cleans the URL instantly without triggering an expensive page reload
      router.replace(`${pathname}${query ? `?${query}` : ""}`);
    }
  }, [triggerAuth, pathname, searchParams, router]);

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

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </React.Suspense>
  );
}
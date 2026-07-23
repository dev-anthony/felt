"use client";
// src/components/providers/auth-provider-wrapper.tsx

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuthDialog } from "@/components/auth-dialog";

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // The URL is the single source of truth for whether the auth dialog is open.
  //
  // This previously mirrored `triggerAuth` into local state via an effect, which
  // desynchronised on close: closing the dialog on "/" set the state to false but
  // left `?auth=true` in the URL, so `triggerAuth` stayed true and the blur
  // overlay below (which reads `triggerAuth`, not the state) kept its
  // `pointer-events-none` — leaving the landing page blurred and unclickable
  // with no dialog to dismiss. Deriving it removes the desync, the extra render,
  // and the effect.
  const triggerAuth = searchParams.get("auth") === "true";
  const isAuthOpen = triggerAuth;

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
    if (open) return; // opening is driven solely by ?auth=true

    // If they cancel out of the modal while sitting on a protected route,
    // bounce them back to the landing page (which drops the param with it).
    if (pathname !== "/") {
      router.push("/");
      return;
    }

    // On the landing page, drop the param so the dialog AND the blur overlay
    // both clear together.
    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
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
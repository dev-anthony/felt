"use client";
import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuthDialog } from "@/components/auth-dialog";

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsAuthOpen(open);
    if (!open && pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <>
      <div className={isAuthOpen ? "pointer-events-none blur-sm opacity-30 select-none transition-all duration-300" : ""}>
        {children}
      </div>
      <AuthDialog open={isAuthOpen} onOpenChange={handleOpenChange} />
      <React.Suspense fallback={null}>
        <SearchParamsWatcher onAuthChange={setIsAuthOpen} />
      </React.Suspense>
    </>
  );
}

function SearchParamsWatcher({ onAuthChange }: { onAuthChange: (open: boolean) => void }) {
  const searchParams = useSearchParams();
  const triggerAuth = searchParams.get("auth") === "true";

  React.useEffect(() => {
    onAuthChange(triggerAuth);
  }, [triggerAuth]);

  return null;
}
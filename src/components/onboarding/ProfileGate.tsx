"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { profile, loaded } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    if (!profile && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else {
      setReady(true);
    }
  }, [loaded, profile, pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

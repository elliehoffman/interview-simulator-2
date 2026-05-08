"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { BrainCircuit, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const { profile, clearProfile } = useProfile();
  const router = useRouter();

  function handleReset() {
    if (confirm("Reset your profile? This will clear all your data.")) {
      clearProfile();
      router.push("/onboarding");
    }
  }

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900 hover:text-brand-600 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <BrainCircuit className="h-4.5 w-4.5 text-white" />
          </div>
          <span>Interview Sim</span>
        </Link>

        {profile && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600">{profile.name}</span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Reset profile"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

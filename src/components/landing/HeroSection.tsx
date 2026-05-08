"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { Sparkles, FileText } from "lucide-react";

export function HeroSection() {
  const { profile } = useProfile();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-indigo-600 px-8 py-16 text-center text-white shadow-2xl">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
      </div>

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Claude AI
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {profile ? `Ready to practice, ${profile.name.split(" ")[0]}?` : "Ace Your Next Interview"}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
          AI-powered behavioral interview practice with personalized questions, real-time feedback, and STAR framework evaluation.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/practice"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Start Practicing
          </Link>
          <Link
            href="/practice?mode=jd"
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Use a Job Description
          </Link>
        </div>
      </div>
    </div>
  );
}

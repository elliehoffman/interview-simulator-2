"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { RotateCcw, Sparkles } from "lucide-react";

export function ActionButtons() {
  const { resetSession } = useSession();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/practice"
        onClick={resetSession}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
      >
        <Sparkles className="h-4 w-4" />
        Try a New Question
      </Link>
      <Link
        href="/practice"
        onClick={resetSession}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Practice Again
      </Link>
    </div>
  );
}

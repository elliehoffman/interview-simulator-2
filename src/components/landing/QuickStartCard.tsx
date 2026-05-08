"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { getSessionHistory } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Clock, ChevronRight } from "lucide-react";

export function QuickStartCard() {
  const { profile } = useProfile();
  const [lastSession, setLastSession] = useState<{ questionType: string; difficulty: string; score: number; timestamp: string } | null>(null);

  useEffect(() => {
    const history = getSessionHistory();
    if (history.sessions.length > 0) {
      setLastSession(history.sessions[0]);
    }
  }, []);

  if (!profile || !lastSession) return null;

  const date = new Date(lastSession.timestamp).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  const scoreColor = lastSession.score >= 8 ? "text-green-600" : lastSession.score >= 6 ? "text-amber-600" : "text-red-600";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        <Clock className="h-3.5 w-3.5" />
        Last Session
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
              {lastSession.questionType}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {lastSession.difficulty}
            </span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Score: <span className={`font-bold ${scoreColor}`}>{lastSession.score}/10</span>
          </p>
        </div>
        <Link
          href="/practice"
          className="flex shrink-0 items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-100 transition-colors"
        >
          Keep going
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

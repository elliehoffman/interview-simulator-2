"use client";

import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { cn } from "@/lib/utils";
import type { QuestionType, Difficulty } from "@/lib/types";
import { Sparkles, ChevronDown } from "lucide-react";

const QUESTION_TYPES: { value: QuestionType; label: string; desc: string }[] = [
  { value: "behavioral", label: "Behavioral", desc: "STAR method stories" },
  { value: "open-ended", label: "Open-Ended", desc: "Insight & reflection" },
  { value: "situational", label: "Situational", desc: "Workplace scenarios" },
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

interface SetupPanelProps {
  onQuestionGenerated: () => void;
}

export function SetupPanel({ onQuestionGenerated }: SetupPanelProps) {
  const {
    questionType, setQuestionType,
    difficulty, setDifficulty,
    jobContext,
    setCurrentQuestion, setChoices,
  } = useSession();
  const { profile } = useProfile();
  const [showJd, setShowJd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateQuestion() {
    if (!profile) return;
    setLoading(true);
    setError(null);
    setCurrentQuestion(null);
    setChoices(null);

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionType, difficulty, profile, jobContext: jobContext ?? undefined }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCurrentQuestion(data);
      onQuestionGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Question type</label>
        <div className="grid grid-cols-3 gap-2">
          {QUESTION_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setQuestionType(t.value)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all",
                questionType === t.value
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className={cn("text-sm font-semibold", questionType === t.value ? "text-brand-700" : "text-gray-800")}>{t.label}</div>
              <div className="mt-0.5 text-xs text-gray-500">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Difficulty</label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all",
                difficulty === d
                  ? d === "Easy" ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20"
                    : d === "Medium" ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/20"
                    : "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowJd(!showJd)}
          className="flex w-full items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium">{jobContext ? `✓ Tailored for: ${jobContext.roleTitle}` : "Add job description (optional)"}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", showJd && "rotate-180")} />
        </button>
        {showJd && (
          <div className="mt-2 animate-slide-up">
            <JobDescriptionInput />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <button
        onClick={generateQuestion}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="h-4.5 w-4.5" />
            Generate Question
          </>
        )}
      </button>
    </div>
  );
}

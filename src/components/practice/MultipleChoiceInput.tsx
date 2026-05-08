"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

export function MultipleChoiceInput() {
  const { currentQuestion, jobContext, choices, setChoices, selectedChoice, setSelectedChoice } = useSession();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentQuestion || !profile || choices) return;
    loadChoices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  async function loadChoices() {
    if (!currentQuestion || !profile) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-choices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.question,
          questionType: currentQuestion.questionType,
          profile,
          jobContext: jobContext ?? undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChoices(data.choices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load choices");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
        {error}
        <button onClick={loadChoices} className="ml-2 underline">Try again</button>
      </div>
    );
  }

  if (!choices) return null;

  return (
    <div className="space-y-2.5 animate-fade-in">
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => setSelectedChoice(choice.id)}
          className={cn(
            "w-full rounded-xl border px-4 py-3.5 text-left text-sm transition-all",
            selectedChoice === choice.id
              ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          <div className="flex items-start gap-3">
            <span className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
              selectedChoice === choice.id ? "border-brand-500 bg-brand-500 text-white" : "border-gray-300 text-gray-500"
            )}>
              {choice.id}
            </span>
            <p className={cn("leading-relaxed", selectedChoice === choice.id ? "text-brand-800" : "text-gray-700")}>
              {choice.text}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

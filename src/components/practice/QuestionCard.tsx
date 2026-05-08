"use client";

import type { GeneratedQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

const TYPE_COLORS = {
  behavioral: "bg-violet-100 text-violet-700 border-violet-200",
  "open-ended": "bg-blue-100 text-blue-700 border-blue-200",
  situational: "bg-amber-100 text-amber-700 border-amber-200",
};

interface QuestionCardProps {
  question: GeneratedQuestion;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-slide-up">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {question.topic && (
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {question.topic}
          </span>
        )}
        <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", TYPE_COLORS[question.questionType])}>
          {question.questionType}
        </span>
      </div>

      <p className="text-lg font-medium leading-relaxed text-gray-900">{question.question}</p>

      {question.hint && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 border border-brand-100">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span><strong>Tip:</strong> {question.hint}</span>
        </div>
      )}
    </div>
  );
}

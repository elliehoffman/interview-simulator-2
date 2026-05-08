"use client";

import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

const MIN = 50;
const MAX = 2000;

export function TextAnswerInput() {
  const { textAnswer, setTextAnswer } = useSession();
  const len = textAnswer.length;

  return (
    <div className="space-y-2">
      <textarea
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value.slice(0, MAX))}
        placeholder="Write your answer here. For behavioral questions, structure it as: Situation → Task → Action → Result."
        rows={8}
        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
      />
      <div className="flex items-center justify-between">
        <span className={cn("text-xs", len < MIN ? "text-amber-600" : "text-gray-400")}>
          {len < MIN ? `${MIN - len} more characters needed` : ""}
        </span>
        <span className={cn("text-xs", len > MAX * 0.9 ? "text-amber-600" : "text-gray-400")}>
          {len} / {MAX}
        </span>
      </div>
    </div>
  );
}

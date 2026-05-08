import type { StarScore } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StarEvaluationProps {
  star: StarScore;
}

const LABELS = [
  { key: "situation" as const, letter: "S", label: "Situation" },
  { key: "task" as const, letter: "T", label: "Task" },
  { key: "action" as const, letter: "A", label: "Action" },
  { key: "result" as const, letter: "R", label: "Result" },
];

function scoreColor(score: number) {
  if (score >= 8) return "text-green-700 bg-green-100 border-green-200";
  if (score >= 5) return "text-amber-700 bg-amber-100 border-amber-200";
  return "text-red-700 bg-red-100 border-red-200";
}

export function StarEvaluation({ star }: StarEvaluationProps) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-800">STAR Framework Breakdown</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LABELS.map(({ key, letter, label }) => {
          const comp = star[key];
          return (
            <div key={key} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
                    {letter}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", scoreColor(comp.score))}>
                  {comp.score}/10
                </span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">{comp.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

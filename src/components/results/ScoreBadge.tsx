import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const color =
    score >= 8 ? "from-green-500 to-emerald-500"
    : score >= 6 ? "from-amber-500 to-yellow-500"
    : "from-red-500 to-rose-500";

  const label =
    score >= 8 ? "Strong Answer"
    : score >= 6 ? "Good Foundation"
    : score >= 4 ? "Needs Work"
    : "Significant Gaps";

  return (
    <div className="flex items-center gap-4">
      <div className={cn("flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", color)}>
        <span className="text-3xl font-bold leading-none">{score}</span>
        <span className="text-xs opacity-80">/10</span>
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">AI-evaluated score</p>
      </div>
    </div>
  );
}

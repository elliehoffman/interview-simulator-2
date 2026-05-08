import { AlertCircle } from "lucide-react";

interface ImprovementsPanelProps {
  improvements: string[];
}

export function ImprovementsPanel({ improvements }: ImprovementsPanelProps) {
  if (!improvements.length) return null;
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-amber-800">
        <AlertCircle className="h-5 w-5" />
        Areas for Improvement
      </h3>
      <ul className="space-y-2.5">
        {improvements.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-amber-800">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-700 text-xs font-bold">!</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

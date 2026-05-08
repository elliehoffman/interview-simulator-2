import { CheckCircle2 } from "lucide-react";

interface StrengthsPanelProps {
  strengths: string[];
}

export function StrengthsPanel({ strengths }: StrengthsPanelProps) {
  if (!strengths.length) return null;
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-green-800">
        <CheckCircle2 className="h-5 w-5" />
        Strengths
      </h3>
      <ul className="space-y-2.5">
        {strengths.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-green-800">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-200 text-green-700 text-xs font-bold">✓</span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

interface FeedbackStreamProps {
  text: string;
  isStreaming: boolean;
}

export function FeedbackStream({ text, isStreaming }: FeedbackStreamProps) {
  if (!text && !isStreaming) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${isStreaming ? "bg-brand-500 animate-pulse" : "bg-green-500"}`} />
        <span className="text-xs font-medium text-gray-500">
          {isStreaming ? "AI is analyzing your answer…" : "Analysis complete"}
        </span>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
        {text}
        {isStreaming && <span className="inline-block w-0.5 h-4 bg-brand-500 align-text-bottom animate-blink ml-0.5" />}
      </pre>
    </div>
  );
}

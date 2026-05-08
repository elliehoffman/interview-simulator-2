"use client";

import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { PenLine, List } from "lucide-react";

export function AnswerToggle() {
  const { answerMode, setAnswerMode } = useSession();

  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
      <button
        onClick={() => setAnswerMode("text")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
          answerMode === "text" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <PenLine className="h-3.5 w-3.5" />
        Write Answer
      </button>
      <button
        onClick={() => setAnswerMode("mcq")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
          answerMode === "mcq" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <List className="h-3.5 w-3.5" />
        Multiple Choice
      </button>
    </div>
  );
}

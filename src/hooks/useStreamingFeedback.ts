"use client";

import { useState, useCallback } from "react";
import { parseFeedback } from "@/lib/utils";
import type { ParsedFeedback, QuestionType, AnswerMode, UserProfile, JobContext } from "@/lib/types";

interface FeedbackPayload {
  question: string;
  questionType: QuestionType;
  answer: string;
  answerMode: AnswerMode;
  profile: UserProfile;
  jobContext?: JobContext;
}

export function useStreamingFeedback() {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [feedback, setFeedback] = useState<ParsedFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(async (payload: FeedbackPayload): Promise<ParsedFeedback | null> => {
    setIsStreaming(true);
    setStreamedText("");
    setFeedback(null);
    setError(null);

    try {
      const response = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamedText(fullText);
      }

      const parsed = parseFeedback(fullText);
      setFeedback(parsed);
      return parsed;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate feedback";
      setError(msg);
      return null;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStreamedText("");
    setIsStreaming(false);
    setFeedback(null);
    setError(null);
  }, []);

  return { startStream, streamedText, isStreaming, feedback, error, reset };
}

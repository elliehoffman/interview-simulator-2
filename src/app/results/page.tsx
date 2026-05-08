"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { useStreamingFeedback } from "@/hooks/useStreamingFeedback";
import { Header } from "@/components/layout/Header";
import { ScoreBadge } from "@/components/results/ScoreBadge";
import { StrengthsPanel } from "@/components/results/StrengthsPanel";
import { ImprovementsPanel } from "@/components/results/ImprovementsPanel";
import { StarEvaluation } from "@/components/results/StarEvaluation";
import { FeedbackStream } from "@/components/results/FeedbackStream";
import { ActionButtons } from "@/components/results/ActionButtons";
import { saveSessionHistory } from "@/lib/utils";

export default function ResultsPage() {
  const router = useRouter();
  const session = useSession();
  const { startStream, streamedText, isStreaming, feedback, error } = useStreamingFeedback();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Try to get pending payload from sessionStorage
    let pending: {
      question: { question: string; questionType: string; hint?: string; topic?: string };
      difficulty: string;
      payload: Parameters<typeof startStream>[0];
    } | null = null;

    try {
      const raw = sessionStorage.getItem("interview_simulator_pending");
      if (raw) pending = JSON.parse(raw);
    } catch {
      // ignore
    }

    // If no pending payload and no session question, redirect
    if (!pending && !session.currentQuestion) {
      router.replace("/practice");
      return;
    }

    const streamPayload = pending?.payload ?? null;
    if (!streamPayload) {
      router.replace("/practice");
      return;
    }

    startStream(streamPayload).then((result) => {
      if (result && pending) {
        saveSessionHistory({
          questionType: pending.question.questionType,
          difficulty: pending.difficulty,
          question: pending.question.question,
          score: result.score,
        });
        session.setFeedback(result);
        try {
          sessionStorage.setItem("interview_simulator_feedback", JSON.stringify(result));
          sessionStorage.removeItem("interview_simulator_pending");
        } catch {
          // ignore
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore question from sessionStorage on hard refresh
  const question = session.currentQuestion ?? (() => {
    try {
      const raw = sessionStorage.getItem("interview_simulator_pending");
      if (raw) return JSON.parse(raw).question;
    } catch { return null; }
    return null;
  })();

  // Use streamed feedback or session feedback (after hard refresh)
  const displayFeedback = feedback ?? session.feedback ?? (() => {
    try {
      const raw = sessionStorage.getItem("interview_simulator_feedback");
      if (raw) return JSON.parse(raw);
    } catch { return null; }
    return null;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Feedback</h1>
          {question && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              Q: {question.question}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {/* Score — show as soon as feedback is parsed */}
          {displayFeedback && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-slide-up">
              <ScoreBadge score={displayFeedback.score} />
            </div>
          )}

          {/* Live stream */}
          {(isStreaming || (streamedText && !displayFeedback)) && (
            <FeedbackStream text={streamedText} isStreaming={isStreaming} />
          )}

          {/* Structured panels — appear after stream completes */}
          {displayFeedback && !isStreaming && (
            <>
              {displayFeedback.strengths.length > 0 && (
                <div className="animate-slide-up">
                  <StrengthsPanel strengths={displayFeedback.strengths} />
                </div>
              )}
              {displayFeedback.improvements.length > 0 && (
                <div className="animate-slide-up">
                  <ImprovementsPanel improvements={displayFeedback.improvements} />
                </div>
              )}
              {displayFeedback.star && question?.questionType === "behavioral" && (
                <div className="animate-slide-up">
                  <StarEvaluation star={displayFeedback.star} />
                </div>
              )}
              {displayFeedback.summary && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-slide-up">
                  <h3 className="mb-2 font-semibold text-gray-800">Summary</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{displayFeedback.summary}</p>
                </div>
              )}
              <div className="animate-slide-up">
                <ActionButtons />
              </div>
            </>
          )}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
              <button
                onClick={() => router.push("/practice")}
                className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                Back to Practice
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

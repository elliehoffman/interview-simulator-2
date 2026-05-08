"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { SetupPanel } from "@/components/practice/SetupPanel";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { AnswerToggle } from "@/components/practice/AnswerToggle";
import { TextAnswerInput } from "@/components/practice/TextAnswerInput";
import { MultipleChoiceInput } from "@/components/practice/MultipleChoiceInput";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Send } from "lucide-react";

type Stage = "setup" | "question";

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const session = useSession();
  const [stage, setStage] = useState<Stage>("setup");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    void searchParams; // used for JD mode hint
    session.resetSession();
    setStage("setup");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = session.answerMode === "text"
    ? session.textAnswer
    : session.choices?.find((c) => c.id === session.selectedChoice)?.text ?? "";

  const canSubmit = session.answerMode === "text"
    ? session.textAnswer.trim().length >= 50
    : session.selectedChoice !== null;

  function handleSubmit() {
    if (!profile || !session.currentQuestion || !canSubmit) return;
    setSubmitError(null);

    const payload = {
      question: session.currentQuestion.question,
      questionType: session.currentQuestion.questionType,
      answer,
      answerMode: session.answerMode,
      profile,
      jobContext: session.jobContext ?? undefined,
    };

    // Store payload in sessionStorage; results page will initiate the stream
    try {
      sessionStorage.setItem("interview_simulator_pending", JSON.stringify({
        question: session.currentQuestion,
        difficulty: session.difficulty,
        payload,
      }));
    } catch {
      setSubmitError("Browser storage unavailable. Please enable cookies.");
      return;
    }

    router.push("/results");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          {stage === "question" && (
            <button
              onClick={() => setStage("setup")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              New question
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {stage === "setup" ? "Set Up Your Practice" : "Answer the Question"}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-gray-800">Configure</h2>
              <SetupPanel onQuestionGenerated={() => setStage("question")} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {stage === "setup" ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                <div className="text-center text-gray-400">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">💬</div>
                  <p className="text-sm font-medium">Your question will appear here</p>
                  <p className="mt-1 text-xs">Configure your settings and click Generate</p>
                </div>
              </div>
            ) : (
              session.currentQuestion && (
                <div className="space-y-4 animate-fade-in">
                  <QuestionCard question={session.currentQuestion} />

                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">How would you like to answer?</h3>
                      <AnswerToggle />
                    </div>

                    {session.answerMode === "text" ? <TextAnswerInput /> : <MultipleChoiceInput />}

                    {submitError && (
                      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
                        {submitError}
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      Get AI Feedback
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

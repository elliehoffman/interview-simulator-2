"use client";

import { createContext, useState, useCallback, type ReactNode } from "react";
import type { QuestionType, Difficulty, JobContext, GeneratedQuestion, Choice, AnswerMode, ParsedFeedback } from "@/lib/types";

interface SessionState {
  questionType: QuestionType;
  difficulty: Difficulty;
  jobContext: JobContext | null;
  currentQuestion: GeneratedQuestion | null;
  choices: Choice[] | null;
  answerMode: AnswerMode;
  textAnswer: string;
  selectedChoice: string | null;
  feedback: ParsedFeedback | null;
  isStreaming: boolean;
  setQuestionType: (t: QuestionType) => void;
  setDifficulty: (d: Difficulty) => void;
  setJobContext: (j: JobContext | null) => void;
  setCurrentQuestion: (q: GeneratedQuestion | null) => void;
  setChoices: (c: Choice[] | null) => void;
  setAnswerMode: (m: AnswerMode) => void;
  setTextAnswer: (a: string) => void;
  setSelectedChoice: (c: string | null) => void;
  setFeedback: (f: ParsedFeedback | null) => void;
  setIsStreaming: (b: boolean) => void;
  resetSession: () => void;
}

export const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [questionType, setQuestionType] = useState<QuestionType>("behavioral");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [jobContext, setJobContext] = useState<JobContext | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null);
  const [choices, setChoices] = useState<Choice[] | null>(null);
  const [answerMode, setAnswerMode] = useState<AnswerMode>("text");
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ParsedFeedback | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const resetSession = useCallback(() => {
    setCurrentQuestion(null);
    setChoices(null);
    setAnswerMode("text");
    setTextAnswer("");
    setSelectedChoice(null);
    setFeedback(null);
    setIsStreaming(false);
  }, []);

  return (
    <SessionContext.Provider value={{
      questionType, difficulty, jobContext, currentQuestion, choices,
      answerMode, textAnswer, selectedChoice, feedback, isStreaming,
      setQuestionType, setDifficulty, setJobContext, setCurrentQuestion,
      setChoices, setAnswerMode, setTextAnswer, setSelectedChoice,
      setFeedback, setIsStreaming, resetSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

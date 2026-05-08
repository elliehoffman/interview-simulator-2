import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ParsedFeedback, StarScore } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseFeedback(markdown: string): ParsedFeedback {
  const sections: Record<string, string> = {};
  const parts = markdown.split(/^## /m).filter(Boolean);

  for (const part of parts) {
    const newlineIdx = part.indexOf("\n");
    if (newlineIdx === -1) continue;
    const header = part.slice(0, newlineIdx).trim().toLowerCase();
    const body = part.slice(newlineIdx + 1).trim();
    sections[header] = body;
  }

  const scoreMatch = (sections["score"] ?? "").match(/(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 5;

  const parseList = (text: string): string[] =>
    (text ?? "")
      .split("\n")
      .map((l) => l.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);

  const strengths = parseList(sections["strengths"] ?? "");
  const improvements = parseList(sections["areas for improvement"] ?? "");
  const summary = sections["summary"] ?? "";

  let star: StarScore | undefined;
  const starText = sections["star evaluation"] ?? "";
  if (starText) {
    const parseStarComponent = (label: string): { score: number; feedback: string } => {
      const regex = new RegExp(
        `\\*\\*${label}:\\*\\*\\s*(\\d+)\\/10\\s*[—-]\\s*([^\\n]+(?:\\n(?!\\*\\*)[^\\n]+)*)`,
        "i"
      );
      const match = starText.match(regex);
      if (!match) return { score: 5, feedback: "" };
      return { score: parseInt(match[1], 10), feedback: match[2].trim() };
    };
    star = {
      situation: parseStarComponent("Situation"),
      task: parseStarComponent("Task"),
      action: parseStarComponent("Action"),
      result: parseStarComponent("Result"),
    };
  }

  return { score, strengths, improvements, star, summary, rawMarkdown: markdown };
}

export function saveSessionHistory(entry: {
  questionType: string;
  difficulty: string;
  question: string;
  score: number;
}) {
  try {
    const raw = localStorage.getItem("interview_simulator_history");
    const history = raw ? JSON.parse(raw) : { sessions: [] };
    history.sessions.unshift({ ...entry, timestamp: new Date().toISOString() });
    history.sessions = history.sessions.slice(0, 20);
    localStorage.setItem("interview_simulator_history", JSON.stringify(history));
  } catch {
    // localStorage unavailable
  }
}

export function getSessionHistory(): { sessions: Array<{ questionType: string; difficulty: string; question: string; score: number; timestamp: string }> } {
  try {
    const raw = localStorage.getItem("interview_simulator_history");
    return raw ? JSON.parse(raw) : { sessions: [] };
  } catch {
    return { sessions: [] };
  }
}

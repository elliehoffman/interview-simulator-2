export type QuestionType = "behavioral" | "open-ended" | "situational";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type AnswerMode = "text" | "mcq";
export type ExperienceRange = "0-2" | "3-5" | "6-10" | "10+";

export interface UserProfile {
  name: string;
  role: string;
  industry: string;
  yearsExperience: ExperienceRange;
  careerGoal: string;
  createdAt: string;
}

export interface JobContext {
  roleSummary: string;
  roleTitle: string;
  keySkills: string[];
  industry: string;
}

export interface GeneratedQuestion {
  question: string;
  questionType: QuestionType;
  hint?: string;
  topic?: string;
}

export interface Choice {
  id: string;
  text: string;
}

export interface StarComponentScore {
  score: number;
  feedback: string;
}

export interface StarScore {
  situation: StarComponentScore;
  task: StarComponentScore;
  action: StarComponentScore;
  result: StarComponentScore;
}

export interface ParsedFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  star?: StarScore;
  summary: string;
  rawMarkdown: string;
}

export interface SessionHistoryEntry {
  questionType: QuestionType;
  difficulty: Difficulty;
  question: string;
  score: number;
  timestamp: string;
}

import type { UserProfile, JobContext, QuestionType, Difficulty, AnswerMode } from "./types";

export function buildPersonalizationContext(profile: UserProfile, jobContext?: JobContext): string {
  let ctx = `The user is ${profile.name}, a ${profile.yearsExperience}-year professional working as a ${profile.role} in the ${profile.industry} industry. Their career goal is: ${profile.careerGoal}.`;
  if (jobContext) {
    ctx += ` They are currently practicing for a ${jobContext.roleTitle} position that requires skills in: ${jobContext.keySkills.join(", ")}.`;
  }
  return ctx;
}

export function buildQuestionPrompt(params: {
  questionType: QuestionType;
  difficulty: Difficulty;
  profile: UserProfile;
  jobContext?: JobContext;
}) {
  const { questionType, difficulty, profile, jobContext } = params;
  const personalization = buildPersonalizationContext(profile, jobContext);

  const typeDescriptions: Record<QuestionType, string> = {
    behavioral: "behavioral (requires a concrete personal story answerable with the STAR method — Situation, Task, Action, Result)",
    "open-ended": "open-ended (invites structured thinking, self-awareness, and insight — not a personal story)",
    situational: "situational judgment (presents a realistic workplace scenario and asks what the candidate would do)",
  };

  const difficultyNotes: Record<Difficulty, string> = {
    Easy: "straightforward scenario, single clear STAR arc, no ambiguity, appropriate for someone newer to interviews",
    Medium: "requires balancing competing priorities, managing a difficult stakeholder, or navigating ambiguity",
    Hard: "requires demonstrating systems thinking, leading through significant uncertainty, recovering from a major failure, or showing strategic judgment",
  };

  const jobClause = jobContext
    ? ` The question should be specifically tailored for someone applying to a ${jobContext.roleTitle} role with a focus on: ${jobContext.keySkills.slice(0, 4).join(", ")}.`
    : "";

  const systemPrompt = `You are an expert behavioral interview coach with 15 years of experience helping candidates prepare for roles at top companies. You craft precise, role-relevant interview questions that reveal genuine competencies.

${personalization}

Your questions must:
- Be specific enough to require a concrete personal story (not answerable with theory alone)
- Match the stated difficulty level precisely: ${difficultyNotes[difficulty]}
- For behavioral questions: be clearly answerable with the STAR framework
- For situational questions: present a plausible realistic workplace scenario
- For open-ended questions: invite structured thinking and self-awareness
- Be calibrated to the candidate's experience level (${profile.yearsExperience} years in ${profile.role})
- Never ask a senior-level question to a junior candidate or vice versa

Respond ONLY with valid JSON in this exact shape, no markdown, no explanation:
{"question": "...", "questionType": "...", "hint": "...", "topic": "..."}`;

  const userMessage = `Generate one ${difficulty} ${typeDescriptions[questionType]} interview question.${jobClause}

The "hint" field should be a short coaching tip (e.g., "Focus on your specific actions, not the team's"). The "topic" field should be the competency area (e.g., "Leadership", "Conflict Resolution", "Problem Solving").`;

  return { systemPrompt, userMessage };
}

export function buildChoicesPrompt(params: {
  question: string;
  questionType: QuestionType;
  profile: UserProfile;
  jobContext?: JobContext;
}) {
  const { question, questionType, profile, jobContext } = params;
  const personalization = buildPersonalizationContext(profile, jobContext);

  const systemPrompt = `You are an expert interview coach. Given a question and candidate profile, generate exactly 4 answer choices that represent different quality levels. Do NOT label them by quality — they should appear equally plausible at first glance to someone unfamiliar with interviewing.

${personalization}

Requirements for choices:
- One choice: a strong, specific, well-structured response calibrated to a ${profile.yearsExperience}-year ${profile.role} (what a top candidate would say)
- Two choices: mediocre responses — they address the question but miss key elements (no metrics, vague actions, generic language, or missing result)
- One choice: a weak response — too generic, overly brief, or shows poor judgment or self-awareness
- Each choice should be 2-4 sentences describing a plausible approach
- Shuffle the strong answer to a random position (A, B, C, or D — not always A or D)
- For behavioral questions: the strong choice clearly follows STAR structure; weak choices skip components

Respond ONLY with valid JSON, no markdown:
{"choices": [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."}]}`;

  const userMessage = `Question (${questionType}): ${question}

Generate 4 multiple-choice answer options.`;

  return { systemPrompt, userMessage };
}

export function buildFeedbackPrompt(params: {
  question: string;
  questionType: QuestionType;
  answer: string;
  answerMode: AnswerMode;
  profile: UserProfile;
  jobContext?: JobContext;
}) {
  const { question, questionType, answer, answerMode, profile, jobContext } = params;
  const personalization = buildPersonalizationContext(profile, jobContext);

  const mcqNote = answerMode === "mcq"
    ? "\nNote: The candidate selected a pre-written multiple-choice option, not a spontaneous response. Evaluate the quality of the answer they chose and whether it demonstrates good judgment about what an effective response looks like."
    : "";

  const starSection = questionType === "behavioral"
    ? `
## STAR Evaluation
**Situation:** [score]/10 — [2-3 sentence evaluation of how well they set up the context]
**Task:** [score]/10 — [2-3 sentence evaluation of how clearly they defined their specific role/responsibility]
**Action:** [score]/10 — [2-3 sentence evaluation of the specificity and quality of their actions]
**Result:** [score]/10 — [2-3 sentence evaluation of whether they quantified outcomes and showed impact]
`
    : "";

  const systemPrompt = `You are a rigorous but encouraging interview coach. Analyze the candidate's interview answer and provide structured, actionable feedback. Be honest — do not pad weak answers with unearned praise. Strong candidates deserve specific recognition; weak answers deserve specific, constructive critique.

${personalization}

Benchmark your feedback to their career stage: ${profile.yearsExperience} years as a ${profile.role} in ${profile.industry}. A more senior candidate is held to a higher standard for leadership, strategic thinking, and quantified impact.

You MUST output feedback in this EXACT markdown structure with these EXACT section headers (use ## for headers):

## Score
[number]/10

## Strengths
- [specific strength with evidence from their answer]
- [specific strength with evidence from their answer]

## Areas for Improvement
- [specific improvement with explanation of why it matters]
- [specific improvement with explanation of why it matters]
${starSection}
## Summary
[2-3 sentence overall assessment, referencing their career stage and goal: ${profile.careerGoal}]`;

  const userMessage = `Question Type: ${questionType}
Question: ${question}
Answer Mode: ${answerMode === "mcq" ? "Multiple Choice (pre-written option selected)" : "Free-form text"}
Candidate's Answer: ${answer}
${mcqNote}

Analyze this answer and provide structured feedback.`;

  return { systemPrompt, userMessage };
}

export function buildJdParsePrompt(text: string) {
  const systemPrompt = `You are a talent analyst. Extract structured information from the following job description. Focus on the core role, key required skills, and industry.

Keep roleSummary to 2-3 sentences describing the role and its main purpose.
Keep keySkills to the 5-8 most important skills or competencies explicitly listed.
If the input is clearly not a job description, return {"error": "Not a job description"}.

Respond ONLY with valid JSON, no markdown, no explanation:
{"roleSummary": "...", "roleTitle": "...", "keySkills": [...], "industry": "..."}`;

  const userMessage = `Job description text (may be truncated to 4000 characters):\n\n${text.slice(0, 4000)}`;

  return { systemPrompt, userMessage };
}

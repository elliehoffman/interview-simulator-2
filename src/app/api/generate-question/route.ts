import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildQuestionPrompt } from "@/lib/prompts";
import type { QuestionType, Difficulty, UserProfile, JobContext } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      questionType: QuestionType;
      difficulty: Difficulty;
      profile: UserProfile;
      jobContext?: JobContext;
    };

    const { systemPrompt, userMessage } = buildQuestionPrompt(body);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-question error:", err);
    return NextResponse.json({ error: "Failed to generate question. Please try again." }, { status: 500 });
  }
}

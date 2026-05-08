import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildChoicesPrompt } from "@/lib/prompts";
import type { QuestionType, UserProfile, JobContext } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      question: string;
      questionType: QuestionType;
      profile: UserProfile;
      jobContext?: JobContext;
    };

    const { systemPrompt, userMessage } = buildChoicesPrompt(body);

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-choices error:", err);
    return NextResponse.json({ error: "Failed to generate choices. Please try again." }, { status: 500 });
  }
}

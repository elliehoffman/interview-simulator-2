import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildFeedbackPrompt } from "@/lib/prompts";
import type { QuestionType, AnswerMode, UserProfile, JobContext } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      question: string;
      questionType: QuestionType;
      answer: string;
      answerMode: AnswerMode;
      profile: UserProfile;
      jobContext?: JobContext;
    };

    const { systemPrompt, userMessage } = buildFeedbackPrompt(body);

    const stream = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("generate-feedback error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate feedback" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

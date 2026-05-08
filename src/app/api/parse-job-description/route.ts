import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { buildJdParsePrompt } from "@/lib/prompts";

const BLOCKED_DOMAINS = ["linkedin.com", "greenhouse.io", "lever.co", "workday.com", "taleo.net", "icims.com"];

export async function POST(req: NextRequest) {
  try {
    const { input, inputType } = await req.json() as { input: string; inputType: "text" | "url" };

    let text = input;

    if (inputType === "url") {
      const isBlocked = BLOCKED_DOMAINS.some((d) => input.includes(d));
      if (isBlocked) {
        return NextResponse.json({
          error: "This site blocks automated access (LinkedIn, ATS systems). Please paste the job description text directly.",
        });
      }

      try {
        const res = await fetch(input, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; InterviewSimulator/1.0)" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        text = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (text.length < 100) {
          return NextResponse.json({
            error: "Couldn't extract readable text from this URL. Please paste the job description text directly.",
          });
        }
      } catch {
        return NextResponse.json({
          error: "Couldn't fetch this URL. Please paste the job description text directly.",
        });
      }
    }

    const { systemPrompt, userMessage } = buildJdParsePrompt(text);

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("parse-job-description error:", err);
    return NextResponse.json({ error: "Failed to parse job description. Please try again." }, { status: 500 });
  }
}

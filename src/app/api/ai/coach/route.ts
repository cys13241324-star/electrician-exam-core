import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { COACH_MODEL } from "@/lib/ai/config";
import { buildCoachSystem } from "@/lib/ai/prompts";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as UIMessage[];
    const learnerSummary = (body.learnerSummary as string) ?? "(컨텍스트 없음)";

    const result = streamText({
      model: COACH_MODEL,
      system: buildCoachSystem(learnerSummary),
      messages: await convertToModelMessages(messages),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "알 수 없는 오류";
    return new Response(
      JSON.stringify({ error: `AI 호출 실패: ${msg}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

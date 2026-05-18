import { streamText } from "ai";
import { EXPLAIN_MODEL } from "@/lib/ai/config";
import { buildExplainSystem } from "@/lib/ai/prompts";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      question,
      correctAnswer,
      existingExplanation,
      userWrongAnswer,
      cardFront,
      cardBack,
    } = body as {
      question?: string;
      correctAnswer?: string;
      existingExplanation?: string;
      userWrongAnswer?: string;
      cardFront?: string;
      cardBack?: string;
    };

    let prompt = "";

    if (question) {
      prompt = `[문제]\n${question}\n\n[정답]\n${correctAnswer ?? "(미상)"}\n`;
      if (userWrongAnswer) {
        prompt += `\n[학습자의 오답]\n${userWrongAnswer}\n`;
      }
      if (existingExplanation) {
        prompt += `\n[기존 해설 — 학습자가 이걸 봤지만 이해 못함]\n${existingExplanation}\n`;
      }
      prompt += `\n위 문제를 다른 각도로 다시 설명해주세요. 일상 비유와 쉬운 말로.`;
    } else if (cardFront) {
      prompt = `[카드 앞면]\n${cardFront}\n\n[카드 뒷면]\n${cardBack ?? ""}\n\n위 개념을 더 쉽게, 일상 비유를 써서 다시 설명해주세요.`;
    } else {
      return new Response(
        JSON.stringify({ error: "question 또는 cardFront 가 필요합니다" }),
        { status: 400 }
      );
    }

    const result = streamText({
      model: EXPLAIN_MODEL,
      system: buildExplainSystem(),
      prompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "알 수 없는 오류";
    return new Response(
      JSON.stringify({ error: `해설 생성 실패: ${msg}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

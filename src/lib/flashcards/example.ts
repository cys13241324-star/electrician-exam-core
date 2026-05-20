import type { CardExample, Flashcard } from "./types";

/**
 * 카드의 예제를 가져옵니다.
 * - card.example 이 있으면 그대로 반환
 * - 없으면 카드 내용을 보고 deterministic 한 fallback 예제를 생성 (id 시드 → 같은 카드 = 같은 예제)
 *
 * 휴리스틱:
 *   1) 뒷면에 수식($...$) 이 있으면 → "공식 적용" 자기점검 패턴
 *   2) 뒷면이 목록형(여러 줄 / "A:" "1." "-" 패턴) → 항목 떠올리기 패턴
 *   3) 그 외(개념·정의) → 한 줄 설명 패턴
 */
export function getExample(card: Flashcard): CardExample {
  if (card.example) return card.example;
  return buildFallbackExample(card);
}

function buildFallbackExample(card: Flashcard): CardExample {
  const backLines = card.back
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const firstLine = backLines[0] ?? card.back.trim();
  const hasMath = /\$[^$]+\$/.test(card.back);
  const isList = detectList(backLines);

  if (hasMath) {
    return buildFormulaExample(card, backLines, firstLine);
  }
  if (isList) {
    return buildListExample(card, backLines);
  }
  return buildConceptExample(card, backLines, firstLine);
}

function detectList(lines: string[]): boolean {
  if (lines.length < 2) return false;
  let listLike = 0;
  for (const l of lines) {
    // "A:" / "1." / "1)" / "- " / "· " / "• " / "① ~ ⑩"
    if (/^[A-Za-z가-힣]\s*[:：]/.test(l)) listLike += 1;
    else if (/^\d+\s*[.)）]/.test(l)) listLike += 1;
    else if (/^[-•·*]\s+/.test(l)) listLike += 1;
    else if (/^[①-⑩]/.test(l)) listLike += 1;
  }
  return listLike >= 2;
}

function buildFormulaExample(
  card: Flashcard,
  backLines: string[],
  firstLine: string,
): CardExample {
  // 수식이 포함된 줄을 우선 picking
  const mathLine =
    backLines.find((l) => /\$[^$]+\$/.test(l)) ?? firstLine;
  const supportLine = backLines.find((l) => l !== mathLine);

  const solution: string[] = [
    `${stripQuestionMark(card.front)} — 답이 어떤 식인지 먼저 떠올려 보세요.`,
    `핵심 식: ${mathLine}`,
  ];
  if (supportLine) {
    solution.push(`보조 설명: ${supportLine}`);
  }
  solution.push("기호의 의미와 단위가 헷갈리지 않는지 점검하세요.");

  return {
    question: `${stripQuestionMark(card.front)}에 해당하는 핵심 식을 적어 보세요.`,
    solution: capSteps(solution, 5),
    answer: mathLine,
  };
}

function buildListExample(card: Flashcard, backLines: string[]): CardExample {
  const items = backLines.slice(0, 5);
  const total = backLines.length;

  return {
    question: `${stripQuestionMark(card.front)} — 핵심 항목을 떠올려 보세요.`,
    solution: [
      "먼저 답을 머릿속으로 나열한 뒤 뒷면과 비교합니다.",
      ...items.map((it, i) => `${i + 1}) ${it}`),
    ],
    answer: total > items.length ? `총 ${total}개 항목` : `총 ${items.length}개 항목`,
  };
}

function buildConceptExample(
  card: Flashcard,
  backLines: string[],
  firstLine: string,
): CardExample {
  const supporting = backLines[1];
  const solution: string[] = [
    `${stripQuestionMark(card.front)} — 한 문장으로 답을 떠올려 보세요.`,
    `정의: ${firstLine}`,
  ];
  if (supporting) solution.push(`참고: ${supporting}`);
  solution.push("비슷한 개념과 헷갈리지 않는지 마지막으로 점검합니다.");

  return {
    question: `${stripQuestionMark(card.front)}을(를) 한 줄로 설명해 보세요.`,
    solution: capSteps(solution, 4),
    answer: firstLine,
  };
}

function stripQuestionMark(s: string): string {
  return s.replace(/[?？]\s*$/u, "").trim();
}

function capSteps(steps: string[], max: number): string[] {
  if (steps.length <= max) return steps;
  return steps.slice(0, max);
}

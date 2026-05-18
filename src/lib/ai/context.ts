/**
 * 학습자 컨텍스트 수집 — 클라이언트 측 localStorage에서 끌어와
 * AI 프롬프트에 주입할 수 있는 형태로 정리.
 *
 * 모든 함수는 브라우저 환경 가정. SSR에서 호출하면 안 됨.
 */

import type { Attempt } from "@/lib/cbt/types";

const ATTEMPT_KEY_PREFIX = "cbt-attempt-";

export type LearnerSnapshot = {
  recentAttempts: Array<{
    examId: string;
    submittedAt: number;
    score: number;
    weakSubjects: string[];
  }>;
  weakTopics: string[];
};

export function collectLearnerSnapshot(): LearnerSnapshot {
  if (typeof window === "undefined") {
    return {
      recentAttempts: [],
      weakTopics: [],
    };
  }

  const recentAttempts = getRecentAttempts();
  // 약점 토픽 추출은 추후 구현 — 지금은 빈 배열
  const weakTopics: string[] = [];

  return { recentAttempts, weakTopics };
}

function getRecentAttempts() {
  const out: LearnerSnapshot["recentAttempts"] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(ATTEMPT_KEY_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const att = JSON.parse(raw) as Attempt;
      if (!att.submittedAt) continue;
      out.push({
        examId: att.examId,
        submittedAt: att.submittedAt,
        score: 0,
        weakSubjects: [],
      });
    } catch {
      continue;
    }
  }
  return out
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .slice(0, 5);
}

export function snapshotToPrompt(snap: LearnerSnapshot): string {
  const lines: string[] = [];
  if (snap.recentAttempts.length > 0) {
    lines.push(`- 최근 ${snap.recentAttempts.length}회 모의고사 응시 기록 있음`);
  } else {
    lines.push("- 아직 모의고사 응시 기록 없음");
  }
  return lines.join("\n");
}

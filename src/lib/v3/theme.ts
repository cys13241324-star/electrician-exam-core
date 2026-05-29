import type { Subject } from "@/lib/flashcards/types";
import { presetCards } from "@/lib/flashcards/data";

export type SubjectTheme = {
  short: string;
  hook: string;
  gradient: string;
  ring: string;
  badge: string;
  accent: string;
  emoji: string;
  /** STEP1 진단을 가정한 mock 점수 */
  mockScore: number;
  mockWeak: string;
};

export const SUBJECT_THEME: Record<Subject, SubjectTheme> = {
  전기이론: {
    short: "기초가 곧 점수",
    hook: "옴의 법칙·교류·3상. 합격선의 절반이 여기서 갈려요.",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    ring: "ring-sky-200",
    badge: "bg-sky-50 text-sky-700",
    accent: "text-sky-600",
    emoji: "⚡",
    mockScore: 72,
    mockWeak: "교류 회로 · RLC",
  },
  전기기기: {
    short: "기출이 가장 정직",
    hook: "변압기·유도전동기 한 묶음만 잡아도 출제율 60%.",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    ring: "ring-violet-200",
    badge: "bg-violet-50 text-violet-700",
    accent: "text-violet-600",
    emoji: "🔩",
    mockScore: 48,
    mockWeak: "변압기 · 권수비",
  },
  전기설비: {
    short: "외우면 끝",
    hook: "전선·접지·차단기·KEC. 숫자만 익히면 점수가 따라와요.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    ring: "ring-emerald-200",
    badge: "bg-emerald-50 text-emerald-700",
    accent: "text-emerald-600",
    emoji: "🛠",
    mockScore: 55,
    mockWeak: "접지 · KEC 기준",
  },
};

export const TOOL_LINKS = [
  { href: "/lectures", emoji: "🎬", name: "기출 강의", note: "문항별 해설" },
  { href: "/cbt", emoji: "📝", name: "CBT 모의고사", note: "실전 회차" },
  { href: "/flashcards", emoji: "🃏", name: "플립 암기카드", note: "핵심 회독" },
  { href: "/audiobook", emoji: "🎧", name: "오디오북", note: "귀로 듣기" },
  { href: "/simulator", emoji: "⚡", name: "시뮬레이터", note: "직접 조작" },
];

export function countBySubject(): Record<Subject, number> {
  const out = { 전기이론: 0, 전기기기: 0, 전기설비: 0 } as Record<
    Subject,
    number
  >;
  for (const c of presetCards) out[c.subject] += 1;
  return out;
}

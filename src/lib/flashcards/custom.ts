import type { Flashcard, Subject } from "./types";
import { ALL_SUBJECTS } from "./chapters";

const KEY = "flashcards-custom-v1";

/**
 * 사용자가 직접 만든 "나만의 카드" 저장소 (localStorage).
 * presetCards 와 같은 Flashcard 모양이되, id 가 "u-" 로 시작한다.
 */

export type CustomCard = Flashcard & { source: "custom"; createdAt: number };

export function isCustomCard(card: Flashcard): card is CustomCard {
  return card.source === "custom";
}

export function loadCustomCards(): CustomCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter(isValid);
  } catch {
    return [];
  }
}

function isValid(x: unknown): x is CustomCard {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.front === "string" &&
    typeof o.back === "string" &&
    typeof o.subject === "string" &&
    ALL_SUBJECTS.includes(o.subject as Subject) &&
    typeof o.topic === "string" &&
    o.source === "custom"
  );
}

function persist(cards: CustomCard[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cards));
  } catch {
    /* 저장 실패는 조용히 무시 */
  }
}

function genId(): string {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export type CustomCardDraft = {
  front: string;
  back: string;
  subject: Subject;
  topic: string;
  hint?: string;
};

export function addCustomCard(
  list: CustomCard[],
  draft: CustomCardDraft,
): CustomCard[] {
  const card: CustomCard = {
    id: genId(),
    front: draft.front.trim(),
    back: draft.back.trim(),
    subject: draft.subject,
    topic: draft.topic.trim() || "사용자 카드",
    hint: draft.hint?.trim() || undefined,
    source: "custom",
    createdAt: Date.now(),
  };
  const next = [card, ...list];
  persist(next);
  return next;
}

export function updateCustomCard(
  list: CustomCard[],
  id: string,
  draft: CustomCardDraft,
): CustomCard[] {
  const next = list.map((c) =>
    c.id === id
      ? {
          ...c,
          front: draft.front.trim(),
          back: draft.back.trim(),
          subject: draft.subject,
          topic: draft.topic.trim() || "사용자 카드",
          hint: draft.hint?.trim() || undefined,
        }
      : c,
  );
  persist(next);
  return next;
}

export function removeCustomCard(
  list: CustomCard[],
  id: string,
): CustomCard[] {
  const next = list.filter((c) => c.id !== id);
  persist(next);
  return next;
}

export function clearCustomCards(): CustomCard[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  }
  return [];
}

const KEY = "flashcards-favorites-v1";
const PROGRESS_KEY = "flashcards-progress-v1";

export function loadFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function saveFavorites(favs: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify([...favs]));
}

export function toggleFavorite(favs: Set<string>, id: string): Set<string> {
  const next = new Set(favs);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saveFavorites(next);
  return next;
}

/* ------------------------------------------------------------------ *
 * 학습 진도 — 순수 UI 상태 (localStorage).
 *
 * SRS 점수·간격 계산은 하지 않는다. 카드별로 마지막 학습 결과와
 * 마지막 본 시각만 가볍게 기록해 "진행률 시각화"·"오늘 복습" 묶음을
 * 화면에 표시하는 용도로만 쓴다. 카드 데이터·분류는 건드리지 않는다.
 * ------------------------------------------------------------------ */

export type CardStatus = "known" | "unknown";

export type CardProgress = {
  /** 마지막 학습 결과 */
  status: CardStatus;
  /** 마지막 학습 시각(ms) */
  ts: number;
};

export type ProgressMap = Record<string, CardProgress>;

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  } catch {
    /* 저장 실패는 조용히 무시 (학습 흐름을 막지 않음) */
  }
}

/** 한 카드의 학습 결과를 기록하고 갱신된 맵을 반환. */
export function recordProgress(
  map: ProgressMap,
  id: string,
  status: CardStatus,
): ProgressMap {
  const next: ProgressMap = { ...map, [id]: { status, ts: Date.now() } };
  saveProgress(next);
  return next;
}

/** 진도 전체 초기화. */
export function resetProgress(): ProgressMap {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {
      /* noop */
    }
  }
  return {};
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * "복습 권장" 여부 — SRS 계산이 아니라 단순 휴리스틱(표시용).
 * - 한 번도 안 본 카드: 복습 대상
 * - 마지막에 "모르겠음": 복습 대상
 * - "알겠음"이지만 하루 이상 지남: 복습 대상(가벼운 망각 곡선 힌트)
 */
export function needsReview(map: ProgressMap, id: string): boolean {
  const p = map[id];
  if (!p) return true;
  if (p.status === "unknown") return true;
  return Date.now() - p.ts > DAY;
}

export type ProgressSummary = {
  total: number;
  known: number;
  unknown: number;
  unseen: number;
  due: number;
  /** 0~100 */
  masteredPct: number;
};

/** 주어진 카드 id 목록에 대한 진도 요약(표시용). */
export function summarize(map: ProgressMap, ids: string[]): ProgressSummary {
  let known = 0;
  let unknown = 0;
  let due = 0;
  for (const id of ids) {
    const p = map[id];
    if (!p) {
      due += 1;
      continue;
    }
    if (p.status === "known") {
      known += 1;
      if (Date.now() - p.ts > DAY) due += 1;
    } else {
      unknown += 1;
      due += 1;
    }
  }
  const total = ids.length;
  const unseen = total - known - unknown;
  return {
    total,
    known,
    unknown,
    unseen,
    due,
    masteredPct: total === 0 ? 0 : Math.round((known / total) * 100),
  };
}

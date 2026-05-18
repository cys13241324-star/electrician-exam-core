/**
 * 클라이언트 측 일일 호출 한도. localStorage 기반.
 * (서버측 진짜 보호는 아님 — 데모용 청구서 폭격 방지)
 */

const KEY = "ai-usage-counter";
const DAILY_LIMIT = 50;

type Counter = {
  date: string;
  count: number;
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function read(): Counter {
  if (typeof window === "undefined") return { date: todayKey(), count: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const c = JSON.parse(raw) as Counter;
    if (c.date !== todayKey()) return { date: todayKey(), count: 0 };
    return c;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function write(c: Counter) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(c));
}

export function checkAndIncrement(): { ok: boolean; remaining: number } {
  const c = read();
  if (c.count >= DAILY_LIMIT) {
    return { ok: false, remaining: 0 };
  }
  const next = { date: c.date, count: c.count + 1 };
  write(next);
  return { ok: true, remaining: DAILY_LIMIT - next.count };
}

export function getRemaining(): number {
  const c = read();
  return Math.max(0, DAILY_LIMIT - c.count);
}

export const AI_DAILY_LIMIT = DAILY_LIMIT;

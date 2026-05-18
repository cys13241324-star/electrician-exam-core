import Link from "next/link";
import { buildFocusId, countByFocus } from "@/lib/cbt/mockData";
import type { Difficulty, Frequency } from "@/lib/cbt/types";

export type FocusCard = {
  filter: { frequency?: Frequency; difficulty?: Difficulty };
  label: string;
  desc: string;
  emoji: string;
  tone: string; // tailwind 색조 prefix (예: "rose")
};

export type FocusGroup = {
  title: string;
  desc?: string;
  cards: FocusCard[];
};

const TONE_STYLES: Record<
  string,
  { bg: string; ring: string; text: string; btn: string }
> = {
  rose: {
    bg: "bg-rose-50",
    ring: "ring-rose-100",
    text: "text-rose-700",
    btn: "bg-rose-600 hover:bg-rose-700",
  },
  blue: {
    bg: "bg-blue-50",
    ring: "ring-blue-100",
    text: "text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    text: "text-emerald-700",
    btn: "bg-emerald-700 hover:bg-emerald-800",
  },
  indigo: {
    bg: "bg-indigo-50",
    ring: "ring-indigo-100",
    text: "text-indigo-700",
    btn: "bg-indigo-600 hover:bg-indigo-700",
  },
  violet: {
    bg: "bg-violet-50",
    ring: "ring-violet-100",
    text: "text-violet-700",
    btn: "bg-violet-600 hover:bg-violet-700",
  },
  amber: {
    bg: "bg-amber-50",
    ring: "ring-amber-100",
    text: "text-amber-700",
    btn: "bg-amber-700 hover:bg-amber-800",
  },
};

function FocusCardItem({ card }: { card: FocusCard }) {
  const count = countByFocus(card.filter);
  const tone = TONE_STYLES[card.tone] ?? TONE_STYLES.blue;
  const disabled = count === 0;
  const id = buildFocusId(card.filter);
  const minutes = Math.min(60, Math.max(10, Math.round(count * 1.5)));
  return (
    <div
      className={`flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 ring-1 ${tone.ring} transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${tone.bg}`}
          aria-hidden
        >
          {card.emoji}
        </span>
        <div className="flex-1">
          <h3 className={`text-base font-bold ${tone.text}`}>{card.label}</h3>
          <p className="mt-1 text-xs leading-5 text-zinc-600">{card.desc}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className={`rounded-lg px-2.5 py-1.5 ${tone.bg}`}>
          <p className="text-[10px] text-zinc-600">문항</p>
          <p className={`mt-0.5 font-bold ${tone.text}`}>{count}문항</p>
        </div>
        <div className={`rounded-lg px-2.5 py-1.5 ${tone.bg}`}>
          <p className="text-[10px] text-zinc-600">예상 시간</p>
          <p className={`mt-0.5 font-bold ${tone.text}`}>약 {minutes}분</p>
        </div>
      </div>
      {disabled ? (
        <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-500">
          지금은 해당 문항이 없어요
        </p>
      ) : (
        <Link
          href={`/cbt/${id}/take`}
          className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${tone.btn}`}
        >
          응시 시작
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

/** 카드 배열을 평면 그리드로 렌더 */
export function FocusGrid({ cards }: { cards: FocusCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <FocusCardItem key={card.label} card={card} />
      ))}
    </div>
  );
}

/** 소분류 헤더로 묶어 렌더 — 항목이 많아져도 스캔 가능하게 */
export function FocusGroupedGrid({ groups }: { groups: FocusGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.title}>
          <div className="mb-3 flex items-baseline gap-2 border-b border-zinc-200 pb-2">
            <h3 className="text-sm font-bold text-zinc-800">{group.title}</h3>
            {group.desc && (
              <p className="text-xs text-zinc-500">{group.desc}</p>
            )}
          </div>
          <FocusGrid cards={group.cards} />
        </section>
      ))}
    </div>
  );
}

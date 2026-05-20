"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import type { Simulator, Subject } from "@/lib/simulators";
import { CHAPTERS, ALL_SUBJECTS } from "@/lib/chapters";

type Props = {
  simulators: Simulator[];
  initialSubject?: Subject;
  /** 히어로/상단 검색·필터 영역을 숨기고 챕터 그룹 카드만 렌더 (서브라우트에서 사용) */
  compact?: boolean;
};

type SubjectFilter = "all" | Subject;
const SUBJECT_FILTERS: SubjectFilter[] = ["all", ...ALL_SUBJECTS];

const SUBJECT_STYLE: Record<
  Subject,
  {
    chip: string;
    emoji: string;
    ring: string;
    accent: string;
    bar: string;
    soft: string;
  }
> = {
  전기이론: {
    chip: "bg-blue-100 text-blue-700",
    emoji: "⚡",
    ring: "ring-blue-100",
    accent: "text-blue-700",
    bar: "bg-blue-500",
    soft: "from-blue-50",
  },
  전기기기: {
    chip: "bg-violet-100 text-violet-700",
    emoji: "🔧",
    ring: "ring-violet-100",
    accent: "text-violet-700",
    bar: "bg-violet-500",
    soft: "from-violet-50",
  },
  전기설비: {
    chip: "bg-amber-100 text-amber-700",
    emoji: "🏗️",
    ring: "ring-amber-100",
    accent: "text-amber-700",
    bar: "bg-amber-500",
    soft: "from-amber-50",
  },
};

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, "");
}

export default function SimulatorList({
  simulators,
  initialSubject,
  compact = false,
}: Props) {
  const [subjectScope, setSubjectScope] = useState<SubjectFilter>(
    initialSubject ?? "all",
  );
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const trimmedQuery = deferredQuery.trim();
  const isSearching = trimmedQuery.length > 0;

  const matched = useMemo(() => {
    if (!isSearching) return simulators;
    const q = normalize(trimmedQuery);
    return simulators.filter((s) =>
      [s.title, s.description, s.topic, s.subject]
        .map(normalize)
        .some((field) => field.includes(q)),
    );
  }, [simulators, isSearching, trimmedQuery]);

  const groups = useMemo(() => {
    const subjectsToShow: Subject[] =
      subjectScope === "all" ? ALL_SUBJECTS : [subjectScope];
    return subjectsToShow.flatMap((subject) =>
      CHAPTERS[subject]
        .map((chapter) => ({
          subject,
          chapter,
          items: matched.filter(
            (s) => s.subject === subject && s.topic === chapter,
          ),
        }))
        .filter((g) => g.items.length > 0),
    );
  }, [matched, subjectScope]);

  const totalInScope = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div>
      {/* 히어로 */}
      {!compact && (
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-200/70 bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl"
        />
        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.2em] text-indigo-300">
            INTERACTIVE SIMULATOR
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            이론을 직접 만지며 이해하다
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            전기력선·RLC 공진·회전 자계·변압기 — 슬라이더를 움직이면 수식과
            파형이 바로 따라옵니다. 글로만 보던 이론을 직접 만져보며
            익혀보세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Stat label="전체 시뮬레이터" value={`${simulators.length}개`} />
            <Stat label="과목" value="3과목" />
            <Stat label="형태" value="브라우저 인터랙티브" />
          </div>
        </div>
      </header>
      )}

      {/* 검색 + 과목 필터 */}
      {!compact && (
      <section className="mb-8 rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          >
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="찾고 싶은 시뮬레이터를 입력하세요 (예: 옴의 법칙, 변압기, 공진)"
            aria-label="시뮬레이터 검색"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 py-3 pl-11 pr-10 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {SUBJECT_FILTERS.map((s) => (
            <Chip
              key={s}
              active={subjectScope === s}
              onClick={() => setSubjectScope(s)}
            >
              {s === "all" ? "전체 과목" : s}
            </Chip>
          ))}
          <span className="ml-auto text-xs font-medium text-zinc-500">
            {isSearching ? (
              <>
                <span className="font-semibold text-indigo-600">
                  &ldquo;{trimmedQuery}&rdquo;
                </span>{" "}
                검색 결과 {totalInScope}개
              </>
            ) : (
              <>현재 조건 {totalInScope}개</>
            )}
          </span>
        </div>
      </section>
      )}

      {groups.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-14 text-center">
          <p className="text-5xl">🧐</p>
          <p className="mt-4 text-base font-semibold text-zinc-700">
            {isSearching
              ? "검색 결과가 없어요"
              : "조건에 맞는 시뮬레이터가 없어요"}
          </p>
          <p className="mt-1.5 text-sm text-zinc-500">
            {isSearching
              ? "다른 키워드로 검색하거나 과목 필터를 바꿔보세요."
              : "다른 과목을 선택해 보세요."}
          </p>
          {isSearching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-700"
            >
              검색 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <ChapterSection
              key={`${g.subject}-${g.chapter}`}
              subject={g.subject}
              chapter={g.chapter}
              items={g.items}
              defaultOpen={!isSearching}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
      <p className="text-base font-bold leading-none text-white">{value}</p>
      <p className="mt-1 text-[11px] tracking-wide text-zinc-400">{label}</p>
    </div>
  );
}

function ChapterSection({
  subject,
  chapter,
  items,
  defaultOpen,
  compact,
}: {
  subject: Subject;
  chapter: string;
  items: Simulator[];
  defaultOpen: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const style = SUBJECT_STYLE[subject];
  const panelId = `chapter-${subject}-${chapter}`.replace(/\s+/g, "-");
  const availableCount = items.filter((s) => s.status === "available").length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((availableCount / total) * 100);

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
      <h3 className="m-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-zinc-50/80 sm:px-5"
        >
          <span
            aria-hidden
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] text-zinc-500 transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          {!compact && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.chip}`}
            >
              {style.emoji} {subject}
            </span>
          )}
          <span className="text-base font-bold text-zinc-900 sm:text-lg">
            {chapter}
          </span>
          {compact && (
            <span className="text-xs font-semibold text-zinc-500">
              {total}개
            </span>
          )}
          {compact ? (
            <div
              className="ml-auto flex shrink-0 items-center gap-2"
              title={`이용 가능 ${availableCount} / 전체 ${total} (${pct}%)`}
              aria-label={`이용률 ${pct}%`}
            >
              <div
                className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-100"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct === 100
                      ? "bg-emerald-500"
                      : pct === 0
                        ? "bg-zinc-300"
                        : "bg-gradient-to-r from-emerald-400 to-emerald-600"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="tabular-nums text-[11px] font-semibold">
                <span className="text-emerald-700">{availableCount}</span>
                <span className="text-zinc-400">/{total}</span>
              </span>
            </div>
          ) : (
            <span className="ml-auto shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
              {total}
            </span>
          )}
        </button>
      </h3>

      {open && (
        <div
          id={panelId}
          className="grid grid-cols-1 gap-3 border-t border-zinc-100 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3"
        >
          {items.map((sim) => (
            <SimCard key={sim.id} sim={sim} style={style} />
          ))}
        </div>
      )}
    </section>
  );
}

function SimCard({
  sim,
  style,
}: {
  sim: Simulator;
  style: (typeof SUBJECT_STYLE)[Subject];
}) {
  const available = sim.status === "available";
  return (
    <Link
      href={`/simulator/${sim.id}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white p-4 ring-1 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-lg ${style.ring}`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${style.bar}`}
      />
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${style.soft} to-white text-2xl ring-1 ${style.ring}`}
        >
          {sim.emoji}
        </span>
        {available ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            이용가능
          </span>
        ) : (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">
            준비중
          </span>
        )}
      </div>
      <h4 className="mt-3.5 text-sm font-bold leading-snug text-zinc-900 transition-colors group-hover:text-indigo-700">
        {sim.title}
      </h4>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-5 text-zinc-500">
        {sim.description}
      </p>
      <span
        className={`mt-3.5 inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5 ${style.accent}`}
      >
        {available ? "체험하기" : "공식 보기"}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

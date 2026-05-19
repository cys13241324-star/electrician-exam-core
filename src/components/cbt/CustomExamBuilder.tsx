"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { curriculum } from "@/lib/cbt/curriculum";
import { buildCustomId, countCustom } from "@/lib/cbt/mockData";
import type { Difficulty, Frequency } from "@/lib/cbt/types";

type FreqOpt = Frequency | "any";
type DiffOpt = Difficulty | "any";

const FREQ_OPTS: { value: FreqOpt; label: string }[] = [
  { value: "any", label: "전체" },
  { value: "high", label: "빈출" },
  { value: "medium", label: "보통" },
  { value: "low", label: "저빈출" },
];

const DIFF_OPTS: { value: DiffOpt; label: string }[] = [
  { value: "any", label: "전체" },
  { value: "easy", label: "쉬움" },
  { value: "medium", label: "보통" },
  { value: "hard", label: "어려움" },
];

const COUNT_PRESETS = [10, 20, 40, 0]; // 0 = 가능한 전부
const MINUTE_PRESETS = [10, 30, 60];

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition ${
            value === o.value
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-zinc-100 py-5 first:border-t-0 first:pt-0">
      <p className="mb-2.5 text-sm font-bold text-zinc-900">{label}</p>
      {children}
    </div>
  );
}

export default function CustomExamBuilder() {
  const router = useRouter();
  const allSubjects = curriculum.map((s) => ({ id: s.id, label: s.subject }));

  const [subjects, setSubjects] = useState<string[]>(
    allSubjects.map((s) => s.id),
  );
  const [freq, setFreq] = useState<FreqOpt>("any");
  const [diff, setDiff] = useState<DiffOpt>("any");
  const [count, setCount] = useState<number>(20);
  const [minutes, setMinutes] = useState<number>(30);

  const filter = useMemo(
    () => ({
      subjects,
      frequency: freq === "any" ? undefined : freq,
      difficulty: diff === "any" ? undefined : diff,
      count,
      minutes,
    }),
    [subjects, freq, diff, count, minutes],
  );

  const available = useMemo(
    () => (subjects.length ? countCustom(filter) : 0),
    [filter, subjects.length],
  );
  const selected =
    count === 0 ? available : Math.min(count, available);
  const canStart = subjects.length > 0 && available > 0;

  function toggleSubject(id: string) {
    setSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function start() {
    if (!canStart) return;
    router.push(`/cbt/${buildCustomId(filter)}/take`);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* 설정 패널 */}
      <section className="rounded-2xl border border-zinc-200 bg-white px-6 py-5 shadow-sm sm:px-8">
        <Field label="과목 (1개 이상)">
          <div className="flex flex-wrap gap-2">
            {allSubjects.map((s) => {
              const on = subjects.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSubject(s.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    on
                      ? "border-violet-300 bg-violet-50 text-violet-700"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {s.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="빈출도">
          <Segmented options={FREQ_OPTS} value={freq} onChange={setFreq} />
        </Field>

        <Field label="난이도">
          <Segmented options={DIFF_OPTS} value={diff} onChange={setDiff} />
        </Field>

        <Field label="문항 수">
          <Segmented
            options={COUNT_PRESETS.map((c) => ({
              value: String(c),
              label: c === 0 ? "가능한 전부" : `${c}문항`,
            }))}
            value={String(count)}
            onChange={(v) => setCount(Number(v))}
          />
        </Field>

        <Field label="제한 시간">
          <div className="flex items-center gap-3">
            <Segmented
              options={MINUTE_PRESETS.map((m) => ({
                value: String(m),
                label: `${m}분`,
              }))}
              value={String(minutes)}
              onChange={(v) => setMinutes(Number(v))}
            />
            <span className="text-sm text-zinc-400">또는</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={180}
                value={minutes}
                onChange={(e) =>
                  setMinutes(
                    Math.min(180, Math.max(1, Number(e.target.value) || 1)),
                  )
                }
                className="w-20 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-900 focus:border-violet-400 focus:outline-none"
              />
              <span className="text-sm text-zinc-500">분</span>
            </div>
          </div>
        </Field>
      </section>

      {/* 요약 + 시작 */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
          <p className="text-sm font-bold text-violet-800">구성 요약</p>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">과목</dt>
              <dd className="text-right font-semibold text-zinc-900">
                {subjects.length
                  ? subjects
                      .map(
                        (id) =>
                          allSubjects.find((s) => s.id === id)?.label ?? id,
                      )
                      .join(", ")
                  : "선택 안 됨"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">빈출도 / 난이도</dt>
              <dd className="font-semibold text-zinc-900">
                {FREQ_OPTS.find((o) => o.value === freq)?.label} /{" "}
                {DIFF_OPTS.find((o) => o.value === diff)?.label}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">문항</dt>
              <dd className="font-semibold text-zinc-900">
                {available > 0 ? (
                  <>
                    {selected}문항{" "}
                    <span className="text-zinc-400">
                      (가능 {available})
                    </span>
                  </>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">제한 시간</dt>
              <dd className="font-semibold text-zinc-900">{minutes}분</dd>
            </div>
          </dl>

          {available === 0 && subjects.length > 0 && (
            <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
              조건에 맞는 문항이 없습니다. 빈출도·난이도를 완화해 보세요.
            </p>
          )}
          {subjects.length === 0 && (
            <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
              과목을 1개 이상 선택하세요.
            </p>
          )}

          <button
            type="button"
            onClick={start}
            disabled={!canStart}
            className="mt-5 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            이 조건으로 시험 시작
          </button>
          <p className="mt-2 text-center text-[11px] text-zinc-400">
            현재 문제 풀은 데모용 60문항입니다.
          </p>
        </div>
      </aside>
    </div>
  );
}

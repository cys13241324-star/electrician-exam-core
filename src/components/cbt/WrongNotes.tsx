"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readAttempts } from "@/lib/cbt/stats";
import { mockExams } from "@/lib/cbt/mockData";
import type { Question, Subject } from "@/lib/cbt/types";

type WrongItem = {
  attemptId: string;
  examTitle: string;
  examId: string;
  qIndex: number;
  question: Question;
  userAnswer: number | null;
  date: number;
};

const SUBJECTS: (Subject | "전체")[] = ["전체", "전기이론", "전기기기", "전기설비"];

export default function WrongNotes() {
  const [items, setItems] = useState<WrongItem[] | null>(null);
  const [filter, setFilter] = useState<Subject | "전체">("전체");
  const [reveal, setReveal] = useState<Set<string>>(new Set());

  useEffect(() => {
    const attempts = readAttempts().filter((a) => a.submittedAt !== null);
    const out: WrongItem[] = [];
    for (const a of attempts) {
      const exam = mockExams.find((e) => e.id === a.examId);
      if (!exam) continue;
      exam.questions.forEach((q, i) => {
        const ua = a.answers[i];
        if (ua === null) return;
        if (ua !== q.answer) {
          out.push({
            attemptId: `${a.examId}-${a.submittedAt}`,
            examTitle: exam.title,
            examId: a.examId,
            qIndex: i,
            question: q,
            userAnswer: ua,
            date: a.submittedAt ?? 0,
          });
        }
      });
    }
    out.sort((a, b) => b.date - a.date);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage attempts 에서 오답만 추출
    setItems(out);
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (filter === "전체") return items;
    return items.filter((it) => it.question.subject === filter);
  }, [items, filter]);

  const subjectCount = useMemo(() => {
    if (!items) return {} as Record<string, number>;
    const map: Record<string, number> = {};
    for (const it of items) {
      map[it.question.subject] = (map[it.question.subject] ?? 0) + 1;
    }
    return map;
  }, [items]);

  if (items === null) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
        오답 기록을 불러오는 중...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
        <div className="text-5xl">📝</div>
        <h2 className="mt-4 text-lg font-bold text-zinc-900">
          아직 오답 기록이 없어요
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          모의고사를 응시한 뒤 틀린 문제가 자동으로 이곳에 모입니다.
        </p>
        <Link
          href="/cbt/exams"
          className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          첫 모의고사 응시하기 →
        </Link>
      </div>
    );
  }

  function toggleReveal(key: string) {
    setReveal((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const allKeys = filtered.map((it) => `${it.attemptId}-${it.qIndex}`);
  const allRevealed =
    allKeys.length > 0 && allKeys.every((k) => reveal.has(k));

  function toggleAll() {
    setReveal((prev) => {
      if (allRevealed) {
        const next = new Set(prev);
        allKeys.forEach((k) => next.delete(k));
        return next;
      }
      return new Set([...prev, ...allKeys]);
    });
  }

  return (
    <div>
      {/* Stats + filter */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold text-rose-700">
            총 오답 {items.length}문항
          </p>
          <p className="mt-1 text-sm text-rose-900">
            틀린 토픽을 우선 보강하면 점수가 가장 빠르게 오릅니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUBJECTS.map((s) => {
            const count =
              s === "전체" ? items.length : (subjectCount[s] ?? 0);
            const active = s === filter;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-rose-600 bg-rose-600 text-white"
                    : "border-rose-200 bg-white text-rose-700 hover:bg-rose-100"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* List controls */}
      {filtered.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-zinc-900">
              {filtered.length}
            </span>
            문항
          </p>
          <button
            type="button"
            onClick={toggleAll}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {allRevealed ? "정답·해설 모두 접기" : "정답·해설 모두 펼치기"}
          </button>
        </div>
      )}

      {/* List */}
      <ul className="space-y-4">
        {filtered.map((it) => {
          const key = `${it.attemptId}-${it.qIndex}`;
          const isOpen = reveal.has(key);
          return (
            <li
              key={key}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="flex items-start gap-4 p-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100 text-sm font-bold text-rose-700">
                  {String(it.qIndex + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-semibold text-zinc-700">
                      [{it.question.subject}] {it.question.topic}
                    </span>
                    <span className="text-zinc-400">·</span>
                    <span className="text-zinc-500">{it.examTitle}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-900">
                    {it.question.questionText}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="rounded-md bg-rose-100 px-2 py-0.5 font-semibold text-rose-700">
                      내 답: {it.userAnswer}번
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleReveal(key)}
                      className="rounded-md border border-zinc-300 bg-white px-2.5 py-0.5 font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      {isOpen ? "정답 숨기기" : "정답 보기"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 rounded-lg bg-emerald-50 p-4">
                      <p className="text-xs font-bold text-emerald-700">
                        정답: {it.question.answer}번
                      </p>
                      <p className="mt-1 text-xs text-emerald-900">
                        {it.question.choices[it.question.answer - 1]}
                      </p>
                      <hr className="my-3 border-emerald-200" />
                      <p className="whitespace-pre-line text-xs leading-5 text-emerald-900">
                        {it.question.explanation}
                      </p>
                    </div>
                  )}
                </div>
                <Link
                  href={`/cbt/${it.examId}/review`}
                  className="hidden flex-shrink-0 self-start rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 sm:inline-block"
                >
                  전체 해설
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
          이 필터에 해당하는 오답이 없습니다.
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** 연도별 회차 — 2019 ~ 2026, 각 1~4회 */
const YEARS: { year: number; rounds: number[] }[] = [
  { year: 2026, rounds: [1, 2, 3, 4] },
  { year: 2025, rounds: [1, 2, 3, 4] },
  { year: 2024, rounds: [1, 2, 3, 4] },
  { year: 2023, rounds: [1, 2, 3, 4] },
  { year: 2022, rounds: [1, 2, 3, 4] },
  { year: 2021, rounds: [1, 2, 3, 4] },
  { year: 2020, rounds: [1, 2, 3, 4] },
  { year: 2019, rounds: [1, 2, 3, 4] },
];

export default function LecturesPage() {
  // 기본으로 최신 연도 하나 펼침
  const [open, setOpen] = useState<number | null>(YEARS[0].year);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* HERO */}
      <section className="border-b border-zinc-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:py-12">
          <nav className="mb-5 text-xs">
            <Link
              href="/v3"
              className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
            >
              ← 독끝 필기로
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-black text-white shadow-sm"
            >
              B
            </span>
            <p className="text-[11px] font-bold tracking-[0.22em] text-emerald-600">
              PART B · 실전 학습
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            기출 해설 강의
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            연도를 누르면 회차가 펼쳐져요. 회차를 고르면 그 시험의 전 문항 풀이
            해설로 이동합니다.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <ul className="space-y-3">
          {YEARS.map(({ year, rounds }) => {
            const isOpen = open === year;
            return (
              <li
                key={year}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                {/* 연도 헤더 — 토글 */}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : year)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 sm:px-6"
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-black shadow-sm transition ${
                        isOpen
                          ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {String(year).slice(2)}
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-zinc-900">
                        {year}년
                      </span>
                      <span className="block text-xs text-zinc-400">
                        {rounds.length}개 회차
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`text-zinc-400 transition ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {/* 회차 — 펼침 */}
                {isOpen && (
                  <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-4 sm:px-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {rounds.map((round) => (
                        <Link
                          key={round}
                          href={`/lectures/${year}/${round}`}
                          className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
                        >
                          {round}회
                          <span
                            aria-hidden
                            className="text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-500"
                          >
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>

      <Footer />
    </div>
  );
}

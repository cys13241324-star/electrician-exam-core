import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { presetCards } from "@/lib/flashcards/data";
import { ALL_SUBJECTS, CHAPTER_DEFS } from "@/lib/flashcards/chapters";
import { SUBJECT_THEME, countBySubject } from "@/lib/v3/theme";
import WhyBox from "@/components/v3/WhyBox";

export const metadata: Metadata = {
  title: "플립 암기카드 — 전체보기·과목별 보기",
  description:
    "전체 카드를 회독하거나 과목별로 좁혀 학습하고, 즐겨찾기·다시 보는 카드로 약점만 다집니다.",
};

export default function V3CardsHubPage() {
  const total = presetCards.length;
  const counts = countBySubject();

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* ============ HERO (PART A) ============ */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
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
              className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-black text-white shadow-sm"
            >
              A
            </span>
            <p className="text-[11px] font-bold tracking-[0.22em] text-violet-600">
              PART A · 이론 보조학습
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            플립 암기카드
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            핵심만 농축한{" "}
            <strong className="font-semibold text-zinc-800">{total}장</strong>의
            카드. 전체로 한 번에 회독하거나 과목별로 좁혀 익히고, 즐겨찾기·다시
            보는 카드로 약점만 골라 다지세요.
          </p>

          {/* 왜 좋은지 — 장점 */}
          <WhyBox
            tone="amber"
            title="왜 플립 암기카드가 좋을까요?"
            points={[
              "답을 떠올렸다 뒤집어 확인하는 ‘능동 인출’ — 다시 읽기보다 기억에 오래 남아요.",
              "한 장이 짧아 자투리 시간에 빠르게 회독, 헷갈리는 카드만 다시 보기 가능.",
              "빈출 핵심만 농축해 필기 합격에 직접 닿는 키워드를 굳혀요.",
            ]}
          />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* ============ 전체보기 / 과목별 보기 ============ */}
        <section>
          <header>
            <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] text-violet-700 ring-1 ring-violet-100">
              HOW TO VIEW
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              어떻게 볼까요?
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
              전체를 통째로 돌리거나, 과목 하나로 좁혀 회독하세요. 즐겨찾기는 어느
              쪽에서 눌러도 그대로 모입니다.
            </p>
          </header>

          {/* 전체보기 — 큰 카드 */}
          <Link
            href="/v3/cards/all"
            className="group relative mt-7 flex items-center gap-5 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xl sm:p-8"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
            />
            <span
              aria-hidden
              className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-3xl shadow-md transition group-hover:scale-110 sm:h-20 sm:w-20"
            >
              🃏
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                전체보기
              </p>
              <h3 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                전체 {total}장 한 번에 회독
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                과목 칩으로 범위를 좁히고, 셔플·검색·랜덤 출제까지. 별 카드와 다시
                보기도 여기서 모두 켤 수 있어요.
              </p>
            </div>
            <span
              aria-hidden
              className="shrink-0 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-500"
            >
              →
            </span>
          </Link>

          {/* 과목별 보기 — 3 카드 */}
          <p className="mt-8 mb-3 text-sm font-bold text-zinc-700">
            과목별 보기
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {ALL_SUBJECTS.map((subject) => {
              const t = SUBJECT_THEME[subject];
              const chapters = CHAPTER_DEFS[subject].length;
              return (
                <Link
                  key={subject}
                  href={`/v3/${subject}/cards`}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ${t.ring} transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.gradient}`}
                  />
                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden
                      className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${t.gradient} text-2xl text-white shadow-md transition group-hover:scale-110`}
                    >
                      {t.emoji}
                    </span>
                    <span className="rounded-full bg-zinc-50 px-2.5 py-1 text-[10px] font-bold text-zinc-500 ring-1 ring-zinc-100">
                      {counts[subject]}장 · {chapters}챕터
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900">
                    {subject}
                  </h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600">
                    {t.hook}
                  </p>
                  <span
                    className={`mt-4 inline-flex items-center gap-1 text-sm font-bold ${t.accent} transition group-hover:gap-1.5`}
                  >
                    이 과목 카드 →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ============ 밑에 — 즐겨찾기 / 다시 보는 카드 ============ */}
        <section className="mt-16">
          <header>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] text-zinc-600 ring-1 ring-zinc-200">
              FOCUS
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              모아서 다시 보기
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
              별표로 모은 카드와, 잊을 때쯤 다시 떠오르는 ‘다시 보는 카드’만 골라
              빠르게 약점을 메우세요.
            </p>
          </header>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Link
              href="/v3/cards/starred"
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500"
              />
              <span
                aria-hidden
                className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-2xl shadow-md transition group-hover:scale-110"
              >
                ⭐
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900">
                즐겨찾기 별 카드
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-600">
                전체·과목별 어디서든 별표한 카드를 한곳에 모아 봐요. 시험 직전
                빠른 복습 덱으로 딱이에요.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-amber-600 transition group-hover:gap-1.5">
                별 카드 모아보기 →
              </span>
            </Link>

            <Link
              href="/v3/cards/review"
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-xl"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"
              />
              <span
                aria-hidden
                className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-2xl shadow-md transition group-hover:scale-110"
              >
                🔁
              </span>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900">
                다시 보는 카드
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-600">
                ‘모르겠음’ 표시했거나 24시간 이상 지난 카드만 모아 다시 만나요.
                망각 곡선이 가장 깊을 때 메우는 게 효율적이에요.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-rose-600 transition group-hover:gap-1.5">
                다시 보기 시작 →
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

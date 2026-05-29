import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import { SUBJECT_THEME, countBySubject } from "@/lib/v4/theme";

export const metadata: Metadata = {
  title: "내 과목 — 진단 결과로 추천받기",
  description:
    "STEP 1 진단 결과에 따라 강점 과목은 빠르게, 약점 과목은 깊게.",
};

export default function v4SubjectsPage() {
  const cardCounts = countBySubject();

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        {/* breadcrumb / back */}
        <nav className="mb-6 text-xs">
          <Link
            href="/v4"
            className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← 합격 시나리오로
          </Link>
        </nav>

        {/* 스토리텔링 도입부 */}
        <header className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-violet-600">
            STEP 02 · 내 과목
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            진단지를 받아 들었어요.
            <br />
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              이제 어디부터 채울지가 보입니다.
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            과목마다 강도가 달라요. 잘하는 과목은 회독으로 빠르게, 약한 과목은
            카드와 시뮬로 깊게. 당신의 진단 결과에 맞춰 학습 강도를 다르게
            제안드려요.
          </p>
        </header>

        {/* 진단 요약 카드 */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                당신의 진단 리포트 · 샘플
              </p>
              <p className="mt-0.5 text-lg font-bold text-zinc-900">
                예상 점수 · 58점 / 100
              </p>
            </div>
            <Link
              href="/cbt"
              className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800"
            >
              다시 진단 →
            </Link>
          </div>
          <div className="grid gap-4 px-6 py-6 sm:grid-cols-3">
            {ALL_SUBJECTS.map((s) => {
              const t = SUBJECT_THEME[s];
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800">{s}</span>
                    <span className="font-bold text-zinc-900">
                      {t.mockScore}점
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${t.gradient}`}
                      style={{ width: `${t.mockScore}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-amber-700">
                    Weak · {t.mockWeak}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 과목 3카드 */}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold text-zinc-900">
              과목을 선택해주세요
            </h2>
            <p className="text-xs text-zinc-500">
              과목 안에서 카드·CBT·오디오·시뮬을 만날 수 있어요
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {ALL_SUBJECTS.map((subject) => {
              const t = SUBJECT_THEME[subject];
              return (
                <Link
                  key={subject}
                  href={`/v4/${subject}`}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ${t.ring} transition hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div
                    className={`relative h-28 bg-gradient-to-br ${t.gradient} p-6 text-white`}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 40%)",
                      }}
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] opacity-80">
                          SUBJECT
                        </p>
                        <h3 className="mt-1 text-2xl font-bold">{subject}</h3>
                      </div>
                      <span className="text-4xl">{t.emoji}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.badge}`}
                      >
                        {t.short}
                      </span>
                      <span className="text-[11px] font-bold text-zinc-400">
                        진단 결과: {t.mockScore}점
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-snug text-zinc-900">
                      {t.hook}
                    </p>
                    <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Weak Spot
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-amber-900">
                        {t.mockWeak}
                      </p>
                    </div>

                    <div className="mt-5 flex items-end justify-between border-t border-zinc-100 pt-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-400">
                          수록 카드
                        </p>
                        <p className="text-xl font-bold text-zinc-900">
                          {cardCounts[subject]}장
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-bold ${t.accent} transition group-hover:translate-x-1`}
                      >
                        시작하기 →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 다음 단계 안내 */}
        <section className="mt-16 rounded-3xl bg-zinc-900 px-7 py-10 text-white sm:px-10">
          <p className="text-xs font-bold tracking-[0.18em] text-amber-300">
            NEXT · STEP 03
          </p>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
            한 챕터만 채워도, 점수가 따라옵니다
          </h3>
          <p className="mt-3 max-w-xl text-sm text-zinc-300">
            과목 하나 골라 30분만 채워보세요. STEP 3에서 같은 문제를 다시 풀어
            점수 변화를 직접 확인할 수 있어요.
          </p>
          <Link
            href="/v4#step3"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-900 hover:-translate-y-0.5 hover:shadow-xl"
          >
            STEP 03 미리 보기 →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

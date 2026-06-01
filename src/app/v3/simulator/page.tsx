import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { simulators } from "@/lib/simulators";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import { SUBJECT_THEME } from "@/lib/v3/theme";
import WhyBox from "@/components/v3/WhyBox";

export const metadata: Metadata = {
  title: "이론 시뮬레이터 — 과목별로 바로 열기",
  description:
    "값을 직접 움직여 원리를 체득하는 인터랙티브 시뮬레이터. 과목을 골라 바로 들어가세요.",
};

export default function V3SimulatorPage() {
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
            이론 시뮬레이터
          </h1>

          {/* 왜 좋은지 — 장점 */}
          <WhyBox
            tone="sky"
            title="왜 시뮬레이터로 학습하면 좋을까요?"
            points={[
              "값을 움직이면 그래프가 즉시 반응 — 외우지 않아도 공식의 의미가 손에 잡혀요.",
              "글로 읽을 땐 막연하던 RLC 공진·3상·변압기가 ‘보이는’ 순간 이해로 바뀝니다.",
              "한 번 체득한 직관은 기출 변형 문제에도 그대로 통해요.",
            ]}
          />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <header>
          <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold tracking-[0.2em] text-sky-700 ring-1 ring-sky-100">
            BY SUBJECT
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            과목을 골라 바로 열기
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
            과목을 누르면 그 과목의 시뮬레이터 목록으로 바로 이동해요. 필요한
            것만 골라 만져보세요.
          </p>
        </header>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {ALL_SUBJECTS.map((subject) => {
            const t = SUBJECT_THEME[subject];
            const count = simulators.filter((s) => s.subject === subject).length;
            return (
              <Link
                key={subject}
                href={`/simulator/by-subject/${subject}`}
                className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ${t.ring} transition hover:-translate-y-1 hover:shadow-2xl`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.gradient}`}
                />
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden
                    className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${t.gradient} text-3xl text-white shadow-md transition group-hover:scale-110`}
                  >
                    {t.emoji}
                  </span>
                  <span className="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-bold text-zinc-500 ring-1 ring-zinc-100">
                    {count}개
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-zinc-900">
                  {subject}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600">
                  {t.hook}
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1 text-sm font-bold ${t.accent} transition group-hover:gap-1.5`}
                >
                  이 과목 시뮬 →
                </span>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

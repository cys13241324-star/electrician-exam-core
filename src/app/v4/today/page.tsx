import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecommendCard from "@/components/v4/RecommendCard";

export const metadata: Metadata = {
  title: "오늘의 학습 — 어디서부터 이어갈까요",
  description:
    "어제 멈춘 곳, 약점 카드, 새로 시작할 챕터. 매일의 한 걸음을 우리가 추천합니다.",
};

export default function v4TodayPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        {/* breadcrumb */}
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
          <p className="text-xs font-bold tracking-[0.22em] text-emerald-600">
            STEP 05 · 오늘의 학습
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            여기서부터는, 매일의 누적입니다.
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              오늘 10분만, 시작해볼까요?
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            합격은 하루의 폭주가 아니라, 매일의 작은 점들이 모여 만들어져요.
            어제 멈춘 곳, 오답이 쌓인 카드, 아직 안 만난 챕터 — 우리가 골라 두었어요.
          </p>
        </header>

        {/* 오늘의 위젯 */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                오늘의 목표 · D-23
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-900">
                CBT 1회 + 카드 20장
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
              누적 12일 · 🔥
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/70 ring-1 ring-emerald-100">
            <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          </div>
          <p className="mt-2 text-xs text-zinc-600">오늘 40% 진행 중</p>
        </section>

        {/* 추천 3카드 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-zinc-900">
            지금 시작할 수 있는 3가지
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            어디부터 손대도, 학습 기록은 자동으로 누적돼요.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <RecommendCard
              tag="이어서 학습"
              tagClass="bg-sky-100 text-sky-700"
              gradient="from-sky-500 to-blue-600"
              title="전기이론 · 직류회로"
              hint="어제 멈춘 §3 부터 자동 재생"
              cta="이어서 풀기"
              href="/v4/전기이론/cards"
            />
            <RecommendCard
              tag="약점 보강 · 10분"
              tagClass="bg-amber-100 text-amber-700"
              gradient="from-amber-500 to-orange-500"
              title="변압기 · 권수비/효율"
              hint="오답률 높은 카드 12장만"
              cta="집중 풀기"
              href="/v4/전기기기/cards"
            />
            <RecommendCard
              tag="새로 시작"
              tagClass="bg-emerald-100 text-emerald-700"
              gradient="from-emerald-500 to-teal-500"
              title="전기설비 · 접지"
              hint="아직 안 본 챕터 · 32장"
              cta="처음부터"
              href="/v4/전기설비/cards"
            />
          </div>
        </section>

        {/* 마지막 한 마디 */}
        <section className="mt-16 rounded-3xl border border-zinc-200 bg-white p-8 text-center sm:p-10">
          <p className="text-xs font-bold tracking-[0.18em] text-emerald-600">
            ONE MORE THING
          </p>
          <h3 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            “오늘 10분”이 모이면, 시험장에서 만나요.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600">
            완벽한 하루보다, 끊기지 않는 하루가 합격을 만들어요. 오늘 한 가지만
            골라 시작해보세요.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CbtHub from "@/components/cbt/CbtHub";
import CustomExamBuilder from "@/components/cbt/CustomExamBuilder";

export const metadata: Metadata = {
  title: "마무리 학습 · 점수 코칭 — 독끝 전기기능사 필기",
  description:
    "회차별·과목별·빈출도순 콘텐츠는 그대로, 학습 대시보드와 나만의 시험 빌더로 약점을 찍어 점수를 굳혀요.",
};

export default function v4CbtPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      {/* 페이지 헤더 — v4 톤 (화이트 미니멀) */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
          <nav className="mb-5 text-xs">
            <Link
              href="/v4"
              className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
            >
              ← 독끝 필기로
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-xs font-black text-white shadow-sm"
            >
              B
            </span>
            <p className="text-[11px] font-bold tracking-[0.22em] text-rose-600">
              STEP B · 마무리 학습
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            점수, 코칭부터 받아볼까요
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            이론 학습은 가볍게 하셨어요. 이제{" "}
            <strong className="font-semibold text-zinc-800">
              약점을 찍어 점수를 굳히는 단계
            </strong>
            예요. 오늘까지의 학습 추이를 먼저 보고, 필요하면 ‘나만의 시험’으로
            좁혀 풀어요.
          </p>

          {/* 페이지 내 빠른 이동 — 두 영역 안내 */}
          <div className="mt-7 flex flex-wrap gap-2 text-xs">
            <a
              href="#coach"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span aria-hidden>📈</span>
              학습 코칭 대시보드
            </a>
            <a
              href="#customize"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span aria-hidden>🎛️</span>
              나만의 시험 만들기
            </a>
          </div>
        </div>
      </section>

      {/* 학습 코칭 영역 — CbtHub 임베드
          · 4-카드: 회차별 / 과목별(=study) / 오답노트 / 나만의 시험
          · 대시보드 스트립: 평균 정답률·응시 회차·누적 학습·취약 영역·D-Day
          · 학습 곡선 + 최근 응시 */}
      <section id="coach" className="scroll-mt-20">
        <CbtHub />
      </section>

      {/* 영역 분리 chip */}
      <div className="mx-auto max-w-5xl px-6">
        <div aria-hidden className="flex items-center gap-4">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700 shadow-sm">
            CUSTOMIZE
          </span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
      </div>

      {/* 커스터마이즈 영역 — CustomExamBuilder 임베드 */}
      <section
        id="customize"
        className="scroll-mt-20 border-y border-zinc-200 bg-white"
      >
        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <header className="mb-8 max-w-2xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-violet-700 ring-1 ring-violet-100">
              <span aria-hidden>🎛️</span>
              MAKE YOUR OWN
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              나만의 시험으로 약점만 좁혀 풀기
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
              과목·빈출도·난이도·문항 수·제한 시간을 직접 골라 시험을 구성해요.
              위 대시보드의 취약 토픽이 보이면, 그 과목의{" "}
              <strong className="font-semibold text-zinc-800">
                빈출만 20문항 · 30분
              </strong>
              으로 좁히는 식이에요.
            </p>
          </header>

          <CustomExamBuilder />

          <p className="mt-6 text-center text-[11px] text-zinc-500">
            💡 시험은 새 탭/페이지에서 시작돼요. 끝내면 결과·오답이 자동으로
            대시보드에 누적돼요.
          </p>
        </div>
      </section>

      {/* 다음 단계 안내 */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center sm:p-10">
          <p className="text-[11px] font-bold tracking-[0.22em] text-zinc-500">
            ONE MORE THING
          </p>
          <h3 className="mt-3 text-xl font-bold text-zinc-900 sm:text-2xl">
            틀린 문제가 모이면, 거기서 다음 회차가 시작돼요.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
            오답은 자동으로 노트에 쌓여요. 다음 시험은 그 노트의 빈출 토픽만 골라
            구성해 보세요. 점수가 합격선 위에서 흔들리지 않게 굳혀집니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/cbt/wrong-notes"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span aria-hidden>🔁</span>
              오답 노트 열기
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/v4"
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              독끝 필기 메인으로
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

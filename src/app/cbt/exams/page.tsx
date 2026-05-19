import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubTabs from "@/components/cbt/SubTabs";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";
import RoundExamsByYear from "@/components/cbt/RoundExamsByYear";
import CbtGuide from "@/components/cbt/CbtGuide";
import { TARGET_YEAR_RANGE } from "@/lib/cbt/curriculum";

export const metadata: Metadata = {
  title: "회차별 모의고사",
  description:
    "전기기능사 CBT 모의고사 — 연도별 회차로 정리. 실제 시험 환경 그대로, 60문항 60분, 자동 채점과 과목별 분석.",
};

// Stripe-inspired 그라데이션 메시(차용 아닌 재해석): 크림→셔벗→라벤더→인디고→루비
const MESH_BG =
  "radial-gradient(38% 78% at 8% 18%, #f5e9d4 0%, transparent 60%)," +
  "radial-gradient(36% 72% at 30% 6%, #f7b27a 0%, transparent 58%)," +
  "radial-gradient(42% 86% at 52% 16%, #c3b8fb 0%, transparent 60%)," +
  "radial-gradient(46% 92% at 73% 4%, #533afd 0%, transparent 56%)," +
  "radial-gradient(38% 78% at 93% 18%, #f96bee 0%, transparent 60%)";

export default function CbtExamsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SubTabs active="exams" />

      {/* Gradient-mesh hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
          style={{ background: MESH_BG, filter: "blur(44px)", opacity: 0.85 }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[260px] h-[200px] bg-gradient-to-b from-transparent to-white"
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#533afd]">
            회차별 모의고사
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-light leading-[1.06] tracking-[-1.2px] text-[#0d253d] sm:text-5xl">
            연도별로 골라 푸는 실전 모의고사
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#64748d]">
            대상 연도{" "}
            <strong className="font-medium text-[#0d253d] tabular-nums">
              {TARGET_YEAR_RANGE}
            </strong>{" "}
            · 연도를 펼쳐 회차를 선택하세요. 실제 시험과 동일한 60문항·60분
            환경으로 응시하고 자동 채점·과목별 분석을 받아봅니다.
          </p>

          {/* Spec strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "문항 수", value: "60문항" },
              { label: "제한 시간", value: "60분" },
              { label: "합격 기준", value: "36문항 이상" },
              { label: "과목 과락", value: "없음" },
            ].map((spec) => (
              <div
                key={spec.label}
                className="rounded-2xl border border-[#e3e8ee] bg-white/80 px-5 py-4 shadow-[0_1px_2px_rgba(13,37,61,0.04)] backdrop-blur-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748d]">
                  {spec.label}
                </p>
                <p className="mt-1 text-xl font-light tracking-[-0.4px] text-[#0d253d] tabular-nums">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#e3e8ee] bg-[#f6f9fc] p-4 text-[13px] leading-relaxed text-[#273951]">
          <span className="text-base leading-none">⚠️</span>
          <p>
            <strong className="font-semibold text-[#0d253d]">응시 안내</strong>{" "}
            · 시험 시작 후에는 일시정지가 불가합니다. 제한 시간이 끝나면 작성된
            답안이 자동으로 제출됩니다. 다시 풀려면 회차 카드의{" "}
            <strong className="font-semibold text-[#0d253d]">초기화</strong>를
            누르세요.
          </p>
        </div>

        <div className="mb-8">
          <CbtGuide />
        </div>

        <RoundExamsByYear />
      </main>

      <Footer />
      <TextbookFloatingPopup />
    </div>
  );
}

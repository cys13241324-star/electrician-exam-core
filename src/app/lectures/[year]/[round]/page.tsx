import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; round: string }>;
}): Promise<Metadata> {
  const { year, round } = await params;
  return {
    title: `${year}년 ${round}회 기출 해설`,
    description: `${year}년 ${round}회 전기기능사 필기 기출 전 문항 풀이 해설.`,
  };
}

export default async function LectureRoundPage({
  params,
}: {
  params: Promise<{ year: string; round: string }>;
}) {
  const { year, round } = await params;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        <nav className="mb-6 text-xs">
          <Link
            href="/lectures"
            className="inline-flex items-center gap-1 font-semibold text-zinc-500 hover:text-zinc-900"
          >
            ← 기출 해설 강의
          </Link>
        </nav>

        <header className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-emerald-600">
            기출 해설 · {year}년 {round}회
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {year}년 {round}회 전 문항 풀이
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            이 회차의 문항별 해설 영상이 여기에 들어옵니다. 단계별 풀이와 함정
            포인트, CBT 오답 연계까지 한곳에서 보게 됩니다.
          </p>
        </header>

        <section className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-sm font-bold tracking-[0.18em] text-zinc-400">
            COMING SOON
          </p>
          <p className="mt-3 text-lg font-bold text-zinc-900">
            {year}년 {round}회 해설 콘텐츠 준비 중
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            연도·회차 구조는 완성됐어요. 각 회차의 실제 해설 영상은 이 자리에
            연결됩니다.
          </p>
          <Link
            href="/lectures"
            className="mt-6 inline-flex items-center gap-1 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            ← 다른 회차 보기
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

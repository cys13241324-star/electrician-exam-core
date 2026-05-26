import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동영상 강의",
  description: "전기기능사 기출 전 문항 풀이 동영상 강의.",
};

export default function LecturesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <header>
        <p className="text-sm font-semibold tracking-wide text-blue-600">
          동영상 강의
        </p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
          기출 전 문항 풀이 강의
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          회차·과목·문항별로 골라보는 핵심 풀이 영상. (페이지 준비 중)
        </p>
      </header>

      <section className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
        <p className="text-sm text-zinc-500">
          강의 목록 UI는 다음 단계에서 만들 예정입니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          ← 메인으로
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-7xl">⚡</div>
          <p className="mt-4 text-sm font-semibold tracking-wide text-blue-600">
            404 — 페이지를 찾을 수 없어요
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            찾으시는 페이지가 없습니다
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            주소가 바뀌었거나 사라졌을 수 있어요.
            <br />
            아래에서 원하는 곳으로 바로 이동해 보세요.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              href="/"
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              홈
            </Link>
            <Link
              href="/cbt"
              className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              CBT 모의고사
            </Link>
            <Link
              href="/flashcards"
              className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              암기카드
            </Link>
            <Link
              href="/simulator"
              className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              시뮬레이터
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

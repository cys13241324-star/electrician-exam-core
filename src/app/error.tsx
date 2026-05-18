"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <div className="text-7xl">⚠️</div>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">
        잠깐, 문제가 생겼어요
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
        잠시 후 다시 시도해 보세요. 같은 화면이 계속 보이면 1:1 문의로 알려
        주시면 빠르게 살펴보겠습니다.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          메인으로
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-zinc-500">에러 코드: {error.digest}</p>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = { availableIds: string[] };

function pickRandom(ids: string[], exclude?: string): string | null {
  if (ids.length === 0) return null;
  if (ids.length === 1) return ids[0];
  const pool = exclude ? ids.filter((id) => id !== exclude) : ids;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function RandomSimulatorLauncher({ availableIds }: Props) {
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(null);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const lastPicked = useRef<string | null>(null);

  // 진입 시 한 번 무작위 선택
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 진입 시 1회 랜덤
    const id = pickRandom(availableIds);
    lastPicked.current = id;
    setPicked(id);
  }, [availableIds]);

  // 자동 리다이렉트 (1.2초 후) — 사용자가 취소할 수 있음
  useEffect(() => {
    if (!autoRedirect || !picked) return;
    const t = setTimeout(() => {
      router.push(`/simulator/${picked}`);
    }, 1200);
    return () => clearTimeout(t);
  }, [autoRedirect, picked, router]);

  const reroll = useCallback(() => {
    setAutoRedirect(false);
    const next = pickRandom(availableIds, lastPicked.current ?? undefined);
    lastPicked.current = next;
    setPicked(next);
  }, [availableIds]);

  if (availableIds.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center">
        <p className="text-5xl">🧐</p>
        <p className="mt-4 text-base font-semibold text-zinc-700">
          아직 사용 가능한 시뮬레이터가 없어요
        </p>
        <p className="mt-1.5 text-sm text-zinc-500">
          곧 새로운 시뮬레이터가 추가됩니다.
        </p>
        <div className="mt-6">
          <Link
            href="/simulator"
            className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-700"
          >
            허브로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-10 text-center shadow-sm">
      <div className="mb-4">
        <Link
          href="/simulator"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
        >
          ← 시뮬레이터 허브
        </Link>
      </div>

      <p className="text-6xl" aria-hidden>
        🎲
      </p>
      <h1 className="mt-4 text-xl font-bold text-zinc-900 sm:text-2xl">
        랜덤 시뮬레이터를 골랐어요
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        잠시 후 자동으로 이동합니다. 다른 걸 원하면 다시 뽑거나, 바로 시작하세요.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-100">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-teal-500" />
        선택된 ID: <code className="font-mono text-teal-700">{picked ?? "—"}</code>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {picked && (
          <Link
            href={`/simulator/${picked}`}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
            onClick={() => setAutoRedirect(false)}
          >
            바로 시작 →
          </Link>
        )}
        <button
          type="button"
          onClick={reroll}
          className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          🎲 다시 뽑기
        </button>
        {autoRedirect && (
          <button
            type="button"
            onClick={() => setAutoRedirect(false)}
            className="rounded-full px-4 py-2 text-xs font-medium text-zinc-500 transition hover:text-zinc-800"
          >
            자동 이동 취소
          </button>
        )}
      </div>

      <p className="mt-6 text-[11px] text-zinc-400">
        총 {availableIds.length}개의 사용 가능한 시뮬레이터 중에서 무작위로
        선택됩니다.
      </p>
    </div>
  );
}

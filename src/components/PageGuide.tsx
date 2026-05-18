"use client";

import { useEffect, useState } from "react";

export type GuideItem = {
  icon?: string;
  title: string;
  body: string;
};

type Tone = "indigo" | "blue" | "violet" | "emerald" | "amber" | "rose";

const TONE_MAP: Record<
  Tone,
  {
    wrap: string;
    head: string;
    badge: string;
    item: string;
    itemTitle: string;
    chevron: string;
  }
> = {
  indigo: {
    wrap: "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white",
    head: "text-indigo-900 hover:bg-indigo-50/60",
    badge: "bg-indigo-600 text-white",
    item: "border-indigo-100 bg-white",
    itemTitle: "text-indigo-900",
    chevron: "text-indigo-600",
  },
  blue: {
    wrap: "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
    head: "text-blue-900 hover:bg-blue-50/60",
    badge: "bg-blue-600 text-white",
    item: "border-blue-100 bg-white",
    itemTitle: "text-blue-900",
    chevron: "text-blue-600",
  },
  violet: {
    wrap: "border-violet-200 bg-gradient-to-br from-violet-50 to-white",
    head: "text-violet-900 hover:bg-violet-50/60",
    badge: "bg-violet-600 text-white",
    item: "border-violet-100 bg-white",
    itemTitle: "text-violet-900",
    chevron: "text-violet-600",
  },
  emerald: {
    wrap: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white",
    head: "text-emerald-900 hover:bg-emerald-50/60",
    badge: "bg-emerald-600 text-white",
    item: "border-emerald-100 bg-white",
    itemTitle: "text-emerald-900",
    chevron: "text-emerald-600",
  },
  amber: {
    wrap: "border-amber-200 bg-gradient-to-br from-amber-50 to-white",
    head: "text-amber-900 hover:bg-amber-50/60",
    badge: "bg-amber-600 text-white",
    item: "border-amber-100 bg-white",
    itemTitle: "text-amber-900",
    chevron: "text-amber-700",
  },
  rose: {
    wrap: "border-rose-200 bg-gradient-to-br from-rose-50 to-white",
    head: "text-rose-900 hover:bg-rose-50/60",
    badge: "bg-rose-600 text-white",
    item: "border-rose-100 bg-white",
    itemTitle: "text-rose-900",
    chevron: "text-rose-600",
  },
};

export default function PageGuide({
  title = "이 페이지 사용법",
  subtitle,
  items,
  tone = "indigo",
  storageKey,
  defaultOpen = true,
  dismissible = true,
  footer,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  items: GuideItem[];
  tone?: Tone;
  storageKey: string;
  defaultOpen?: boolean;
  dismissible?: boolean;
  footer?: React.ReactNode;
  className?: string;
}) {
  // 첫 렌더는 SSR/hydration mismatch 방지 위해 defaultOpen 사용,
  // 마운트 후 localStorage 값으로 동기화
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 하이드레이션 (SSR/CSR 일관성 위해 마운트 후 동기화)
    setHydrated(true);
    try {
      const stored = localStorage.getItem(`page-guide:${storageKey}`);
      if (stored === "dismissed") setDismissed(true);
      else if (stored === "open") setOpen(true);
      else if (stored === "closed") setOpen(false);
      // 기록 없으면 defaultOpen 그대로 (첫 방문은 펼침)
    } catch {
      /* localStorage 차단된 환경 — 그대로 진행 */
    }
  }, [storageKey]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (hydrated) {
      try {
        localStorage.setItem(
          `page-guide:${storageKey}`,
          next ? "open" : "closed",
        );
      } catch {
        /* ignore */
      }
    }
  }

  function dismiss(e: React.MouseEvent) {
    e.stopPropagation();
    setDismissed(true);
    if (hydrated) {
      try {
        localStorage.setItem(`page-guide:${storageKey}`, "dismissed");
      } catch {
        /* ignore */
      }
    }
  }

  // 사용자가 영구 숨김한 경우 렌더하지 않음
  if (dismissed) return null;

  const t = TONE_MAP[tone];

  return (
    <section
      className={`overflow-hidden rounded-2xl border shadow-sm ${t.wrap} ${className}`}
    >
      <div
        className={`flex w-full items-center justify-between gap-3 px-5 py-3.5 transition sm:px-6 ${t.head}`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? "사용법 접기" : "사용법 펼치기"}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${t.badge}`}
            aria-hidden="true"
          >
            💡
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold sm:text-base">{title}</p>
            {subtitle && (
              <p className="mt-0.5 text-[11px] font-medium opacity-70 sm:text-xs">
                {subtitle}
              </p>
            )}
          </div>
        </button>
        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={open ? "접기" : "펼치기"}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold transition hover:bg-white/60 ${t.chevron}`}
          >
            <span
              className={`transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>
          {dismissible && (
            <button
              type="button"
              onClick={dismiss}
              aria-label="이 안내 다시 보지 않기"
              title="다시 보지 않기"
              className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-zinc-500 transition hover:bg-white/60 hover:text-zinc-900"
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-white/60 bg-white/70 px-5 py-5 sm:px-6 sm:py-6">
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((it, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 rounded-xl border bg-white p-3.5 ${t.item}`}
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${t.badge}`}
                  aria-hidden="true"
                >
                  {it.icon ?? i + 1}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-bold ${t.itemTitle}`}>
                    {it.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-zinc-700">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {footer && (
            <div className="mt-4 border-t border-zinc-200 pt-4 text-xs leading-6 text-zinc-600">
              {footer}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

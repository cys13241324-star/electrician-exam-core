"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
};

type Ctx = {
  toast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<Ctx | null>(null);

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: () => {
        if (typeof window !== "undefined") {
          console.warn("ToastProvider not mounted");
        }
      },
    };
  }
  return ctx;
}

const TONE: Record<ToastTone, { bg: string; icon: string; ring: string }> = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    icon: "✓",
    ring: "text-emerald-600",
  },
  error: {
    bg: "bg-rose-50 border-rose-200",
    icon: "⚠",
    ring: "text-rose-600",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: "ℹ",
    ring: "text-blue-600",
  },
};

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    setItems((prev) => [...prev, { ...t, id: Date.now() + Math.random() }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 left-6 z-[80] flex flex-col gap-2"
      >
        {items.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const enter = window.setTimeout(() => setVisible(true), 20);
    const exit = window.setTimeout(() => setVisible(false), 4000);
    const cleanup = window.setTimeout(onDismiss, 4400);
    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(exit);
      window.clearTimeout(cleanup);
    };
  }, [onDismiss]);
  const t = TONE[toast.tone];
  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${t.bg} px-4 py-3 shadow-xl transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      role="status"
    >
      <span
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold ${t.ring}`}
      >
        {t.icon}
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold text-zinc-900">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-zinc-600">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="닫기"
        className="ml-1 rounded p-0.5 text-zinc-400 hover:text-zinc-700"
      >
        ✕
      </button>
    </div>
  );
}

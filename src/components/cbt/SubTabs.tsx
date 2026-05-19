import Link from "next/link";

type TabId =
  | "main"
  | "study"
  | "exams"
  | "wrong-notes"
  | "frequent"
  | "hard";

const TABS: { id: TabId; label: string; href: string; badge?: string }[] = [
  { id: "main", label: "전기기능사", href: "/cbt", badge: "구독중" },
  { id: "study", label: "과목별 학습", href: "/cbt/study" },
  { id: "exams", label: "모의고사", href: "/cbt/exams" },
  { id: "wrong-notes", label: "오답노트", href: "/cbt/wrong-notes" },
  { id: "frequent", label: "N회빈출", href: "/cbt/frequent" },
  { id: "hard", label: "고난도모음", href: "/cbt/hard" },
];

export default function SubTabs({ active }: { active: TabId }) {
  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-6">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex items-center gap-1.5 px-4 py-4 text-sm font-semibold transition ${
                isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export type { TabId };

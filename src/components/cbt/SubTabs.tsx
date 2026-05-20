import Link from "next/link";

// 다른 페이지에서 active="study" 식으로 호출하지만, 이제 main 탭 하나만 남았으므로
// 호환을 위해 ID 종류는 받되 실제로는 main 만 렌더된다.
type TabId =
  | "main"
  | "study"
  | "exams"
  | "wrong-notes"
  | "frequent"
  | "hard";

const TABS: { id: TabId; label: string; href: string; badge?: string }[] = [
  { id: "main", label: "전기기능사", href: "/cbt", badge: "구독중" },
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

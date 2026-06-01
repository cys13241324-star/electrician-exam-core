import Link from "next/link";
import { ALL_SUBJECTS } from "@/lib/flashcards/chapters";
import { presetCards } from "@/lib/flashcards/data";
import { topicsBySubject } from "@/lib/audiobook/data";
import { simulators } from "@/lib/simulators";

type Tool = {
  emoji: string;
  name: string;
  desc: string;
  cta: string;
  href: string;
  meta: string;
  gradient: string;
};

const TOOLS: Tool[] = [
  {
    emoji: "🃏",
    name: "플립 암기카드",
    desc: "공식 한 줄·정의 한 문장. 핵심만 농축한 카드로 회독해요.",
    cta: "카드 학습",
    href: "/v3/cards",
    meta: `${presetCards.length}장`,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
  },
  {
    emoji: "🎧",
    name: "5분 핵심 요약 오디오북",
    desc: "한 챕터 = 5분. 출퇴근·산책 중 흘려듣기만 해도 키워드가 남아요.",
    cta: "오디오 듣기",
    href: "/v3/audiobook",
    meta: `${ALL_SUBJECTS.reduce((n, s) => n + topicsBySubject(s).length, 0)}챕터`,
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
  },
  {
    emoji: "⚡",
    name: "이론 시뮬레이터",
    desc: "값을 움직여 그래프 변화를 손으로 체득. 외우지 않아도 이해돼요.",
    cta: "시뮬 열기",
    href: "/v3/simulator",
    meta: `${simulators.length}개`,
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
  },
];

export default function TheorySection() {
  return (
    <div className="space-y-3">
      {TOOLS.map((tool) => (
        <Link
          key={tool.name}
          href={tool.href}
          className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
        >
          <span
            aria-hidden
            className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${tool.gradient}`}
          />
          <span
            aria-hidden
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-2xl shadow-md`}
          >
            {tool.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-bold text-zinc-900 sm:text-base">
                {tool.name}
              </h3>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {tool.meta}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              {tool.desc}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold transition group-hover:gap-1.5">
              <span
                className={`bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent`}
              >
                {tool.cta}
              </span>
              <span className="text-zinc-400 transition group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * 각 콘텐츠 최상단에 "이게 왜 좋은지" 장점을 짚어주는 박스.
 */
export default function WhyBox({
  tone,
  title,
  points,
}: {
  tone: "sky" | "amber" | "rose" | "violet" | "emerald";
  title: string;
  points: string[];
}) {
  const cls = TONE[tone];
  return (
    <div className={`mt-6 max-w-2xl rounded-2xl border p-5 sm:p-6 ${cls.box}`}>
      <p
        className={`flex items-center gap-2 text-base font-extrabold tracking-tight sm:text-lg ${cls.text}`}
      >
        <span aria-hidden className="text-lg sm:text-xl">💡</span>
        {title}
      </p>
      <ul className="mt-3.5 space-y-2.5">
        {points.map((p) => (
          <li
            key={p}
            className="flex items-start gap-2.5 text-[15px] leading-relaxed text-zinc-700 sm:text-base"
          >
            <span
              aria-hidden
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cls.chip}`}
            />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TONE = {
  sky: { box: "border-sky-100 bg-sky-50/60", chip: "bg-sky-500", text: "text-sky-700" },
  amber: {
    box: "border-amber-100 bg-amber-50/60",
    chip: "bg-amber-500",
    text: "text-amber-700",
  },
  rose: { box: "border-rose-100 bg-rose-50/60", chip: "bg-rose-500", text: "text-rose-700" },
  violet: {
    box: "border-violet-100 bg-violet-50/60",
    chip: "bg-violet-500",
    text: "text-violet-700",
  },
  emerald: {
    box: "border-emerald-100 bg-emerald-50/60",
    chip: "bg-emerald-500",
    text: "text-emerald-700",
  },
} as const;

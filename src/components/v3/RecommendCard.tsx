import Link from "next/link";

export type RecommendCardProps = {
  tag: string;
  tagClass: string;
  gradient: string;
  title: string;
  hint: string;
  cta: string;
  href: string;
};

export default function RecommendCard({
  tag,
  tagClass,
  gradient,
  title,
  hint,
  cta,
  href,
}: RecommendCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
      />
      <span
        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${tagClass}`}
      >
        {tag}
      </span>
      <h3 className="mt-3 text-base font-bold text-zinc-900">{title}</h3>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">
        {hint}
      </p>
      <span
        className={`mt-5 inline-flex items-center gap-1 bg-gradient-to-r ${gradient} bg-clip-text text-sm font-bold text-transparent`}
      >
        {cta}
        <span className="text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-900">
          →
        </span>
      </span>
    </Link>
  );
}

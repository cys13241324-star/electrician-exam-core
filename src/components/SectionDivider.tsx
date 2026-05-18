type Variant = "dots" | "wave" | "line" | "spark";

export default function SectionDivider({
  variant = "spark",
  label,
}: {
  variant?: Variant;
  label?: string;
}) {
  if (variant === "wave") {
    return (
      <div className="relative h-12 overflow-hidden">
        <svg
          viewBox="0 0 1200 80"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,40 C300,80 600,0 900,40 C1050,60 1200,30 1200,30 L1200,80 L0,80 Z"
            fill="currentColor"
            className="text-zinc-50"
          />
        </svg>
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div className="mx-auto my-2 h-px max-w-6xl bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    );
  }

  // spark (default) — gradient line + center icon (optional label)
  return (
    <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 to-zinc-300" />
      <span className="flex items-center gap-2 text-xs font-semibold tracking-widest text-zinc-400">
        <span className="text-amber-400" aria-hidden="true">
          ✦
        </span>
        {label}
        <span className="text-amber-400" aria-hidden="true">
          ✦
        </span>
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-zinc-300 to-zinc-300" />
    </div>
  );
}

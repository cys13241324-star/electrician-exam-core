/**
 * 자체 SVG 백그라운드 패턴 모음.
 * heropatterns/dotted-grid 스타일을 직접 제작.
 *
 * 사용 예:
 *   <section className="relative ...">
 *     <BackgroundPattern variant="grid" />
 *     <div className="relative ...">실제 콘텐츠</div>
 *   </section>
 */

type Variant =
  | "grid"
  | "dots"
  | "diagonal"
  | "circuit"
  | "mesh-blue"
  | "mesh-amber"
  | "mesh-violet"
  | "noise";

const PATTERNS: Record<string, string> = {
  grid: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
    <path d='M0 0 L40 0 M0 10 L40 10 M0 20 L40 20 M0 30 L40 30 M0 0 L0 40 M10 0 L10 40 M20 0 L20 40 M30 0 L30 40' stroke='currentColor' stroke-width='0.5' fill='none' opacity='0.5'/>
  </svg>`,

  dots: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
    <circle cx='2' cy='2' r='1.2' fill='currentColor'/>
  </svg>`,

  diagonal: `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
    <path d='M0 28 L28 0 M-7 21 L21 -7 M7 35 L35 7' stroke='currentColor' stroke-width='1' opacity='0.4'/>
  </svg>`,

  circuit: `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
    <g stroke='currentColor' stroke-width='1' fill='none' opacity='0.6'>
      <path d='M10 10 L30 10 L30 30 L50 30 L50 50 L70 50 L70 70'/>
      <path d='M10 50 L20 50 L20 70'/>
      <path d='M50 10 L70 10 L70 30'/>
      <circle cx='10' cy='10' r='2.5' fill='currentColor'/>
      <circle cx='30' cy='30' r='2.5' fill='currentColor'/>
      <circle cx='50' cy='50' r='2.5' fill='currentColor'/>
      <circle cx='70' cy='70' r='2.5' fill='currentColor'/>
      <circle cx='70' cy='30' r='2.5' fill='currentColor'/>
      <circle cx='20' cy='70' r='2.5' fill='currentColor'/>
    </g>
  </svg>`,
};

function svgToDataUri(svg: string): string {
  // URL 인코딩으로 data URI 생성 (CSP friendly)
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function BackgroundPattern({
  variant = "grid",
  className = "",
  color = "#0f172a",
  opacity = 0.06,
}: {
  variant?: Variant;
  className?: string;
  color?: string;
  opacity?: number;
}) {
  // 메시 그라디언트 (SVG 없이 CSS gradient만)
  if (variant === "mesh-blue") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(at 20% 0%, rgba(59,130,246,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(14,165,233,0.10) 0px, transparent 50%)",
        }}
      />
    );
  }
  if (variant === "mesh-amber") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(at 20% 0%, rgba(251,191,36,0.18) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(244,63,94,0.12) 0px, transparent 50%), radial-gradient(at 30% 100%, rgba(249,115,22,0.10) 0px, transparent 50%)",
        }}
      />
    );
  }
  if (variant === "mesh-violet") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(at 0% 30%, rgba(139,92,246,0.18) 0px, transparent 50%), radial-gradient(at 100% 60%, rgba(236,72,153,0.14) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(99,102,241,0.10) 0px, transparent 50%)",
        }}
      />
    );
  }

  // 노이즈 텍스처 (SVG turbulence 필터)
  if (variant === "noise") {
    const noise = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 mix-blend-multiply ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(noise)}")`,
          opacity,
        }}
      />
    );
  }

  // SVG 반복 패턴
  const svg = PATTERNS[variant];
  const colored = svg.replace(/currentColor/g, color);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: svgToDataUri(colored),
        opacity,
      }}
    />
  );
}
